// Original illustration built from scratch, not a stock asset.
// Colors pulled from shared/theme/tokens.ts (graphite/slate/fog/cloud/
// silver) plus two illustration-only tints (mist, ash) added there.

export function IsometricDevice() {
  return (
    <svg viewBox="0 0 600 560" className="w-full max-w-lg" aria-hidden="true">
      <g stroke="#C4CDD5" strokeWidth="2" strokeDasharray="4 5" fill="none">
        <path d="M175 430 L260 380" />
        <path d="M355 470 L300 420" />
      </g>

      {/* floating card behind the screen */}
      <g transform="translate(150,60)">
        <polygon points="0,60 90,10 180,60 90,110" fill="#E4E7EB" />
        <polygon points="0,60 90,110 90,150 0,100" fill="#C4CDD5" />
        <polygon points="180,60 90,110 90,150 180,100" fill="#9AA5B1" />
      </g>

      {/* laptop screen */}
      <g transform="translate(210,40)">
        <rect x="0" y="0" width="230" height="160" rx="10" fill="#1B222C" />
        <rect x="10" y="10" width="210" height="140" rx="4" fill="#3E4C59" />
        <g fill="#9AA5B1">
          <rect x="30" y="95" width="14" height="35" />
          <rect x="52" y="75" width="14" height="55" />
          <rect x="74" y="55" width="14" height="75" />
        </g>
        <circle cx="170" cy="45" r="20" fill="none" stroke="#C4CDD5" strokeWidth="6" />
        <circle
          cx="170" cy="45" r="20" fill="none" stroke="#F4F6F8" strokeWidth="6"
          strokeDasharray="70 126" strokeLinecap="round"
        />
        <polygon points="90,160 140,160 155,180 75,180" fill="#3E4C59" />
      </g>

      {/* laptop base / keyboard deck */}
      <g transform="translate(150,195)">
        <polygon points="0,40 175,0 350,40 175,80" fill="#F4F6F8" stroke="#E4E7EB" />
        <polygon points="0,40 175,80 175,95 0,55" fill="#C4CDD5" />
        <polygon points="350,40 175,80 175,95 350,55" fill="#9AA5B1" />
        <polygon points="40,42 175,12 310,42 175,72" fill="#E4E7EB" />
        <rect x="150" y="48" width="50" height="16" rx="3" fill="#C4CDD5" />
      </g>

      {/* tablet, front-left */}
      <g transform="translate(70,330)">
        <polygon points="0,45 95,0 190,45 95,90" fill="#F4F6F8" stroke="#E4E7EB" />
        <polygon points="0,45 95,90 95,105 0,60" fill="#C4CDD5" />
        <polygon points="190,45 95,90 95,105 190,60" fill="#9AA5B1" />
        <polygon points="70,30 95,-10 130,25 95,55" fill="#6B7684" opacity="0.9" />
      </g>

      {/* phone, bottom right */}
      <g transform="translate(310,395)">
        <polygon points="0,35 70,0 140,35 70,70" fill="#3E4C59" />
        <polygon points="0,35 70,70 70,90 0,55" fill="#1B222C" />
        <polygon points="140,35 70,70 70,90 140,55" fill="#1B222C" opacity="0.85" />
        <g fill="#9AA5B1">
          <rect x="35" y="20" width="60" height="4" transform="skewY(-14)" />
          <rect x="35" y="30" width="40" height="4" transform="skewY(-14)" />
        </g>
      </g>

      {/* notification chip */}
      <g transform="translate(200,375)">
        <rect x="0" y="0" width="60" height="45" rx="8" fill="#E4E7EB" />
        <circle cx="30" cy="20" r="10" fill="#3E4C59" />
      </g>

      {/* plant */}
      <g transform="translate(470,340)">
        <polygon points="0,20 40,0 80,20 40,40" fill="#F4F6F8" />
        <rect x="20" y="20" width="40" height="35" fill="#C4CDD5" />
        <path d="M40 20 C20 0 20 -30 40 -35 C60 -30 60 0 40 20" fill="#6B7684" />
      </g>
    </svg>
  );
}
