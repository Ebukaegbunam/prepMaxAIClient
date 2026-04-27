import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Dumbbell, Check, ChevronDown, Clock, Scale, Footprints, TrendingDown, Flame, RotateCcw } from 'lucide-react-native';
import { colors, typography, tabularNumerals, motion, radius } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { DayChip } from '@/components/ui/DayChip';

// ─── Stub data ──────────────────────────────────────────────────────────────

const WEEK_NUM = 4;
const TOTAL_WEEKS = 16;
const WEEKS_OUT = 12;
const WEEK_PROGRESS = WEEK_NUM / TOTAL_WEEKS;

const ADHERENCE = [
  { k: 'Workouts',  v: 100, hint: '4/4 logged' },
  { k: 'Nutrition', v: 92,  hint: '6/7 days hit' },
  { k: 'Cardio',    v: 70,  hint: '2/3 sessions' },
];

const OVERALL = Math.round(ADHERENCE.reduce((s, a) => s + a.v, 0) / ADHERENCE.length);

const MISSING = [
  { id: 'cardio_mon',  label: 'Cardio · Monday',    detail: 'Did you do incline walk?' },
  { id: 'weight_yest', label: 'Weight · Yesterday',  detail: 'No reading logged' },
];

const WEEK_DAYS = [
  { d: 'M', n: 26, s: 'logged'  as const },
  { d: 'T', n: 27, s: 'planned' as const, today: true },
  { d: 'W', n: 28, s: 'planned' as const },
  { d: 'T', n: 29, s: 'rest'    as const },
  { d: 'F', n: 30, s: 'planned' as const },
  { d: 'S', n: 1,  s: 'planned' as const },
  { d: 'S', n: 2,  s: 'planned' as const },
];

const STEPS_TARGET = 8000;
const STEPS_TAKEN  = 4210;

// ─── Phase progress bar ─────────────────────────────────────────────────────

function PhaseBar({ progress }: { progress: number }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(progress * 100, { duration: motion.duration.chart, easing: Easing.out(Easing.cubic) });
  }, [progress]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as `${number}%` }));
  return (
    <View style={{ height: 6, backgroundColor: colors.neutral[100], borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: colors.brand[500], borderRadius: 999 }, barStyle]} />
      {[0.25, 0.5, 0.75].map((t) => (
        <View key={t} style={{ position: 'absolute', left: `${t * 100}%` as `${number}%`, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.7)' }} />
      ))}
    </View>
  );
}

// ─── Adherence bar ──────────────────────────────────────────────────────────

function AdherenceBar({ v, k, hint }: { v: number; k: string; hint: string }) {
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(v, { duration: motion.duration.chart, easing: Easing.out(Easing.cubic) });
  }, [v]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as `${number}%` }));
  const barColor = v >= 90 ? colors.success[500] : v >= 70 ? colors.brand[500] : colors.warning[500];

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[700] }}>{k}</Text>
        <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500], ...tabularNumerals }}>{hint}</Text>
      </View>
      <View style={{ height: 5, backgroundColor: colors.neutral[100], borderRadius: 999, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: barColor, borderRadius: 999 }, barStyle]} />
      </View>
    </View>
  );
}

// ─── Prep Hero card ─────────────────────────────────────────────────────────

function PrepHeroCard() {
  return (
    <Card elevation={1} padding={0}>
      {/* Phase chip + show date */}
      <View style={{ padding: 16, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Pill tone="brand">Cut · 16 wk</Pill>
        <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[400], textTransform: 'uppercase', letterSpacing: 0.66 }}>
          Show day · Aug 16
        </Text>
      </View>

      {/* Week numeral + weeks out */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>
            Week
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 2 }}>
            <Text style={{ fontSize: 56, fontWeight: '700', color: colors.neutral[900], lineHeight: 60, letterSpacing: -1.68, ...tabularNumerals }}>
              {WEEK_NUM}
            </Text>
            <Text style={{ fontSize: 22, fontWeight: '600', color: colors.neutral[400], ...tabularNumerals, paddingBottom: 4 }}>
              / {TOTAL_WEEKS}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>
            Weeks out
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '700', color: colors.neutral[900], letterSpacing: -0.64, marginTop: 2, ...tabularNumerals }}>
            {WEEKS_OUT}
          </Text>
        </View>
      </View>

      {/* Phase progress bar */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <PhaseBar progress={WEEK_PROGRESS} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500] }}>Started Apr 1</Text>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500] }}>{Math.round(WEEK_PROGRESS * 100)}% in</Text>
        </View>
      </View>

      {/* Adherence */}
      <View style={{ borderTopWidth: 1, borderTopColor: colors.neutral[100], paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>How we're doing</Text>
          <Text style={{ fontSize: 13, fontWeight: '700', color: OVERALL >= 90 ? colors.success[700] : colors.brand[500], ...tabularNumerals, letterSpacing: -0.13 }}>
            {OVERALL}% on track
          </Text>
        </View>
        <View style={{ gap: 10 }}>
          {ADHERENCE.map((a) => <AdherenceBar key={a.k} {...a} />)}
        </View>
      </View>
    </Card>
  );
}

