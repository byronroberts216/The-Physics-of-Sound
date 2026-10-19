import curriculum from "../content/curriculum.json" with { type: "json" };
export const STORAGE_KEY = "physics-of-sound:v1";
const ids = new Set(curriculum.lessons.map((l) => l.slug));
export type Review = { due: number; interval: number };
export type Progress = {
  version: 1;
  completed: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  reviews: Record<string, Review>;
  theme: "dark" | "light";
};
export const emptyProgress: Progress = {
  version: 1,
  completed: [],
  bookmarks: [],
  notes: {},
  reviews: {},
  theme: "dark",
};
export function validateProgress(value: unknown): Progress {
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    value.version !== 1
  )
    throw new Error("Choose a version 1 Physics of Sound export.");
  const obj = value as Record<string, unknown>;
  const list = (key: string) => {
    if (
      !Array.isArray(obj[key]) ||
      !(obj[key] as unknown[]).every((x) => typeof x === "string" && ids.has(x))
    )
      throw new Error(`Invalid ${key} list.`);
    return [...new Set(obj[key] as string[])];
  };
  if (!obj.notes || typeof obj.notes !== "object" || Array.isArray(obj.notes))
    throw new Error("Invalid notes.");
  const notes: Record<string, string> = {};
  for (const [id, text] of Object.entries(obj.notes)) {
    if (!ids.has(id) || typeof text !== "string" || text.length > 20000)
      throw new Error("Invalid note or note too long.");
    notes[id] = text;
  }
  if (
    !obj.reviews ||
    typeof obj.reviews !== "object" ||
    Array.isArray(obj.reviews)
  )
    throw new Error("Invalid review schedule.");
  const reviews: Record<string, Review> = {};
  for (const [id, review] of Object.entries(obj.reviews)) {
    const r = review as Review;
    if (
      !ids.has(id) ||
      !r ||
      typeof r !== "object" ||
      !Number.isFinite(r.due) ||
      r.due < 0 ||
      !Number.isInteger(r.interval) ||
      r.interval < 0 ||
      r.interval > 365
    )
      throw new Error("Invalid review entry.");
    reviews[id] = { due: r.due, interval: r.interval };
  }
  if (obj.theme !== "dark" && obj.theme !== "light")
    throw new Error("Invalid theme.");
  return {
    version: 1,
    completed: list("completed"),
    bookmarks: list("bookmarks"),
    notes,
    reviews,
    theme: obj.theme,
  };
}
export function scheduleReview(
  current: Review | undefined,
  recalled: boolean,
  now: number,
): Review {
  const steps = [1, 3, 7, 14, 30];
  const interval = recalled
    ? (steps.find((n) => n > (current?.interval ?? 0)) ?? 30)
    : 1;
  return { interval, due: now + interval * 86400000 };
}
