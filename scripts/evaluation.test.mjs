import test from 'node:test';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadProtocol, makePlan, initialize, generationBody, judgeBody, parseRating, reservation, usageCost, Ledger, requestOne, execute, pairedEstimate, lockOutput, exportBlind, summarize, atomicJson } from './evaluation-lib.mjs';
function fixture(t, budgetUsd = 25) {
  const root = mkdtempSync(join(tmpdir(), 'judgment-eval-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const model = { id: 'mock-model', inputUsdPerMillion: 2.5, outputUsdPerMillion: 15 };
  const config = { version: 1, sourceCommit: 'fixture', seed: 42, budgetUsd, models: [model], judge: model, repeats: 2, maxOutputTokens: 32, judgeMaxOutputTokens: 32, reasoningEffort: 'none', conditions: ['A','B','C','D','E'], practices: { practice: { skillPath: 'skill.md', sourceContextPath: 'source.md', neutralPath: 'neutral.md' } }, genericPromptPath: 'generic.md', commonPromptPath: 'common.md' };
  const cases = [{ id: 'secret-case-id', practice: 'practice', scenario: 'A bounded scenario.', expected_use: 'clarify', evaluation_notes: ['HIDDEN NOTE'] }];
  const files = { 'config.json': JSON.stringify(config), 'cases.json': JSON.stringify(cases), 'skill.md': '---\nname: skill\nmetadata:\n  collection: rabbi\n---\nDo useful things.', 'neutral.md': 'Do useful things.', 'source.md': 'SOURCE CONTEXT', 'generic.md': 'GENERIC PROMPT', 'common.md': 'COMMON INSTRUCTION' };
  config.practices.practice.skillSha256 = createHash('sha256').update(files['skill.md']).digest('hex');
  files['config.json'] = JSON.stringify(config);
  for (const [path, text] of Object.entries(files)) writeFileSync(join(root, path), text);
  const protocol = loadProtocol('config.json', 'cases.json', root), out = join(root, 'out');
  return { root, protocol, out, model };
}
const mockResponse = text => ({ ok: true, json: async () => ({ id: 'resp_mock', model: 'mock-model', status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text }] }], usage: { input_tokens: 20, output_tokens: 10 } }) });

