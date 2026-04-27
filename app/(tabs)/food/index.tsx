import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Sparkles, ChevronRight, Plus, ArrowRight } from 'lucide-react-native';
import { colors, typography, tabularNumerals, motion, radius, elevation as elevationStyles } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { StatBar } from '@/components/ui/StatBar';
import { Check } from 'lucide-react-native';

type MealState = 'logged' | 'planned';

type Meal = {
  slot: string;
  time: string;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  state: MealState;
};

const MEALS: Meal[] = [
  { slot: 'Breakfast',    time: '7:30 AM',  name: 'Oats, whey, banana',          kcal: 540, p: 42, c: 78, f: 8,  state: 'logged' },
  { slot: 'Pre-workout',  time: '11:00 AM', name: 'Rice cakes + jam',             kcal: 320, p: 8,  c: 64, f: 2,  state: 'logged' },
  { slot: 'Post-workout', time: '1:30 PM',  name: 'Chicken, rice, broccoli',      kcal: 720, p: 62, c: 84, f: 14, state: 'planned' },
  { slot: 'Snack',        time: '4:30 PM',  name: 'Greek yogurt + berries',       kcal: 220, p: 22, c: 18, f: 4,  state: 'planned' },
  { slot: 'Dinner',       time: '7:30 PM',  name: 'Salmon, sweet potato',         kcal: 680, p: 48, c: 56, f: 24, state: 'planned' },
];

const CONSUMED = 860;
const TARGET = 2480;

function CalorieBar({ consumed, target }: { consumed: number; target: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming((consumed / target) * 100, { duration: motion.duration.chart, easing: Easing.out(Easing.cubic) });
  }, [consumed, target]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as `${number}%` }));
  return (
    <View style={{ height: 6, backgroundColor: colors.neutral[100], borderRadius: 999, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: colors.brand[500], borderRadius: 999 }, barStyle]} />
    </View>
  );
}

function MealRow({ meal }: { meal: Meal }) {
  const logged = meal.state === 'logged';
  return (
    <Pressable style={[{ backgroundColor: colors.neutral[0], borderRadius: radius.lg }, elevationStyles[1]]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
        {/* Icon box with badge */}
        <View style={{ position: 'relative' }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: logged ? colors.brand[50] : colors.neutral[50], alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>🍽</Text>
          </View>
          {logged && (
            <View style={{ position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 999, backgroundColor: colors.success[500], borderWidth: 2, borderColor: colors.neutral[0], alignItems: 'center', justifyContent: 'center' }}>
              <Check size={8} color="#fff" strokeWidth={4} />
            </View>
          )}
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>{meal.slot}</Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[400], ...tabularNumerals }}>{meal.time}</Text>
          </View>
          <Text style={{ fontSize: 15, fontWeight: '600', color: logged ? colors.neutral[700] : colors.neutral[900], marginTop: 2, opacity: logged ? 0.7 : 1 }} numberOfLines={1}>{meal.name}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.neutral[700], ...tabularNumerals }}>{meal.kcal}<Text style={{ color: colors.neutral[400], fontWeight: '500' }}> kcal</Text></Text>
            <Text style={{ fontSize: 12, color: colors.neutral[500], ...tabularNumerals }}>P {meal.p}</Text>
            <Text style={{ fontSize: 12, color: colors.neutral[500], ...tabularNumerals }}>C {meal.c}</Text>
            <Text style={{ fontSize: 12, color: colors.neutral[500], ...tabularNumerals }}>F {meal.f}</Text>
          </View>
        </View>

        <ChevronRight size={18} color={colors.neutral[300]} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

export default function FoodTab() {
  const remaining = TARGET - CONSUMED;
  const logged = MEALS.filter((m) => m.state === 'logged').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Today's plan</Text>
            <Text style={{ ...typography.title1, color: colors.neutral[900], marginTop: 2 }}>Food</Text>
          </View>
          <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.neutral[0], borderWidth: 1, borderColor: colors.neutral[200], paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 }}>
            <Sparkles size={14} color={colors.brand[500]} strokeWidth={2} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.neutral[700] }}>Plan week</Text>
          </Pressable>
        </View>

        {/* Targets card */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <Card elevation={1} padding={16}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
              <View>
                <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Calories</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 2 }}>
                  <Text style={{ fontSize: 32, fontWeight: '700', color: colors.neutral[900], letterSpacing: -0.64, ...tabularNumerals }}>{CONSUMED.toLocaleString()}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: colors.neutral[400], paddingBottom: 4 }}>/ {TARGET.toLocaleString()}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Remaining</Text>
                <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand[500], letterSpacing: -0.22, marginTop: 2, ...tabularNumerals }}>
                  {remaining.toLocaleString()}
                </Text>
              </View>
            </View>

            <CalorieBar consumed={CONSUMED} target={TARGET} />

            <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
              <StatBar value={142} max={210} label="Protein" color={colors.brand[500]} />
              <StatBar value={186} max={248} label="Carbs" color={colors.brand[400]} />
              <StatBar value={48} max={68} label="Fat" color={colors.brand[300]} />
            </View>
          </Card>
        </View>

        {/* Meal list */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Meals</Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[400] }}>{logged} of {MEALS.length} logged</Text>
          </View>
          <View style={{ gap: 8 }}>
            {MEALS.map((m, i) => <MealRow key={i} meal={m} />)}
          </View>
        </View>

        {/* Add freeform */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Pressable style={{ paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, backgroundColor: colors.neutral[0], borderWidth: 1, borderColor: colors.neutral[300], borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Plus size={18} color={colors.neutral[500]} strokeWidth={2.5} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[600] }}>Add freeform meal</Text>
          </Pressable>
        </View>

        {/* Coach prompts */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 8, paddingHorizontal: 4 }}>Ask coach</Text>
          <View style={{ gap: 8 }}>
            {[
              'What can I eat with my remaining macros?',
              'Find restaurants near me',
            ].map((label, i) => (
              <Card key={i} elevation={1} padding={14} onPress={() => {}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: colors.brand[50], alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color={colors.brand[500]} strokeWidth={2} />
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[800], flex: 1 }}>{label}</Text>
                  <ArrowRight size={16} color={colors.neutral[400]} strokeWidth={2} />
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
