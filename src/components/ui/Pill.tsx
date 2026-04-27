import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'dark';

interface PillProps {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  style?: object;
}

const TONE: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.neutral[100],  fg: colors.neutral[700] },
  brand:   { bg: colors.brand[50],     fg: colors.brand[700] },
  success: { bg: colors.success[50],   fg: colors.success[700] },
  warning: { bg: colors.warning[50],   fg: colors.warning[700] },
  danger:  { bg: colors.danger[50],    fg: colors.danger[700] },
  dark:    { bg: colors.neutral[900],  fg: '#fff' },
};

export function Pill({ children, tone = 'neutral', icon, style }: PillProps) {
  const t = TONE[tone];
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: t.bg,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: t.fg,
          letterSpacing: 0.22,
          textTransform: 'uppercase',
        }}
      >
        {children}
      </Text>
    </View>
  );
}
