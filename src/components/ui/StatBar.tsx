import { View, Text } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, motion, tabularNumerals } from '@/constants/theme';

interface StatBarProps {
  value: number;
  max: number;
  color?: string;
  label: string;
  suffix?: string;
}

export function StatBar({ value, max, color = colors.brand[500], label, suffix = 'g' }: StatBarProps) {
  const pct = Math.min(value / max, 1);
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      50,
      withTiming(pct * 100, {
        duration: motion.duration.chart,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as `${number}%` }));

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
        <Text
          style={{
            fontSize: 11,
            lineHeight: 14,
            fontWeight: '500',
            letterSpacing: 0.22,
            color: colors.neutral[500],
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.neutral[700], ...tabularNumerals }}>
          {value}
          <Text style={{ color: colors.neutral[400], fontWeight: '500' }}>
            /{max}{suffix}
          </Text>
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.neutral[100], borderRadius: 999, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: color, borderRadius: 999 }, barStyle]} />
      </View>
    </View>
  );
}
