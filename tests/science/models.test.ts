import { test } from "node:test";
import assert from "node:assert/strict";
import {
  wavelength,
  period,
  travelingPressure,
  particleDisplacement,
  interferenceAmplitude,
  pressureLevel,
  intensityLevel,
  sumIndependentLevels,
  modeFrequency,
  modeShape,
  roomModes,
  reflectionGeometry,
  quarterWaveScale,
  harmonicSignal,
} from "../../src/lib/physics/models.ts";
const close = (actual: number, expected: number, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);
test("wavelength and period preserve fλ=c and fT=1 across audible examples", () => {
  for (const f of [20, 100, 500, 1000, 20000]) {
    close(wavelength(f) * f, 343);
    close(period(f) * f, 1);
  }
  close(wavelength(500), 0.686);
  close(period(500), 0.002);
});
test("traveling pressure is periodic and travels right at c", () => {
  const f = 100;
  close(travelingPressure(0, 0, f), 1);
  close(travelingPressure(0, period(f), f), 1);
  close(travelingPressure(343 * 0.002, 0.002, f), 1);
  close(travelingPressure(wavelength(f) / 2, 0, f), -1);
});
test("parcel displacement is bounded, periodic, and compression matches pressure", () => {
  const f = 100,
    lambda = wavelength(f),
    epsilon = 1e-6;
  close(particleDisplacement(0, 0, f), 0);
  close(particleDisplacement(0, period(f), f), 0);
  const minusGradient =
    -(
      particleDisplacement(epsilon, 0, f) - particleDisplacement(-epsilon, 0, f)
    ) /
    (2 * epsilon);
  close(minusGradient, (2 * Math.PI) / lambda, 1e-6);
  for (let t = 0; t < 0.03; t += 0.001)
    assert.ok(Math.abs(particleDisplacement(2, t, f)) <= 1);
});
test("interference analytic limits distinguish unequal/coherent sources", () => {
  close(interferenceAmplitude(1, 1, 0), 2);
  close(interferenceAmplitude(1, 1, 180), 0);
  close(interferenceAmplitude(1, 0.5, 180), 0.5);
  close(interferenceAmplitude(1, 1, 90), Math.sqrt(2));
  close(interferenceAmplitude(1, 0, 90), 1);
});
test("decibel references and doubling rules are distinct", () => {
  close(pressureLevel(20e-6), 0);
  close(pressureLevel(40e-6), 6.020599913279624);
  close(intensityLevel(1e-12), 0);
  close(intensityLevel(2e-12), 3.010299956639812);
  close(pressureLevel(2), 100);
  close(sumIndependentLevels([60, 60]), 63.01029995663981);
  close(sumIndependentLevels([4000, 4000]), 4003.01029995664, 1e-8);
});
test("room mode fundamentals, dimensions scaling and nonaxial values", () => {
  close(modeFrequency([5, 4, 3], [1, 0, 0]), 34.3);
  close(modeFrequency([5, 4, 3], [0, 1, 0]), 42.875);
  close(
    modeFrequency([5, 4, 3], [1, 1, 0]),
    (343 / 2) * Math.sqrt(0.04 + 0.0625),
  );
  close(
    modeFrequency([10, 8, 6], [1, 1, 1]),
    modeFrequency([5, 4, 3], [1, 1, 1]) / 2,
  );
});
test("rigid pressure shape has antinodes on ends and odd-mode midpoint node", () => {
  close(modeShape([0, 2, 1.5], [5, 4, 3], [1, 0, 0]), 1);
  close(modeShape([5, 2, 1.5], [5, 4, 3], [1, 0, 0]), -1);
  close(modeShape([2.5, 2, 1.5], [5, 4, 3], [1, 0, 0]), 0);
  const eps = 1e-6;
  assert.ok(
    Math.abs((modeShape([eps, 2, 1.5], [5, 4, 3], [1, 0, 0]) - 1) / eps) < 1e-5,
  );
});
test("mode enumeration sorts, classifies, preserves degeneracy and excludes DC", () => {
  const modes = roomModes([4, 4, 4], 200);
  assert.ok(modes.every((m) => m.frequency > 0 && m.frequency <= 200));
  assert.ok(modes.every((m, i) => !i || m.frequency >= modes[i - 1].frequency));
  assert.equal(
    modes.filter((m) => Math.abs(m.frequency - 42.875) < 1e-9).length,
    3,
  );
  assert.equal(
    modes.find((m) => m.indices.join() === "1,1,0")?.kind,
    "tangential",
  );
  assert.equal(
    modes.find((m) => m.indices.join() === "1,1,1")?.kind,
    "oblique",
  );
});
test("image source path has correct intersection, reciprocity and excess delay", () => {
  const r = reflectionGeometry([1, 1], [3, 1]);
  close(r.direct, 2);
  close(r.reflected, Math.sqrt(8));
  close(r.wallX, 2);
  close(r.extraDelay, (Math.sqrt(8) - 2) / 343);
  const reverse = reflectionGeometry([3, 1], [1, 1]);
  close(r.reflected, reverse.reflected);
  close(r.wallX, reverse.wallX);
  assert.ok(r.extraDelay >= 0);
});
test("quarter-wave comparison is a geometric scale and harmonic recipe is periodic", () => {
  close(quarterWaveScale(0.1), 857.5);
  close(quarterWaveScale(0.2), 428.75);
  for (const u of [0.1, 0.25, 0.63])
    close(
      harmonicSignal(u, [1, 0.5, 0.2]),
      harmonicSignal(u + 1, [1, 0.5, 0.2]),
    );
});
test("models reject invalid domain inputs rather than silently producing nonsense", () => {
  for (const x of [0, -1, NaN, Infinity]) {
    assert.throws(() => wavelength(x));
    assert.throws(() => period(x));
    assert.throws(() => pressureLevel(x));
    assert.throws(() => intensityLevel(x));
    assert.throws(() => quarterWaveScale(x));
    assert.throws(() => modeFrequency([x, 4, 3], [1, 0, 0]));
  }
  assert.throws(() => modeFrequency([5, 4, 3], [0, 0, 0]));
  assert.throws(() => modeFrequency([5, 4, 3], [0.5, 0, 0]));
  assert.throws(() => modeShape([6, 1, 1], [5, 4, 3], [1, 0, 0]));
  assert.throws(() => roomModes([5, 4, 3], 200, 30));
  assert.throws(() => sumIndependentLevels([]));
  assert.throws(() => reflectionGeometry([1, -1], [2, 2]));
});
