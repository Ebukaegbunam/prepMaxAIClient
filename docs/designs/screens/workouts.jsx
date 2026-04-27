// Workouts — week overview with day cards, volume per muscle group, deload toggle
const WT = window.PrepAITheme;
const { Card: WCard, Pill: WPill } = window.PrepAIComponents;

function WorkoutsWeekScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || WT.colors.brand[500];

  const week = [
    { d: 'Mon', n: 26, focus: 'Push', exercises: ['Bench', 'OHP', 'Incline DB', 'Lateral Raise'], dur: '62m', state: 'done', vol: 'A' },
    { d: 'Tue', n: 27, focus: 'Chest + Side Delts', exercises: ['Incline DB Press', 'Cable Fly', 'Side Lateral', 'Rear Delt'], dur: '~58m', state: 'today', vol: 'A' },
    { d: 'Wed', n: 28, focus: 'Pull', exercises: ['Pulldown', 'Row', 'Pullover', 'Curls'], dur: '~55m', state: 'planned', vol: 'A' },
    { d: 'Thu', n: 29, focus: 'Rest + cardio', exercises: ['30m incline walk'], dur: '30m', state: 'rest', vol: 'C' },
    { d: 'Fri', n: 30, focus: 'Legs', exercises: ['Squat', 'RDL', 'Leg Press', 'Calf'], dur: '~70m', state: 'planned', vol: 'A' },
    { d: 'Sat', n: 1,  focus: 'Arms + Delts', exercises: ['Lateral Raise', 'Curls', 'Triceps', 'Rear Delt'], dur: '~50m', state: 'planned', vol: 'B' },
    { d: 'Sun', n: 2,  focus: 'Rest', exercises: [], dur: '—', state: 'rest', vol: '—' },
  ];

  // Volume by muscle group this week (sets)
  const volume = [
    { group: 'Chest',     sets: 16, target: 14, hit: true },
    { group: 'Back',      sets: 14, target: 16, hit: false },
    { group: 'Shoulders', sets: 18, target: 16, hit: true },
    { group: 'Arms',      sets: 12, target: 12, hit: true },
    { group: 'Quads',     sets: 10, target: 12, hit: false },
    { group: 'Hams',      sets: 8,  target: 10, hit: false },
  ];

  return (
    <div style={{ background: WT.colors.neutral[50], minHeight: '100%', fontFamily: WT.font, paddingBottom: 96 }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ ...WT.type.footnote, color: WT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Week 4 of 16</div>
          <div style={{ ...WT.type.title1, color: WT.colors.neutral[900], marginTop: 2 }}>Push / Pull / Legs</div>
        </div>
        <button style={{
          width: 40, height: 40, borderRadius: 999,
          background: WT.colors.neutral[0], border: `1px solid ${WT.colors.neutral[200]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <Icon name="edit" size={16} color={WT.colors.neutral[700]}/>
        </button>
      </div>

      {/* Week summary card */}
      <div style={{ padding: '0 16px 12px' }}>
        <WCard padding={16} elevation={1}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{ ...WT.type.bodyStrong, color: WT.colors.neutral[900] }}>This week</span>
            <span style={{ ...WT.type.footnote, color: WT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>1 done · 4 left · 2 rest</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {week.map((d, i) => {
              const c = d.state === 'done' ? WT.colors.success[500]
                : d.state === 'today' ? blue
                : d.state === 'rest' ? WT.colors.neutral[200]
                : WT.colors.neutral[100];
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', height: 28, borderRadius: 6, background: c,
                    border: d.state === 'today' ? `2px solid ${blue}` : 'none',
                    boxShadow: d.state === 'today' ? `0 4px 12px ${blue}40` : 'none',
                  }}/>
                  <span style={{ ...WT.type.footnote, color: d.state === 'today' ? blue : WT.colors.neutral[500], fontWeight: d.state === 'today' ? 700 : 500 }}>{d.d}</span>
                </div>
              );
            })}
          </div>
        </WCard>
      </div>

      {/* Day cards */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ ...WT.type.footnote, color: WT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 8, padding: '0 4px', letterSpacing: '0.06em', fontWeight: 600 }}>Days</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {week.map((d, i) => <DayCard key={i} day={d} blue={blue}/>)}
        </div>
      </div>

      {/* Volume by muscle group */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ ...WT.type.footnote, color: WT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 8, padding: '0 4px', letterSpacing: '0.06em', fontWeight: 600 }}>Weekly volume · sets</div>
        <WCard padding={14} elevation={1}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {volume.map((v) => {
              const pct = Math.min(120, (v.sets / v.target) * 100);
              return (
                <div key={v.group}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ ...WT.type.callout, color: WT.colors.neutral[700], fontWeight: 600 }}>{v.group}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: v.hit ? WT.colors.success[700] : WT.colors.warning[700], fontVariantNumeric: 'tabular-nums' }}>
                      {v.sets} / {v.target}
                    </span>
                  </div>
                  <div style={{ height: 6, background: WT.colors.neutral[100], borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      width: `${Math.min(100, pct)}%`, height: '100%',
                      background: v.hit ? WT.colors.success[500] : blue,
                      borderRadius: 999, transition: 'width 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}/>
                    {/* target marker */}
                    <div style={{ position: 'absolute', left: '100%', top: -2, bottom: -2, width: 2, background: WT.colors.neutral[400], transform: 'translateX(-1px)' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </WCard>
      </div>
    </div>
  );
}

function DayCard({ day, blue }) {
  const [open, setOpen] = React.useState(day.state === 'today');
  const isDone = day.state === 'done';
  const isToday = day.state === 'today';
  const isRest = day.state === 'rest';

  const accent = isDone ? WT.colors.success[500] : isToday ? blue : WT.colors.neutral[300];

  return (
    <WCard padding={0} elevation={1} style={{
      borderLeft: `3px solid ${accent}`,
      opacity: isRest && !day.exercises.length ? 0.7 : 1,
    }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}
        style={{
          width: '100%', padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
          fontFamily: WT.font,
        }}>
        {/* Day chip */}
        <div style={{
          width: 44, height: 48, borderRadius: 10,
          background: isToday ? blue : isDone ? WT.colors.success[50] : WT.colors.neutral[100],
          color: isToday ? '#fff' : isDone ? WT.colors.success[700] : WT.colors.neutral[600],
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>{day.d}</span>
          <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: '20px' }}>{day.n}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ ...WT.type.bodyStrong, color: WT.colors.neutral[900] }}>{day.focus}</span>
            {isToday && <WPill tone="brand">Today</WPill>}
            {isDone && <span style={{ fontSize: 10, fontWeight: 700, color: WT.colors.success[700], textTransform: 'uppercase', letterSpacing: '0.06em' }}>✓ Done</span>}
          </div>
          <div style={{ ...WT.type.footnote, color: WT.colors.neutral[500] }}>
            {day.exercises.length ? `${day.exercises.length} exercises · ${day.dur}` : 'Rest day'}
          </div>
        </div>

        {!isRest && (
          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isToday ? blue : 'transparent',
              color: isToday ? '#fff' : blue,
              border: isToday ? 'none' : `1px solid ${WT.colors.brand[100]}`,
              padding: '6px 14px', borderRadius: 999, cursor: 'pointer',
              fontFamily: WT.font, fontSize: 13, fontWeight: 700,
            }}>
            {isDone ? 'View' : isToday ? 'Start' : 'Open'}
          </button>
        )}
      </div>

      {/* Expanded exercise list */}
      {open && day.exercises.length > 0 && (
        <div style={{ padding: '0 14px 12px 70px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {day.exercises.map((ex, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 4, borderRadius: 999, background: WT.colors.neutral[300] }}/>
              <span style={{ ...WT.type.callout, color: WT.colors.neutral[700] }}>{ex}</span>
            </div>
          ))}
        </div>
      )}
    </WCard>
  );
}

window.WorkoutsWeekScreen = WorkoutsWeekScreen;
