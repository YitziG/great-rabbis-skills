import React from "react";
import Link from "@docusaurus/Link";
import { Check, CopySimple } from "@phosphor-icons/react";
import { useCopyFeedback } from "../hooks/useCopyFeedback";
import styles from "./PracticeHeader.module.css";

type Props = {
  name: string;
  collection: string;
  collectionPath: string;
  category: string;
  invocation: string;
  description: string;
};

export default function PracticeHeader({ name, collection, collectionPath, category, invocation, description }: Props) {
  const { copy, status: copyStatus } = useCopyFeedback();
  const command = `npx skills@latest add YitziG/great-rabbis-skills --skill ${name}`;

  return (
    <header className={styles.header}>
      <div className={styles.eyebrow}>
        <Link to={collectionPath}>{collection}</Link>
        <span aria-hidden="true"> / </span>
        {category} practice
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.meta}>
        <span>{invocation}</span>
        <button type="button" onClick={() => copy(command)} className={styles.copyButton} aria-label={`Copy install command for ${name}`}>
          <code>{command}</code>
          {copyStatus === "Copied" ? <Check weight="bold" aria-hidden="true" /> : <CopySimple aria-hidden="true" />}
        </button>
        <span role="status" aria-live="polite" className={styles.copyStatus}>{copyStatus}</span>
      </div>
    </header>
  );
}
