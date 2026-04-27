import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Check, Dumbbell, Moon, Zap, Sparkles, ArrowRight } from 'lucide-react-native';
import { colors, typography, tabularNumerals, radius, elevation as elevationStyles } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

const PHOTOS = [
  { angle: 'Front',  captured: true },
  { angle: 'Side L', captured: true },
  { angle: 'Side R', captured: false },
  { angle: 'Back',   captured: false },
];

const STEPS = ['Weight', 'Measurements', 'Photos', 'Ratings'];

const RATINGS_CONFIG = [
  { key: 'mood',     label: 'Mood',             icon: Sparkles },
  { key: 'energy',   label: 'Energy',            icon: Zap },
  { key: 'sleep',    label: 'Sleep',             icon: Moon },
  { key: 'training', label: 'Training quality',  icon: Dumbbell },
];

export default function ProgressTab() {
  const [ratings, setRatings] = useState<Record<string, number>>({ mood: 4, energy: 3, sleep: 4, training: 5 });
  const activeStep = 2;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Week 4 check-in</Text>
            <Text style={{ ...typography.title2, color: colors.neutral[900] }}>Sunday, Apr 27</Text>
          </View>
          <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], ...tabularNumerals }}>3 of 4</Text>
        </View>

        {/* Step progress dots */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20, flexDirection: 'row', gap: 6 }}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: i < activeStep ? colors.brand[500] : i === activeStep ? colors.brand[300] : colors.neutral[200] }}
            />
          ))}
        </View>

        {/* Completed steps recap */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', gap: 8 }}>
          <Card elevation={1} padding={12} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: colors.success[500], alignItems: 'center', justifyContent: 'center' }}>
                <Check size={11} color="#fff" strokeWidth={3} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Weight</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 6 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.neutral[900], letterSpacing: -0.22, ...tabularNumerals }}>92.4</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.neutral[400], paddingBottom: 2 }}>kg</Text>
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.success[700], paddingBottom: 2, marginLeft: 4 }}>−0.6</Text>
            </View>
          </Card>
          <Card elevation={1} padding={12} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 18, height: 18, borderRadius: 999, backgroundColor: colors.success[500], alignItems: 'center', justifyContent: 'center' }}>
                <Check size={11} color="#fff" strokeWidth={3} />
              </View>
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Measurements</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 6 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.neutral[900], letterSpacing: -0.22, ...tabularNumerals }}>7</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.neutral[400], paddingBottom: 2 }}>logged</Text>
            </View>
          </Card>
        </View>

        {/* Active step header */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <Text style={{ ...typography.title1, color: colors.neutral[900] }}>Progress photos</Text>
          <Text style={{ fontSize: 15, lineHeight: 20, fontWeight: '400', color: colors.neutral[500], marginTop: 4 }}>
            Same lighting, same angle, neutral pose. The AI compares week-over-week.
          </Text>
        </View>

        {/* Photo grid */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {PHOTOS.map((p, i) => (
              <Pressable
                key={i}
                style={{ width: '47%', aspectRatio: 3 / 4, borderRadius: 14, overflow: 'hidden', backgroundColor: p.captured ? colors.neutral[400] : colors.neutral[100], borderWidth: p.captured ? 0 : 1.5, borderColor: colors.neutral[300], borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}
              >
                {!p.captured && (
                  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <View style={{ opacity: 0.4 }}>
                      {/* Silhouette placeholder */}
                      <View style={{ width: 36, height: 36, borderRadius: 999, borderWidth: 1.5, borderColor: colors.neutral[400] }} />
                      <View style={{ width: 36, height: 54, borderWidth: 1.5, borderColor: colors.neutral[400], borderRadius: 10, marginTop: 4 }} />
                    </View>
                  </View>
                )}

                {p.captured && (
                  <View style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 999, backgroundColor: colors.success[500], borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} color="#fff" strokeWidth={3} />
                  </View>
                )}

                {!p.captured && (
                  <View style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 999, backgroundColor: colors.brand[500], alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={14} color="#fff" strokeWidth={2} />
                  </View>
                )}

                <View style={{ position: 'absolute', bottom: 8, left: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: p.captured ? '#fff' : colors.neutral[600] }}>{p.angle}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Ratings */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Card elevation={1} padding={16}>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 12 }}>How was this week?</Text>
            {RATINGS_CONFIG.map((r, i) => {
              const Icon = r.icon;
              return (
                <View key={r.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.neutral[100] }}>
                  <Icon size={16} color={colors.neutral[500]} strokeWidth={2} />
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[800], flex: 1 }}>{r.label}</Text>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Pressable
                        key={v}
                        onPress={() => setRatings((p) => ({ ...p, [r.key]: v }))}
                        style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: v <= ratings[r.key] ? colors.brand[500] : colors.neutral[100] }}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </Card>
        </View>

        {/* Bottom actions */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20, flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Button variant="outline" size="lg" full>Skip step</Button>
          </View>
          <View style={{ flex: 2 }}>
            <Button variant="primary" size="lg" full icon={<ArrowRight size={18} color="#fff" strokeWidth={2} />}>
              Submit check-in
            </Button>
          </View>
        </View>

        <View style={{ paddingTop: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[400] }}>AI weekly report generates after submit · usually 30s</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
