import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, radius } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  full?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: object;
}

const SIZE = {
  sm: { height: 32, paddingHorizontal: 12, fontSize: 13, gap: 6, borderRadius: radius.md },
  md: { height: 44, paddingHorizontal: 16, fontSize: 15, gap: 8, borderRadius: radius.md },
  lg: { height: 52, paddingHorizontal: 20, fontSize: 16, gap: 10, borderRadius: radius.md },
} as const;

const VARIANT = {
  primary:   { bg: colors.brand[500],    fg: '#fff',                borderWidth: 0, borderColor: 'transparent' },
  secondary: { bg: colors.neutral[100],  fg: colors.neutral[800],   borderWidth: 0, borderColor: 'transparent' },
  ghost:     { bg: 'transparent',        fg: colors.brand[600],     borderWidth: 0, borderColor: 'transparent' },
  outline:   { bg: colors.neutral[0],    fg: colors.neutral[800],   borderWidth: 1, borderColor: colors.neutral[200] },
} as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ children, variant = 'primary', size = 'md', onPress, full, disabled, loading, icon, style }: ButtonProps) {
  const scale = useSharedValue(1);
  const s = SIZE[size];
  const v = VARIANT[variant];

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 30, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 30, stiffness: 400 }); }}
      style={[
        animStyle,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: s.borderRadius,
          backgroundColor: v.bg,
          borderWidth: v.borderWidth,
          borderColor: v.borderColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s.gap,
          alignSelf: full ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.fg} />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text
            style={{
              fontSize: s.fontSize,
              fontWeight: '600',
              color: v.fg,
              letterSpacing: -0.08,
            }}
          >
            {children}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
