import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getCurrentPrep } from '@/api/endpoints/preps';
import { NewPrepModal } from '@/components/NewPrepModal';
import { getWorkoutTemplate } from '@/api/endpoints/workouts';
import { colors, typography, radius, elevation } from '@/constants/theme';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WorkoutsScreen() {
  const router = useRouter();
  const [showNewPrep, setShowNewPrep] = useState(false);
  const todayDow = new Date().getDay();

  const { data: prep, isLoading: prepLoading, refetch } = useQuery({
    queryKey: ['prep-current'],
    queryFn: getCurrentPrep,
  });

  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ['workout-template', prep?.id],
    queryFn: () => getWorkoutTemplate(prep!.id),
    enabled: !!prep?.id,
  });

  const isLoading = prepLoading || templateLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand[500]} size="large" />
      </SafeAreaView>
    );
  }

  if (!prep || !template) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🏋️</Text>
        <Text style={{ ...typography.title3, color: colors.neutral[900], textAlign: 'center', marginBottom: 8 }}>
          {!prep ? 'No prep active' : 'No workouts yet'}
        </Text>
        <Text style={{ ...typography.body, color: colors.neutral[500], textAlign: 'center', marginBottom: 28 }}>
          {!prep
            ? 'Create a prep to generate your weekly workout plan.'
            : 'Your workout template is being generated — check back shortly.'}
        </Text>
        {!prep && (
          <Pressable
            onPress={() => setShowNewPrep(true)}
            style={{ backgroundColor: colors.brand[500], borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 36 }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Create prep →</Text>
          </Pressable>
        )}
        <NewPrepModal visible={showNewPrep} onClose={() => setShowNewPrep(false)} />
      </SafeAreaView>
    );
  }

  const daysByDow = Object.fromEntries(template.days.map((d) => [d.day_of_week, d]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ ...typography.title1, color: colors.neutral[900] }}>Workouts</Text>
        <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 2 }}>
          {template.name} · Week {prep.current_week}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.brand[500]} />}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: 7 }, (_, i) => {
          const dow = i; // 0=Sun
          const day = daysByDow[dow];
          const isToday = dow === todayDow;
          const isRest = !day;

          return (
            <Pressable
              key={dow}
              onPress={() => day && router.push({ pathname: '/(tabs)/workouts/[day]', params: { day: day.id, prepId: prep.id } })}
              disabled={isRest}
              style={{
                marginBottom: 10,
                borderRadius: radius.lg,
                backgroundColor: isToday ? colors.brand[500] : colors.neutral[0],
                borderWidth: isToday ? 0 : 1,
                borderColor: colors.neutral[100],
                padding: 16,
                ...elevation[isToday ? 2 : 1],
                opacity: isRest ? 0.45 : 1,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : colors.neutral[100],
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: isToday ? '#fff' : colors.neutral[500] }}>
                      {DAY_NAMES[dow]}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ ...typography.body, fontWeight: '700', color: isToday ? '#fff' : colors.neutral[900] }}>
                      {day ? day.name : 'Rest'}
                    </Text>
                    {day && (
                      <Text style={{ ...typography.footnote, color: isToday ? 'rgba(255,255,255,0.75)' : colors.neutral[400], marginTop: 1 }}>
                        {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}
                      </Text>
                    )}
                  </View>
                </View>
                {day && (
                  <Text style={{ fontSize: 18, color: isToday ? 'rgba(255,255,255,0.7)' : colors.neutral[300] }}>›</Text>
                )}
              </View>

              {day && day.exercises.length > 0 && (
                <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {day.exercises.slice(0, 4).map((ex) => (
                    <View key={ex.id} style={{
                      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
                      backgroundColor: isToday ? 'rgba(255,255,255,0.15)' : colors.neutral[50],
                    }}>
                      <Text style={{ fontSize: 12, color: isToday ? 'rgba(255,255,255,0.9)' : colors.neutral[600], fontWeight: '500' }}>
                        {ex.name}
                      </Text>
                    </View>
                  ))}
                  {day.exercises.length > 4 && (
                    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: isToday ? 'rgba(255,255,255,0.15)' : colors.neutral[50] }}>
                      <Text style={{ fontSize: 12, color: isToday ? 'rgba(255,255,255,0.7)' : colors.neutral[400] }}>
                        +{day.exercises.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
