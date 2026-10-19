"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useProgress } from "./progress";
import { validateProgress, scheduleReview } from "@/lib/progress";
import type { Question } from "./learning-tools";
import { KnowledgeChecks } from "./learning-tools";
export function Notebook({
  available,
}: {
  available: { slug: string; title: string; question: Question }[];
}) {
  const { state, update, ready } = useProgress();
  const [message, setMessage] = useState(""),
    [pending, setPending] = useState<ReturnType<
      typeof validateProgress
    > | null>(null),
    [now] = useState(() => Date.now());
  const input = useRef<HTMLInputElement>(null);
  const [reviewing, setReviewing] = useState("");
  const due = available.filter(
    (l) =>
      state.completed.includes(l.slug) &&
      (!state.reviews[l.slug] || state.reviews[l.slug].due <= now),
  );
  const selected = available.find((l) => l.slug === reviewing);
  const saveReview = (recalled: boolean) => {
    try {
      update((s) => ({
        ...s,
        reviews: {
          ...s.reviews,
          [reviewing]: scheduleReview(
            s.reviews[reviewing],
            recalled,
            Date.now(),
          ),
        },
      }));
      setReviewing("");
      setMessage(
        "Review saved. Recall is scheduled in days, not promised mastery.",
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "physics-of-sound-progress.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Export downloaded. Keep a backup outside this browser.");
  };
  const importData = async (file: File | undefined) => {
    setPending(null);
    if (!file) return;
    try {
      if (file.size > 1_000_000)
        throw new Error("Choose a JSON export smaller than 1 MB.");
      const next = validateProgress(JSON.parse(await file.text()));
      setPending(next);
      setMessage(
        `Valid export: ${next.completed.length} completed lessons and ${Object.keys(next.notes).length} notes. Confirm below to replace current data.`,
      );
    } catch (e) {
      setMessage(`Import not applied: ${(e as Error).message}`);
    }
    if (input.current) input.current.value = "";
  };
  return (
    <>
      <section className="card notebook-transfer">
        <div>
          <div className="eyebrow">YOUR LEARNING BELONGS TO YOU</div>
          <h2>Keep a copy. Bring it with you.</h2>
          <p>
            Notes, bookmarks, completion and review dates stay in this browser.
            There is no account or cloud sync. Clearing site storage removes
            them; export a backup first.
          </p>
        </div>
        <div className="button-row">
          <button
            className="button secondary"
            disabled={!ready}
            onClick={exportData}
          >
            Export progress
          </button>
          <label className="button secondary file-button">
            Choose import
            <input
              ref={input}
              type="file"
              accept=".json,application/json"
              disabled={!ready}
              onChange={(e) => void importData(e.target.files?.[0])}
            />
          </label>
        </div>
        <p role="status">{message}</p>
        {pending && (
          <div className="notice">
            <p>
              Import will replace this device’s notes and progress. Export first
              if you want to keep them.
            </p>
            <div className="button-row">
              <button
                className="button primary"
                onClick={() => {
                  try {
                    update(() => pending);
                    setPending(null);
                    setMessage("Imported successfully.");
                  } catch (e) {
                    setMessage((e as Error).message);
                  }
                }}
              >
                Replace with imported data
              </button>
              <button
                className="button quiet"
                onClick={() => {
                  setPending(null);
                  setMessage("Import cancelled. Current data preserved.");
                }}
              >
                Cancel import
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="card review-card">
        <div className="eyebrow">RETRIEVAL, THEN REVISIT</div>
        <h2>Give the idea another pass.</h2>
        <p className="muted">
          Simple spaced review: 1, 3, 7, 14, then 30 days after successful
          self-recall. A difficult recall returns to 1 day. This transparent
          schedule is not FSRS and does not predict memory probability.
        </p>
        {selected ? (
          <>
            <KnowledgeChecks
              key={selected.slug}
              questions={[selected.question]}
              title={selected.title}
            />
            <p>After answering and explaining why, how did recall feel?</p>
            <div className="button-row">
              <button
                className="button primary"
                onClick={() => saveReview(true)}
              >
                I recalled and explained it
              </button>
              <button
                className="button secondary"
                onClick={() => saveReview(false)}
              >
                I need another pass
              </button>
              <button className="button quiet" onClick={() => setReviewing("")}>
                Close review
              </button>
            </div>
          </>
        ) : due.length ? (
          <div className="review-list">
            {due.map((l) => (
              <button
                className="button secondary"
                key={l.slug}
                onClick={() => setReviewing(l.slug)}
              >
                {l.title} →
              </button>
            ))}
          </div>
        ) : (
          <p className="notice">
            No reviews due now. Mark a lesson as studied to schedule a revisit
            tomorrow.
          </p>
        )}
      </section>
      <div className="notebook-columns">
        <section>
          <h2>Bookmarks</h2>
          {available
            .filter((l) => state.bookmarks.includes(l.slug))
            .map((l) => (
              <Link
                className="saved-item card"
                key={l.slug}
                href={`/course/${l.slug}`}
              >
                <strong>{l.title}</strong>
                <span>Return to lesson →</span>
              </Link>
            ))}
          {!state.bookmarks.length && (
            <p className="muted">Bookmark a lesson to find it here.</p>
          )}
        </section>
        <section>
          <h2>Your notes</h2>
          {available
            .filter((l) => state.notes[l.slug]?.trim())
            .map((l) => (
              <div className="saved-item card" key={l.slug}>
                <Link href={`/course/${l.slug}`}>{l.title} →</Link>
                <p className="saved-note">{state.notes[l.slug]}</p>
              </div>
            ))}
          {!Object.values(state.notes).some((t) => t.trim()) && (
            <p className="muted">
              Write in a lesson’s note field to capture your reasoning.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
