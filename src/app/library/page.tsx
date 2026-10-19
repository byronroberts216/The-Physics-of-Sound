import { Notebook } from "@/components/notebook";
import { published } from "@/lib/course";
export const metadata = { title: "My notebook" };
export default function Page() {
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">A RECORD OF YOUR UNDERSTANDING</div>
          <h1>Your notebook</h1>
          <p>
            Collect ideas, revisit questions, and keep your progress portable.
          </p>
        </div>
      </div>
      <Notebook
        available={published.map((l) => ({
          slug: l.slug,
          title: l.title,
          question: l.content!.questions[0],
        }))}
      />
    </div>
  );
}
