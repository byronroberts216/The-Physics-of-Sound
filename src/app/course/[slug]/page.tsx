import Link from "next/link";
import { notFound } from "next/navigation";
import katex from "katex";
import { lessons, modules, sourceById } from "@/lib/course";
import { LessonDiagram } from "@/components/lesson-diagram";
import { LessonTools, KnowledgeChecks } from "@/components/learning-tools";
import { Icon } from "@/components/icons";
export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: lessons.find((l) => l.slug === slug)?.title ?? "Lesson" };
}
export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) notFound();
  const content = lesson.content;
  const m = modules.find((m) => m.id === lesson.module)!;
  const next = lessons.find((l) => l.number === lesson.number + 1);
  const prereqs = lesson.prerequisites
    .map((slug) => lessons.find((l) => l.slug === slug)!)
    .filter(Boolean);
  if (!content)
    return (
      <div className="page-wrap narrow">
        <Link className="text-link" href="/course">
          ← Learning path
        </Link>
        <div className="eyebrow space-top">
          STAGE {m.number} · LESSON {lesson.number} · PLANNED
        </div>
        <h1>{lesson.title}</h1>
        <div className="notice">
          This lesson is not yet written or scientifically reviewed. This is its
          curriculum brief, not a substitute lesson.
        </div>
        <h2>Learning objectives</h2>
        <ul>
          {lesson.objectives.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h2>Proposed learning sequence</h2>
        <ol>
          {lesson.outline.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <h2>Prerequisites</h2>
        {prereqs.map((p) => (
          <p key={p.slug}>
            <Link className="text-link" href={`/course/${p.slug}`}>
              {p.title} →
            </Link>
          </p>
        ))}
        <Link className="button primary" href="/course/measurement">
          Start with a complete lesson <Icon name="arrow" size={16} />
        </Link>
      </div>
    );
  return (
    <div className="page-wrap lesson-page">
      <div className="lesson-breadcrumb">
        <Link href="/course">Learning path</Link>
        <span>/</span>
        <span>{m.title}</span>
      </div>
      <header className="lesson-header">
        <div className="eyebrow">
          LESSON {String(lesson.number).padStart(2, "0")} ·{" "}
          {content.minutes.toUpperCase()}
        </div>
        <h1>{lesson.title}</h1>
        <p className="muted">
          First principles. Familiar examples. A little practice.
        </p>
      </header>
      <div className="lesson-layout">
        <article className="lesson-body">
          <section className="objectives">
            <div className="eyebrow">AFTER THIS LESSON</div>
            <ul>
              {lesson.objectives.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>
          {content.intro.split("\n\n").map((p) => (
            <p className="intro-paragraph" key={p}>
              {p}
            </p>
          ))}
          <section className="terms-block">
            <h2>Words we’ll use</h2>
            <dl>
              {content.terms.map((t) => (
                <div key={t.term}>
                  <dt>{t.term}</dt>
                  <dd>{t.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
          <LessonDiagram kind={content.diagram} />
          {content.sections.map((s, i) => (
            <section key={s.title} id={`section-${i}`}>
              <h2>{s.title}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <section className="equation-card">
            <div className="eyebrow">THE RELATIONSHIP, EXPLAINED</div>
            <div
              className="equation"
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(content.equation, {
                  displayMode: true,
                  throwOnError: true,
                  trust: false,
                  output: "htmlAndMathml",
                }),
              }}
            />
            <p>{content.symbols}</p>
          </section>
          <section className="worked-example">
            <div className="eyebrow">A WORKED EXAMPLE</div>
            <h2>{content.worked.problem}</h2>
            <ol>
              {content.worked.steps.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
            <p className="worked-answer">{content.worked.answer}</p>
          </section>
          <aside className="misconception">
            <h3>A common wrong turn</h3>
            <p>
              <s>{content.misconception.claim}</s>
            </p>
            <p>{content.misconception.correction}</p>
          </aside>
          <Link href={`/labs#${content.lab}`} className="inline-lab">
            <Icon name="lab" />
            <div>
              <strong>Turn the idea over in the laboratory</strong>
              <span>
                Predict, change one variable, and explain what you observe.
              </span>
            </div>
            <Icon name="arrow" />
          </Link>
          <KnowledgeChecks questions={content.questions} />
          <section>
            <div className="eyebrow">YOUR TURN</div>
            <h2>Practice, then explain</h2>
            {content.exercises.map((e, i) => (
              <div className="exercise" key={e.prompt}>
                <h3>
                  {i + 1}. {e.prompt}
                </h3>
                <details>
                  <summary>Compare your reasoning</summary>
                  <p>{e.answer}</p>
                </details>
              </div>
            ))}
          </section>
          <section className="summary-box">
            <h2>Take it with you</h2>
            <ul>
              {content.summary.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="small muted">
              Close the page and explain the main idea aloud. Revisit it
              tomorrow before rereading.
            </p>
          </section>
          <section className="lesson-sources">
            <h2>Sources & scope</h2>
            <p className="small muted">
              Original explanations informed by the reviewed sections below.
              These are author-reviewed starter lessons, not externally
              peer-reviewed course certification.
            </p>
            {content.sources.map((id) => {
              const s = sourceById(id);
              return (
                s && (
                  <p key={id}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.publisher}: {s.title} ↗
                    </a>
                    <span>
                      Section {s.section} · accessed {s.accessed}
                    </span>
                  </p>
                )
              );
            })}
            <p className="small muted">{content.limits}</p>
          </section>
          {next && (
            <Link href={`/course/${next.slug}`} className="next-lesson">
              <span>
                UP NEXT{!next.content ? " · PLANNED" : ""}
                <strong>{next.title}</strong>
              </span>
              <Icon name="arrow" />
            </Link>
          )}
        </article>
        <aside className="lesson-aside">
          <LessonTools
            slug={slug}
            prerequisites={prereqs.map((p) => ({
              slug: p.slug,
              title: p.title,
            }))}
          />
        </aside>
      </div>
    </div>
  );
}
