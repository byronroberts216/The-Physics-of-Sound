import { published } from "@/lib/course";
import { Glossary } from "@/components/glossary";
export const metadata = { title: "Glossary" };
export default function Page() {
  const all = published.flatMap((l) =>
    l.content!.terms.map((t) => ({ ...t, slug: l.slug, title: l.title })),
  );
  const terms = all
    .filter((t, i) => all.findIndex((x) => x.term === t.term) === i)
    .sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">BUILD YOUR SCIENTIFIC VOCABULARY</div>
          <h1>A language for what you hear.</h1>
          <p>
            Plain definitions, connected to the lesson where the idea begins.
          </p>
        </div>
      </div>
      <Glossary terms={terms} />
    </div>
  );
}
