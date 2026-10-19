import Link from "next/link";
import { lessons, modules, published } from "@/lib/course";
import { CompletionBadge } from "@/components/learning-tools";
import { Icon } from "@/components/icons";
export const metadata = { title: "Learning path" };
export default function CoursePage() {
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ONE IDEA BUILDS ON ANOTHER</div>
          <h1>Your learning path</h1>
          <p>
            {published.length} available lessons. A 48-lesson destination. No
            assumed physics knowledge.
          </p>
        </div>
      </div>
      <div className="notice">
        Begin with Stage 01. Later lessons are mapped, with objectives and
        prerequisites; planned lessons are not yet teaching content. Optional
        mathematics is separated from the essential path.
      </div>
      {modules.map((m) => (
        <section className="curriculum-module" id={m.id} key={m.id}>
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                STAGE {String(m.number).padStart(2, "0")}
              </div>
              <h2>{m.title}</h2>
              <p className="muted">{m.description}</p>
            </div>
          </div>
          <div className="lesson-list">
            {lessons
              .filter((l) => l.module === m.id)
              .map((l) => (
                <Link
                  key={l.slug}
                  href={`/course/${l.slug}`}
                  className={`lesson-row ${!l.content ? "planned" : ""}`}
                >
                  <span className="lesson-index">
                    {String(l.number).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>
                      {l.title}
                      {l.optional && <span className="tag">OPTIONAL</span>}
                    </h3>
                    <p>{l.objectives[0]}</p>
                  </div>
                  <div className="lesson-row-end">
                    <CompletionBadge slug={l.slug} />
                    <span className="small muted">
                      {l.content ? l.content.minutes : "Planned"}
                    </span>
                    <Icon name="arrow" size={18} />
                  </div>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
