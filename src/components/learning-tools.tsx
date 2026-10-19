"use client";
import Link from "next/link";
import { useState } from "react";
import { useProgress } from "./progress";
import { Icon } from "./icons";
import { scheduleReview } from "@/lib/progress";
export function CourseProgress({
  available,
}: {
  available: { slug: string; title: string }[];
}) {
  const { state, ready } = useProgress();
  const completed = available.filter((l) =>
    state.completed.includes(l.slug),
  ).length;
  const next =
    available.find((l) => !state.completed.includes(l.slug)) ?? available[0];
  return (
    <div className="continue-card">
      <div className="eyebrow">
        {completed ? "KEEP YOUR MOMENTUM" : "START WITH THE FUNDAMENTALS"}
      </div>
      <h2>
        {completed === available.length ? "Revisit what you know." : next.title}
      </h2>
      <p>
        One idea at a time. A worked example, an experiment, and a question
        worth thinking about.
      </p>
      <div className="progress-line">
        <span style={{ width: `${(completed / available.length) * 100}%` }} />
      </div>
      <div className="continue-bottom">
        <span>
          {ready ? completed : 0} of {available.length} available lessons
          completed
        </span>
        <Link className="button primary" href={`/course/${next.slug}`}>
          {completed ? "Continue learning" : "Begin lesson 01"}
          <Icon name="arrow" size={17} />
        </Link>
      </div>
    </div>
  );
}
export function CompletionBadge({ slug }: { slug: string }) {
  const { state } = useProgress();
  return state.completed.includes(slug) ? (
    <span className="completion">
      <Icon name="check" size={14} />
      Completed
    </span>
  ) : null;
}
export function LessonTools({
  slug,
  prerequisites,
}: {
  slug: string;
  prerequisites: { slug: string; title: string }[];
}) {
  const { state, update, ready } = useProgress();
  const [message, setMessage] = useState("");
  const complete = state.completed.includes(slug);
  const bookmarked = state.bookmarks.includes(slug);
  const save = (fn: Parameters<typeof update>[0]) => {
    try {
      update(fn);
      setMessage("Saved on this device.");
    } catch (e) {
      setMessage((e as Error).message);
    }
  };
  return (
    <div className="lesson-tools">
      <div className="prerequisites">
        <h3>Before this lesson</h3>
        {prerequisites.length ? (
          prerequisites.map((p) => (
            <Link key={p.slug} href={`/course/${p.slug}`}>
              <Icon
                name={state.completed.includes(p.slug) ? "check" : "book"}
                size={16}
              />
              {p.title}
            </Link>
          ))
        ) : (
          <p>No physics or algebra prerequisites. Start here.</p>
        )}
      </div>
      <button
        className="button secondary"
        disabled={!ready}
        aria-pressed={bookmarked}
        onClick={() =>
          save((s) => ({
            ...s,
            bookmarks: bookmarked
              ? s.bookmarks.filter((x) => x !== slug)
              : [...s.bookmarks, slug],
          }))
        }
      >
        <Icon name="bookmark" />
        {bookmarked ? "Bookmarked" : "Bookmark lesson"}
      </button>
      <label className="note-label" htmlFor="lesson-note">
        Your notes
      </label>
      <p className="muted small">
        Explain the idea in your own words. Saved as you type.
      </p>
      <textarea
        id="lesson-note"
        placeholder="What clicked? What do you want to test?"
        maxLength={20000}
        disabled={!ready}
        value={state.notes[slug] ?? ""}
        onChange={(e) =>
          save((s) => ({ ...s, notes: { ...s.notes, [slug]: e.target.value } }))
        }
      />
      <button
        className="button primary"
        disabled={!ready}
        aria-pressed={complete}
        onClick={() =>
          save((s) => ({
            ...s,
            completed: complete
              ? s.completed.filter((x) => x !== slug)
              : [...s.completed, slug],
            reviews: complete
              ? s.reviews
              : {
                  ...s.reviews,
                  [slug]: scheduleReview(undefined, false, Date.now()),
                },
          }))
        }
      >
        <Icon name={complete ? "check" : "book"} />
        {complete ? "Lesson completed" : "Mark as studied"}
      </button>
      <p className="muted small">
        Completion is your self-assessment, not a claim of mastery. Answer the
        checks before moving on.
      </p>
      <p role="status" className="small">
        {message}
      </p>
    </div>
  );
}
export type Question = {
  prompt: string;
  options: string[];
  correct: number;
  feedback: string[];
};
export function KnowledgeChecks({
  questions,
  title = "Check your understanding",
}: {
  questions: Question[];
  title?: string;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  return (
    <section className="knowledge-check">
      <div className="eyebrow">ACTIVE RECALL</div>
      <h2>{title}</h2>
      <p className="muted">
        Try before looking back. A wrong answer is useful information.
      </p>
      {questions.map((q, i) => (
        <fieldset key={q.prompt}>
          <legend>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {q.prompt}
          </legend>
          <div className="answer-options">
            {q.options.map((option, j) => (
              <label
                key={option}
                className={answers[i] === j ? "selected" : ""}
              >
                <input
                  type="radio"
                  name={`question-${i}`}
                  checked={answers[i] === j}
                  onChange={() => setAnswers({ ...answers, [i]: j })}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {answers[i] !== undefined && (
            <p
              role="status"
              className={`feedback ${answers[i] === q.correct ? "correct" : "retry"}`}
            >
              <strong>
                {answers[i] === q.correct
                  ? "That’s it. "
                  : "Let’s examine that. "}
              </strong>
              {q.feedback[answers[i]]}
            </p>
          )}
        </fieldset>
      ))}
    </section>
  );
}
