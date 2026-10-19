/** Educational linear models. SI units throughout; see docs/science-models.md. */
export const TAU = 2 * Math.PI;
export const SOUND_SPEED = 343;
function positive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0)
    throw new RangeError(`${name} must be finite and positive`);
  return value;
}
export function wavelength(frequency: number, speed = SOUND_SPEED) {
  return positive(speed, "speed") / positive(frequency, "frequency");
}
export function period(frequency: number) {
  return 1 / positive(frequency, "frequency");
}
export function travelingPressure(
  x: number,
  t: number,
  frequency: number,
  amplitude = 1,
  speed = SOUND_SPEED,
  phase = 0,
) {
  const lambda = wavelength(frequency, speed);
  return amplitude * Math.cos(TAU * (x / lambda - frequency * t) + phase);
}
/** Rightward traveling wave: displacement is -sin so -d(displacement)/dx is in phase with pressure. */
export function particleDisplacement(
  x: number,
  t: number,
  frequency: number,
  speed = SOUND_SPEED,
) {
  return -Math.sin(TAU * (x / wavelength(frequency, speed) - frequency * t));
}
export function interferenceAmplitude(
  a: number,
  b: number,
  phaseDegrees: number,
) {
  if (![a, b, phaseDegrees].every(Number.isFinite) || a < 0 || b < 0)
    throw new RangeError("Invalid amplitudes or phase");
  return Math.sqrt(
    Math.max(
      0,
      a * a + b * b + 2 * a * b * Math.cos((phaseDegrees * Math.PI) / 180),
    ),
  );
}
export function pressureLevel(rmsPressure: number, reference = 20e-6) {
  return (
    20 *
    Math.log10(
      positive(rmsPressure, "RMS pressure") / positive(reference, "reference"),
    )
  );
}
export function intensityLevel(intensity: number, reference = 1e-12) {
  return (
    10 *
    Math.log10(
      positive(intensity, "intensity") / positive(reference, "reference"),
    )
  );
}
/** Sum independent (uncorrelated) mean-square levels; not coherent equal-frequency wave addition. */
export function sumIndependentLevels(levels: number[]) {
  if (!levels.length || !levels.every(Number.isFinite))
    throw new RangeError("Finite levels required");
  const max = Math.max(...levels);
  return (
    max +
    10 * Math.log10(levels.reduce((sum, l) => sum + 10 ** ((l - max) / 10), 0))
  );
}
export type Dimensions = [number, number, number];
export type ModeIndex = [number, number, number];
export function modeFrequency(
  dimensions: Dimensions,
  indices: ModeIndex,
  speed = SOUND_SPEED,
) {
  dimensions.forEach((d) => positive(d, "dimension"));
  positive(speed, "speed");
  if (
    !indices.every((n) => Number.isInteger(n) && n >= 0) ||
    indices.every((n) => n === 0)
  )
    throw new RangeError("Nonzero nonnegative integer mode required");
  return (speed / 2) * Math.hypot(...indices.map((n, i) => n / dimensions[i]));
}
export function modeShape(
  position: Dimensions,
  dimensions: Dimensions,
  indices: ModeIndex,
) {
  modeFrequency(dimensions, indices);
  if (
    !position.every(
      (x, i) => Number.isFinite(x) && x >= 0 && x <= dimensions[i],
    )
  )
    throw new RangeError("Position outside room");
  return indices.reduce(
    (product, n, i) =>
      product * Math.cos((n * Math.PI * position[i]) / dimensions[i]),
    1,
  );
}
export function roomModes(
  dimensions: Dimensions,
  maxFrequency = 200,
  order = 6,
) {
  dimensions.forEach((d) => positive(d, "dimension"));
  positive(maxFrequency, "maximum frequency");
  if (!Number.isInteger(order) || order < 1 || order > 20)
    throw new RangeError("Mode order must be 1–20");
  const modes = [];
  for (let x = 0; x <= order; x++)
    for (let y = 0; y <= order; y++)
      for (let z = 0; z <= order; z++) {
        if (x + y + z === 0) continue;
        const indices: ModeIndex = [x, y, z];
        const frequency = modeFrequency(dimensions, indices);
        const active = indices.filter((n) => n > 0).length;
        if (frequency <= maxFrequency)
          modes.push({
            indices,
            frequency,
            kind:
              active === 1 ? "axial" : active === 2 ? "tangential" : "oblique",
          });
      }
  return modes.sort((a, b) => a.frequency - b.frequency);
}
export function reflectionGeometry(
  source: [number, number],
  listener: [number, number],
  speed = SOUND_SPEED,
) {
  positive(speed, "speed");
  if (
    ![...source, ...listener].every(Number.isFinite) ||
    source[1] <= 0 ||
    listener[1] <= 0
  )
    throw new RangeError("Source/listener must be on positive side of wall");
  const direct = Math.hypot(source[0] - listener[0], source[1] - listener[1]);
  const reflected = Math.hypot(
    source[0] - listener[0],
    source[1] + listener[1],
  );
  const fraction = source[1] / (source[1] + listener[1]);
  const wallX = source[0] + fraction * (listener[0] - source[0]);
  return { direct, reflected, wallX, extraDelay: (reflected - direct) / speed };
}
/** Geometry scale only; not an absorption coefficient or cutoff frequency. */
export function quarterWaveScale(depth: number, speed = SOUND_SPEED) {
  return positive(speed, "speed") / (4 * positive(depth, "depth"));
}
export function harmonicSignal(cycles: number, weights: number[]) {
  if (
    !Number.isFinite(cycles) ||
    !weights.length ||
    !weights.every(Number.isFinite)
  )
    throw new RangeError("Finite harmonics required");
  return weights.reduce(
    (sum, a, i) => sum + a * Math.sin(TAU * (i + 1) * cycles),
    0,
  );
}
