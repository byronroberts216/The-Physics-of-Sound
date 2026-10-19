"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import {
  travelingPressure,
  particleDisplacement,
  wavelength,
  period,
  interferenceAmplitude,
  pressureLevel,
  intensityLevel,
  sumIndependentLevels,
  harmonicSignal,
} from "@/lib/physics/models";
const subscribeHydration = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
}
function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const ready = useHydrated();
  return (
    <label className="slider-control">
      <span>
        {label}
        <output>
          {value.toLocaleString("en-US", { maximumFractionDigits: 3 })} {unit}
        </output>
      </span>
      <input
        type="range"
        disabled={!ready}
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
export { Slider };
function Plot({
  paths,
  label,
  xLabel = "Position (m)",
  yLabel = "Relative pressure",
  children,
}: {
  paths: { d: string; color: string; dash?: boolean }[];
  label: string;
  xLabel?: string;
  yLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <svg
      className="science-plot"
      role="img"
      aria-label={label}
      viewBox="0 0 720 260"
    >
      <title>{label}</title>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${55 + i * 100} 35v175`} stroke="var(--line)" />
      ))}
      {[45, 115, 185].map((y) => (
        <path key={y} d={`M55 ${y}h620`} stroke="var(--line)" />
      ))}
      <text x="55" y="20">
        {yLabel}
      </text>
      <text x="365" y="248" textAnchor="middle">
        {xLabel}
      </text>
      <text x="25" y="120">
        0
      </text>
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={p.color}
          strokeWidth="2.5"
          strokeDasharray={p.dash ? "6 4" : undefined}
        />
      ))}
      {children}
    </svg>
  );
}
function path(fn: (u: number) => number, scale = 65) {
  return Array.from(
    { length: 241 },
    (_, i) =>
      `${i ? "L" : "M"}${(55 + (i / 240) * 620).toFixed(3)},${(115 - scale * fn(i / 240)).toFixed(3)}`,
  ).join(" ");
}
export function WaveLab() {
  const [frequency, setFrequency] = useState(100),
    [phase, setPhase] = useState(0),
    [playing, setPlaying] = useState(false),
    [showParticles, setShowParticles] = useState(true);
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      previous = 0;
    const tick = (t: number) => {
      if (previous)
        setPhase((p) => (p + Math.min((t - previous) / 1000, 0.1) * 0.25) % 2);
      previous = t;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", pause);
    };
  }, [playing]);
  const time = phase / frequency;
  const lambda = wavelength(frequency);
  return (
    <section className="lab-panel" id="waves">
      <div className="lab-heading">
        <span className="lab-number">LAB 01</span>
        <div>
          <h2>Follow the wave. Watch the air.</h2>
          <p>Wavelength, repetition rate, and local particle motion.</p>
        </div>
      </div>
      <p className="prediction">
        <strong>Predict first:</strong> double frequency. Will wavelength halve?
        Will a marked parcel travel with a compression?
      </p>
      <div className="lab-grid">
        <div>
          <Plot
            label={`Pressure snapshot over 6 metres at ${frequency} Hz; wavelength ${lambda.toFixed(3)} metres.`}
            paths={[
              {
                d: path((u) => travelingPressure(u * 6, time, frequency)),
                color: "var(--accent)",
              },
            ]}
          >
            <text x="55" y="226">
              0
            </text>
            <text x="675" y="226" textAnchor="end">
              6 m
            </text>
          </Plot>
          {showParticles && (
            <svg
              className="particle-plot"
              role="img"
              aria-label="Representative air parcels oscillate left and right about fixed equilibrium positions. The amber parcel is marked."
              viewBox="0 0 720 95"
            >
              <text x="55" y="16">
                Local parcel motion · displacement exaggerated
              </text>
              {Array.from({ length: 55 }, (_, i) => {
                const x = (i / 54) * 6;
                const original = 55 + (x / 6) * 620;
                const displacement =
                  ((particleDisplacement(x, time, frequency) * lambda * 0.04) /
                    6) *
                  620;
                return (
                  <g key={i}>
                    <line
                      x1={original}
                      x2={original}
                      y1="35"
                      y2="65"
                      stroke="var(--line)"
                    />
                    <circle
                      cx={Number((original + displacement).toFixed(3))}
                      cy="50"
                      r={i === 27 ? 5 : 3}
                      fill={i === 27 ? "var(--amber)" : "var(--accent)"}
                    />
                  </g>
                );
              })}
            </svg>
          )}
          <div className="lab-toolbar">
            <button
              className="button secondary"
              aria-pressed={playing}
              onClick={() => setPlaying(!playing)}
            >
              <Icon name={playing ? "stop" : "play"} size={17} />
              {playing ? "Pause motion" : "Animate slowly"}
            </button>
            <button
              className="button quiet"
              onClick={() => {
                setPlaying(false);
                setPhase((p) => (p + 0.125) % 2);
              }}
            >
              Step ⅛ cycle
            </button>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={showParticles}
                onChange={(e) => setShowParticles(e.target.checked)}
              />
              Show parcels
            </label>
          </div>
        </div>
        <div className="lab-controls">
          <Slider
            label="Frequency"
            value={frequency}
            min={40}
            max={500}
            unit="Hz"
            onChange={setFrequency}
          />
          <Slider
            label="Cycle position"
            value={phase}
            min={0}
            max={2}
            step={0.001}
            unit="cycles"
            onChange={(v) => {
              setPlaying(false);
              setPhase(v);
            }}
          />
          <div className="readouts">
            <div>
              <span>Wavelength</span>
              <strong>
                {lambda.toFixed(3)} <small>m</small>
              </strong>
            </div>
            <div>
              <span>Period</span>
              <strong>
                {(period(frequency) * 1000).toFixed(2)} <small>ms</small>
              </strong>
            </div>
            <div>
              <span>Wave speed</span>
              <strong>
                343 <small>m/s</small>
              </strong>
            </div>
          </div>
          <p className="small muted">
            Motion is paused initially. Animation displays ¼ cycle per real
            second; physical time is {time.toFixed(5)} s. The dot scale is
            illustrative, not a pressure calibration.
          </p>
        </div>
      </div>
      <div className="lab-explanation">
        <h3>What you’re seeing</h3>
        <p>
          The pressure pattern advances while representative air parcels move
          locally. Pressure peaks align with crowding, not with maximum parcel
          displacement. At fixed sound speed, λ = c/f: doubling frequency halves
          spatial spacing. The amber parcel never rides across the room with a
          crest.
        </p>
        <p className="small muted">
          Model: linear, uniform, one-direction plane sound in air, c = 343 m/s.
          Pressure is normalized, displacement exaggerated, no thermal molecular
          trajectories, spreading, walls or losses.{" "}
          <Link href="/course/mechanical-waves">Learn the mechanism →</Link>
        </p>
      </div>
    </section>
  );
}
export function InterferenceLab() {
  const [phase, setPhase] = useState(0),
    [ratio, setRatio] = useState(1);
  const phi = (phase * Math.PI) / 180;
  const amplitude = interferenceAmplitude(1, ratio, phase);
  return (
    <section id="interference" className="lab-panel">
      <div className="lab-heading">
        <span className="lab-number">LAB 02</span>
        <div>
          <h2>One location. Two contributions.</h2>
          <p>Coherent equal-frequency interference.</p>
        </div>
      </div>
      <p className="prediction">
        <strong>Predict first:</strong> at 180°, will unequal amplitudes cancel
        completely?
      </p>
      <div className="lab-grid">
        <div>
          <Plot
            label={`Two coherent sinusoids, phase difference ${phase} degrees, resulting amplitude ${amplitude.toFixed(3)}.`}
            xLabel="Time (cycles at one location)"
            paths={[
              {
                d: path((u) => Math.cos(4 * Math.PI * u), 32),
                color: "var(--muted)",
                dash: true,
              },
              {
                d: path((u) => ratio * Math.cos(4 * Math.PI * u + phi), 32),
                color: "var(--purple)",
                dash: true,
              },
              {
                d: path(
                  (u) =>
                    Math.cos(4 * Math.PI * u) +
                    ratio * Math.cos(4 * Math.PI * u + phi),
                  32,
                ),
                color: "var(--accent)",
              },
            ]}
          />
          <p className="plot-legend">
            Dashed gray: source A · dashed violet: source B · teal: their sum
          </p>
        </div>
        <div>
          <Slider
            label="Phase difference"
            value={phase}
            min={0}
            max={360}
            unit="°"
            onChange={setPhase}
          />
          <Slider
            label="Source B amplitude / A"
            value={ratio}
            min={0}
            max={1}
            step={0.05}
            onChange={setRatio}
          />
          <div className="big-readout" aria-live="polite">
            <span>Resulting amplitude relative to A</span>
            <strong>{amplitude.toFixed(3)}</strong>
          </div>
        </div>
      </div>
      <div className="lab-explanation">
        <p>
          At this location, signed pressure contributions add instant by
          instant. Equal amplitudes at 0° give twice the amplitude; at 180° they
          cancel in the ideal model. Unequal amplitudes leave a residual. This
          is not the rule for adding independent sound levels, and cancellation
          at one point does not mean the room has no energy.
        </p>
        <p className="small muted">
          Two pure sinusoids at one frequency, fixed local amplitudes and phase.
          No room-wide cancellation or speaker-placement prediction. See
          OpenStax §§16.5,17.4 in <Link href="/references">Sources</Link>.
        </p>
      </div>
    </section>
  );
}
export function DecibelLab() {
  const [pressure, setPressure] = useState(20),
    [levelA, setLevelA] = useState(60),
    [levelB, setLevelB] = useState(60),
    [ratio, setRatio] = useState(2);
  return (
    <section id="decibels" className="lab-panel">
      <div className="lab-heading">
        <span className="lab-number">LAB 03</span>
        <div>
          <h2>Decibels need a reference.</h2>
          <p>Pressure, intensity ratios, and independent sources.</p>
        </div>
      </div>
      <p className="prediction">
        <strong>Predict first:</strong> does doubling RMS pressure produce the
        same dB change as doubling intensity?
      </p>
      <div className="three-controls">
        <div>
          <Slider
            label="RMS pressure"
            value={pressure}
            min={1}
            max={200}
            step={1}
            unit="µPa"
            onChange={setPressure}
          />
          <div className="big-readout">
            <span>20 log₁₀(p / 20 µPa)</span>
            <strong>
              {pressureLevel(pressure * 1e-6).toFixed(2)} <small>dB SPL</small>
            </strong>
          </div>
          <p>
            0 dB SPL means the reference pressure, not no sound. RMS is the
            square root of the mean of squared pressure samples; it expresses an
            effective amplitude.
          </p>
        </div>
        <div>
          <Slider
            label="Intensity ratio"
            value={ratio}
            min={0.1}
            max={10}
            step={0.1}
            unit="× reference"
            onChange={setRatio}
          />
          <div className="big-readout">
            <span>10 log₁₀(intensity ratio)</span>
            <strong>
              {intensityLevel(ratio, 1).toFixed(2)} <small>dB change</small>
            </strong>
          </div>
          <p>
            A logarithm asks which power of ten gives a ratio. Ten times
            intensity is +10 dB; twice intensity is about +3.01 dB.
          </p>
        </div>
        <div>
          <Slider
            label="Independent level A"
            value={levelA}
            min={20}
            max={90}
            unit="dB"
            onChange={setLevelA}
          />
          <Slider
            label="Independent level B"
            value={levelB}
            min={20}
            max={90}
            unit="dB"
            onChange={setLevelB}
          />
          <div className="big-readout">
            <span>Uncorrelated energy sum</span>
            <strong>
              {sumIndependentLevels([levelA, levelB]).toFixed(2)}{" "}
              <small>dB</small>
            </strong>
          </div>
        </div>
      </div>
      <div className="lab-explanation">
        <p>
          Pressure level uses 20 times the logarithm of an RMS pressure ratio;
          intensity level uses 10 times the logarithm of an intensity ratio.
          Under fixed traveling-wave impedance, intensity scales with pressure
          squared. Do not apply that traveling-wave intensity relationship
          blindly to a standing field.
        </p>
        <p className="small muted">
          Independent-level addition assumes uncorrelated contributions using
          the same reference, band and weighting. Coherent same-frequency
          signals require phase-aware addition. No loudness, hearing-safety
          exposure or calibrated device output is predicted. This is a preview
          tool; full logarithm/level lessons are still planned.
        </p>
      </div>
    </section>
  );
}
function AudioControl({ frequency }: { frequency: number }) {
  const ref = useRef<{
    context: AudioContext;
    osc: OscillatorNode;
    gain: GainNode;
  } | null>(null);
  const [on, setOn] = useState(false),
    [busy, setBusy] = useState(false),
    [volume, setVolume] = useState(0.01),
    [error, setError] = useState("");
  const stop = () => {
    const audio = ref.current;
    ref.current = null;
    if (audio) {
      audio.gain.gain.cancelScheduledValues(audio.context.currentTime);
      audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.01);
      audio.osc.stop(audio.context.currentTime + 0.08);
      setTimeout(() => {
        void audio.context.close();
      }, 100);
    }
    setOn(false);
  };
  useEffect(
    () => () => {
      const a = ref.current;
      if (a) {
        a.osc.stop();
        void a.context.close();
        ref.current = null;
      }
    },
    [],
  );
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        const a = ref.current;
        if (a) {
          a.osc.stop();
          void a.context.close();
          ref.current = null;
        }
        setOn(false);
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  useEffect(() => {
    const a = ref.current;
    if (a)
      a.osc.frequency.setTargetAtTime(frequency, a.context.currentTime, 0.02);
  }, [frequency]);
  useEffect(() => {
    const a = ref.current;
    if (a) a.gain.gain.setTargetAtTime(volume, a.context.currentTime, 0.02);
  }, [volume]);
  const start = async () => {
    setBusy(true);
    setError("");
    try {
      if (!window.AudioContext)
        throw new Error("Web Audio is not supported by this browser.");
      const context = new AudioContext();
      const osc = context.createOscillator(),
        gain = context.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.value = 0;
      osc.connect(gain).connect(context.destination);
      const audio = { context, osc, gain };
      ref.current = audio;
      osc.start();
      await context.resume();
      if (ref.current !== audio || document.hidden) {
        if (ref.current === audio) {
          osc.stop();
          void context.close();
          ref.current = null;
        }
        return;
      }
      gain.gain.setTargetAtTime(volume, context.currentTime, 0.02);
      setOn(true);
    } catch (e) {
      const a = ref.current;
      ref.current = null;
      if (a) void a.context.close();
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="audio-control">
      <div>
        <h3>Optional listening: pure tone</h3>
        <p className="small muted">
          Start with low device volume. Digital gain cannot guarantee safe SPL.
          This plays only the fundamental, not the harmonic recipe above.
        </p>
      </div>
      <button
        className={`button ${on ? "danger" : "secondary"}`}
        disabled={busy}
        onClick={() => (on ? stop() : void start())}
      >
        <Icon name={on ? "stop" : "play"} size={17} />
        {on ? "Stop audio" : "Play pure tone"}
      </button>
      <Slider
        label="Digital output gain"
        value={volume}
        min={0}
        max={0.03}
        step={0.001}
        onChange={setVolume}
      />
      <p role="status">
        {on
          ? `Playing ${frequency} Hz sine tone. Use Stop audio to end.`
          : error || "Audio is off."}
      </p>
    </div>
  );
}
export function HarmonicLab() {
  const [frequency, setFrequency] = useState(110),
    [second, setSecond] = useState(0.4),
    [third, setThird] = useState(0.2);
  return (
    <section id="harmonics" className="lab-panel">
      <div className="lab-heading">
        <span className="lab-number">LAB 04</span>
        <div>
          <h2>Build a harmonic recipe.</h2>
          <p>Same fundamental. Different waveform.</p>
        </div>
      </div>
      <p className="prediction">
        <strong>Predict first:</strong> will changing the second harmonic change
        the fundamental’s repetition rate?
      </p>
      <div className="lab-grid">
        <Plot
          label="A sum of the first three integer harmonics, shown over two fundamental cycles."
          xLabel="Time (fundamental cycles)"
          yLabel="Relative signal"
          paths={[
            {
              d: path((u) => harmonicSignal(u * 2, [1, second, third]), 42),
              color: "var(--accent)",
            },
          ]}
        />
        <div>
          <Slider
            label="Fundamental frequency"
            value={frequency}
            min={80}
            max={440}
            unit="Hz"
            onChange={setFrequency}
          />
          <Slider
            label="Second harmonic weight"
            value={second}
            min={0}
            max={1}
            step={0.05}
            onChange={setSecond}
          />
          <Slider
            label="Third harmonic weight"
            value={third}
            min={0}
            max={1}
            step={0.05}
            onChange={setThird}
          />
          <dl className="spectrum-values">
            <div>
              <dt>Fundamental</dt>
              <dd>{frequency} Hz · amplitude 1</dd>
            </div>
            <div>
              <dt>Harmonic 2</dt>
              <dd>
                {frequency * 2} Hz · amplitude {second}
              </dd>
            </div>
            <div>
              <dt>Harmonic 3</dt>
              <dd>
                {frequency * 3} Hz · amplitude {third}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="lab-explanation">
        <p>
          The signal adds sinusoids at f, 2f and 3f with fixed zero phase.
          Changing weights changes its shape, while the fundamental remains
          present. This is a synthetic harmonic recipe, not a microphone
          spectrum analyzer or a full instrument model. Real timbre also depends
          on envelopes, noise and radiation.
        </p>
      </div>
      <AudioControl frequency={frequency} />
    </section>
  );
}
