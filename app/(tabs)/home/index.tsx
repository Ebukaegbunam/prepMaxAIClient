import { View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '@/state/session-store';
import { getCurrentPrep } from '@/api/endpoints/preps';
import { getDailyMacros, getWeeklyPlan } from '@/api/endpoints/meals';
import { getWeightTrend } from '@/api/endpoints/progress';
import { getProfile } from '@/api/endpoints/profile';
import { StatBar } from '@/components/ui';
import { colors, typography, radius, elevation } from '@/constants/theme';

function today() { return new Date().toISOString().split('T')[0]; }

const PHASE_COLORS: Record<string, string> = {
  maintenance: colors.neutral[400],
  cut: colors.brand[500],
  peak: '#F59E0B',
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useSessionStore();

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: getProfile });

  const { data: prep, isLoading: prepLoading, refetch: refetchPrep } = useQuery({
    queryKey: ['prep-current'],
    queryFn: getCurrentPrep,
  });

  const { data: plan } = useQuery({
    queryKey: ['weekly-plan', prep?.id],
    queryFn: () => getWeeklyPlan(prep!.id),
    enabled: !!prep?.id,
  });

  const { data: macros, refetch: refetchMacros } = useQuery({
    queryKey: ['daily-macros', prep?.id, today()],
    queryFn: () => getDailyMacros(prep!.id, today()),
    enabled: !!prep?.id,
  });

  const { data: weightLogs } = useQuery({
    queryKey: ['weight-trend', prep?.id],
    queryFn: () => getWeightTrend(prep!.id),
    enabled: !!prep?.id,
  });

  const onRefresh = () => { refetchPrep(); refetchMacros(); };

  const latestWeight = weightLogs?.[0]?.weight_kg;
  const firstName = profile?.name?.split(' ')[0] ?? user?.name?.split(' ')[0] ?? 'Coach';

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
        <Text style={{ ...typography.title2, color: colors.neutral[700], textAlign: 'center', marginBottom: 12 }}>No active prep</Text>
        <Text style={{ ...typography.body, color: colors.neutral[500], textAlign: 'center' }}>Set up your prep in onboarding.</Text>
      </SafeAreaView>
    );
  }

  const caloriesLogged = macros?.logged.calories ?? 0;
  const caloriesTarget = plan?.daily_calories ?? macros?.targets.calories ?? 2000;
  const proteinLogged = macros?.logged.protein_g ?? 0;
  const proteinTarget = plan?.protein_g ?? macros?.targets.protein_g ?? 180;
  const carbsLogged = macros?.logged.carbs_g ?? 0;
  const carbsTarget = plan?.carbs_g ?? macros?.targets.carbs_g ?? 200;
  const fatLogged = macros?.logged.fat_g ?? 0;
  const fatTarget = plan?.fat_g ?? macros?.targets.fat_g ?? 60;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.brand[500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16 }}>
          <Text style={{ ...typography.title2, color: colors.neutral[900] }}>Hey, {firstName} 👊</Text>
          <Pressable
            onPress={() => router.push('/settings')}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.brand[100], alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 16 }}>⚙️</Text>
          </Pressable>
        </View>

        {/* Prep Hero Card */}
        <View style={{ borderRadius: radius.lg, backgroundColor: colors.brand[500], padding: 20, marginBottom: 16, ...elevation[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 56, fontWeight: '800', color: '#fff', lineHeight: 60 }}>{prep.current_week}</Text>
              <Text style={{ ...typography.footnote, color: 'rgba(255,255,255,0.75)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>
                Week of {prep.prep_length_weeks}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 8 }}>
                <Text style={{ ...typography.footnote, color: '#fff', fontWeight: '700', textTransform: 'uppercase' }}>{prep.current_phase}</Text>
              </View>
              <Text style={{ ...typography.footnote, color: 'rgba(255,255,255,0.75)' }}>{prep.division.replace(/_/g, ' ')}</Text>
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: `${(prep.current_week / prep.prep_length_weeks) * 100}%`, height: '100%', backgroundColor: '#fff', borderRadius: 3 }} />
            </View>
          </View>
          {latestWeight != null && (
            <View style={{ marginTop: 12, flexDirection: 'row', gap: 20 }}>
              <View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Current</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{latestWeight.toFixed(1)} kg</Text>
              </View>
              <View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Target</Text>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>{prep.target_weight_kg.toFixed(1)} kg</Text>
              </View>
            </View>
          )}
        </View>

        {/* Today's Nutrition */}
        <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, marginBottom: 16, ...elevation[1] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ ...typography.title3, color: colors.neutral[900] }}>Today's nutrition</Text>
            <Pressable onPress={() => router.push('/(tabs)/food')}>
              <Text style={{ ...typography.footnote, color: colors.brand[500], fontWeight: '700' }}>Log meal →</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: colors.neutral[900] }}>{Math.round(caloriesLogged)}</Text>
            <Text style={{ ...typography.body, color: colors.neutral[400], marginLeft: 4 }}>/ {Math.round(caloriesTarget)} kcal</Text>
          </View>
          <StatBar label="Protein" value={proteinLogged} max={proteinTarget} color={colors.brand[500]} suffix="g" />
          <StatBar label="Carbs" value={carbsLogged} max={carbsTarget} color="#F59E0B" suffix="g" />
          <StatBar label="Fat" value={fatLogged} max={fatTarget} color="#EF4444" suffix="g" />
        </View>

        {/* Weekly Plan Targets */}
        {plan && (
          <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, marginBottom: 16, ...elevation[1] }}>
            <Text style={{ ...typography.title3, color: colors.neutral[900], marginBottom: 12 }}>Week {prep.current_week} targets</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[
                { label: 'Calories', value: `${Math.round(plan.daily_calories)}` },
                { label: 'Protein', value: `${Math.round(plan.protein_g)}g` },
                { label: 'Steps', value: `${plan.step_floor.toLocaleString()}` },
              ].map(({ label, value }) => (
                <View key={label} style={{ flex: 1, alignItems: 'center', backgroundColor: colors.neutral[50], borderRadius: radius.md, paddingVertical: 12 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.neutral[900] }}>{value}</Text>
                  <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 2 }}>{label}</Text>
                </View>
              ))}
            </View>
            {plan.cardio.frequency_per_week > 0 && (
              <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 10 }}>
                Cardio: {plan.cardio.frequency_per_week}×/wk · {plan.cardio.modality ?? 'any'} · {plan.cardio.duration_min ?? '—'}min
              </Text>
            )}
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => router.push('/(tabs)/workouts')}
            style={{ flex: 1, borderRadius: radius.lg, backgroundColor: colors.neutral[900], padding: 18, ...elevation[2] }}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>🏋️</Text>
            <Text style={{ ...typography.body, fontWeight: '700', color: '#fff' }}>Workouts</Text>
            <Text style={{ ...typography.footnote, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Week {prep.current_week}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/(tabs)/progress')}
            style={{ flex: 1, borderRadius: radius.lg, backgroundColor: colors.brand[50], padding: 18, borderWidth: 1, borderColor: colors.brand[100] }}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>📊</Text>
            <Text style={{ ...typography.body, fontWeight: '700', color: colors.brand[700] }}>Check in</Text>
            <Text style={{ ...typography.footnote, color: colors.brand[500], marginTop: 2 }}>Weekly progress</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
