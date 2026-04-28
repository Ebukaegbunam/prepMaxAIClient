import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentPrep } from '@/api/endpoints/preps';
import { NewPrepModal } from '@/components/NewPrepModal';
import { useUnits } from '@/lib/units';
import { logWeight, getWeightTrend, createCheckIn, getCheckIns } from '@/api/endpoints/progress';
import { colors, typography, radius, elevation } from '@/constants/theme';

const RATINGS = [1, 2, 3, 4, 5];
const EMOJI = ['😩', '😕', '😐', '🙂', '😄'];

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {RATINGS.map((r) => (
          <Pressable
            key={r}
            onPress={() => onChange(r)}
            style={{ flex: 1, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1.5, borderColor: value === r ? colors.brand[500] : colors.neutral[200], backgroundColor: value === r ? colors.brand[50] : colors.neutral[0], alignItems: 'center' }}
          >
            <Text style={{ fontSize: 18 }}>{EMOJI[r - 1]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const qc = useQueryClient();
  const [showNewPrep, setShowNewPrep] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [checkIn, setCheckIn] = useState({ energy_level: 3, mood_score: 3, sleep_quality: 3, training_performance: 3, weight_kg: '', notes: '' });

  const { data: prep, isLoading: prepLoading } = useQuery({ queryKey: ['prep-current'], queryFn: getCurrentPrep });

  const { data: weightLogs, refetch: refetchWeight } = useQuery({
    queryKey: ['weight-trend', prep?.id],
    queryFn: () => getWeightTrend(prep!.id),
    enabled: !!prep?.id,
  });

  const { data: checkIns } = useQuery({
    queryKey: ['check-ins', prep?.id],
    queryFn: () => getCheckIns(prep!.id),
    enabled: !!prep?.id,
  });

  const logWeightMutation = useMutation({
    mutationFn: () => logWeight(prep!.id, {
      logged_at: new Date().toISOString(),
      weight_kg: parseFloat(weightInput),
      source: 'manual',
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['weight-trend'] });
      setShowWeightModal(false);
      setWeightInput('');
    },
    onError: () => Alert.alert('Failed to log weight'),
  });

  const checkInMutation = useMutation({
    mutationFn: () => createCheckIn(prep!.id, {
      weight_kg: parseFloat(checkIn.weight_kg) || (weightLogs?.[0]?.weight_kg ?? 80),
      energy_level: checkIn.energy_level,
      mood_score: checkIn.mood_score,
      sleep_quality: checkIn.sleep_quality,
      training_performance: checkIn.training_performance,
      notes: checkIn.notes || undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['check-ins'] });
      qc.invalidateQueries({ queryKey: ['weight-trend'] });
      setShowCheckInModal(false);
      Alert.alert('Check-in saved! ✓', 'Your weekly check-in has been recorded.');
    },
    onError: () => Alert.alert('Failed to save check-in'),
  });

  if (prepLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand[500]} size="large" />
      </SafeAreaView>
    );
  }

  if (!prep) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>📈</Text>
        <Text style={{ ...typography.title3, color: colors.neutral[900], textAlign: 'center', marginBottom: 8 }}>No prep active</Text>
        <Text style={{ ...typography.body, color: colors.neutral[500], textAlign: 'center', marginBottom: 28 }}>
          Create a prep to track weight, check-ins, and progress photos.
        </Text>
        <Pressable
          onPress={() => setShowNewPrep(true)}
          style={{ backgroundColor: colors.brand[500], borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 36 }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Create prep →</Text>
        </Pressable>
        <NewPrepModal visible={showNewPrep} onClose={() => setShowNewPrep(false)} />
      </SafeAreaView>
    );
  }

  const { fw, weightUnit } = useUnits();
  const latestWeight = weightLogs?.[0]?.weight_kg;
  const startingWeight = prep?.starting_weight_kg;
  const targetWeight = prep?.target_weight_kg;
  const weightChange = latestWeight != null && startingWeight != null ? latestWeight - startingWeight : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ ...typography.title1, color: colors.neutral[900] }}>Progress</Text>
        {prep && (
          <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 2 }}>
            Week {prep.current_week} · {prep.current_phase}
          </Text>
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Weight card */}
        <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, marginBottom: 16, ...elevation[1] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ ...typography.title3, color: colors.neutral[900] }}>Weight</Text>
            <Pressable
              onPress={() => setShowWeightModal(true)}
              style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.md, backgroundColor: colors.brand[50], borderWidth: 1, borderColor: colors.brand[100] }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand[600] }}>+ Log</Text>
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'Current', value: latestWeight != null ? fw(latestWeight) : '—' },
              { label: 'Start', value: startingWeight != null ? fw(startingWeight) : '—' },
              { label: 'Target', value: targetWeight != null ? fw(targetWeight) : '—' },
              { label: 'Change', value: weightChange != null ? `${weightChange > 0 ? '+' : ''}${fw(Math.abs(weightChange))}` : '—' },
            ].map(({ label, value }) => (
              <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.neutral[900] }}>{value}</Text>
                <Text style={{ ...typography.footnote, color: colors.neutral[400], marginTop: 2 }}>{label}</Text>
              </View>
            ))}
          </View>

          {weightLogs && weightLogs.length > 0 && (
            <View>
              <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Recent</Text>
              {weightLogs.slice(0, 5).map((log) => (
                <View key={log.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.neutral[50] }}>
                  <Text style={{ ...typography.footnote, color: colors.neutral[600] }}>
                    {new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={{ ...typography.footnote, color: colors.neutral[900], fontWeight: '700' }}>{fw(log.weight_kg)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Weekly check-in CTA */}
        <Pressable
          onPress={() => setShowCheckInModal(true)}
          style={{ borderRadius: radius.lg, backgroundColor: colors.brand[500], padding: 20, marginBottom: 16, ...elevation[2] }}
        >
          <Text style={{ fontSize: 20, marginBottom: 8 }}>📋</Text>
          <Text style={{ ...typography.title3, color: '#fff', marginBottom: 4 }}>Weekly check-in</Text>
          <Text style={{ ...typography.footnote, color: 'rgba(255,255,255,0.75)' }}>
            Log your energy, mood, sleep, and training quality.
          </Text>
        </Pressable>

        {/* Past check-ins */}
        {checkIns && checkIns.length > 0 && (
          <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, ...elevation[1] }}>
            <Text style={{ ...typography.title3, color: colors.neutral[900], marginBottom: 12 }}>Check-in history</Text>
            {checkIns.slice(0, 5).map((ci) => (
              <View key={ci.id} style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.neutral[50] }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ ...typography.body, fontWeight: '700', color: colors.neutral[900] }}>Week {ci.week_number}</Text>
                  <Text style={{ ...typography.footnote, color: colors.neutral[500] }}>
                    {new Date(ci.checked_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                  {[
                    { label: 'Energy', v: ci.energy_level },
                    { label: 'Mood', v: ci.mood_score },
                    { label: 'Sleep', v: ci.sleep_quality },
                    { label: 'Training', v: ci.training_performance },
                  ].map(({ label, v }) => (
                    <Text key={label} style={{ ...typography.footnote, color: colors.neutral[500] }}>
                      {label}: {EMOJI[v - 1]}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Log Weight Modal */}
      <Modal visible={showWeightModal} animationType="slide" presentationStyle="formSheet" onRequestClose={() => setShowWeightModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] }}>
              <Text style={{ ...typography.title3, color: colors.neutral[900] }}>Log weight</Text>
              <Pressable onPress={() => setShowWeightModal(false)} hitSlop={8}>
                <Text style={{ fontSize: 22, color: colors.neutral[500] }}>✕</Text>
              </Pressable>
            </View>
            <View style={{ padding: 20 }}>
              <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Weight (kg)</Text>
              <TextInput
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="decimal-pad"
                placeholder={latestWeight?.toFixed(1) ?? '80.0'}
                placeholderTextColor={colors.neutral[300]}
                autoFocus
                style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 16, fontSize: 28, fontWeight: '800', color: colors.neutral[900], textAlign: 'center', marginBottom: 24 }}
              />
              <Pressable
                onPress={() => logWeightMutation.mutate()}
                disabled={!weightInput || logWeightMutation.isPending}
                style={{ backgroundColor: weightInput ? colors.brand[500] : colors.neutral[200], borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: weightInput ? '#fff' : colors.neutral[400] }}>
                  {logWeightMutation.isPending ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Check-in Modal */}
      <Modal visible={showCheckInModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCheckInModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] }}>
            <Text style={{ ...typography.title3, color: colors.neutral[900] }}>Weekly check-in</Text>
            <Pressable onPress={() => setShowCheckInModal(false)} hitSlop={8}>
              <Text style={{ fontSize: 22, color: colors.neutral[500] }}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Weight (kg)</Text>
            <TextInput
              value={checkIn.weight_kg}
              onChangeText={(v) => setCheckIn((c) => ({ ...c, weight_kg: v.replace(/[^0-9.]/g, '') }))}
              keyboardType="decimal-pad"
              placeholder={latestWeight?.toFixed(1) ?? '80.0'}
              placeholderTextColor={colors.neutral[300]}
              style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 18, fontWeight: '700', color: colors.neutral[900], textAlign: 'center', marginBottom: 20 }}
            />
            <RatingRow label="Energy level" value={checkIn.energy_level} onChange={(v) => setCheckIn((c) => ({ ...c, energy_level: v }))} />
            <RatingRow label="Mood" value={checkIn.mood_score} onChange={(v) => setCheckIn((c) => ({ ...c, mood_score: v }))} />
            <RatingRow label="Sleep quality" value={checkIn.sleep_quality} onChange={(v) => setCheckIn((c) => ({ ...c, sleep_quality: v }))} />
            <RatingRow label="Training performance" value={checkIn.training_performance} onChange={(v) => setCheckIn((c) => ({ ...c, training_performance: v }))} />
            <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, marginBottom: 6 }}>Notes (optional)</Text>
            <TextInput
              value={checkIn.notes}
              onChangeText={(v) => setCheckIn((c) => ({ ...c, notes: v }))}
              placeholder="How's the week going?"
              placeholderTextColor={colors.neutral[300]}
              multiline
              numberOfLines={3}
              style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.neutral[900], minHeight: 80, textAlignVertical: 'top', marginBottom: 24 }}
            />
            <Pressable
              onPress={() => checkInMutation.mutate()}
              disabled={checkInMutation.isPending}
              style={{ backgroundColor: colors.brand[500], borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                {checkInMutation.isPending ? 'Saving…' : 'Save check-in'}
              </Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
