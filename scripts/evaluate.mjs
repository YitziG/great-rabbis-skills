#!/usr/bin/env node
import { resolve } from 'node:path';
import { loadProtocol, initialize, lockOutput, execute, summarize, exportBlind } from './evaluation-lib.mjs';

async function main() {
  const [command, ...args] = process.argv.slice(2), options = {};
  if (!['plan', 'run', 'grade', 'export', 'summarize'].includes(command)) throw new Error('Usage: node scripts/evaluate.mjs <plan|run|grade|export|summarize> --out PATH [--config PATH] [--cases PATH] [--limit N] [--concurrency 4]');
  for (let i = 0; i < args.length; i += 2) {
    if (!['--out', '--config', '--cases', '--limit', '--concurrency'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Invalid CLI option');
    if (options[args[i]]) throw new Error('Duplicate CLI option'); options[args[i]] = args[i + 1];
  }
  if (!options['--out']) throw new Error('--out is required; use a directory outside the repository');
  const out = resolve(options['--out']);
  const protocol = loadProtocol(options['--config'] || 'evals/practical-judgment/config.json', options['--cases'] || 'evals/practical-judgment/cases.json');
  const release = lockOutput(out);
  try {
    let result;
    if (command === 'plan') result = { cells: initialize(out, protocol).length, fingerprint: protocol.manifest.fingerprint, budgetUsd: protocol.config.budgetUsd };
    if (command === 'run' || command === 'grade') result = await execute(protocol, out, { mode: command, limit: options['--limit'] ? Number(options['--limit']) : Infinity, concurrency: options['--concurrency'] ? Number(options['--concurrency']) : 4, apiKey: process.env.OPENAI_API_KEY, onProgress: progress => console.error(JSON.stringify({ progress })) });
    if (command === 'export') result = exportBlind(protocol, out);
    if (command === 'summarize') { const summary = summarize(protocol, out); result = { label: summary.label, plannedCells: summary.plannedCells, gradedCells: summary.gradedCells, statuses: summary.statuses, coverage: summary.coverage, decision: summary.decision, primaryPairedEminusB: summary.primaryPairedEminusB, summaryPath: `${out}/summary.json` }; }
    console.log(JSON.stringify(result, null, 2));
  } finally { release(); }
}
main().catch(error => { console.error(`Evaluation stopped: ${error.message}`); process.exitCode = 1; });
