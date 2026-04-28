import { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '@/api/endpoints/profile';
import { createPrep } from '@/api/endpoints/preps';
import { Field, SegmentPicker, Stepper } from '@/components/onboarding/fields';
import { colors, typography, radius, elevation } from '@/constants/theme';
import type { Division } from '@/state/onboarding-store';

const DIVISIONS: { value: Division; label: string }[] = [
  { value: 'classic_physique', label: 'Classic' },
  { value: 'mens_physique', label: "Men's" },
  { value: 'bikini', label: 'Bikini' },
  { value: 'wellness', label: 'Wellness' },
];

function lbToKg(lb: number) { return lb * 0.45359237; }

export default function NewPrepScreen() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const isLb = profile?.units_weight === 'lb';
  const unit = isLb ? 'lb' : 'kg';

  const [division, setDivision] = useState<Division | null>(null);
  const [startWeight, setStartWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [startBf, setStartBf] = useState('');
  const [targetBf, setTargetBf] = useState('');
  const [maintenanceWeeks, setMaintenanceWeeks] = useState(0);
  const [cutWeeks, setCutWeeks] = useState(12);
  const [submitting, setSubmitting] = useState(false);

  const totalWeeks = maintenanceWeeks + cutWeeks;
  const canSubmit = division !== null && startWeight.trim() !== '' && targetWeight.trim() !== '';

  const handleCreate = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const toKg = (raw: string) => {
        const n = parseFloat(raw);
        return isNaN(n) ? 0 : isLb ? lbToKg(n) : n;
      };
      await createPrep({
        division: division!,
        start_date: new Date().toISOString().split('T')[0],
        starting_weight_kg: toKg(startWeight),
        target_weight_kg: toKg(targetWeight),
        starting_bf_pct: startBf ? parseFloat(startBf) : undefined,
        target_bf_pct: targetBf ? parseFloat(targetBf) : undefined,
        phase_split: { maintenance_weeks: maintenanceWeeks, cut_weeks: cutWeeks },
      });
      await qc.invalidateQueries({ queryKey: ['prep-current'] });
      router.replace('/(tabs)/home');
    } catch {
      setSubmitting(false);
      Alert.alert('Could not create prep', 'Check your connection and try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 20, paddingVertical: 14,
          borderBottomWidth: 1, borderBottomColor: colors.neutral[100],
        }}>
          <Text style={{ ...typography.title3, color: colors.neutral[900] }}>New prep</Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={{ fontSize: 22, color: colors.neutral[400], lineHeight: 26 }}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SegmentPicker
            label="Division"
            options={DIVISIONS}
            value={division}
            onChange={setDivision}
          />

          {/* Weights */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field
                label={`Start weight (${unit})`}
                value={startWeight}
                onChangeText={(v) => setStartWeight(v.replace(/[^0-9.]/g, ''))}
                placeholder={isLb ? '200' : '90'}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label={`Target weight (${unit})`}
                value={targetWeight}
                onChangeText={(v) => setTargetWeight(v.replace(/[^0-9.]/g, ''))}
                placeholder={isLb ? '175' : '80'}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Body fat (optional) */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Field
                label="Start body fat % (opt)"
                value={startBf}
                onChangeText={(v) => setStartBf(v.replace(/[^0-9.]/g, ''))}
                placeholder="18"
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label="Target body fat % (opt)"
                value={targetBf}
                onChangeText={(v) => setTargetBf(v.replace(/[^0-9.]/g, ''))}
                placeholder="5"
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Phase split */}
          <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[50], padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Phase split
              </Text>
              <View style={{ backgroundColor: colors.brand[500], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>{totalWeeks} weeks total</Text>
              </View>
            </View>
            <Stepper
              label="Maintenance weeks"
              value={maintenanceWeeks}
              min={0}
              max={8}
              onChange={setMaintenanceWeeks}
              suffix="w"
            />
            <Stepper
              label="Cut weeks"
              value={cutWeeks}
              min={4}
              max={20}
              onChange={setCutWeeks}
              suffix="w"
            />
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleCreate}
            disabled={!canSubmit || submitting}
            style={{
              backgroundColor: canSubmit ? colors.brand[500] : colors.neutral[200],
              borderRadius: radius.lg,
              paddingVertical: 16,
              alignItems: 'center',
              ...elevation[canSubmit ? 2 : 0],
            }}
          >
            {submitting
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ fontSize: 16, fontWeight: '700', color: canSubmit ? '#fff' : colors.neutral[400] }}>
                  Build my prep →
                </Text>
            }
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
