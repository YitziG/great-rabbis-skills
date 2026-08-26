import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import { ArrowRight } from "@phosphor-icons/react";
import practiceManifest from "../../.generated/practice-manifest.json";
import collections from "../../site-content/collections.json";
import styles from "./index.module.css";

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Great Rabbis Skills" description="Source-grounded agent practices inspired by three great rabbinic thinkers.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Knowledge becomes useful when it becomes a practice.</p>
          <h1>Great Rabbis<br /><em>Skills</em></h1>
          <p className={styles.lede}>A source-grounded experiment in translating characteristic ways of seeing and acting into small, installable agent workflows.</p>
          <p className={styles.boundary}>Inspired by documented themes. Never written in a rabbi's voice; never a substitute for Torah study, halakhic guidance, pastoral care, or human judgment.</p>
        </section>

        <section className={styles.collections} aria-label="Rabbinic skill collections">
          {collections.map((collection, index) => {
            const count = practiceManifest.filter((practice) => practice.collection === collection.id).length;
            return (
              <Link
                key={collection.id}
                to={`/${collection.id}`}
                className={styles.collectionCard}
                style={{ "--card-accent": collection.accent, "--card-glow": collection.glow } as React.CSSProperties}
              >
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <p>{collection.kicker}</p>
                <h2>{collection.name}</h2>
                <span className={styles.tagline}>{collection.tagline}</span>
                <span className={styles.summary}>{collection.summary}</span>
                <span className={styles.enter}>{count} practices <ArrowRight aria-hidden="true" /></span>
              </Link>
            );
          })}
        </section>

        <section className={styles.method}>
          <span>One shared standard</span>
          <p>Every skill names a recurring situation, produces an observable artifact, preserves user agency, and states where the inspiration ends and the modern workflow begins.</p>
          <Link to="/guide/explanation/practices-not-teachings">Read the method <ArrowRight aria-hidden="true" /></Link>
        </section>
      </main>
    </Layout>
  );
}
