import Link from "next/link";
import { CourseProgress } from "@/components/learning-tools";
import { WaveArt } from "@/components/wave-art";
import { Icon } from "@/components/icons";
import { modules, lessons, published } from "@/lib/course";
export default function Page() {
  return (
    <div className="dashboard page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR PERSONAL ACOUSTICS ACADEMY</div>
          <h1>The Physics of Sound</h1>
          <p>From hearing it to understanding it.</p>
        </div>
        <span className="edition-label">
          A SELF-PACED JOURNEY <span>01 — ∞</span>
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">
            <span className="live-dot" /> BUILT FOR THE CURIOUS EAR
          </span>
          <h2>
            You know the sound.
            <br />
            Discover the <em>science.</em>
          </h2>
          <p>
            Turn years of listening into a deeper understanding of waves,
            spaces, and the music between them. No physics background needed.
          </p>
          <Link href="/course" className="text-link">
            Explore your learning path <Icon name="arrow" size={18} />
          </Link>
        </div>
        <WaveArt />
        <div className="hero-caption">
          VIBRATION <span>→</span> PROPAGATION <span>→</span> PERCEPTION
        </div>
      </section>
      <div className="dashboard-middle">
        <CourseProgress
          available={published.map((l) => ({ slug: l.slug, title: l.title }))}
        />
        <Link className="lab-promo card" href="/labs">
          <div className="promo-icon">
            <Icon name="lab" size={26} />
          </div>
          <div className="eyebrow">LEARN BY EXPLORING</div>
          <h2>
            Make a prediction.
            <br /> See what happens.
          </h2>
          <p>
            Change a frequency. Follow a particle. Make the invisible a little
            more tangible.
          </p>
          <span className="text-link">
            Enter the laboratory <Icon name="arrow" size={18} />
          </span>
        </Link>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE BIG PICTURE</div>
            <h2>Your path to understanding</h2>
          </div>
          <Link className="text-link" href="/course">
            View all {lessons.length} lessons <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="module-grid">
          {modules.map((m, i) => {
            const count = published.filter((l) => l.module === m.id).length;
            return (
              <Link href={`/course#${m.id}`} className="module-card" key={m.id}>
                <span className={`module-symbol symbol-${i}`}>
                  <Icon
                    name={["book", "wave", "refresh", "sun", "room", "lab"][i]}
                    size={23}
                  />
                </span>
                <span className="module-number">
                  STAGE {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
                <div className="module-meta">
                  <span>
                    {count
                      ? `${count} available · ${8 - count} planned`
                      : "8 planned lessons"}
                  </span>
                  <Icon name="arrow" size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="workshop-banner">
        <div className="workshop-grid" aria-hidden="true">
          <div />
          <i />
          <b />
        </div>
        <div>
          <div className="eyebrow">FROM FIRST PRINCIPLES TO YOUR OWN ROOM</div>
          <h2>A better room starts with a better question.</h2>
          <p>
            Explore ideal room modes, reflection paths, and the limits of
            acoustic-treatment shortcuts.
          </p>
        </div>
        <Link className="button secondary" href="/workshop">
          Open room workshop <Icon name="arrow" size={17} />
        </Link>
      </section>
      <p className="development-note">
        An academy in progress: {published.length} complete starter lessons and
        exploratory labs are available. The remaining curriculum is mapped and
        clearly marked as planned. No account required.
      </p>
    </div>
  );
}
