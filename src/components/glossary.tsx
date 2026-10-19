"use client";
import { useState } from "react";
import Link from "next/link";
export function Glossary({
  terms,
}: {
  terms: { term: string; definition: string; slug: string; title: string }[];
}) {
  const [search, setSearch] = useState("");
  const filtered = terms.filter((t) =>
    `${t.term} ${t.definition}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <label className="search-field">
        <span>Find a term</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Try pressure, period, or energy…"
        />
      </label>
      <p className="small muted" role="status">
        {filtered.length} terms in the available lessons
      </p>
      <dl className="glossary-grid">
        {filtered.map((t, i) => (
          <div className="card" key={i}>
            <dt>{t.term}</dt>
            <dd>
              {t.definition}
              <Link href={`/course/${t.slug}`}>{t.title} →</Link>
            </dd>
          </div>
        ))}
      </dl>
      {!filtered.length && (
        <div className="notice">
          No matching term yet. The glossary grows with verified lessons.
        </div>
      )}
    </>
  );
}
