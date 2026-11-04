export default function SignalFallback() {
  return (
    <svg viewBox="0 0 600 640" className="signal-fallback" aria-hidden="true">
      <defs>
        <linearGradient id="copper" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#7d321d" />
          <stop offset=".38" stopColor="#e49f72" />
          <stop offset=".57" stopColor="#b85c37" />
          <stop offset=".8" stopColor="#652c1c" />
          <stop offset="1" stopColor="#cb7850" />
        </linearGradient>
        <filter id="shadow">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>
      <ellipse
        cx="310"
        cy="555"
        rx="160"
        ry="17"
        fill="#6d614d"
        opacity=".18"
        filter="url(#shadow)"
      />
      <g
        fill="none"
        stroke="url(#copper)"
        strokeWidth="17"
        transform="rotate(-19 300 320)"
      >
        <ellipse
          cx="300"
          cy="320"
          rx="170"
          ry="225"
          transform="rotate(24 300 320)"
        />
        <ellipse
          cx="300"
          cy="320"
          rx="170"
          ry="225"
          transform="rotate(74 300 320)"
        />
        <ellipse
          cx="300"
          cy="320"
          rx="170"
          ry="225"
          transform="rotate(124 300 320)"
        />
        <ellipse
          cx="300"
          cy="320"
          rx="170"
          ry="225"
          transform="rotate(174 300 320)"
        />
      </g>
      <circle cx="300" cy="320" r="33" fill="url(#copper)" />
    </svg>
  );
}
