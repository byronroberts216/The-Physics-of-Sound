import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
const path = ".agents/skills/apple-design/SKILL.md";
assert(existsSync(path), "Codex repository-local skill is missing");
const skill = readFileSync(path, "utf8");
assert.match(skill, /^---\nname: apple-design\n/);
assert.match(skill, /Reduced motion & accessibility/);
assert.match(
  readFileSync("AGENTS.md", "utf8"),
  /\.agents\/skills\/apple-design\/SKILL\.md/,
);
assert.equal(
  JSON.parse(readFileSync("skills-lock.json", "utf8")).skills["apple-design"]
    .source,
  "emilkowalski/skills",
);
console.log(`Codex skill discovered and readable: ${path}`);

const author = readFileSync(
  ".agents/skills/acoustics-course-author/SKILL.md",
  "utf8",
);
assert.match(author, /^---\nname: acoustics-course-author\n/);
console.log("Acoustics course author skill discovered and readable.");
