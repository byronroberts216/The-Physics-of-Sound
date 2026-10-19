import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateProgress,
  emptyProgress,
  scheduleReview,
} from "../../src/lib/progress.ts";
test("progress round trip preserves notes, completion and bookmarks", () => {
  const input = {
    ...emptyProgress,
    completed: ["measurement", "measurement"],
    bookmarks: ["ratios"],
    notes: { measurement: "3.42 m, wall to wall" },
  };
  const output = validateProgress(JSON.parse(JSON.stringify(input)));
  assert.deepEqual(output.completed, ["measurement"]);
  assert.equal(output.notes.measurement, input.notes.measurement);
  assert.deepEqual(output.bookmarks, ["ratios"]);
});
test("malformed imports reject prototype keys, oversized notes and nonfinite schedules", () => {
  assert.throws(() => validateProgress({ ...emptyProgress, version: 2 }));
  assert.throws(() =>
    validateProgress({ ...emptyProgress, completed: ["unknown"] }),
  );
  assert.throws(() =>
    validateProgress({
      ...emptyProgress,
      notes: JSON.parse('{"__proto__":"bad"}'),
    }),
  );
  assert.throws(() =>
    validateProgress({
      ...emptyProgress,
      notes: { measurement: "x".repeat(20001) },
    }),
  );
  assert.throws(() =>
    validateProgress({
      ...emptyProgress,
      reviews: { measurement: { due: Infinity, interval: 1 } },
    }),
  );
});
test("simple review intervals are explicit and failure resets to one day", () => {
  const first = scheduleReview(undefined, true, 1000);
  assert.equal(first.interval, 1);
  assert.equal(first.due, 86401000);
  const next = scheduleReview(first, true, 2000);
  assert.equal(next.interval, 3);
  assert.equal(scheduleReview(next, false, 0).interval, 1);
});
