import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentPrep } from '@/api/endpoints/preps';
import { getDailyMacros, getWeeklyPlan, logMeal } from '@/api/endpoints/meals';
import { StatBar } from '@/components/ui';
import { colors, typography, radius, elevation } from '@/constants/theme';

function today() { return new Date().toISOString().split('T')[0]; }

const SLOTS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'pre_workout', label: 'Pre-workout' },
  { key: 'post_workout', label: 'Post-workout' },
  { key: 'snack_1', label: 'Snack 1' },
  { key: 'snack_2', label: 'Snack 2' },
] as const;

type SlotKey = typeof SLOTS[number]['key'];

interface LogForm {
  slot: SlotKey;
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function FoodScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<LogForm>({ slot: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' });

  const { data: prep, isLoading: prepLoading } = useQuery({ queryKey: ['prep-current'], queryFn: getCurrentPrep });

  const { data: plan } = useQuery({
    queryKey: ['weekly-plan', prep?.id],
    queryFn: () => getWeeklyPlan(prep!.id),
    enabled: !!prep?.id,
  });

  const { data: macros, isLoading: macrosLoading, refetch } = useQuery({
    queryKey: ['daily-macros', prep?.id, today()],
    queryFn: () => getDailyMacros(prep!.id, today()),
    enabled: !!prep?.id,
  });

  const logMutation = useMutation({
    mutationFn: () => logMeal(prep!.id, {
      eaten_at: new Date().toISOString(),
      slot: form.slot,
      name: form.name.trim(),
      calories: parseFloat(form.calories) || 0,
      protein_g: parseFloat(form.protein) || 0,
      carbs_g: parseFloat(form.carbs) || 0,
      fat_g: parseFloat(form.fat) || 0,
      source: 'freeform',
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-macros'] });
      setShowModal(false);
      setForm({ slot: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' });
    },
    onError: () => Alert.alert('Failed to log meal', 'Check your connection and try again.'),
  });

  const isLoading = prepLoading || macrosLoading;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand[500]} size="large" />
      </SafeAreaView>
    );
  }

  if (!prep) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50], alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🥗</Text>
        <Text style={{ ...typography.title3, color: colors.neutral[900], textAlign: 'center', marginBottom: 8 }}>No prep active</Text>
        <Text style={{ ...typography.body, color: colors.neutral[500], textAlign: 'center', marginBottom: 28 }}>
          Create a prep to unlock meal tracking and macro targets.
        </Text>
        <Pressable
          onPress={() => router.push('/new-prep')}
          style={{ backgroundColor: colors.brand[500], borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 36 }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Create prep →</Text>
        </Pressable>
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

  const loggedBySlot = Object.groupBy(macros?.logs ?? [], (l) => l.slot);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ ...typography.title1, color: colors.neutral[900] }}>Food</Text>
        <Pressable
          onPress={() => setShowModal(true)}
          style={{ backgroundColor: colors.brand[500], paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.md, ...elevation[1] }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>+ Log meal</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.brand[500]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Macro summary card */}
        <View style={{ borderRadius: radius.lg, backgroundColor: colors.neutral[0], padding: 18, marginBottom: 16, ...elevation[1] }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 14 }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: colors.neutral[900] }}>{Math.round(caloriesLogged)}</Text>
            <Text style={{ ...typography.body, color: colors.neutral[400], marginLeft: 6 }}>/ {Math.round(caloriesTarget)} kcal</Text>
            <Text style={{ ...typography.footnote, color: caloriesLogged > caloriesTarget ? '#EF4444' : colors.brand[500], fontWeight: '700', marginLeft: 'auto' }}>
              {Math.round(caloriesTarget - caloriesLogged)} left
            </Text>
          </View>
          <StatBar label="Protein" value={proteinLogged} max={proteinTarget} color={colors.brand[500]} suffix="g" />
          <StatBar label="Carbs" value={carbsLogged} max={carbsTarget} color="#F59E0B" suffix="g" />
          <StatBar label="Fat" value={fatLogged} max={fatTarget} color="#EF4444" suffix="g" />
        </View>

        {/* Meal slots */}
        {SLOTS.map(({ key, label }) => {
          const entries = loggedBySlot[key] ?? [];
          return (
            <View key={key} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ ...typography.footnote, color: colors.neutral[500], fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {label}
                </Text>
                {entries.length > 0 && (
                  <Text style={{ ...typography.footnote, color: colors.neutral[400] }}>
                    {Math.round(entries.reduce((s, e) => s + e.calories, 0))} kcal
                  </Text>
                )}
              </View>

              {entries.length === 0 ? (
                <Pressable
                  onPress={() => { setForm((f) => ({ ...f, slot: key })); setShowModal(true); }}
                  style={{ borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.neutral[100], borderStyle: 'dashed', padding: 14, alignItems: 'center' }}
                >
                  <Text style={{ ...typography.footnote, color: colors.neutral[400] }}>Tap to log {label.toLowerCase()}</Text>
                </Pressable>
              ) : (
                <View style={{ borderRadius: radius.md, backgroundColor: colors.neutral[0], borderWidth: 1, borderColor: colors.neutral[100], overflow: 'hidden' }}>
                  {entries.map((entry, i) => (
                    <View key={entry.id} style={{ padding: 12, borderBottomWidth: i < entries.length - 1 ? 1 : 0, borderBottomColor: colors.neutral[50] }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...typography.body, fontWeight: '600', color: colors.neutral[900], flex: 1 }}>{entry.name}</Text>
                        <Text style={{ ...typography.body, color: colors.neutral[500], fontWeight: '700' }}>{Math.round(entry.calories)} kcal</Text>
                      </View>
                      <Text style={{ ...typography.footnote, color: colors.neutral[400], marginTop: 2 }}>
                        P: {Math.round(entry.protein_g)}g · C: {Math.round(entry.carbs_g)}g · F: {Math.round(entry.fat_g)}g
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Log Meal Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] }}>
              <Text style={{ ...typography.title3, color: colors.neutral[900] }}>Log meal</Text>
              <Pressable onPress={() => setShowModal(false)} hitSlop={8}>
                <Text style={{ fontSize: 22, color: colors.neutral[500] }}>✕</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
              {/* Slot selector */}
              <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Meal slot</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {SLOTS.map(({ key, label }) => (
                    <Pressable
                      key={key}
                      onPress={() => setForm((f) => ({ ...f, slot: key }))}
                      style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1.5, borderColor: form.slot === key ? colors.brand[500] : colors.neutral[200], backgroundColor: form.slot === key ? colors.brand[50] : colors.neutral[0] }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '600', color: form.slot === key ? colors.brand[600] : colors.neutral[600] }}>{label}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              {/* Name */}
              <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Food / meal name</Text>
              <TextInput
                value={form.name}
                onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Chicken + rice bowl"
                placeholderTextColor={colors.neutral[300]}
                style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16, color: colors.neutral[900], marginBottom: 16 }}
                returnKeyType="next"
              />

              {/* Macros */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
                {[
                  { key: 'calories', label: 'Calories', placeholder: '450' },
                  { key: 'protein', label: 'Protein (g)', placeholder: '40' },
                  { key: 'carbs', label: 'Carbs (g)', placeholder: '50' },
                  { key: 'fat', label: 'Fat (g)', placeholder: '8' },
                ].map(({ key, label, placeholder }) => (
                  <View key={key} style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, color: colors.neutral[500], fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>{label}</Text>
                    <TextInput
                      value={form[key as keyof LogForm]}
                      onChangeText={(v) => setForm((f) => ({ ...f, [key]: v.replace(/[^0-9.]/g, '') }))}
                      keyboardType="decimal-pad"
                      placeholder={placeholder}
                      placeholderTextColor={colors.neutral[300]}
                      style={{ borderWidth: 1, borderColor: colors.neutral[200], borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 12, fontSize: 15, fontWeight: '700', color: colors.neutral[900], textAlign: 'center' }}
                    />
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => logMutation.mutate()}
                disabled={!form.name.trim() || logMutation.isPending}
                style={{ backgroundColor: form.name.trim() ? colors.brand[500] : colors.neutral[200], borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 16, fontWeight: '700', color: form.name.trim() ? '#fff' : colors.neutral[400] }}>
                  {logMutation.isPending ? 'Logging…' : 'Log meal'}
                </Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
