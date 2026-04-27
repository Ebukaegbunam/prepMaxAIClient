import { View, Text, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Dumbbell, UtensilsCrossed, Camera, Sparkles } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors, typography, radius, elevation } from '@/constants/theme';
import { useHaptic } from '@/lib/haptics';
import { signInWithGoogle, signInWithApple } from '@/lib/auth';
import { useState } from 'react';

// PrepMax logo: bold geometric P + lightning bolt accent.
// Source: docs/designs/screens/signin.jsx PrepMaxLogo
function PrepMaxLogo({ size = 88 }: { size?: number }) {
  const blue = colors.brand[500];
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Defs>
        <LinearGradient id="pmShine" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={blue} stopOpacity="1" />
          <Stop offset="100%" stopColor={blue} stopOpacity="0.82" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="96" height="96" rx="24" fill={`url(#pmShine)`} />
      <Path
        d="M28 22 h22 a18 18 0 0 1 0 36 H42 V74 H28 V22 Z M42 34 V46 H49 a6 6 0 0 0 0-12 H42 Z"
        fill="#fff"
      />
      <Path
        d="M64 22 L52 50 H62 L56 74 L74 44 H64 L70 22 Z"
        fill="#fff"
        opacity="0.95"
      />
    </Svg>
  );
}

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Dumbbell, label: 'Lift' },
  { icon: UtensilsCrossed, label: 'Fuel' },
  { icon: Camera, label: 'Pose' },
  { icon: Sparkles, label: 'Coach' },
];

// Google "G" SVG logo
function GoogleG() {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </Svg>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignIn() {
  const haptic = useHaptic();
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);
  const googleScale = useSharedValue(1);
  const googleStyle = useAnimatedStyle(() => ({ transform: [{ scale: googleScale.value }] }));

  const handleGoogle = async () => {
    if (loading) return;
    haptic('buttonPress');
    setLoading('google');
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      Alert.alert('Sign-in failed', msg);
    } finally {
      setLoading(null);
    }
  };

  const handleApple = async () => {
    if (loading) return;
    haptic('buttonPress');
    setLoading('apple');
    try {
      await signInWithApple();
    } catch (e: unknown) {
      if ((e as { code?: string }).code === 'ERR_REQUEST_CANCELED') {
        setLoading(null);
        return;
      }
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      Alert.alert('Sign-in failed', msg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      {/* Soft brand wash circles (background decoration) */}
      <View
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: 999,
          backgroundColor: colors.brand[100],
          opacity: 0.7,
        }}
        pointerEvents="none"
      />
      <View
        style={{
          position: 'absolute',
          bottom: -100,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: 999,
          backgroundColor: colors.brand[50],
          opacity: 0.9,
        }}
        pointerEvents="none"
      />

      {/* Hero section */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <View style={{ marginBottom: 28 }}>
          <PrepMaxLogo size={92} />
        </View>

        {/* Wordmark: "prepmax AI" */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Text style={{ fontSize: 40, fontWeight: '800', letterSpacing: -1.4, color: colors.neutral[900], lineHeight: 44 }}>
            prep
          </Text>
          <Text style={{ fontSize: 40, fontWeight: '800', letterSpacing: -1.4, color: colors.brand[500], lineHeight: 44 }}>
            max
          </Text>
          <View
            style={{
              marginLeft: 6,
              marginBottom: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: radius.sm,
              backgroundColor: colors.brand[500],
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: 0.36, color: '#fff' }}>AI</Text>
          </View>
        </View>

        {/* Tagline */}
        <Text
          style={{
            ...typography.body,
            color: colors.neutral[700],
            textAlign: 'center',
            maxWidth: 300,
            lineHeight: 24,
            fontSize: 17,
            fontWeight: '500',
          }}
        >
          Train hard. Eat dialed. Let the AI handle the math —{' '}
          <Text style={{ color: colors.brand[500], fontWeight: '700' }}>you handle the reps.</Text>
        </Text>

        {/* Sub-tagline */}
        <Text
          style={{
            ...typography.footnote,
            color: colors.neutral[500],
            textAlign: 'center',
            marginTop: 10,
            textTransform: 'uppercase',
            letterSpacing: 1.1,
            fontWeight: '600',
          }}
        >
          16 weeks · every set · every meal
        </Text>

        {/* Feature icons row */}
        <View style={{ flexDirection: 'row', gap: 18, marginTop: 36 }}>
          {FEATURES.map(({ icon: Icon, label }) => (
            <View key={label} style={{ alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: colors.brand[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={colors.brand[500]} strokeWidth={2} />
              </View>
              <Text
                style={{
                  ...typography.footnote,
                  color: colors.neutral[600],
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Sign-in actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32, zIndex: 1 }}>
        {/* Google */}
        <AnimatedPressable
          onPress={handleGoogle}
          disabled={loading !== null}
          onPressIn={() => { googleScale.value = withSpring(0.97, { damping: 30, stiffness: 400 }); }}
          onPressOut={() => { googleScale.value = withSpring(1, { damping: 30, stiffness: 400 }); }}
          style={[
            googleStyle,
            {
              width: '100%',
              height: 52,
              borderRadius: 14,
              backgroundColor: colors.neutral[0],
              borderWidth: 1,
              borderColor: colors.neutral[200],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 12,
              opacity: loading === 'google' ? 0.6 : 1,
              ...elevation[2],
            },
          ]}
        >
          <GoogleG />
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.neutral[800], letterSpacing: -0.08 }}>
            {loading === 'google' ? 'Signing in…' : 'Continue with Google'}
          </Text>
        </AnimatedPressable>

        {/* Apple — only renders on iOS where Sign In with Apple is available */}
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={14}
          style={{ width: '100%', height: 52, marginBottom: 20 }}
          onPress={handleApple}
        />

        <Text
          style={{
            ...typography.footnote,
            color: colors.neutral[400],
            textAlign: 'center',
            lineHeight: 16,
          }}
        >
          By continuing, you agree to our{' '}
          <Text style={{ color: colors.neutral[600], textDecorationLine: 'underline' }}>Terms</Text>
          {' '}and{' '}
          <Text style={{ color: colors.neutral[600], textDecorationLine: 'underline' }}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
