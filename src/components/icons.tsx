// Iconos SVG en línea (sin dependencias). Decorativos por defecto: aria-hidden.
type IconProps = { className?: string };

function Svg({ className = "size-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const TodayIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="m9.5 15 1.8 1.8 3.4-3.6" />
  </Svg>
);

export const ExploreIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5z" />
  </Svg>
);

export const ClapperIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="m4 10 1.2-4.6a1 1 0 0 1 1.2-.7l13.2 3.4-.6 1.9" />
    <path d="m9 5.5 2 3.5M14 6.8l2 3.4" />
  </Svg>
);

export const SceneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const TranslateIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h8M8 3v2M6 5c0 4 2.5 7 5 8M10 5c-.5 3.5-2.8 6.6-6 8" />
    <path d="m13 21 4-9 4 9M14.5 18h5" />
  </Svg>
);

export const GlobeIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </Svg>
);

export const SparkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </Svg>
);

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);
