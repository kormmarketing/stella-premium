/** Минималистичные геометрические иконки — stroke only */

const iconClass = 'stroke-current';

export function IconPerson({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="16" cy="10" r="4" />
      <path d="M8 26c0-4 4-8 8-8s8 4 8 8" />
    </svg>
  );
}

export function IconDocument({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <rect x="6" y="4" width="20" height="24" rx="1" />
      <path d="M10 10h12M10 14h12M10 18h8" />
    </svg>
  );
}

export function IconFlow({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="8" cy="8" r="2" />
      <circle cx="16" cy="16" r="2" />
      <circle cx="24" cy="24" r="2" />
      <path d="M10 10l4 4M14 14l4 4" />
    </svg>
  );
}

export function IconFactory({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <rect x="4" y="14" width="24" height="14" rx="1" />
      <path d="M10 14V8l6-4 6 4v6" />
      <path d="M12 22h2M18 22h2M14 18h4" />
    </svg>
  );
}

export function IconCheck({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconClass} ${className}`} fill="none" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

export function IconCompose({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <rect x="4" y="4" width="10" height="10" rx="1" />
      <rect x="18" y="4" width="10" height="10" rx="1" />
      <rect x="4" y="18" width="10" height="10" rx="1" />
      <rect x="18" y="18" width="10" height="10" rx="1" />
    </svg>
  );
}

export function IconBrush({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 22c0-4 4-12 10-12s10 8 10 12" />
      <path d="M16 10v-4" />
    </svg>
  );
}

export function IconList({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 8h16M8 16h16M8 24h12" />
    </svg>
  );
}

export function IconStone({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 20c2-4 4-8 8-8s6 4 8 8" />
      <path d="M16 12v16M12 24h8" />
    </svg>
  );
}

export function IconRare({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <polygon points="16,4 22,12 16,28 10,12" />
    </svg>
  );
}

export function IconQuality({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="16" cy="16" r="8" />
      <path d="M16 12v4l2 2" />
    </svg>
  );
}

export function IconApproved({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <rect x="4" y="8" width="24" height="16" rx="1" />
      <path d="M10 16l4 4 8-8" />
    </svg>
  );
}

export function IconPlace({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 6c-3.3 0-6 2.7-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z" />
      <circle cx="16" cy="12" r="2.5" />
    </svg>
  );
}

export function IconFile({ className = 'w-8 h-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${iconClass} ${className}`} fill="none" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 4v24h16V10l-6-6H8z" />
      <path d="M14 4v6h6" />
    </svg>
  );
}