// ─── Meals card ─────────────────────────────────────────────────────────────

type Meal = {
  id: string;
  label: string;
  time: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  done: boolean;
  items: string[];
};

const INITIAL_MEALS: Meal[] = [
  { id: 'b',    label: 'Breakfast',     time: '7:30 AM',  kcal: 540, p: 38, c: 62, f: 18, done: true,
    items: ['Oats + whey', '2 eggs', 'Berries', 'Black coffee'] },
  { id: 'pre',  label: 'Pre-workout',   time: '11:00 AM', kcal: 320, p: 22, c: 48, f: 6,  done: true,
    items: ['Banana', 'Rice cakes + honey', 'Espresso'] },
  { id: 'post', label: 'Post-workout',  time: '2:15 PM',  kcal: 720, p: 52, c: 78, f: 18, done: false,
    items: ['Chicken thigh 220g', 'Jasmine rice 1.5c', 'Broccoli', 'Soy + sesame'] },
  { id: 'sn',   label: 'Snack',         time: '5:30 PM',  kcal: 180, p: 18, c: 12, f: 8,  done: false,
    items: ['Greek yogurt', 'Walnuts'] },
];

function MealRow({ meal, isOpen, isLast, onToggleOpen, onToggleDone }: {
  meal: Meal;
  isOpen: boolean;
  isLast: boolean;
  onToggleOpen: () => void;
  onToggleDone: () => void;
}) {
  const expandedHeight = 16 + 40 + (meal.items.length * 26) + 16 + 42 + 14;
  const height = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  useEffect(() => {
    height.value = withTiming(isOpen ? expandedHeight : 0, { duration: motion.duration.medium, easing: Easing.out(Easing.cubic) });
    chevronRotation.value = withSpring(isOpen ? 180 : 0, { damping: 20, stiffness: 200 });
  }, [isOpen]);

  const expandStyle = useAnimatedStyle(() => ({ height: height.value, overflow: 'hidden' }));
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${chevronRotation.value}deg` }] }));

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: colors.neutral[100], backgroundColor: isOpen ? colors.neutral[50] : 'transparent', borderBottomLeftRadius: isLast ? radius.lg : 0, borderBottomRightRadius: isLast ? radius.lg : 0 }}>
      <Pressable onPress={onToggleOpen} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingVertical: 12 }}>
        {/* Check circle */}
        <Pressable
          onPress={onToggleDone}
          hitSlop={8}
          style={{
            width: 26, height: 26, borderRadius: 999,
            backgroundColor: meal.done ? colors.brand[500] : 'transparent',
            borderWidth: meal.done ? 0 : 1.5,
            borderColor: colors.neutral[300],
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {meal.done && <Check size={14} color="#fff" strokeWidth={3} />}
        </Pressable>

        {/* Icon box */}
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: meal.done ? colors.brand[50] : colors.neutral[100], alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Dumbbell size={18} color={meal.done ? colors.brand[500] : colors.neutral[500]} strokeWidth={2} />
        </View>

        {/* Label + time */}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: meal.done ? colors.neutral[500] : colors.neutral[900], textDecorationLine: meal.done ? 'line-through' : 'none' }}>
            {meal.label}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Clock size={11} color={colors.neutral[400]} strokeWidth={2} />
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], ...tabularNumerals }}>{meal.time}</Text>
            <Text style={{ color: colors.neutral[300] }}>·</Text>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500] }}>{meal.items.length} items</Text>
          </View>
        </View>

        {/* Kcal + chevron */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: meal.done ? colors.neutral[400] : colors.neutral[900], ...tabularNumerals, letterSpacing: -0.15 }}>
            {meal.kcal}
          </Text>
          <Animated.View style={chevronStyle}>
            <ChevronDown size={16} color={colors.neutral[400]} strokeWidth={2} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Expanded detail */}
      <Animated.View style={expandStyle}>
        <View style={{ paddingLeft: 64, paddingRight: 16, paddingBottom: 14 }}>
          {/* Macro chips */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            {[
              { k: 'P', v: meal.p, c: colors.brand[500] },
              { k: 'C', v: meal.c, c: colors.brand[400] },
              { k: 'F', v: meal.f, c: colors.brand[300] },
            ].map((x) => (
              <View key={x.k} style={{ flex: 1, padding: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.neutral[100], flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: x.c, letterSpacing: 0.44 }}>{x.k}</Text>
                <Text style={{ fontSize: 12, fontWeight: '600', color: colors.neutral[700], ...tabularNumerals }}>{x.v}g</Text>
              </View>
            ))}
          </View>

          {/* Food items */}
          <View style={{ gap: 6, marginBottom: 12 }}>
            {meal.items.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: colors.neutral[300] }} />
                <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[700] }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={onToggleDone}
              style={{
                flex: 1, height: 34, borderRadius: 10,
                backgroundColor: meal.done ? '#fff' : colors.brand[500],
                borderWidth: meal.done ? 1 : 0,
                borderColor: colors.neutral[200],
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {meal.done
                ? <RotateCcw size={13} color={colors.neutral[700]} strokeWidth={2.5} />
                : <Check size={13} color="#fff" strokeWidth={2.5} />}
              <Text style={{ fontSize: 13, fontWeight: '600', color: meal.done ? colors.neutral[700] : '#fff' }}>
                {meal.done ? 'Mark not eaten' : 'Mark eaten'}
              </Text>
            </Pressable>
            <Pressable style={{ height: 34, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.neutral[200], alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.neutral[700] }}>Edit</Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function MealsCard() {
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [openId, setOpenId] = useState<string | null>('post');

  const TARGET = 2480;
  const eaten = meals.filter((m) => m.done).reduce((s, m) => s + m.kcal, 0);
  const left = Math.max(0, TARGET - eaten);
  const completed = meals.filter((m) => m.done).length;

  const toggleDone = (id: string) => setMeals((p) => p.map((m) => m.id === id ? { ...m, done: !m.done } : m));
  const toggleOpen = (id: string) => setOpenId((p) => p === id ? null : id);

  return (
    <Card elevation={1} padding={0}>
      <View style={{ padding: 16, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>Meals</Text>
        <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[500], ...tabularNumerals }}>
          {left} kcal left · {completed} of {meals.length}
        </Text>
      </View>
      {meals.map((m, i) => (
        <MealRow
          key={m.id}
          meal={m}
          isOpen={openId === m.id}
          isLast={i === meals.length - 1}
          onToggleOpen={() => toggleOpen(m.id)}
          onToggleDone={() => toggleDone(m.id)}
        />
      ))}
    </Card>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function HomeTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>
              Tuesday · Apr 27
            </Text>
            <Text style={{ ...typography.title1, color: colors.neutral[900], marginTop: 2 }}>Good morning, Ebuka</Text>
          </View>
          <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: colors.brand[100], alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.brand[700] }}>EO</Text>
          </View>
        </View>

        {/* Prep hero */}
        <View style={{ paddingHorizontal: 16 }}>
          <PrepHeroCard />
        </View>

        {/* Catch up — missed info */}
        {MISSING.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <Card elevation={1} padding={0}>
              <View style={{ padding: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 999, backgroundColor: colors.warning[50], alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: colors.warning[700] }}>{MISSING.length}</Text>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>Catch up</Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500] }}>missed entries</Text>
              </View>
              {MISSING.map((m, i) => (
                <Pressable key={m.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.neutral[100] }}>
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.warning[50], alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Flame size={16} color={colors.warning[700]} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.neutral[900] }}>{m.label}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], marginTop: 1 }}>{m.detail}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.brand[50] }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.brand[500] }}>Log</Text>
                  </View>
                </Pressable>
              ))}
            </Card>
          </View>
        )}

        {/* Today's workout */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Card elevation={1} padding={16}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.brand[50], alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={22} color={colors.brand[500]} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>Chest + Side Delts</Text>
                <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[500], marginTop: 2 }}>6 exercises · ~58 min · last: Tue</Text>
              </View>
              <Button size="sm" variant="primary">Start</Button>
            </View>
          </Card>
        </View>

        {/* Meals */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <MealsCard />
        </View>

        {/* Weight + Steps */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', gap: 12 }}>
          <Card elevation={1} padding={14} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Scale size={16} color={colors.neutral[600]} strokeWidth={2} />
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Weight</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.neutral[900], letterSpacing: -0.22, ...tabularNumerals }}>92.4</Text>
              <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[400], paddingBottom: 2 }}>kg</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
              <TrendingDown size={11} color={colors.success[500]} strokeWidth={2.5} />
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.success[700] }}>−0.6 kg this week</Text>
            </View>
          </Card>

          <Card elevation={1} padding={14} style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Footprints size={16} color={colors.neutral[600]} strokeWidth={2} />
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Steps to hit</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: colors.neutral[900], letterSpacing: -0.22, ...tabularNumerals }}>
                {(STEPS_TARGET - STEPS_TAKEN).toLocaleString()}
              </Text>
              <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[400], paddingBottom: 2 }}>left</Text>
            </View>
            <View style={{ height: 4, backgroundColor: colors.neutral[100], borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
              <View style={{ width: `${Math.min(100, (STEPS_TAKEN / STEPS_TARGET) * 100)}%` as `${number}%`, height: '100%', backgroundColor: colors.brand[500], borderRadius: 999 }} />
            </View>
          </Card>
        </View>

        {/* Week strip */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 8, paddingHorizontal: 4 }}>
            This week
          </Text>
          <Card elevation={1} padding={8}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {WEEK_DAYS.map((d) => (
                <DayChip key={d.d + d.n} day={d.d} num={d.n} status={d.s} isToday={'today' in d ? d.today : false} />
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
