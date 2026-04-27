import { Pressable, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, tabularNumerals } from '@/constants/theme';

export type DayStatus = 'logged' | 'partial' | 'missed' | 'planned' | 'rest';

interface DayChipProps {
  day: string;
  num: number;
  status?: DayStatus;
  isToday?: boolean;
  onPress?: () => void;
}

const DOT_COLOR: Record<DayStatus, string> = {
  logged:  colors.brand[500],
  partial: colors.brand[300],
  missed:  colors.danger[500],
  planned: colors.neutral[300],
  rest:    colors.neutral[200],
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DayChip({ day, num, status = 'planned', isToday = false, onPress }: DayChipProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.93, { damping: 30, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 30, stiffness: 400 }); }}
      style={[
        animStyle,
        {
          width: 44,
          height: 56,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          backgroundColor: isToday ? colors.brand[500] : 'transparent',
          borderRadius: 14,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 11,
          lineHeight: 14,
          fontWeight: '500',
          letterSpacing: 0.66,
          textTransform: 'uppercase',
          color: isToday ? '#fff' : colors.neutral[500],
        }}
      >
        {day}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          color: isToday ? '#fff' : colors.neutral[900],
          ...tabularNumerals,
        }}
      >
        {num}
      </Text>
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 999,
          backgroundColor: isToday ? 'rgba(255,255,255,0.7)' : DOT_COLOR[status],
        }}
      />
    </AnimatedPressable>
  );
}
