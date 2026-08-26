import { useCallback, useEffect, useRef, useState } from "react";

type CopyStatus = "" | "Copied" | "Copy failed";

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the browser's legacy copy path.
    }
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("The browser rejected the copy command.");
}

export function useCopyFeedback(resetAfter = 1800) {
  const [status, setStatus] = useState<CopyStatus>("");
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  const copy = useCallback(async (text: string) => {
    window.clearTimeout(timeout.current);
    try {
      await writeClipboard(text);
      setStatus("Copied");
    } catch {
      setStatus("Copy failed");
    }
    timeout.current = window.setTimeout(() => setStatus(""), resetAfter);
  }, [resetAfter]);

  return { copy, status };
}
