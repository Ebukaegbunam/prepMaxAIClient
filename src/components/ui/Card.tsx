import { View, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, elevation as elevationStyles, radius } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  onPress?: () => void;
  elevation?: 0 | 1 | 2 | 3;
  style?: object;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ children, padding = 16, onPress, elevation = 1, style }: CardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const base = {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.lg,
    padding,
    ...elevationStyles[elevation],
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98, { damping: 30, stiffness: 400 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 30, stiffness: 400 }); }}
        style={[animStyle, base, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={[base, style]}>{children}</View>;
}
