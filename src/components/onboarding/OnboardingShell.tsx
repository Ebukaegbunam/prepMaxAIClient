import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, typography, radius } from '@/constants/theme';
import { Button } from '@/components/ui';

const TOTAL_STEPS = 6;

interface Props {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  loading?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  loading = false,
  skipLabel,
  onSkip,
}: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            {step > 1 && (
              <Pressable
                onPress={() => router.back()}
                hitSlop={8}
                style={{ marginRight: 12 }}
              >
                <Text style={{ fontSize: 28, color: colors.neutral[600], lineHeight: 32 }}>‹</Text>
              </Pressable>
            )}
            <View style={{ flex: 1, flexDirection: 'row', gap: 6 }}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: i < step ? colors.brand[500] : colors.neutral[100],
                  }}
                />
              ))}
            </View>
            {skipLabel && onSkip && (
              <Pressable onPress={onSkip} hitSlop={8} style={{ marginLeft: 12 }}>
                <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600' }}>
                  {skipLabel}
                </Text>
              </Pressable>
            )}
          </View>

          <Text style={{ ...typography.title1, color: colors.neutral[900], marginBottom: subtitle ? 6 : 0 }}>
            {title}
          </Text>
          {subtitle && (
            <Text style={{ ...typography.body, color: colors.neutral[500], lineHeight: 22 }}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Bottom action */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.neutral[100] }}>
          <Button
            onPress={onContinue}
            disabled={continueDisabled || loading}
            loading={loading}
            full
          >
            {continueLabel}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
