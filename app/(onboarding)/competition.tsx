import { useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useOnboardingStore } from '@/state/onboarding-store';
import { searchCompetitions } from '@/api/endpoints/competitions';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Field } from '@/components/onboarding/fields';
import { colors, typography, radius } from '@/constants/theme';

export default function CompetitionScreen() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [q, setQ] = useState('');

  const { data: results, isFetching } = useQuery({
    queryKey: ['competitions-search', q, store.division],
    queryFn: () => searchCompetitions({
      q: q || undefined,
      after_date: new Date().toISOString().split('T')[0],
      division: store.division ?? undefined,
    }),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  const select = (id: string, name: string) => {
    store.set({ target_competition_id: id, target_competition_name: name });
  };

  const handleContinue = () => {
    router.push('/(onboarding)/submitting');
  };

  return (
    <OnboardingShell
      step={6}
      title="Target show"
      subtitle="Pick the competition you're prepping for — or skip."
      onContinue={handleContinue}
      continueLabel={store.target_competition_id ? 'Continue' : 'Skip for now'}
      skipLabel="Skip"
      onSkip={handleContinue}
    >
      <Field
        label="Search competitions"
        value={q}
        onChangeText={setQ}
        placeholder="Search by name, city, or federation..."
        returnKeyType="search"
      />

      {isFetching && (
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <ActivityIndicator color={colors.brand[500]} />
        </View>
      )}

      {results?.map((comp) => {
        const selected = store.target_competition_id === comp.id;
        return (
          <Pressable
            key={comp.id}
            onPress={() => select(comp.id, comp.name)}
            style={{
              borderWidth: 1.5,
              borderColor: selected ? colors.brand[500] : colors.neutral[200],
              borderRadius: radius.md,
              padding: 14,
              marginBottom: 10,
              backgroundColor: selected ? colors.brand[50] : colors.neutral[0],
            }}
          >
            <Text style={{ ...typography.body, fontWeight: '700', color: selected ? colors.brand[700] : colors.neutral[900] }}>
              {comp.name}
            </Text>
            <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 2 }}>
              {comp.date} · {comp.city ?? comp.country} · {comp.federation}
            </Text>
          </Pressable>
        );
      })}

      {results?.length === 0 && !isFetching && (
        <Text style={{ ...typography.body, color: colors.neutral[400], textAlign: 'center', paddingVertical: 24 }}>
          No competitions found. You can add one later in Settings.
        </Text>
      )}
    </OnboardingShell>
  );
}
