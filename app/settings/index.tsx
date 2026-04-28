import { View, Text, Pressable, Alert, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, patchProfile } from '@/api/endpoints/profile';
import { signOut } from '@/lib/auth';
import { colors, typography, radius, elevation } from '@/constants/theme';
import type { WeightUnit, LengthUnit } from '@/lib/units';

function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.neutral[100], marginHorizontal: 16 }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text style={{
        ...typography.footnote, color: colors.neutral[500], fontWeight: '700',
        textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 4,
      }}>
        {title}
      </Text>
      <View style={{ borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.neutral[100], backgroundColor: colors.neutral[0], ...elevation[0] }}>
        {children}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 }}>
      <Text style={{ ...typography.body, color: colors.neutral[700] }}>{label}</Text>
      <Text style={{ ...typography.body, color: colors.neutral[400] }}>{value ?? '—'}</Text>
    </View>
  );
}

function ActionRow({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 14, paddingHorizontal: 16,
        backgroundColor: pressed ? colors.neutral[50] : colors.neutral[0],
      })}
    >
      <Text style={{ ...typography.body, color: danger ? '#EF4444' : colors.neutral[900] }}>{label}</Text>
      {!danger && <Text style={{ color: colors.neutral[300], fontSize: 18 }}>›</Text>}
    </Pressable>
  );
}

function UnitToggle({
  label, left, right, isRight, onToggle,
}: { label: string; left: string; right: string; isRight: boolean; onToggle: (val: boolean) => void }) {
  return (
    <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[left, right].map((opt, i) => {
          const active = i === 0 ? !isRight : isRight;
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(i === 1)}
              style={{
                flex: 1, paddingVertical: 10, borderRadius: radius.md, alignItems: 'center',
                borderWidth: 1.5,
                borderColor: active ? colors.brand[500] : colors.neutral[200],
                backgroundColor: active ? colors.brand[50] : colors.neutral[0],
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: active ? colors.brand[600] : colors.neutral[500] }}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  const patchMutation = useMutation({
    mutationFn: patchProfile,
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ['profile'] });
      const prev = qc.getQueryData(['profile']);
      qc.setQueryData(['profile'], (old: typeof profile) => old ? { ...old, ...vars } : old);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(['profile'], ctx?.prev);
      Alert.alert('Failed to save', 'Could not update your settings.');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const isImperial = profile?.units_weight === 'lb';

  const handleSystemChange = (toImperial: boolean) => {
    const weightUnit: WeightUnit = toImperial ? 'lb' : 'kg';
    const lengthUnit: LengthUnit = toImperial ? 'in' : 'cm';
    patchMutation.mutate({ units_weight: weightUnit, units_measurement: lengthUnit });
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Your local session will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out', style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] }}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 28, color: colors.neutral[600], lineHeight: 32 }}>‹</Text>
        </Pressable>
        <Text style={{ ...typography.title2, color: colors.neutral[900] }}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

        {/* Profile info */}
        {profile && (
          <Section title="Profile">
            <InfoRow label="Name" value={profile.name} />
            <Divider />
            <InfoRow label="Age" value={String(profile.age)} />
            <Divider />
            <InfoRow label="Height" value={profile.units_measurement === 'in'
              ? (() => { const totalIn = profile.height_cm / 2.54; return `${Math.floor(totalIn / 12)}'${Math.round(totalIn % 12)}"`; })()
              : `${Math.round(profile.height_cm)} cm`}
            />
            <Divider />
            <InfoRow label="Division" value={profile.sex === 'male' ? 'Male' : 'Female'} />
          </Section>
        )}

        {/* Units */}
        <Section title="Units">
          <UnitToggle
            label="Measurement system"
            left="Metric (kg / cm)"
            right="US (lb / in)"
            isRight={isImperial}
            onToggle={handleSystemChange}
          />
        </Section>

        {/* Account */}
        <Section title="Account">
          <ActionRow label="Sign out" onPress={handleSignOut} danger />
        </Section>

        <Text style={{ ...typography.footnote, color: colors.neutral[400], textAlign: 'center', marginTop: 8 }}>
          PrepMax AI v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
