import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchCompetitions } from '@/api/endpoints/competitions';
import { api } from '@/api/client';
import { colors, typography, radius, elevation } from '@/constants/theme';

interface SavedCompetition {
  id: string;
  competition_id: string;
  saved_at: string;
  snapshot: {
    name: string;
    date: string;
    city: string | null;
    federation: string;
    divisions: string[];
  };
}

async function getSavedCompetitions(): Promise<SavedCompetition[]> {
  return api.get<SavedCompetition[]>('competitions/saved');
}

async function saveCompetition(id: string): Promise<void> {
  await api.post(`competitions/${id}/save`, {});
}

async function unsaveCompetition(id: string): Promise<void> {
  await api.delete(`competitions/${id}/save`);
}

export default function CompetitionsScreen() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');

  const { data: saved, isLoading: savedLoading, refetch: refetchSaved } = useQuery({
    queryKey: ['saved-competitions'],
    queryFn: getSavedCompetitions,
  });

  const { data: results, isFetching } = useQuery({
    queryKey: ['competitions-search', q],
    queryFn: () => searchCompetitions({ q: q || undefined, after_date: new Date().toISOString().split('T')[0] }),
    staleTime: 1000 * 60 * 5,
  });

  const saveMutation = useMutation({
    mutationFn: saveCompetition,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-competitions'] }),
    onError: () => Alert.alert('Failed to save competition'),
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveCompetition,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-competitions'] }),
  });

  const savedIds = new Set(saved?.map((s) => s.competition_id) ?? []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ ...typography.title1, color: colors.neutral[900] }}>Competitions</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetchSaved} tintColor={colors.brand[500]} />}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Saved competitions */}
        {saved && saved.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
              Saved shows
            </Text>
            {saved.map((s) => (
              <View
                key={s.id}
                style={{ borderRadius: radius.md, backgroundColor: colors.neutral[0], padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.brand[100], ...elevation[1] }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typography.body, fontWeight: '700', color: colors.neutral[900] }}>{s.snapshot.name}</Text>
                    <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 2 }}>
                      {s.snapshot.date} · {s.snapshot.city ?? '—'} · {s.snapshot.federation}
                    </Text>
                    {s.snapshot.divisions.length > 0 && (
                      <Text style={{ ...typography.footnote, color: colors.neutral[400], marginTop: 2 }}>
                        {s.snapshot.divisions.join(', ')}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    onPress={() => unsaveMutation.mutate(s.competition_id)}
                    style={{ marginLeft: 12, padding: 6 }}
                    hitSlop={8}
                  >
                    <Text style={{ fontSize: 18 }}>🔖</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Search */}
        <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
          Find competitions
        </Text>
        <View style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, marginBottom: 12, backgroundColor: colors.neutral[0], flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by name, city, federation…"
            placeholderTextColor={colors.neutral[400]}
            style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.neutral[900] }}
            returnKeyType="search"
          />
          {isFetching && <ActivityIndicator size="small" color={colors.brand[500]} />}
        </View>

        {results?.map((comp) => {
          const isSaved = savedIds.has(comp.id);
          return (
            <View
              key={comp.id}
              style={{ borderRadius: radius.md, backgroundColor: colors.neutral[0], padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.neutral[100], ...elevation[0] }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{ ...typography.body, fontWeight: '700', color: colors.neutral[900] }}>{comp.name}</Text>
                  <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 2 }}>
                    {comp.date} · {comp.city ?? comp.country} · {comp.federation}
                  </Text>
                  {comp.divisions.length > 0 && (
                    <Text style={{ ...typography.footnote, color: colors.neutral[400], marginTop: 2 }}>
                      {comp.divisions.slice(0, 3).join(', ')}{comp.divisions.length > 3 ? ` +${comp.divisions.length - 3}` : ''}
                    </Text>
                  )}
                </View>
                <Pressable
                  onPress={() => isSaved ? unsaveMutation.mutate(comp.id) : saveMutation.mutate(comp.id)}
                  style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.md, backgroundColor: isSaved ? colors.brand[50] : colors.neutral[100], borderWidth: 1, borderColor: isSaved ? colors.brand[200] : colors.neutral[200] }}
                  hitSlop={8}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: isSaved ? colors.brand[600] : colors.neutral[600] }}>
                    {isSaved ? 'Saved' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {results?.length === 0 && !isFetching && (
          <Text style={{ ...typography.body, color: colors.neutral[400], textAlign: 'center', paddingVertical: 32 }}>
            No competitions found.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
