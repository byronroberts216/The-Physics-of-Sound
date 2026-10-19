import curriculum from "@/content/curriculum.json";
import content from "@/content/lessons.json";
import references from "@/content/references.json";
export type LessonContent = (typeof content)[number];
export const modules = curriculum.modules;
export const lessons = curriculum.lessons.map((item) => ({
  ...item,
  content: content.find((c) => c.slug === item.slug),
}));
export type Lesson = (typeof lessons)[number];
export const published = lessons.filter((l) => l.content);
export const sources = references;
export function sourceById(id: string) {
  return sources.find((s) => s.id === id);
}
