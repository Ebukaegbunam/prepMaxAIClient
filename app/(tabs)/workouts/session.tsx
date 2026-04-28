import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useWorkoutSessionStore } from '@/state/workout-session-store';
import { logSet, completeSession, getExerciseHistory } from '@/api/endpoints/workouts';
import { colors, typography, radius, elevation } from '@/constants/theme';
import { useHaptic } from '@/lib/haptics';

function elapsed(startedAt: number) {
  const secs = Math.floor((Date.now() - startedAt) / 1000);
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SessionScreen() {
  const router = useRouter();
  const haptic = useHaptic();
  const { active, logSet: storeLogSet, advanceExercise, jumpToExercise, endSession } = useWorkoutSessionStore();

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const exercise = active?.exercises[active.currentIdx];
  const loggedSets = exercise ? (active?.loggedSets[exercise.id] ?? []) : [];
  const targetSets = exercise?.sets ?? 0;
  const setsRemaining = targetSets - loggedSets.length;

  const { data: history } = useQuery({
    queryKey: ['ex-history', exercise?.canonical_exercise_id],
    queryFn: () => getExerciseHistory(exercise!.canonical_exercise_id),
    enabled: !!exercise?.canonical_exercise_id,
    staleTime: 1000 * 60 * 10,
  });

  const lastSession = history?.history[0];
  const lastSet = lastSession?.sets[0];

  const handleLogSet = useCallback(async () => {
    if (!active || !exercise) return;
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    if (isNaN(w) || isNaN(r) || r < 1) return;

    setSubmitting(true);
    haptic('setLogged');

    const setData = { weight, reps, rpe };
    storeLogSet(exercise.id, setData);

    try {
      if (!active.sessionId.startsWith('local-')) {
        await logSet(active.sessionId, {
          exercise_id: exercise.id,
          set_number: loggedSets.length + 1,
          weight_kg: w,
          reps: r,
          rpe: rpe ? parseFloat(rpe) : undefined,
        });
      }
    } catch {
      // Optimistic — already in local store
    }

    setSubmitting(false);

    // Auto-clear reps between sets, keep weight
    setReps('');
    setRpe('');

    // Auto-advance when all sets logged
    if (loggedSets.length + 1 >= targetSets) {
      if (active.currentIdx < active.exercises.length - 1) {
        setTimeout(() => {
          advanceExercise();
          setWeight('');
          setReps('');
          setRpe('');
        }, 400);
      }
    }
  }, [active, exercise, weight, reps, rpe, loggedSets.length, targetSets]);

  const handleFinish = () => {
    Alert.alert(
      'Finish workout?',
      `${active?.exercises.length ?? 0} exercises logged.`,
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            if (active && !active.sessionId.startsWith('local-')) {
              try { await completeSession(active.sessionId); } catch { /* ignore */ }
            }
            endSession();
            haptic('workoutComplete');
            router.replace('/(tabs)/workouts');
          },
        },
      ],
    );
  };

  if (!active || !exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...typography.body, color: colors.neutral[500] }}>No active session.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
          <View>
            <Text style={{ ...typography.title3, color: colors.neutral[900] }}>{active.dayName}</Text>
            <Text style={{ ...typography.footnote, color: colors.neutral[400] }}>
              {elapsed(active.startedAt)} · {active.currentIdx + 1}/{active.exercises.length}
            </Text>
          </View>
          <Pressable onPress={handleFinish} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.md, backgroundColor: colors.neutral[900] }}>
            <Text style={{ ...typography.footnote, fontWeight: '700', color: '#fff' }}>Finish</Text>
          </Pressable>
        </View>

        {/* Exercise progress strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 6, paddingBottom: 8 }}>
          {active.exercises.map((ex, i) => {
            const done = (active.loggedSets[ex.id]?.length ?? 0) >= ex.sets;
            const isCurrent = i === active.currentIdx;
            return (
              <Pressable
                key={ex.id}
                onPress={() => jumpToExercise(i)}
                style={{
                  paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
                  backgroundColor: isCurrent ? colors.brand[500] : done ? colors.neutral[200] : colors.neutral[100],
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: isCurrent ? '#fff' : done ? colors.neutral[500] : colors.neutral[600] }}>
                  {ex.name.length > 14 ? ex.name.slice(0, 13) + '…' : ex.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Current exercise card */}
          <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, marginBottom: 14, ...elevation[1] }}>
            <Text style={{ ...typography.title2, color: colors.neutral[900] }}>{exercise.name}</Text>
            <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 4 }}>
              {exercise.sets} sets · {exercise.reps_min === exercise.reps_max ? `${exercise.reps_min}` : `${exercise.reps_min}–${exercise.reps_max}`} reps
              {exercise.rpe_target != null ? ` · RPE ${exercise.rpe_target}` : ''}
            </Text>

            {lastSet && (
              <View style={{ marginTop: 10, padding: 10, borderRadius: radius.sm, backgroundColor: colors.neutral[50] }}>
                <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600', marginBottom: 2 }}>Last session</Text>
                <Text style={{ ...typography.footnote, color: colors.neutral[700] }}>
                  {lastSet.weight_kg} kg × {lastSet.reps} reps{lastSet.rpe != null ? ` @ RPE ${lastSet.rpe}` : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Logged sets */}
          {loggedSets.length > 0 && (
            <View style={{ marginBottom: 14 }}>
              <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Logged ({loggedSets.length}/{targetSets})
              </Text>
              {loggedSets.map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand[500], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{i + 1}</Text>
                  </View>
                  <Text style={{ ...typography.body, color: colors.neutral[900] }}>
                    {s.weight} kg × {s.reps} reps{s.rpe ? ` @ RPE ${s.rpe}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Log next set */}
          {setsRemaining > 0 && (
            <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, ...elevation[1] }}>
              <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Set {loggedSets.length + 1} of {targetSets}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600', marginBottom: 6 }}>Weight (kg)</Text>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholder={lastSet ? String(lastSet.weight_kg) : '0'}
                    placeholderTextColor={colors.neutral[300]}
                    style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 18, fontWeight: '700', color: colors.neutral[900], textAlign: 'center' }}
                    returnKeyType="next"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600', marginBottom: 6 }}>Reps</Text>
                  <TextInput
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="number-pad"
                    placeholder={lastSet ? String(lastSet.reps) : '0'}
                    placeholderTextColor={colors.neutral[300]}
                    style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 18, fontWeight: '700', color: colors.neutral[900], textAlign: 'center' }}
                    returnKeyType="next"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '600', marginBottom: 6 }}>RPE</Text>
                  <TextInput
                    value={rpe}
                    onChangeText={setRpe}
                    keyboardType="decimal-pad"
                    placeholder="8"
                    placeholderTextColor={colors.neutral[300]}
                    style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 18, fontWeight: '700', color: colors.neutral[900], textAlign: 'center' }}
                    returnKeyType="done"
                    onSubmitEditing={handleLogSet}
                  />
                </View>
              </View>
              <Pressable
                onPress={handleLogSet}
                disabled={submitting || !weight || !reps}
                style={{
                  backgroundColor: weight && reps ? colors.brand[500] : colors.neutral[200],
                  borderRadius: radius.md, paddingVertical: 15, alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: weight && reps ? '#fff' : colors.neutral[400] }}>
                  Log Set {loggedSets.length + 1}
                </Text>
              </Pressable>
            </View>
          )}

          {setsRemaining === 0 && active.currentIdx < active.exercises.length - 1 && (
            <Pressable
              onPress={() => { advanceExercise(); setWeight(''); setReps(''); setRpe(''); }}
              style={{ borderRadius: radius.lg, backgroundColor: colors.brand[50], padding: 18, alignItems: 'center', borderWidth: 1, borderColor: colors.brand[200] }}
            >
              <Text style={{ ...typography.body, fontWeight: '700', color: colors.brand[600] }}>
                Next: {active.exercises[active.currentIdx + 1].name} →
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
