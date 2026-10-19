import { Workshop } from "@/components/workshop";
export const metadata = { title: "Room workshop" };
export default function Page() {
  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR ROOM, THROUGH THE LENS OF PHYSICS</div>
          <h1>The room workshop</h1>
          <p>
            Ask better questions about bass, boundaries, and acoustic treatment.
          </p>
        </div>
      </div>
      <div className="notice">
        Exploratory preview: ideal modes and geometry are implemented and
        numerically tested. The full room-treatment curriculum is still planned.
        These tools cannot replace measurements or predict material performance.
      </div>
      <Workshop />
    </div>
  );
}
