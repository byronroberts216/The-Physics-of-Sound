export function WaveArt({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={`wave-art ${compact ? "compact" : ""}`}
      viewBox="0 0 650 310"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={compact ? "wave-c" : "wave"}
          x1="0"
          x2="650"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5cd8ce" stopOpacity="0" />
          <stop offset=".45" stopColor="#70e2d8" />
          <stop offset="1" stopColor="#91a8ff" stopOpacity=".15" />
        </linearGradient>
      </defs>
      {Array.from({ length: 17 }, (_, i) => {
        const points = Array.from({ length: 180 }, (_, n) => {
          const x = (n / 179) * 650;
          const taper = Math.sin((n / 179) * Math.PI);
          const y =
            155 +
            Math.sin(x / 52 + i * 0.15) *
              Math.sin(x / 300 + 1) *
              taper *
              (28 + i * 5);
          return `${n === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(" ");
        return (
          <path
            key={i}
            d={points}
            stroke={`url(#${compact ? "wave-c" : "wave"})`}
            strokeWidth="1"
            opacity={0.22 + i * 0.035}
          />
        );
      })}
    </svg>
  );
}
