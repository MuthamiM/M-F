// Decorative, CSS-animated backdrop for the landing hero.
// Kept as inline SVG so it remains crisp without adding image payloads.

function Frog({ className }: { className: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 120 92" aria-hidden="true" focusable="false">
        <path d="M33 59C15 65 10 78 5 84c13 1 24-4 33-13" fill="#3e9f58" />
        <path d="M87 59c18 6 23 19 28 25-13 1-24-4-33-13" fill="#3e9f58" />
        <ellipse cx="60" cy="58" rx="34" ry="23" fill="#54b96a" />
        <ellipse cx="60" cy="44" rx="27" ry="19" fill="#61c875" />
        <circle cx="45" cy="32" r="11" fill="#61c875" />
        <circle cx="75" cy="32" r="11" fill="#61c875" />
        <circle cx="45" cy="31" r="6" fill="#f8fff2" />
        <circle cx="75" cy="31" r="6" fill="#f8fff2" />
        <circle cx="46" cy="31" r="2.5" fill="#193b36" />
        <circle cx="74" cy="31" r="2.5" fill="#193b36" />
        <path d="M47 56c8 7 18 7 26 0" fill="none" stroke="#237344" strokeLinecap="round" strokeWidth="3" />
        <path d="M34 66c-10 7-15 16-13 22 9-3 18-9 23-18" fill="#49ad62" />
        <path d="M86 66c10 7 15 16 13 22-9-3-18-9-23-18" fill="#49ad62" />
      </svg>
    </div>
  );
}

export function WaterBackground() {
  return (
    <div className="water-scene" aria-hidden="true">
      <div className="water-glow" />
      <svg className="water-wave water-wave--back" viewBox="0 0 1440 360" preserveAspectRatio="none">
        <path d="M0 145c133 52 262 52 395 0s262-52 395 0 262 52 395 0 255-52 395 0v215H0Z" fill="currentColor" />
      </svg>
      <svg className="water-wave water-wave--mid" viewBox="0 0 1440 360" preserveAspectRatio="none">
        <path d="M0 180c120-58 245-58 370 0s250 58 375 0 250-58 375 0 220 58 320 0v180H0Z" fill="currentColor" />
      </svg>
      <svg className="water-wave water-wave--front" viewBox="0 0 1440 360" preserveAspectRatio="none">
        <path d="M0 190c110 42 235 42 345 0s235-42 345 0 235 42 345 0 235-42 405 0v170H0Z" fill="currentColor" />
      </svg>

      <span className="water-bubble water-bubble--one" />
      <span className="water-bubble water-bubble--two" />
      <span className="water-bubble water-bubble--three" />
      <span className="water-bubble water-bubble--four" />

      <Frog className="water-frog water-frog--left" />
      <Frog className="water-frog water-frog--right" />
      <Frog className="water-frog water-frog--left-lower" />
    </div>
  );
}
