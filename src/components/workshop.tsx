"use client";
import { useState } from "react";
import Link from "next/link";
import { Slider } from "./labs";
import {
  modeShape,
  modeFrequency,
  roomModes,
  reflectionGeometry,
  quarterWaveScale,
  type Dimensions,
} from "@/lib/physics/models";
export function Workshop() {
  const [sizes, setSizes] = useState(["4.8", "3.6", "2.5"]),
    [tab, setTab] = useState("modes"),
    [modeId, setModeId] = useState("1,0,0");
  const [sx, setSx] = useState(0.2),
    [sy, setSy] = useState(0.25),
    [lx, setLx] = useState(0.65),
    [ly, setLy] = useState(0.5),
    [z, setZ] = useState(0.5),
    [depth, setDepth] = useState(0.1),
    [gap, setGap] = useState(0.1);
  const dimensions = sizes.map(Number) as Dimensions;
  const valid =
    sizes.every((s) => s.trim() !== "") &&
    dimensions.every((d) => Number.isFinite(d) && d >= 1 && d <= 15);
  const modes = valid ? roomModes(dimensions, 200, 6) : [];
  const selected =
    modes.find((m) => m.indices.join(",") === modeId) ?? modes[0];
  const source: Dimensions = [
      sx * dimensions[0],
      sy * dimensions[1],
      z * dimensions[2],
    ],
    listener: Dimensions = [
      lx * dimensions[0],
      ly * dimensions[1],
      z * dimensions[2],
    ];
  const coupling =
    valid && selected
      ? modeShape(source, dimensions, selected.indices) *
        modeShape(listener, dimensions, selected.indices)
      : 0;
  const geometry = valid
    ? reflectionGeometry([source[0], source[1]], [listener[0], listener[1]])
    : null;
  return (
    <>
      <section className="room-inputs card">
        <div>
          <h2>Your room, simplified.</h2>
          <p className="muted">
            Inside dimensions in metres. Rectangular, rigid, lossless walls. A
            learning model, not a survey.
          </p>
        </div>
        <div className="dimension-fields">
          {["Length", "Width", "Height"].map((label, i) => (
            <label key={label}>
              {label}
              <span>
                <input
                  type="number"
                  aria-label={`Room ${label.toLowerCase()} (m)`}
                  min="1"
                  max="15"
                  step="0.1"
                  value={sizes[i]}
                  onChange={(e) =>
                    setSizes((s) =>
                      s.map((v, j) => (j === i ? e.target.value : v)),
                    )
                  }
                />
                <b>m</b>
              </span>
            </label>
          ))}
        </div>
        {!valid && (
          <p role="alert" className="error-banner">
            Enter a finite dimension from 1 to 15 metres for each axis.
            Calculations are paused until all dimensions are valid.
          </p>
        )}
      </section>
      <div className="segmented" role="tablist" aria-label="Workshop models">
        {[
          ["modes", "Room modes"],
          ["reflection", "Reflection paths"],
          ["treatment", "Depth & treatment"],
        ].map(([id, label]) => (
          <button
            id={`tab-${id}`}
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onKeyDown={(e) => {
              const ids = ["modes", "reflection", "treatment"];
              const i = ids.indexOf(id);
              if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? ids[0]
                    : e.key === "End"
                      ? ids[2]
                      : ids[(i + (e.key === "ArrowRight" ? 1 : 2)) % 3];
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {valid && selected && (
        <section
          className="lab-panel room-lab"
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
        >
          {tab === "modes" && (
            <>
              <div className="lab-heading">
                <span className="lab-number">IDEAL MODES</span>
                <div>
                  <h2>Where a room can resonate.</h2>
                  <p>
                    Mode frequencies are geometry. How a mode is driven and
                    heard also depends on position.
                  </p>
                </div>
              </div>
              <p className="prediction">
                <strong>Predict first:</strong> for the (1,0,0) mode, what
                happens to pressure at the exact length midpoint?
              </p>
              <div className="lab-grid">
                <div>
                  <div className="room-plan">
                    <svg
                      role="img"
                      aria-label={`Signed relative pressure pattern for mode ${selected.indices.join(",")}, at height ${(z * dimensions[2]).toFixed(2)} m. S marks source; L marks listener.`}
                      viewBox="0 0 620 420"
                    >
                      <title>
                        Ideal pressure mode, horizontal slice; sign is
                        oscillation phase, not a permanent pressure deficit.
                      </title>
                      {Array.from({ length: 24 * 16 }, (_, i) => {
                        const x = i % 24,
                          y = Math.floor(i / 24);
                        const value = modeShape(
                          [
                            ((x + 0.5) / 24) * dimensions[0],
                            ((y + 0.5) / 16) * dimensions[1],
                            z * dimensions[2],
                          ],
                          dimensions,
                          selected.indices,
                        );
                        return (
                          <rect
                            key={i}
                            x={40 + x * 22}
                            y={35 + y * 20}
                            width="22.5"
                            height="20.5"
                            fill={
                              value >= 0
                                ? `rgba(80,208,198,${(Math.abs(value) * 0.75 + 0.04).toFixed(3)})`
                                : `rgba(153,133,245,${(Math.abs(value) * 0.75 + 0.04).toFixed(3)})`
                            }
                          />
                        );
                      })}
                      <rect
                        x="40"
                        y="35"
                        width="528"
                        height="320"
                        fill="none"
                        stroke="var(--text)"
                        strokeWidth="2"
                      />
                      <circle
                        cx={40 + sx * 528}
                        cy={35 + sy * 320}
                        r="14"
                        fill="var(--text)"
                      />
                      <text
                        x={40 + sx * 528}
                        y={40 + sy * 320}
                        textAnchor="middle"
                        fill="var(--background)"
                        fontWeight="700"
                      >
                        S
                      </text>
                      <circle
                        cx={40 + lx * 528}
                        cy={35 + ly * 320}
                        r="14"
                        fill="var(--amber)"
                      />
                      <text
                        x={40 + lx * 528}
                        y={40 + ly * 320}
                        textAnchor="middle"
                        fill="#142123"
                        fontWeight="700"
                      >
                        L
                      </text>
                      <text x="304" y="390" textAnchor="middle">
                        Length: {dimensions[0]} m
                      </text>
                      <text x="40" y="20">
                        Width: {dimensions[1]} m · slice z ={" "}
                        {(z * dimensions[2]).toFixed(2)} m
                      </text>
                    </svg>
                  </div>
                  <p className="plot-legend">
                    Teal: positive phase · violet: opposite phase · pale: near a
                    pressure node. S = source, L = listener. This is a signed
                    mode-shape slice, not SPL; plan axes are stretched to fit.
                  </p>
                  <div className="readouts">
                    <div>
                      <span>Selected frequency</span>
                      <strong>
                        {modeFrequency(dimensions, selected.indices).toFixed(2)}{" "}
                        <small>Hz</small>
                      </strong>
                    </div>
                    <div>
                      <span>Single-mode coupling</span>
                      <strong>{coupling.toFixed(3)}</strong>
                    </div>
                  </div>
                </div>
                <div className="lab-controls">
                  <label className="select-label">
                    Selected ideal mode
                    <select
                      value={selected.indices.join(",")}
                      onChange={(e) => setModeId(e.target.value)}
                    >
                      {modes.slice(0, 80).map((m) => (
                        <option
                          key={m.indices.join()}
                          value={m.indices.join(",")}
                        >
                          ({m.indices.join(",")}) · {m.frequency.toFixed(1)} Hz
                          · {m.kind}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Slider
                    label="Source along length"
                    value={sx}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× L"
                    onChange={setSx}
                  />
                  <Slider
                    label="Source across width"
                    value={sy}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× W"
                    onChange={setSy}
                  />
                  <Slider
                    label="Listener along length"
                    value={lx}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× L"
                    onChange={setLx}
                  />
                  <Slider
                    label="Listener across width"
                    value={ly}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× W"
                    onChange={setLy}
                  />
                  <Slider
                    label="Shared source/listener height"
                    value={z}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× H"
                    onChange={setZ}
                  />
                </div>
              </div>
              <details className="mode-table">
                <summary>Inspect the first 20 calculated modes</summary>
                <div className="table-scroll">
                  <table>
                    <caption>
                      Ideal rigid-room frequencies; modes with the same
                      frequency remain separate.
                    </caption>
                    <thead>
                      <tr>
                        <th>Indices</th>
                        <th>Frequency</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modes.slice(0, 20).map((m) => (
                        <tr key={m.indices.join()}>
                          <td>({m.indices.join(", ")})</td>
                          <td>{m.frequency.toFixed(2)} Hz</td>
                          <td>{m.kind}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
              <div className="lab-explanation">
                <h3>Frequency and coupling answer different questions</h3>
                <p>
                  The indices count half-wavelength variations along each axis.
                  One nonzero index is axial, two are tangential, three are
                  oblique. The all-zero static case is excluded. Each
                  one-dimensional pressure factor has an antinode in the
                  direction normal to a rigid wall; other factors can still
                  produce nodes along that wall. Odd length modes have a
                  pressure node at the length midpoint. A source or listener at
                  a node couples weakly to that single ideal mode.
                </p>
                <p className="small muted">
                  Coupling is the signed product of normalized source and
                  receiver mode shapes, assuming ideal point coupling; it is not
                  total response, perceived bass or a treatment recommendation.
                  No damping, doors, flexing walls, furniture, directivity or
                  modal bandwidth. c = 343 m/s. Enumeration: indices 0–6, at
                  most 200 Hz; menu shows first 80 modes. The slice is spatial,
                  not a moving pressure front. A slice through a nodal plane can
                  be zero everywhere, for example a first height mode viewed at
                  half height.
                </p>
              </div>
            </>
          )}
          {tab === "reflection" && geometry && (
            <>
              <div className="lab-heading">
                <span className="lab-number">IMAGE GEOMETRY</span>
                <div>
                  <h2>A reflection takes the longer route.</h2>
                  <p>Compare one wall path with the direct arrival.</p>
                </div>
              </div>
              <p className="prediction">
                <strong>Predict first:</strong> can a reflected path arrive
                before the direct path in this model?
              </p>
              <div className="lab-grid">
                <div>
                  <svg
                    className="reflection-plot"
                    viewBox="0 0 620 390"
                    role="img"
                    aria-label="Direct path from source to listener and first specular reflection at the top wall."
                  >
                    <line
                      x1="40"
                      x2="575"
                      y1="40"
                      y2="40"
                      stroke="var(--text)"
                      strokeWidth="3"
                    />
                    <text x="40" y="25">
                      One reflecting wall (y = 0)
                    </text>
                    <path
                      d={`M${40 + sx * 520} ${40 + sy * 300} L${40 + lx * 520} ${40 + ly * 300}`}
                      stroke="var(--muted)"
                      strokeWidth="2"
                      strokeDasharray="7 5"
                    />
                    <path
                      d={`M${40 + sx * 520} ${40 + sy * 300} L${40 + (geometry.wallX / dimensions[0]) * 520} 40 L${40 + lx * 520} ${40 + ly * 300}`}
                      stroke="var(--accent)"
                      strokeWidth="3"
                      fill="none"
                    />
                    {[
                      [sx, sy, "S"],
                      [lx, ly, "L"],
                    ].map(([x, y, label]) => (
                      <g key={String(label)}>
                        <circle
                          cx={40 + Number(x) * 520}
                          cy={40 + Number(y) * 300}
                          r="15"
                          fill="var(--accent)"
                        />
                        <text
                          x={40 + Number(x) * 520}
                          y={45 + Number(y) * 300}
                          textAnchor="middle"
                          fill="#102625"
                        >
                          {label}
                        </text>
                      </g>
                    ))}
                    <text x="40" y="370">
                      Schematic plan · proportions may be stretched to fit
                    </text>
                  </svg>
                  <div className="readouts">
                    <div>
                      <span>Direct distance</span>
                      <strong>
                        {geometry.direct.toFixed(3)} <small>m</small>
                      </strong>
                    </div>
                    <div>
                      <span>Reflected distance</span>
                      <strong>
                        {geometry.reflected.toFixed(3)} <small>m</small>
                      </strong>
                    </div>
                    <div>
                      <span>Extra delay</span>
                      <strong>
                        {(geometry.extraDelay * 1000).toFixed(2)}{" "}
                        <small>ms</small>
                      </strong>
                    </div>
                  </div>
                </div>
                <div>
                  <Slider
                    label="Source along length"
                    value={sx}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× L"
                    onChange={setSx}
                  />
                  <Slider
                    label="Source distance from wall"
                    value={sy}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× W"
                    onChange={setSy}
                  />
                  <Slider
                    label="Listener along length"
                    value={lx}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× L"
                    onChange={setLx}
                  />
                  <Slider
                    label="Listener distance from wall"
                    value={ly}
                    min={0.05}
                    max={0.95}
                    step={0.01}
                    unit="× W"
                    onChange={setLy}
                  />
                </div>
              </div>
              <div className="lab-explanation">
                <p>
                  Reflect the source across the wall, then draw a straight line
                  from that image to the listener. Its wall crossing locates the
                  ideal specular reflection point. Extra arrival time is extra
                  distance divided by 343 m/s.
                </p>
                <p className="small muted">
                  One infinite flat wall and point source; this is geometrical
                  path length only, not diffraction or frequency-dependent
                  reflection/absorption. No arrival amplitude, comb-filter depth
                  or room response is predicted. Coincident source/listener has
                  zero direct distance, a degenerate ideal geometry.
                </p>
              </div>
            </>
          )}
          {tab === "treatment" && (
            <>
              <div className="lab-heading">
                <span className="lab-number">DEPTH IS NOT A RATING</span>
                <div>
                  <h2>Put panel depth beside a wavelength.</h2>
                  <p>A useful comparison, carefully limited.</p>
                </div>
              </div>
              <p className="prediction">
                <strong>Predict first:</strong> does a deeper assembly
                necessarily prove a particular absorption coefficient?
              </p>
              <div className="lab-grid">
                <div>
                  <div className="depth-diagram">
                    <span className="depth-wall">RIGID WALL</span>
                    <div
                      className="air-gap"
                      style={{ flex: Math.max(0.01, gap) }}
                    >
                      Air gap
                      <br />
                      {(gap * 100).toFixed(0)} cm
                    </div>
                    <div className="porous-panel" style={{ flex: depth }}>
                      Porous material
                      <br />
                      {(depth * 100).toFixed(0)} cm
                    </div>
                  </div>
                  <div className="big-readout">
                    <span>Quarter-wavelength comparison for total depth</span>
                    <strong>
                      {quarterWaveScale(depth + gap).toFixed(0)}{" "}
                      <small>Hz</small>
                    </strong>
                  </div>
                  <p className="small muted">
                    f = c / (4d), d = material thickness + gap. This is neither
                    a cutoff frequency nor a predicted absorption peak or
                    coefficient.
                  </p>
                </div>
                <div>
                  <Slider
                    label="Material thickness"
                    value={depth}
                    min={0.02}
                    max={0.5}
                    step={0.01}
                    unit="m"
                    onChange={setDepth}
                  />
                  <Slider
                    label="Air gap"
                    value={gap}
                    min={0}
                    max={0.5}
                    step={0.01}
                    unit="m"
                    onChange={setGap}
                  />
                  <div className="notice">
                    No material performance is calculated. Choose products using
                    frequency-dependent measured data with the same mounting and
                    test conditions.
                  </div>
                </div>
              </div>
              <div className="lab-explanation">
                <h3>What more depth can mean—and what it cannot prove</h3>
                <p>
                  At an ideal rigid boundary normal particle velocity is zero.
                  In a simple standing field it grows with distance from that
                  boundary. Porous losses depend on air motion and material
                  properties, so mounting depth matters. Comparing depth with a
                  quarter wavelength supplies a geometric scale, not a sharp
                  absorption threshold.
                </p>
                <p>
                  An air gap is not extra porous material. Real behavior depends
                  on flow resistance, thickness, mounting, frequency, incidence
                  and construction. Thin foam cannot be assigned a bass-trap
                  rating from its appearance. Tuned membrane/resonant devices
                  use a different mechanism and require verified design data.
                </p>
                <p>
                  <strong>
                    Treatment changes behavior inside a room. Isolation concerns
                    transmission between spaces.
                  </strong>{" "}
                  A porous panel can reduce some internal reflections while
                  leaving a neighbor’s noise problem largely unresolved.
                  Investigate flanking paths, leaks and construction before
                  recommending isolation work.
                </p>
                <p className="small muted">
                  The treatment interpretation is preliminary qualitative
                  guidance. Further material-specific primary-source review is
                  required before publishing a complete treatment lesson or
                  making a purchasing/design recommendation.
                </p>
              </div>
            </>
          )}
        </section>
      )}
      <section className="measurement-guide card">
        <div className="eyebrow">THE REAL ROOM HAS THE LAST WORD</div>
        <h2>Turn a model into a testable question.</h2>
        <ol>
          <li>
            <strong>Record a baseline.</strong> Note dimensions,
            speaker/microphone positions, calibration file, gain, sweep settings
            and environmental noise. Keep playback low and controlled; do not
            raise it just to fill a graph.
          </li>
          <li>
            <strong>Repeat before changing.</strong> Use the same configuration
            twice to estimate repeatability. A single graph cannot separate room
            behavior from inconsistent setup.
          </li>
          <li>
            <strong>Change one factor.</strong> Compare a small position change
            or a documented treatment change with the same source, microphone,
            timing, gain and analysis settings.
          </li>
          <li>
            <strong>Inspect response and decay.</strong> Use REW’s magnitude and
            low-frequency decay displays. Do not interpret one smoothed curve as
            the entire room.
          </li>
          <li>
            <strong>Keep the evidence.</strong> Save original measurements,
            exact positions and notes. Compare several nearby receiver locations
            before generalizing one point to the whole listening area.
          </li>
        </ol>
        <p className="muted">
          Small rooms are not diffuse fields at low frequencies. REW cautions
          that conventional RT60 estimates are often not meaningful there;
          inspect modal decay instead of assigning a universal bass RT60 target.
        </p>
        <div className="inline-links">
          <a
            href="https://www.roomeqwizard.com/help/help_en-GB/html/modalsim.html"
            target="_blank"
            rel="noreferrer"
          >
            REW model assumptions ↗
          </a>
          <a
            href="https://www.roomeqwizard.com/help/help_en-GB/html/graph_rt60.html"
            target="_blank"
            rel="noreferrer"
          >
            REW decay guidance ↗
          </a>
          <Link href="/references">Scientific scope & references →</Link>
        </div>
      </section>
    </>
  );
}
