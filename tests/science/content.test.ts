import { test } from "node:test";
import assert from "node:assert/strict";
import curriculum from "../../src/content/curriculum.json" with { type: "json" };
import lessons from "../../src/content/lessons.json" with { type: "json" };
import sources from "../../src/content/references.json" with { type: "json" };
test("curriculum has 48 unique items and acyclic ordered prerequisites", () => {
  const seen = new Set();
  assert.equal(curriculum.lessons.length, 48);
  for (const l of curriculum.lessons) {
    assert.ok(!seen.has(l.slug));
    for (const p of l.prerequisites)
      assert.ok(seen.has(p), `${l.slug} lacks preceding ${p}`);
    seen.add(l.slug);
    assert.ok(l.objectives.length);
    assert.equal(l.outline.length, 5);
  }
});
test("available lessons contain all required teaching blocks and reviewed references", () => {
  assert.equal(lessons.length, 16);
  for (const l of lessons) {
    assert.ok(curriculum.lessons.some((c) => c.slug === l.slug));
    assert.ok(l.intro.length > 300);
    assert.ok(l.sections.length >= 3);
    assert.ok(l.sections.every((s) => s.paragraphs.length >= 2));
    assert.ok(l.terms.length >= 4);
    assert.ok(l.equation && l.symbols && l.diagram);
    assert.ok(l.worked.steps.length >= 3);
    assert.ok(l.misconception.correction);
    assert.ok(l.exercises.length >= 3);
    assert.ok(l.summary.length >= 3);
    assert.ok(l.sources.length);
    for (const id of l.sources)
      assert.equal(
        sources.find((s) => s.id === id)?.status,
        "passages-reviewed",
      );
    for (const q of l.questions) {
      assert.equal(q.options.length, q.feedback.length);
      assert.ok(q.correct >= 0 && q.correct < q.options.length);
      assert.ok(q.feedback.every((f) => f.length > 20));
    }
    const words = JSON.stringify(l).split(/\s+/).length;
    assert.ok(words > 650, `${l.slug}: substantive content gate, ${words}`);
  }
});
