import type { ViewStyle, TextStyle } from 'react-native';

// ─── Colors ────────────────────────────────────────────────────────────────
// Source of truth: docs/designs/theme.js (PrepAITheme)

export const colors = {
  brand: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',   // PRIMARY — buttons, key accents
    600: '#2563EB',   // pressed states, headlines, ghost button text
    700: '#1D4ED8',   // high-emphasis text on light blue
    900: '#1E3A8A',   // dark accents, charts
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',    // alternate surface, page background
    100: '#F1F5F9',   // muted surface, input fields, dividers
    200: '#E2E8F0',   // subtle borders, separators
    300: '#CBD5E1',   // disabled controls, low-emphasis borders
    400: '#94A3B8',   // placeholder text, tertiary icons
    500: '#64748B',   // secondary text
    600: '#475569',   // body text on muted surfaces
    700: '#334155',   // default body text
    800: '#1E293B',   // headlines, emphasized labels
    900: '#0F172A',   // hero numerals (weight, calories, etc.)
  },
  success: {
    50: '#ECFDF5',
    500: '#10B981',   // workout complete, on-track, set marked done
    700: '#047857',   // high-emphasis success text
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',   // approaching limits, alerts
    700: '#B45309',
  },
  danger: {
    50: '#FEF2F2',
    500: '#EF4444',   // over limits, errors, failed sync
    700: '#B91C1C',
  },
} as const;

// ─── Spacing ───────────────────────────────────────────────────────────────

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,   // DEFAULT — card padding, screen horizontal padding
  5: 20,
  6: 24,   // section gaps
  8: 32,
  10: 40,
  12: 48,  // hero margins
  16: 64,
} as const;

// ─── Border radius ─────────────────────────────────────────────────────────

export const radius = {
  sm: 8,     // buttons, chips, small inputs
  md: 12,    // cards (default)
  lg: 16,    // sheets, modals, large cards
  xl: 24,    // hero cards, photo containers
  full: 9999, // pill buttons, avatars, dots
} as const;

// ─── Typography ────────────────────────────────────────────────────────────
// Sizes from docs/designs/theme.js — more compact than initial estimate.
// SF Pro on iOS (system font), Inter on Android.

export const typography = {
  display: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700' as const,
    letterSpacing: -0.8,     // -0.02em at 40px
  },
  title1: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.28,    // -0.01em at 28px
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.11,    // -0.005em at 22px
  },
  title3: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  callout: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500' as const,
  },
  footnote: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
    letterSpacing: 0.22,     // 0.02em at 11px
  },
} as const;

// Tabular numerals — apply to any numeric display so numbers never jitter.
export const tabularNumerals: Pick<TextStyle, 'fontVariant'> = {
  fontVariant: ['tabular-nums'],
};

// ─── Hero numerals (large numbers in set logger, calorie display, etc.) ────
// These get additional tighter letter spacing beyond the base type scale.

export const heroNumeral = {
  large: { letterSpacing: -1.92 },   // -0.03em at 64px
  medium: { letterSpacing: -0.64 },  // -0.02em at 32px
  small: { letterSpacing: -0.22 },   // -0.01em at 22px
} as const;

// ─── Elevation ─────────────────────────────────────────────────────────────
// Uses the 0.5px hairline border trick from the design mockup for crispness.

export const elevation = {
  0: {} as ViewStyle,
  1: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  } as ViewStyle,
  2: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  } as ViewStyle,
  3: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
} as const;

// ─── Motion ────────────────────────────────────────────────────────────────

export const motion = {
  spring: {
    default: { damping: 20, stiffness: 200 } as const,   // sheet open
    snappy: { damping: 30, stiffness: 400 } as const,    // button press
    gentle: { damping: 15, stiffness: 150 } as const,    // modal
    chart: { damping: 25, stiffness: 250 } as const,     // stat ring fill
  },
  // Cubic bezier equivalent: cubic-bezier(0.2, 0.8, 0.2, 1) from design mockup
  duration: {
    micro: 100,
    fast: 150,
    normal: 220,
    medium: 320,
    slow: 600,
    chart: 700,
  },
} as const;

// ─── Layout constants ──────────────────────────────────────────────────────

export const layout = {
  screenPadding: 16,      // always 16, never more, never less
  cardPadding: 16,
  cardGap: 8,             // gap between cards in a list (from designs: 8px)
  sectionGap: 12,         // gap between sections (padding top on section divs)
  tabBarHeight: 56,
  minTouchTarget: 44,     // Apple HIG minimum
  gymTouchTarget: 56,     // set logger — bigger for gym hands/gloves
  bigStepBtn: 52,         // weight +/- stepper buttons in set logger
} as const;

// ─── Icon sizes ────────────────────────────────────────────────────────────

export const iconSize = {
  inline: 11,
  sm: 14,
  default: 16,
  md: 18,
  nav: 20,           // used in tab bar via Lucide
  header: 22,
  emptyState: 48,
} as const;

// ─── Haptic event map ──────────────────────────────────────────────────────
// Centralized for documentation. Handlers in src/lib/haptics/index.ts.

export const hapticMap = {
  tabChange: 'selection',
  dayChange: 'selection',
  buttonPress: 'impactLight',
  setLogged: 'impactMedium',
  workoutComplete: 'notificationSuccess',
  mealLogged: 'impactLight',
  weeklyCheckInSubmit: 'notificationSuccess',
  photoCaptured: 'impactMedium',
  aiSuggestionAccepted: 'selection',
  aiSuggestionRejected: 'selection',
  errorToast: 'notificationError',
  warningToast: 'notificationWarning',
  longPressStart: 'impactHeavy',
  pullToRefreshThreshold: 'impactMedium',
} as const;

// ─── Skeleton shimmer ──────────────────────────────────────────────────────

export const skeleton = {
  baseColor: colors.neutral[100],
  highlightOpacity: 0.08,
  animationDuration: 1500,
} as const;

// ─── Backdrop ──────────────────────────────────────────────────────────────

export const backdrop = {
  color: colors.neutral[900],
  opacity: 0.4,
} as const;
