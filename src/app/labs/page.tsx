import {
  WaveLab,
  InterferenceLab,
  DecibelLab,
  HarmonicLab,
} from "@/components/labs";
import Link from "next/link";
export const metadata = { title: "Physics laboratory" };
export default function LabsPage() {
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">PREDICT · EXPLORE · EXPLAIN</div>
          <h1>The physics laboratory</h1>
          <p>
            Make the invisible tangible. Change one variable and tell the story.
          </p>
        </div>
      </div>
      <div className="lab-jump">
        <a href="#waves">01 Waves & particles</a>
        <a href="#interference">02 Interference</a>
        <a href="#decibels">03 Decibels</a>
        <a href="#harmonics">04 Harmonics</a>
        <Link href="/workshop">05 Room workshop →</Link>
      </div>
      <div className="notice">
        Labs are exploratory models, not real-room predictions. Animation starts
        paused, audio starts off, and all controls work without dragging.
        Later-topic labs include a short explanation; their full lessons are
        still being developed.
      </div>
      <WaveLab />
      <InterferenceLab />
      <DecibelLab />
      <HarmonicLab />
    </div>
  );
}
