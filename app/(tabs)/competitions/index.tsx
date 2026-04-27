import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Check, RotateCcw, ArrowRight } from 'lucide-react-native';
import { colors, typography, tabularNumerals, radius, elevation as elevationStyles } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

type SuggestionKind = 'workout' | 'nutrition' | 'cardio';

type Suggestion = {
  id: string;
  kind: SuggestionKind;
  title: string;
  detail: string;
  impact: string;
  confidence: 'High' | 'Med' | 'Low';
};

const WHY = [
  'Weight ↓ 0.6 kg/wk · on plan',
  'Chest volume hit · back 14/16 sets',
  'RPE on Incline DB averaging 8.5 — room to push',
  'Sleep flagged 5.4h Tue · recovery factor',
];

const SUGGESTIONS: Suggestion[] = [
  { id: 's1', kind: 'workout',   title: 'Add 2 sets of Pulldowns on Wed',         detail: 'Back lagging vs target (14 → 16 sets). Slot before rows.',                  impact: '+2 sets back', confidence: 'High' },
  { id: 's2', kind: 'workout',   title: 'Bump Incline DB working weight to 35kg',  detail: 'Last 3 sessions hit 32.5kg × 8 at RPE 8.5. Time to load.',                  impact: '+2.5kg',       confidence: 'High' },
  { id: 's3', kind: 'nutrition', title: 'Hold calories at 2480',                   detail: 'Rate of loss is right at 0.6 kg/wk — no cut needed yet.',                    impact: 'No change',    confidence: 'Med' },
  { id: 's4', kind: 'cardio',    title: 'Drop Sat cardio · sleep debt',            detail: 'Sleep < 6h three nights. Recovery > NEAT this week.',                        impact: '−30 min cardio', confidence: 'Med' },
];

const KIND_COLOR: Record<SuggestionKind, string> = {
  workout:   colors.brand[500],
  nutrition: colors.success[500],
  cardio:    colors.warning[500],
};

const RETHINK_CHIPS = ['Less back volume', 'More legs', 'Coach said push waist', 'I felt drained Tue', 'Travel Sat'];

export default function CompetitionsTab() {
  const [accepted, setAccepted] = useState<Set<string>>(new Set(['s2']));

  const toggle = (id: string) => {
    setAccepted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Weekly review · Sun</Text>
            <Text style={{ ...typography.title2, color: colors.neutral[900] }}>AI suggestions</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.brand[50] }}>
            <Sparkles size={11} color={colors.brand[500]} strokeWidth={2.5} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.brand[500], letterSpacing: 0.48 }}>4 NEW</Text>
          </View>
        </View>

        {/* Why now */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Card elevation={1} padding={14}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 8 }}>Based on this week</Text>
            <View style={{ gap: 6 }}>
              {WHY.map((w, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <View style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: colors.brand[500], marginTop: 8, flexShrink: 0 }} />
                  <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[700], flex: 1 }}>{w}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Suggestions */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 8, paddingHorizontal: 4 }}>
            Proposed changes · pick what you'll apply
          </Text>
          <View style={{ gap: 8 }}>
            {SUGGESTIONS.map((s) => {
              const on = accepted.has(s.id);
              const kc = KIND_COLOR[s.kind];
              return (
                <Pressable
                  key={s.id}
                  onPress={() => toggle(s.id)}
                  style={[{ backgroundColor: colors.neutral[0], borderRadius: radius.lg, borderLeftWidth: 3, borderLeftColor: on ? kc : colors.neutral[200] }, elevationStyles[1]]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 }}>
                    {/* Checkbox */}
                    <View style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: on ? kc : 'transparent', borderWidth: on ? 0 : 1.5, borderColor: colors.neutral[300], alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 }}>
                      {on && <Check size={13} color="#fff" strokeWidth={3} />}
                    </View>

                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: kc }}>{s.kind}</Text>
                        <Text style={{ color: colors.neutral[300] }}>·</Text>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.6 }}>{s.confidence} confidence</Text>
                      </View>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900], marginBottom: 4 }}>{s.title}</Text>
                      <Text style={{ fontSize: 13, lineHeight: 20, fontWeight: '500', color: colors.neutral[600] }}>{s.detail}</Text>
                      <View style={{ marginTop: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: colors.neutral[50], borderWidth: 1, borderColor: colors.neutral[100], alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.neutral[700], ...tabularNumerals }}>{s.impact}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Re-think */}
          <Card elevation={1} padding={14} style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={14} color={colors.brand[500]} strokeWidth={2} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>Ask AI to re-think</Text>
            </View>
            <Text style={{ fontSize: 13, lineHeight: 20, fontWeight: '500', color: colors.neutral[600], marginBottom: 10 }}>
              What should we focus on, or what did your real coach mention?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {RETHINK_CHIPS.map((c, i) => (
                <Pressable key={i} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.neutral[50], borderWidth: 1, borderColor: colors.neutral[200] }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: colors.neutral[700] }}>{c}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ borderRadius: 10, borderWidth: 1, borderColor: colors.neutral[200], backgroundColor: colors.neutral[50], padding: 12, minHeight: 60, marginBottom: 10 }}>
              <Text style={{ fontSize: 14, color: colors.neutral[400] }}>Optional · what should the AI focus on this round?</Text>
            </View>
            <Pressable style={{ height: 42, borderRadius: 10, backgroundColor: colors.neutral[0], borderWidth: 1, borderColor: colors.brand[100], flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <RotateCcw size={14} color={colors.brand[500]} strokeWidth={2.5} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.brand[500] }}>Re-think · uses 1 credit</Text>
            </Pressable>
          </Card>
        </View>
      </ScrollView>

      {/* Sticky apply bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 32, backgroundColor: 'rgba(255,255,255,0.96)', borderTopWidth: 1, borderTopColor: colors.neutral[100], flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Selected</Text>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900], ...tabularNumerals }}>{accepted.size} of {SUGGESTIONS.length} changes</Text>
        </View>
        <Button
          variant="primary"
          size="md"
          disabled={accepted.size === 0}
          icon={<ArrowRight size={15} color="#fff" strokeWidth={2.5} />}
        >
          Apply
        </Button>
      </View>
    </SafeAreaView>
  );
}