test('plan is shuffled deterministically and condition prompts cannot leak held-out case metadata', t => {
  const { protocol } = fixture(t), plan = makePlan(protocol);
  assert.equal(plan.length, 10); assert.deepEqual(plan, makePlan(protocol)); assert.equal(new Set(plan.map(c => c.id)).size, 10);
  for (const cell of plan) {
    const body = generationBody(protocol, cell), serialized = JSON.stringify(body);
    for (const hidden of ['secret-case-id', 'HIDDEN NOTE', 'expected_use', 'condition']) assert.ok(!serialized.includes(hidden));
    assert.equal(body.input[0].content, 'A bounded scenario.'); assert.equal(body.store, false); assert.equal(body.service_tier, 'default'); assert.equal(body.tools, undefined);
    assert.equal(body.instructions.includes('GENERIC PROMPT'), cell.condition === 'B');
    assert.equal(body.instructions.includes('SOURCE CONTEXT'), cell.condition === 'C');
    assert.equal(body.instructions.includes('collection: rabbi'), cell.condition === 'E');
  }
});
test('resume refuses changed cases, config, source prompts, or stored plan', t => {
  const { root, protocol, out } = fixture(t); initialize(out, protocol);
  writeFileSync(join(root, 'source.md'), 'Changed source');
  assert.throws(() => initialize(out, loadProtocol('config.json', 'cases.json', root)), /drift/);
  writeFileSync(join(out, 'plan.json'), '[]');
  assert.throws(() => initialize(out, protocol), /plan mismatch/);
});
test('shared spend ledger never schedules beyond conservative cap', async t => {
  const { protocol, out, model } = fixture(t, .03); initialize(out, protocol);
  const ledger = new Ledger(join(out, 'ledger.json')), body = generationBody(protocol, makePlan(protocol)[0]);
  const amount = reservation(body, model); assert.ok(amount >= usageCost({ input_tokens: 20, output_tokens: 10 }, model));
  let calls = 0;
  const args = { body, price: model, ledger, apiKey: 'NEVER PERSIST THIS', fetchImpl: async () => { calls++; throw new Error('NEVER PERSIST THIS'); } };
  await requestOne({ ...args, key: 'run:one', path: join(out, 'generations', 'one.json') });
  const second = await requestOne({ ...args, key: 'grade:two', path: join(out, 'ratings', 'two.json') });
  assert.equal(second.skipped, true); assert.equal(calls, 1); assert.ok(ledger.spent() <= .03);
  assert.ok(!readFileSync(join(out, 'generations', 'one.json'), 'utf8').includes('NEVER PERSIST THIS'));
});
test('durable in-flight reservations and uncertain requests are not retried on resume', async t => {
  const { protocol, out, model } = fixture(t); const plan = initialize(out, protocol);
  const ledger = new Ledger(join(out, 'ledger.json'));
  ledger.reserve(`run:${plan[0].id}`, reservation(generationBody(protocol, plan[0]), model));
  let calls = 0;
  await assert.rejects(execute(protocol, out, { apiKey: 'mock', limit: 1, fetchImpl: async () => { calls++; throw new Error('timeout'); } }), /uncertain/);
  const resumed = new Ledger(join(out, 'ledger.json'));
  assert.equal(resumed.data.entries[`run:${plan[0].id}`].state, 'uncertain');
  assert.equal(calls, 1); assert.equal(Object.keys(resumed.data.entries).length, 2);
  const failed = Object.entries(resumed.data.entries).find(([key]) => key !== `run:${plan[0].id}`)[0];
  assert.equal(resumed.data.entries[failed].state, 'uncertain');
  assert.ok(resumed.spent() > 0);
});
test('completed response retains actual full-rate usage and duplicate call is skipped', async t => {
  const { protocol, out, model } = fixture(t); initialize(out, protocol);
  const ledger = new Ledger(join(out, 'ledger.json')), body = generationBody(protocol, makePlan(protocol)[0]);
  let calls = 0;
  const args = { body, price: model, ledger, key: 'run:one', path: join(out, 'generations', 'one.json'), apiKey: 'mock', fetchImpl: async (url, init) => { calls++; assert.equal(url, 'https://api.openai.com/v1/responses'); assert.equal(JSON.parse(init.body).store, false); return mockResponse('A useful answer.'); } };
  const result = await requestOne(args);
  assert.equal(result.status, 'completed'); assert.equal(result.text, 'A useful answer.'); assert.equal(ledger.spent(), .0002);
  assert.equal((await requestOne(args)).skipped, true); assert.equal(calls, 1);
});
test('non-success, malformed ratings, and missing usage fail closed without raw error persistence', async t => {
  const { protocol, out, model } = fixture(t); initialize(out, protocol);
  const ledger = new Ledger(join(out, 'ledger.json')), body = generationBody(protocol, makePlan(protocol)[0]);
  const result = await requestOne({ body, price: model, ledger, key: 'run:http', path: join(out, 'generations', 'http.json'), apiKey: 'mock', fetchImpl: async () => ({ ok: false, status: 429, text: () => { throw new Error('should not read raw body'); } }) });
  assert.equal(result.status, 'http_error'); assert.equal(result.costBasis, 'reservation');
  const rating = await requestOne({ body, price: model, ledger, key: 'grade:bad', path: join(out, 'ratings', 'bad.json'), apiKey: 'mock', fetchImpl: async () => mockResponse('{"evidence":99}'), parse: parseRating });
  assert.equal(rating.status, 'invalid_rating');
  assert.throws(() => parseRating('{"evidence":99}'));
});
test('judge excludes condition, practice and model labels; exports hide mapping', t => {
  const { protocol, out } = fixture(t), plan = initialize(out, protocol), cell = plan[0];
  const body = judgeBody(protocol, cell, { text: 'CANDIDATE' });
  const supplied = JSON.parse(body.input[0].content);
  assert.deepEqual(Object.keys(supplied).sort(), ['candidate_response', 'evaluation_notes', 'scenario']);
  assert.deepEqual(supplied.evaluation_notes, ['HIDDEN NOTE']);
  atomicJson(join(out, 'generations', `${cell.id}.json`), { status: 'completed', text: 'ANSWER' });
  exportBlind(protocol, out);
  const review = JSON.parse(readFileSync(join(out, 'blind-review.jsonl'), 'utf8'));
  assert.deepEqual(Object.keys(review).sort(), ['response', 'reviewId', 'scenario']);
  assert.ok(!JSON.stringify(review).includes(cell.id));
});
test('case-cluster estimator averages within cases and only matched model/repeat cells', () => {
  const rows = [
    { caseId: 'one', model: 'm', repeat: 0, condition: 'E', score: 4 }, { caseId: 'one', model: 'm', repeat: 0, condition: 'B', score: 2 },
    { caseId: 'one', model: 'm', repeat: 1, condition: 'E', score: 2 }, { caseId: 'one', model: 'm', repeat: 1, condition: 'B', score: 2 },
    { caseId: 'two', model: 'm', repeat: 0, condition: 'E', score: 1 }, { caseId: 'two', model: 'm', repeat: 0, condition: 'B', score: 2 },
    { caseId: 'three', model: 'm', repeat: 0, condition: 'E', score: 4 },
  ];
  const result = pairedEstimate(rows, 1);
  assert.equal(result.caseCount, 2); assert.equal(result.pairedCells, 3); assert.equal(result.meanDifference, 0);
  assert.deepEqual(result, pairedEstimate(rows, 1)); assert.deepEqual(result.ci95, [-1, 1]);
});
test('exclusive output lock prevents concurrent writers', t => {
  const { out } = fixture(t), release = lockOutput(out);
  assert.throws(() => lockOutput(out), /locked/); release(); lockOutput(out)();
});
test('missing usage remains charged at reserve and cannot be graded', async t => {
  const { protocol, out, model } = fixture(t); initialize(out, protocol);
  const ledger = new Ledger(join(out, 'ledger.json')), body = generationBody(protocol, makePlan(protocol)[0]);
  const result = await requestOne({ body, price: model, ledger, key: 'run:no-usage', path: join(out, 'generations', 'no-usage.json'), apiKey: 'mock', fetchImpl: async () => ({ ok: true, json: async () => ({ id: 'r', model: 'mock-model', status: 'completed', output: [] }) }) });
  assert.equal(result.status, 'incomplete'); assert.equal(result.costBasis, 'reservation'); assert.equal(ledger.spent(), reservation(body, model));
});
test('concurrent generation and subsequent judging share a cumulative cap including smoke', async t => {
  const { protocol, out } = fixture(t, .05); initialize(out, protocol);
  let calls = 0;
  const failedFetch = async () => { calls++; await new Promise(resolve => setTimeout(resolve, 2)); throw new Error('uncertain'); };
  await assert.rejects(execute(protocol, out, { apiKey: 'mock', limit: 1, fetchImpl: failedFetch }), /uncertain/);
  assert.equal(calls, 1);
  await assert.rejects(execute(protocol, out, { apiKey: 'mock', concurrency: 6, fetchImpl: failedFetch }), /uncertain/);
  assert.equal(calls, 2); assert.ok(new Ledger(join(out, 'ledger.json')).spent() <= .05);
  const again = await execute(protocol, out, { apiKey: 'mock', fetchImpl: failedFetch });
  assert.equal(again.attempted, 0); assert.equal(calls, 2);
});
test('empty completed output and provider refusal are never valid generations', async t => {
  const { protocol, out, model } = fixture(t); initialize(out, protocol);
  const ledger = new Ledger(join(out, 'ledger.json')), body = generationBody(protocol, makePlan(protocol)[0]);
  for (const [name, content, status] of [['empty', [{ type: 'output_text', text: '  ' }], 'empty_output'], ['refusal', [{ type: 'refusal', refusal: 'private refusal details' }], 'refused']]) {
    const result = await requestOne({ body, price: model, ledger, key: `run:${name}`, path: join(out, 'generations', `${name}.json`), apiKey: 'mock', fetchImpl: async () => ({ ok: true, json: async () => ({ id: 'r', model: 'mock-model', status: 'completed', output: [{ type: 'message', content }], usage: { input_tokens: 20, output_tokens: 10 } }) }) });
    assert.equal(result.status, status); assert.ok(!JSON.stringify(result).includes('private refusal details'));
  }
});
test('HTTP failure stops scheduling, waits for already in-flight work, and resume skips failed cell', async t => {
  const { protocol, out } = fixture(t); let calls = 0, settled = 0;
  await assert.rejects(execute(protocol, out, { apiKey: 'mock', concurrency: 2, fetchImpl: async () => {
    calls++;
    if (calls === 1) return { ok: false, status: 401 };
    await new Promise(resolve => setTimeout(resolve, 15)); settled++; return mockResponse('Answer');
  } }), /http_error \(401\)/);
  assert.equal(calls, 2); assert.equal(settled, 1);
  const resume = await execute(protocol, out, { apiKey: 'mock', limit: 1, fetchImpl: async () => { calls++; return mockResponse('Next answer'); } });
  assert.equal(resume.attempted, 1); assert.equal(calls, 3);
  assert.equal(Object.keys(new Ledger(join(out, 'ledger.json')).data.entries).length, 3);
});
test('provider model mismatch is retained and stops further scheduling', async t => {
  const { protocol, out } = fixture(t); let calls = 0;
  await assert.rejects(execute(protocol, out, { apiKey: 'mock', concurrency: 1, fetchImpl: async () => {
    calls++; const response = mockResponse('Answer'); const data = await response.json(); data.model = 'unexpected-model'; return { ok: true, json: async () => data };
  } }), /model_mismatch/);
  assert.equal(calls, 1);
  const cell = makePlan(protocol)[0], record = JSON.parse(readFileSync(join(out, 'generations', `${cell.id}.json`), 'utf8'));
  assert.equal(record.model, 'unexpected-model'); assert.equal(record.requestedModel, 'mock-model'); assert.equal(record.status, 'model_mismatch');
});
test('pinned skill digest rejects edited skill files before planning or spending', t => {
  const { root } = fixture(t);
  writeFileSync(join(root, 'skill.md'), 'Changed actionable instructions');
  assert.throws(() => loadProtocol('config.json', 'cases.json', root), /Pinned skill hash mismatch/);
});
test('malformed rating trips the circuit before another judging request', async t => {
  const { protocol, out } = fixture(t), plan = initialize(out, protocol); let calls = 0;
  for (const cell of plan) atomicJson(join(out, 'generations', `${cell.id}.json`), { status: 'completed', text: 'Answer' });
  await assert.rejects(execute(protocol, out, { mode: 'grade', apiKey: 'mock', concurrency: 1, fetchImpl: async () => { calls++; return mockResponse('{}'); } }), /invalid_rating/);
  assert.equal(calls, 1);
});
test('summary reports resource costs, secondary comparisons, incomplete coverage and safety gating', t => {
  const { protocol, out } = fixture(t), plan = initialize(out, protocol);
  const initial = summarize(protocol, out);
  assert.equal(initial.coverage.status, 'incomplete'); assert.equal(initial.decision.meetsPredeclaredPilotSignal, false);
  assert.equal(initial.missingCells.length, 10);
  for (const cell of plan) {
    const score = { A: 1, B: 2, C: 1, D: 2, E: 3 }[cell.condition];
    const rating = { evidence: score, judgment: score, actionability: score, constraints: score, calibration: score, safety_flags: cell.condition === 'E' && cell.repeat === 0 ? ['authorization concern'] : [], rationale: 'Synthetic rated result.' };
    atomicJson(join(out, 'generations', `${cell.id}.json`), { status: 'completed', text: 'Answer', usage: { input_tokens: 20, output_tokens: 10 }, costUsd: .001, costBasis: 'reported_usage', latencyMs: 100 });
    atomicJson(join(out, 'ratings', `${cell.id}.json`), { status: 'completed', rating, usage: { input_tokens: 30, output_tokens: 10 }, costUsd: .002, costBasis: 'reported_usage', latencyMs: 200 });
  }
  const flagged = summarize(protocol, out);
  assert.equal(flagged.coverage.status, 'complete'); assert.equal(flagged.primaryPairedEminusB.meanDifference, 1);
  assert.equal(flagged.secondaryComparisons.EminusA.meanDifference, 2);
  assert.equal(flagged.secondaryComparisons.DminusB.meanDifference, 0);
  assert.equal(flagged.secondaryComparisons.EminusD.meanDifference, 1);
  assert.equal(flagged.secondaryComparisons.EminusC.meanDifference, 2);
  assert.equal(flagged.resources.generation.inputTokens, 200); assert.equal(flagged.resources.judging.inputTokens, 300);
  assert.equal(flagged.resources.generation.meanLatencyMs, 100); assert.equal(flagged.resources.judging.p95LatencyMs, 200);
  assert.ok(Math.abs(flagged.resources.generation.recordedCostUsd - .01) < 1e-10);
  assert.equal(flagged.byCondition.E.safetyFlaggedCells.length, 1);
  assert.equal(flagged.decision.safetyRegressionSignal, true); assert.equal(flagged.decision.meetsPredeclaredPilotSignal, false);
  assert.equal(flagged.decision.status, 'safety_review_required');
  for (const cell of plan.filter(c => c.condition === 'E')) {
    const path = join(out, 'ratings', `${cell.id}.json`), record = JSON.parse(readFileSync(path, 'utf8')); record.rating.safety_flags = []; atomicJson(path, record);
  }
  const cleared = summarize(protocol, out);
  assert.equal(cleared.decision.meetsPredeclaredPilotSignal, true); assert.equal(cleared.decision.demonstratedHumanBenefit, false);
  for (const cell of plan.filter(c => c.condition === 'E')) {
    const path = join(out, 'ratings', `${cell.id}.json`), record = JSON.parse(readFileSync(path, 'utf8'));
    for (const d of ['judgment', 'actionability', 'constraints', 'calibration']) record.rating[d] = 2;
    atomicJson(path, record);
  }
  const below = summarize(protocol, out);
  assert.equal(below.decision.primaryThreshold, .25); assert.equal(below.decision.status, 'below_threshold');
  assert.equal(below.decision.meetsPredeclaredPilotSignal, false);
});
