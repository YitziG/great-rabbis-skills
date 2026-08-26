import React, { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { ArrowLeft, ArrowRight, Check, CopySimple } from "@phosphor-icons/react";
import practiceManifest from "../../.generated/practice-manifest.json";
import collectionData from "../../site-content/collections.json";
import { useCopyFeedback } from "../hooks/useCopyFeedback";
import styles from "./CollectionHome.module.css";

type Practice = {
  name: string;
  title: string;
  collection: string;
  category: string;
  summary: string;
  order: number;
};

type Collection = (typeof collectionData)[number];

export default function CollectionHome({ collectionId }: { collectionId: string }): React.JSX.Element {
  const collection = collectionData.find((item) => item.id === collectionId) as Collection;
  const stages = collection.stages.map((stage, index) => ({
    ...stage,
    number: String(index + 1).padStart(2, "0"),
    practices: (practiceManifest as Practice[])
      .filter((practice) => practice.collection === collection.id && practice.category === stage.id)
      .sort((a, b) => a.order - b.order),
  }));
  const [activeId, setActiveId] = useState(stages[0].id);
  const { copy, status: copyStatus } = useCopyFeedback();
  const active = useMemo(() => stages.find((stage) => stage.id === activeId) ?? stages[0], [activeId, stages]);
  const installCommand = "npx skills@latest add YitziG/great-rabbis-skills";
  const displayNameLines: Record<string, string[]> = {
    "rabbi-nachman": ["Rabbi Nachman", "of Breslov"],
    "lubavitcher-rebbe": ["The Lubavitcher", "Rebbe"],
    "rav-kook": ["Rav Kook"],
  };
  const theme = {
    "--collection-accent": collection.accent,
    "--collection-surface": collection.surface,
    "--collection-glow": collection.glow,
  } as React.CSSProperties;

  return (
    <Layout title={collection.name} description={collection.summary}>
      <main className={styles.page} style={theme} data-collection={collection.id}>
        <div className={styles.scrim} aria-hidden="true" />
        <section className={styles.mapShell} aria-labelledby="collection-title">
          <div className={styles.intro}>
            <Link className={styles.backLink} to="/">
              <ArrowLeft aria-hidden="true" /> All collections
            </Link>
            <p className={styles.kicker}>{collection.kicker}</p>
            <h1 id="collection-title">
              {displayNameLines[collection.id].map((line) => <span key={line}>{line}</span>)}
            </h1>
            <p className={styles.lede}>{collection.tagline}</p>
            <a className={styles.primaryAction} href="#collection-stages">
              Choose where to begin <ArrowRight weight="bold" aria-hidden="true" />
            </a>
            <p className={styles.boundary}>
              Original modern workflows inspired by documented themes. No quotations, impersonation, religious rulings, or claims of rabbinic authority.
            </p>
          </div>

          <div id="collection-stages" className={styles.stages} aria-label={`${collection.name} practice groups`}>
            {stages.map((stage) => (
              <button
                type="button"
                key={stage.id}
                className={`${styles.stage} ${activeId === stage.id ? styles.activeStage : ""}`}
                onClick={() => setActiveId(stage.id)}
                aria-pressed={activeId === stage.id}
              >
                <span className={styles.stageNode} aria-hidden="true" />
                <span className={styles.stageNumber}>{stage.number}</span>
                <strong>{stage.name}</strong>
                <span>{stage.summary}</span>
              </button>
            ))}
          </div>

          <aside className={styles.practicePanel} aria-live="polite">
            <p className={styles.panelLabel}>{active.name} practices</p>
            <h2>{active.name} from here</h2>
            <p className={styles.panelSummary}>{active.summary}</p>
            <div className={styles.practiceList}>
              {active.practices.map((practice) => (
                <Link key={practice.name} to={`/${collection.id}/practices/${practice.name}`} className={styles.practiceRow}>
                  <span>
                    <strong>{practice.title}</strong>
                    <small>{practice.summary}</small>
                  </span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className={styles.installBlock}>
              <span>Install the complete library or choose one skill</span>
              <button type="button" onClick={() => copy(installCommand)} aria-label="Copy install command">
                <code>{installCommand}</code>
                {copyStatus === "Copied" ? <Check weight="bold" aria-hidden="true" /> : <CopySimple aria-hidden="true" />}
              </button>
              <span role="status" aria-live="polite" className={styles.copyStatus}>{copyStatus}</span>
            </div>
            <nav className={styles.helpModes} aria-label="Collection context">
              <Link to="/guide/tutorials/getting-started">Get started</Link>
              <Link to="/guide/how-to/choose-a-practice">Choose well</Link>
              <Link to="/sources">Sources & limits</Link>
            </nav>
          </aside>
        </section>
      </main>
    </Layout>
  );
}
