// Shared UI primitives — Card, Button, StatRing, StatBar, Pill, MealDot
const T = window.PrepAITheme;

// ─────────────────── Hero stat ring ───────────────────
function StatRing({ value, max, size = 188, stroke = 14, color, trackColor, children, animate = true }) {
  const c = color || T.colors.brand[500];
  const t = trackColor || T.colors.neutral[100];
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const [animated, setAnimated] = React.useState(animate ? 0 : pct);
  React.useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setAnimated(pct));
    return () => cancelAnimationFrame(id);
  }, [pct, animate]);
  const offset = circ * (1 - animated);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────── Macro / progress bar ───────────────────
function StatBar({ value, max, color, label, suffix = 'g', animate = true }) {
  const c = color || T.colors.brand[500];
  const pct = Math.min(value / max, 1) * 100;
  const [animated, setAnimated] = React.useState(animate ? 0 : pct);
  React.useEffect(() => {
    if (!animate) return;
    const id = setTimeout(() => setAnimated(pct), 50);
    return () => clearTimeout(id);
  }, [pct, animate]);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ ...T.type.footnote, color: T.colors.neutral[500], textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: T.font, fontSize: 12, fontWeight: 600, color: T.colors.neutral[700], fontVariantNumeric: 'tabular-nums' }}>
          {value}<span style={{ color: T.colors.neutral[400], fontWeight: 500 }}>/{max}{suffix}</span>
        </span>
      </div>
      <div style={{ height: 6, background: T.colors.neutral[100], borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${animated}%`, background: c, borderRadius: 999,
          transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}/>
      </div>
    </div>
  );
}

// ─────────────────── Card ───────────────────
function Card({ children, style = {}, padding = 16, onClick, elevation = 1 }) {
  const shadows = {
    0: 'none',
    1: '0 1px 2px rgba(15, 23, 42, 0.04), 0 0 0 0.5px rgba(15, 23, 42, 0.04)',
    2: '0 4px 12px rgba(15, 23, 42, 0.06), 0 0 0 0.5px rgba(15, 23, 42, 0.04)',
    3: '0 8px 24px rgba(15, 23, 42, 0.10), 0 0 0 0.5px rgba(15, 23, 42, 0.04)',
  };
  return (
    <div
      onClick={onClick}
      style={{
        background: T.colors.neutral[0], borderRadius: T.radius.lg,
        padding, boxShadow: shadows[elevation], cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}>
      {children}
    </div>
  );
}

// ─────────────────── Button ───────────────────
function Button({ children, variant = 'primary', size = 'md', onClick, full, style = {}, icon, disabled }) {
  const sizes = {
    sm: { height: 32, padding: '0 12px', fontSize: 13, gap: 6 },
    md: { height: 44, padding: '0 16px', fontSize: 15, gap: 8 },
    lg: { height: 52, padding: '0 20px', fontSize: 16, gap: 10 },
  };
  const variants = {
    primary: { background: T.colors.brand[500], color: '#fff', border: 'none' },
    secondary: { background: T.colors.neutral[100], color: T.colors.neutral[800], border: 'none' },
    ghost: { background: 'transparent', color: T.colors.brand[600], border: 'none' },
    outline: { background: T.colors.neutral[0], color: T.colors.neutral[800], border: `1px solid ${T.colors.neutral[200]}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...sizes[size], ...variants[variant],
      borderRadius: 12, fontFamily: T.font, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: full ? '100%' : 'auto',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'transform 120ms ease, opacity 120ms ease',
      letterSpacing: '-0.005em',
      ...style,
    }}
    onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
      {icon}
      {children}
    </button>
  );
}

// ─────────────────── Pill / phase chip ───────────────────
function Pill({ children, tone = 'neutral', style = {} }) {
  const tones = {
    neutral: { bg: T.colors.neutral[100], fg: T.colors.neutral[700] },
    brand:   { bg: T.colors.brand[50],    fg: T.colors.brand[700] },
    success: { bg: T.colors.success[50],  fg: T.colors.success[700] },
    warning: { bg: T.colors.warning[50],  fg: T.colors.warning[700] },
    danger:  { bg: T.colors.danger[50],   fg: T.colors.danger[700] },
    dark:    { bg: T.colors.neutral[900], fg: '#fff' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: t.bg, color: t.fg,
      padding: '4px 10px', borderRadius: 999,
      fontFamily: T.font, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.02em', textTransform: 'uppercase',
      ...style,
    }}>{children}</span>
  );
}

// ─────────────────── Day chip (week strip) ───────────────────
function DayChip({ day, status = 'planned', isToday = false, onClick, num }) {
  // status: 'logged' | 'partial' | 'missed' | 'planned' | 'today' | 'rest'
  const dotColor = {
    logged: T.colors.brand[500],
    partial: T.colors.brand[300],
    missed: T.colors.danger[500],
    planned: T.colors.neutral[300],
    rest: T.colors.neutral[200],
  }[status];
  return (
    <button onClick={onClick} style={{
      width: 44, height: 56,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: isToday ? T.colors.brand[500] : 'transparent',
      borderRadius: 14, border: 'none', cursor: 'pointer',
      transition: 'all 200ms ease',
    }}>
      <span style={{
        ...T.type.footnote, color: isToday ? '#fff' : T.colors.neutral[500],
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{day}</span>
      <span style={{
        fontFamily: T.font, fontSize: 16, fontWeight: 700,
        color: isToday ? '#fff' : T.colors.neutral[900],
        fontVariantNumeric: 'tabular-nums',
      }}>{num}</span>
      <span style={{
        width: 4, height: 4, borderRadius: 999,
        background: isToday ? 'rgba(255,255,255,0.7)' : dotColor,
      }}/>
    </button>
  );
}

window.PrepAIComponents = { StatRing, StatBar, Card, Button, Pill, DayChip };
