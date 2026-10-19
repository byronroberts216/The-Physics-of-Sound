import { sources } from "@/lib/course";
export const metadata = { title: "Sources & method" };
export default function Page() {
  return (
    <div className="page-wrap references-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">TRACEABLE IDEAS. EXPLICIT LIMITS.</div>
          <h1>Sources & scientific method</h1>
          <p>What we read, what it supports, and what we have not verified.</p>
        </div>
      </div>
      <section className="card reference-intro">
        <h2>Understand first. Verify always.</h2>
        <p>
          Explanations and diagrams are original. The starter lessons draw from
          the reviewed scientific sections below; reference access does not
          imply independent peer review of this academy. Planned lessons need
          further research before publication.
        </p>
        <p>
          The IES learning guide informs worked examples, retrieval, graphical
          explanations and spaced practice. Evidence strength and populations
          vary; no learning outcome is guaranteed for a particular adult
          student.
        </p>
        <p>
          Laboratories are idealized models. Pressure is not displacement,
          loudness is not SPL, treatment is not isolation, and a room-mode
          calculator is not a measured response. All models state their
          assumptions. Metadata-only sources do not verify scientific claims.
        </p>
      </section>
      <div className="reference-list">
        {sources.map((s) => (
          <article className="card reference-card" key={s.id}>
            <div>
              <span
                className={`source-status ${s.status === "metadata-only" ? "pending" : ""}`}
              >
                {s.status.replaceAll("-", " ")}
              </span>
              <span className="small muted">ACCESSED {s.accessed}</span>
            </div>
            <h2>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title} ↗
              </a>
            </h2>
            <p>
              {s.authors} · {s.publisher}
              {s.year ? ` · ${s.year}` : ""}
            </p>
            <p className="small">
              <strong>Reviewed scope:</strong> {s.section}
            </p>
            <ul>
              {s.verifiedClaims.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="small muted">
              <strong>Limit:</strong> {s.limitations}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
