import type { ViewStyle } from 'react-native';

// ─── Colors ────────────────────────────────────────────────────────────────

export const colors = {
  brand: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',   // PRIMARY — buttons, key accents
    600: '#2563EB',   // pressed states, headlines
    700: '#1D4ED8',   // high-emphasis text on light blue
    900: '#1E3A8A',   // dark accents, charts
  },
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',    // alternate surface, scrim
    100: '#F1F5F9',   // muted surface, input fields, dividers
    200: '#E2E8F0',   // subtle borders, separators
    300: '#CBD5E1',   // disabled controls, low-emphasis borders
    400: '#94A3B8',   // placeholder text, tertiary icons
    500: '#64748B',   // secondary text
    600: '#475569',   // body text on muted surfaces
    700: '#334155',   // default body text
    800: '#1E293B',   // headlines, emphasized labels
    900: '#0F172A',   // hero numerals
  },
  success: {
    50: '#ECFDF5',
    500: '#10B981',   // workout complete, on-track trend, set marked done
    700: '#047857',   // high-emphasis success text
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',   // approaching limits, calorie warnings
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
  4: 16,   // DEFAULT padding for cards, screen edges
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
  lg: 16,    // sheets, modals
  xl: 24,    // hero cards, photo containers
  full: 9999, // pill buttons, avatars
} as const;

// ─── Typography ────────────────────────────────────────────────────────────

export const typography = {
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  title3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  callout: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  footnote: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
} as const;

// Tabular numerals for any numeric display — numbers never jitter as they update.
export const tabularNumerals = {
  fontVariant: ['tabular-nums'] as const,
};

// ─── Elevation ─────────────────────────────────────────────────────────────

export const elevation = {
  0: {} as ViewStyle,   // flat surfaces, dividers
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
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  } as ViewStyle,
  3: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  } as ViewStyle,
} as const;

// ─── Motion ────────────────────────────────────────────────────────────────

export const motion = {
  spring: {
    default: { damping: 20, stiffness: 200 } as const,       // sheet open
    snappy: { damping: 30, stiffness: 400 } as const,        // button press
    gentle: { damping: 15, stiffness: 150 } as const,        // modal open
  },
  duration: {
    micro: 100,    // button press, tap feedback
    fast: 150,     // tab change crossfade
    normal: 200,   // list item enter, set logged
    medium: 250,   // modal open
    slow: 300,     // sheet open, progress arc
    chart: 400,    // chart entrance, number change
  },
} as const;

// ─── Layout constants ──────────────────────────────────────────────────────

export const layout = {
  screenPadding: 16,      // always 16, never more, never less
  cardPadding: 16,        // same number — visual rhythm
  cardGap: 16,            // vertical gap between cards
  sectionGap: 24,         // vertical gap between sections
  ctaTopMargin: 32,       // before a screen-level CTA
  tabBarHeight: 56,       // tab bar height (plus safe area inset)
  minTouchTarget: 44,     // Apple HIG minimum
  gymTouchTarget: 56,     // set logger buttons — bigger for gym hands
} as const;

// ─── Icon sizes ────────────────────────────────────────────────────────────

export const iconSize = {
  inline: 16,
  default: 20,
  nav: 24,       // tabs/headers
  emptyState: 32,
  illustration: 48,
} as const;

// ─── Haptic types ──────────────────────────────────────────────────────────
// Mappings live in src/lib/haptics/index.ts.
// Centralized here for documentation purposes.

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
