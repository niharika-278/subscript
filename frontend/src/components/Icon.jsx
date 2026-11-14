// Subscript icon set — hand-drawn 24x24 stroke icons (one consistent style).
// Usage: <Icon name="film" size={18} />. Colour comes from CSS currentColor.

const GLYPHS = {
  // ---- categories ----
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="m10 9.2 4.6 2.8L10 14.8V9.2Z" />
    </>
  ),
  music: (
    <>
      <path d="M4 13.5v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13.5" width="4.5" height="6.5" rx="2" />
      <rect x="16.5" y="13.5" width="4.5" height="6.5" rx="2" />
    </>
  ),
  graduation: (
    <>
      <path d="m2 9.3 10-4.8 10 4.8-10 4.8L2 9.3Z" />
      <path d="M6.5 12v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V12" />
      <path d="M22 9.3v5.2" />
    </>
  ),
  bolt: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />,
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 20 4c0 12-4 16-9 16Z" />
      <path d="M4.5 20.5C8 14 12 11 16.5 8.5" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M7 12h10" />
      <rect x="3.5" y="8" width="3.5" height="8" rx="1.2" />
      <rect x="17" y="8" width="3.5" height="8" rx="1.2" />
      <path d="M1 10.5v3M23 10.5v3" />
    </>
  ),
  gamepad: (
    <>
      <rect x="2" y="7" width="20" height="11" rx="5.5" />
      <path d="M6.5 12.5h4M8.5 10.5v4M15.5 13.5h.01M18.5 10.5h.01" />
    </>
  ),
  cloud: (
    <path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98A6.5 6.5 0 0 0 5.4 11.9 4.2 4.2 0 0 0 6.5 19h11Z" />
  ),
  box: (
    <>
      <path d="m21 8.5-9-5-9 5v7l9 5 9-5v-7Z" />
      <path d="m3 8.5 9 5 9-5M12 13.5v7" />
    </>
  ),

  // ---- navigation ----
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  rows: (
    <>
      <rect x="3" y="4.5" width="18" height="6" rx="2" />
      <rect x="3" y="13.5" width="18" height="6" rx="2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10.5h18" />
    </>
  ),
  chart: <path d="M5 20v-7M12 20V5M19 20v-11" />,
  wallet: (
    <>
      <path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z" />
      <path d="M18 7V5.5A1.5 1.5 0 0 0 16.5 4H4" />
      <path d="M16.5 13.5h.01" />
    </>
  ),
  pie: (
    <>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10Z" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="11" width="15" height="9.5" rx="2.5" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </>
  ),

  // ---- interface ----
  bell: (
    <>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4.8 1.8 5.8 1.8 5.8H4.2S6 14.3 6 9.5" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
  receipt: (
    <>
      <path d="M5 3h14v18l-2.4-1.6L14.3 21l-2.3-1.5L9.7 21l-2.3-1.6L5 21V3Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 4l1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7L12 4Z" />
      <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
    </>
  ),
  "calendar-check": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10.5h18" />
      <path d="m9 15.5 2 2 4-4" />
    </>
  ),
  moon: <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" />,
  power: (
    <>
      <path d="M12 3v8" />
      <path d="M17.7 6.3a8 8 0 1 1-11.4 0" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  "trending-up": (
    <>
      <path d="m3 17 6.5-6.5 4 4L21 7" />
      <path d="M15 7h6v6" />
    </>
  ),
  gauge: (
    <>
      <path d="m12 15 3.5-3.5" />
      <path d="M20.2 17.5a9.5 9.5 0 1 0-16.4 0" />
    </>
  ),
  coins: (
    <>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M17.3 9.7a5.5 5.5 0 1 1-7.6 7.6" />
      <path d="M8.5 6.3v4.4M6.3 8.5h4.4" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5L19.5 7" />,
  alert: (
    <>
      <path d="m12 3.5 9.5 16.5h-19L12 3.5Z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6.5 6.5 0 0 0-3.7 11.8c.7.5 1.2 1.3 1.2 2.2h5c0-.9.5-1.7 1.2-2.2A6.5 6.5 0 0 0 12 3Z" />
    </>
  ),
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
  ),
  wind: (
    <path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2" />
  ),

  // brand marks (filled, not stroked)
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  ),
};

export default function Icon({ name, size = 18, strokeWidth = 1.9, className = "" }) {
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph}
    </svg>
  );
}
