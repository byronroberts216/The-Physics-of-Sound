export function LessonDiagram({ kind }: { kind: string }) {
  const measurement = kind === "measurement";
  const wave = kind === "wave";
  const force = kind === "force";
  const label = measurement
    ? "A rectangular floor measures 4 metres by 3 metres, giving an area of 12 square metres."
    : force
      ? "Two equal opposing forces on equal areas can cancel. Pressure is normal force divided by area."
      : wave
        ? "A spatial snapshot of pressure variation; positive and negative deviations are values, not upward or downward particle motion."
        : "Displacement changes over time. The vertical size is amplitude; the horizontal interval of a repeat is the period.";
  return (
    <figure className="lesson-figure">
      <svg role="img" aria-label={label} viewBox="0 0 660 250">
        <title>{label}</title>
        {measurement ? (
          <>
            <rect
              x="160"
              y="35"
              width="320"
              height="160"
              rx="4"
              fill="var(--accent-soft)"
              stroke="var(--accent)"
            />
            {Array.from({ length: 3 }, (_, i) => (
              <path
                key={i}
                d={`M${240 + i * 80} 35v160`}
                stroke="var(--line)"
              />
            ))}
            {[88, 141].map((y) => (
              <path key={y} d={`M160 ${y}h320`} stroke="var(--line)" />
            ))}
            <text x="320" y="225" textAnchor="middle">
              4 m
            </text>
            <text x="100" y="120">
              3 m
            </text>
            <text x="320" y="125" textAnchor="middle">
              12 m²
            </text>
          </>
        ) : force ? (
          <>
            <rect
              x="265"
              y="55"
              width="120"
              height="130"
              fill="var(--accent-soft)"
              stroke="var(--accent)"
            />
            <path
              d="M100 120h145m-15-10 15 10-15 10M550 120H405m15-10-15 10 15 10"
              stroke="var(--accent)"
              strokeWidth="3"
            />
            <text x="145" y="90">
              +F
            </text>
            <text x="480" y="90">
              −F
            </text>
            <text x="325" y="217" textAnchor="middle">
              Equal and opposite forces · net force = 0
            </text>
          </>
        ) : (
          <>
            <path d="M65 30v175h540M65 115h540" stroke="var(--line)" />
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                d={`M${65 + i * 75} 35v170`}
                stroke="var(--line)"
                opacity=".45"
              />
            ))}
            <path
              d={Array.from(
                { length: 150 },
                (_, i) =>
                  `${i ? "L" : "M"}${65 + i * 3.5},${115 - 65 * Math.sin((i / 149) * Math.PI * 4)}`,
              ).join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
            />
            <text x="330" y="238" textAnchor="middle">
              {wave ? "Position along the medium →" : "Time →"}
            </text>
            <text x="16" y="22">
              {wave ? "Pressure variation" : "Displacement"}
            </text>
            <text x="35" y="120">
              0
            </text>
          </>
        )}
      </svg>
      <figcaption>
        {label} Diagram is schematic; no measured values are implied except the
        labeled rectangle example.
      </figcaption>
    </figure>
  );
}
