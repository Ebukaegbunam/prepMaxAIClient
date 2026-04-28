import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getCurrentPrep } from '@/api/endpoints/preps';
import { getWorkoutTemplate, startSession } from '@/api/endpoints/workouts';
import { useWorkoutSessionStore } from '@/state/workout-session-store';
import { colors, typography, radius, elevation } from '@/constants/theme';

export default function DayScreen() {
  const { day: dayId, prepId } = useLocalSearchParams<{ day: string; prepId: string }>();
  const router = useRouter();
  const startActiveSession = useWorkoutSessionStore((s) => s.startSession);

  const { data: template, isLoading } = useQuery({
    queryKey: ['workout-template', prepId],
    queryFn: async () => {
      const prep = await import('@/api/endpoints/preps').then((m) => m.getCurrentPrep());
      return import('@/api/endpoints/workouts').then((m) => m.getWorkoutTemplate(prep.id));
    },
    enabled: !!prepId,
  });

  const day = template?.days.find((d) => d.id === dayId);

  const handleStart = async () => {
    if (!day || !prepId) return;
    try {
      const session = await startSession(prepId, day.id);
      startActiveSession({
        sessionId: session.id,
        prepId,
        dayId: day.id,
        dayName: day.name,
        exercises: day.exercises,
        currentIdx: 0,
      });
      router.push('/(tabs)/workouts/session');
    } catch {
      // If backend fails (no template yet), start a local-only session
      startActiveSession({
        sessionId: `local-${Date.now()}`,
        prepId: prepId ?? '',
        dayId: day.id,
        dayName: day.name,
        exercises: day.exercises,
        currentIdx: 0,
      });
      router.push('/(tabs)/workouts/session');
    }
  };

  if (isLoading || !day) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand[500]} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 }}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 28, color: colors.neutral[600], lineHeight: 32 }}>‹</Text>
        </Pressable>
        <View>
          <Text style={{ ...typography.title2, color: colors.neutral[900] }}>{day.name}</Text>
          {day.notes && (
            <Text style={{ ...typography.footnote, color: colors.neutral[500] }}>{day.notes}</Text>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {day.exercises.map((ex, i) => (
          <View
            key={ex.id}
            style={{
              borderRadius: radius.md,
              backgroundColor: colors.neutral[0],
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.neutral[100],
              ...elevation[1],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={{
                width: 28, height: 28, borderRadius: 8,
                backgroundColor: colors.brand[50],
                alignItems: 'center', justifyContent: 'center',
                marginTop: 1,
              }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.brand[500] }}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...typography.body, fontWeight: '700', color: colors.neutral[900] }}>{ex.name}</Text>
                <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 3 }}>
                  {ex.sets} sets · {ex.reps_min === ex.reps_max ? `${ex.reps_min}` : `${ex.reps_min}–${ex.reps_max}`} reps
                  {ex.rpe_target != null ? ` · RPE ${ex.rpe_target}` : ''}
                  {ex.rest_seconds != null ? ` · ${ex.rest_seconds}s rest` : ''}
                </Text>
                {ex.notes && (
                  <Text style={{ ...typography.footnote, color: colors.neutral[400], marginTop: 4, fontStyle: 'italic' }}>{ex.notes}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Start button pinned to bottom */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.neutral[0], paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.neutral[100] }}>
        <Pressable
          onPress={handleStart}
          style={{ backgroundColor: colors.brand[500], borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', ...elevation[2] }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>Start workout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
