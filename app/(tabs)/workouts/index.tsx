import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Edit2 } from 'lucide-react-native';
import { colors, typography, tabularNumerals, motion, radius, elevation as elevationStyles } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

type DayState = 'done' | 'today' | 'planned' | 'rest';

type WorkoutDay = {
  d: string;
  n: number;
  focus: string;
  exercises: string[];
  dur: string;
  state: DayState;
};

const WEEK: WorkoutDay[] = [
  { d: 'Mon', n: 26, focus: 'Push',               exercises: ['Bench', 'OHP', 'Incline DB', 'Lateral Raise'],                  dur: '62m',  state: 'done' },
  { d: 'Tue', n: 27, focus: 'Chest + Side Delts',  exercises: ['Incline DB Press', 'Cable Fly', 'Side Lateral', 'Rear Delt'],   dur: '~58m', state: 'today' },
  { d: 'Wed', n: 28, focus: 'Pull',               exercises: ['Pulldown', 'Row', 'Pullover', 'Curls'],                          dur: '~55m', state: 'planned' },
  { d: 'Thu', n: 29, focus: 'Rest + cardio',      exercises: ['30m incline walk'],                                               dur: '30m',  state: 'rest' },
  { d: 'Fri', n: 30, focus: 'Legs',               exercises: ['Squat', 'RDL', 'Leg Press', 'Calf'],                             dur: '~70m', state: 'planned' },
  { d: 'Sat', n: 1,  focus: 'Arms + Delts',       exercises: ['Lateral Raise', 'Curls', 'Triceps', 'Rear Delt'],                dur: '~50m', state: 'planned' },
  { d: 'Sun', n: 2,  focus: 'Rest',               exercises: [],                                                                 dur: '—',   state: 'rest' },
];

const VOLUME = [
  { group: 'Chest',     sets: 16, target: 14, hit: true },
  { group: 'Back',      sets: 14, target: 16, hit: false },
  { group: 'Shoulders', sets: 18, target: 16, hit: true },
  { group: 'Arms',      sets: 12, target: 12, hit: true },
  { group: 'Quads',     sets: 10, target: 12, hit: false },
  { group: 'Hams',      sets: 8,  target: 10, hit: false },
];

function VolumeBar({ sets, target, hit, group }: typeof VOLUME[number]) {
  const pct = Math.min(100, (sets / target) * 100);
  const width = useSharedValue(0);
  useEffect(() => {
    width.value = withTiming(pct, { duration: motion.duration.chart, easing: Easing.out(Easing.cubic) });
  }, [pct]);
  const barStyle = useAnimatedStyle(() => ({ width: `${width.value}%` as `${number}%` }));

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '600', color: colors.neutral[700] }}>{group}</Text>
        <Text style={{ fontSize: 12, fontWeight: '600', color: hit ? colors.success[700] : colors.warning[700], ...tabularNumerals }}>
          {sets} / {target}
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.neutral[100], borderRadius: 999, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: hit ? colors.success[500] : colors.brand[500], borderRadius: 999 }, barStyle]} />
      </View>
    </View>
  );
}

function DayCard({ day }: { day: WorkoutDay }) {
  const [open, setOpen] = useState(day.state === 'today');
  const isDone  = day.state === 'done';
  const isToday = day.state === 'today';
  const isRest  = day.state === 'rest';

  const accent  = isDone ? colors.success[500] : isToday ? colors.brand[500] : colors.neutral[300];
  const labelBg = isToday ? colors.brand[500] : isDone ? colors.success[50] : colors.neutral[100];
  const labelFg = isToday ? '#fff' : isDone ? colors.success[700] : colors.neutral[600];

  return (
    <View style={[{ backgroundColor: colors.neutral[0], borderRadius: radius.lg, borderLeftWidth: 3, borderLeftColor: accent, opacity: isRest && !day.exercises.length ? 0.7 : 1 }, elevationStyles[1]]}>
      <Pressable onPress={() => setOpen((p) => !p)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
        <View style={{ width: 44, height: 48, borderRadius: 10, backgroundColor: labelBg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Text style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: labelFg, opacity: 0.85 }}>{day.d}</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: labelFg, ...tabularNumerals, letterSpacing: -0.18, lineHeight: 20 }}>{day.n}</Text>
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>{day.focus}</Text>
            {isToday && <Pill tone="brand">Today</Pill>}
            {isDone && <Text style={{ fontSize: 10, fontWeight: '700', color: colors.success[700], textTransform: 'uppercase', letterSpacing: 0.6 }}>✓ Done</Text>}
          </View>
          <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.neutral[500] }}>
            {day.exercises.length ? `${day.exercises.length} exercises · ${day.dur}` : 'Rest day'}
          </Text>
        </View>

        {!isRest && (
          <Pressable style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: isToday ? colors.brand[500] : 'transparent', borderWidth: isToday ? 0 : 1, borderColor: colors.brand[100] }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: isToday ? '#fff' : colors.brand[500] }}>
              {isDone ? 'View' : isToday ? 'Start' : 'Open'}
            </Text>
          </Pressable>
        )}
      </Pressable>

      {open && day.exercises.length > 0 && (
        <View style={{ paddingLeft: 70, paddingRight: 14, paddingBottom: 12, gap: 4 }}>
          {day.exercises.map((ex, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: colors.neutral[300] }} />
              <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: '500', color: colors.neutral[700] }}>{ex}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function WorkoutsTab() {
  const done    = WEEK.filter((d) => d.state === 'done').length;
  const rest    = WEEK.filter((d) => d.state === 'rest').length;
  const planned = WEEK.filter((d) => d.state === 'planned' || d.state === 'today').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[50] }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66 }}>Week 4 of 16</Text>
            <Text style={{ ...typography.title1, color: colors.neutral[900], marginTop: 2 }}>Push / Pull / Legs</Text>
          </View>
          <Pressable style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: colors.neutral[0], borderWidth: 1, borderColor: colors.neutral[200], alignItems: 'center', justifyContent: 'center' }}>
            <Edit2 size={16} color={colors.neutral[700]} strokeWidth={2} />
          </Pressable>
        </View>

        {/* Week mini-bars */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Card elevation={1} padding={16}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.neutral[900] }}>This week</Text>
              <Text style={{ fontSize: 11, fontWeight: '500', color: colors.neutral[500], ...tabularNumerals }}>{done} done · {planned} left · {rest} rest</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {WEEK.map((d, i) => {
                const bg = d.state === 'done' ? colors.success[500] : d.state === 'today' ? colors.brand[500] : d.state === 'rest' ? colors.neutral[200] : colors.neutral[100];
                return (
                  <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                    <View style={{ width: '100%', height: 28, borderRadius: 6, backgroundColor: bg, borderWidth: d.state === 'today' ? 2 : 0, borderColor: colors.brand[500] }} />
                    <Text style={{ fontSize: 11, fontWeight: d.state === 'today' ? '700' : '500', color: d.state === 'today' ? colors.brand[500] : colors.neutral[500] }}>{d.d}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Day cards */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 8, paddingHorizontal: 4 }}>Days</Text>
          <View style={{ gap: 8 }}>
            {WEEK.map((d, i) => <DayCard key={i} day={d} />)}
          </View>
        </View>

        {/* Volume by muscle group */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: 0.66, marginBottom: 8, paddingHorizontal: 4 }}>Weekly volume · sets</Text>
          <Card elevation={1} padding={14}>
            <View style={{ gap: 10 }}>
              {VOLUME.map((v) => <VolumeBar key={v.group} {...v} />)}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
