// PrepAI theme tokens — single source of truth for design values.
const PrepAITheme = {
  colors: {
    brand: {
      50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE',
      300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6',
      600: '#2563EB', 700: '#1D4ED8', 900: '#1E3A8A',
    },
    neutral: {
      0: '#FFFFFF', 50: '#F8FAFC', 100: '#F1F5F9',
      200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8',
      500: '#64748B', 600: '#475569', 700: '#334155',
      800: '#1E293B', 900: '#0F172A',
    },
    success: { 50: '#ECFDF5', 500: '#10B981', 700: '#047857' },
    warning: { 50: '#FFFBEB', 500: '#F59E0B', 700: '#B45309' },
    danger:  { 50: '#FEF2F2', 500: '#EF4444', 700: '#B91C1C' },
  },
  spacing: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 },
  radius: { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 },
  type: {
    display:    { fontSize: 40, lineHeight: '44px', fontWeight: 700, letterSpacing: '-0.02em' },
    title1:     { fontSize: 28, lineHeight: '32px', fontWeight: 700, letterSpacing: '-0.01em' },
    title2:     { fontSize: 22, lineHeight: '28px', fontWeight: 600, letterSpacing: '-0.005em' },
    title3:     { fontSize: 17, lineHeight: '22px', fontWeight: 600 },
    body:       { fontSize: 15, lineHeight: '20px', fontWeight: 400 },
    bodyStrong: { fontSize: 15, lineHeight: '20px', fontWeight: 600 },
    callout:    { fontSize: 13, lineHeight: '17px', fontWeight: 500 },
    footnote:   { fontSize: 11, lineHeight: '14px', fontWeight: 500, letterSpacing: '0.02em' },
  },
  font: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
  mono: '"SF Mono", ui-monospace, "JetBrains Mono", Menlo, monospace',
};

window.PrepAITheme = PrepAITheme;
