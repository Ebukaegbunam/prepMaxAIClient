// Home — prep-progress hero, today's workout, meals, missed-info, conditional steps, week strip
const { StatBar, Card, Button, Pill, DayChip } = window.PrepAIComponents;
const HT = window.PrepAITheme;

function HomeScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || HT.colors.brand[500];

  // Prep state
  const weekNum = 4, totalWeeks = 16, weeksOut = 12;
  const weekProgress = weekNum / totalWeeks;

  // Adherence this week (each pillar 0-100)
  const adherence = [
    { k: 'Workouts', v: 100, hint: '4/4 logged' },
    { k: 'Nutrition', v: 92, hint: '6/7 days hit' },
    { k: 'Cardio',    v: 70, hint: '2/3 sessions' },
  ];
  const overall = Math.round(adherence.reduce((s, a) => s + a.v, 0) / adherence.length);

  // Missed-info queue (only renders if non-empty)
  const missing = [
    { id: 'cardio_mon', icon: 'flame', label: 'Cardio · Monday', detail: 'Did you do incline walk?' },
    { id: 'weight_yest', icon: 'scale', label: 'Weight · Yesterday', detail: 'No reading logged' },
  ];

  // Steps target only renders when non-zero (conditional)
  const stepsTargetToday = 8000;
  const stepsTaken = 4210;

  return (
    <div style={{ background: HT.colors.neutral[50], minHeight: '100%', paddingBottom: 96, fontFamily: HT.font }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ ...HT.type.footnote, color: HT.colors.neutral[500], textTransform: 'uppercase' }}>Tuesday · Apr 27</div>
          <div style={{ ...HT.type.title1, color: HT.colors.neutral[900], marginTop: 2 }}>Good morning, Ebuka</div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 999,
          background: HT.colors.brand[100], color: HT.colors.brand[700],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 15,
        }}>EO</div>
      </div>

      {/* PREP HERO — week + how we're doing */}
      <div style={{ padding: '0 16px' }}>
        <Card padding={0} elevation={1}>
          {/* Top: phase chip + weeks-out */}
          <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Pill tone="brand">Cut · 16 wk</Pill>
            </div>
            <span style={{ ...HT.type.footnote, color: HT.colors.neutral[400], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Show day · Aug 16</span>
          </div>

          {/* Week — big numeral */}
          <div style={{ padding: '0 16px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ ...HT.type.footnote, color: HT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Week</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 56, fontWeight: 700, color: HT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: '60px' }}>{weekNum}</span>
                <span style={{ fontSize: 22, fontWeight: 600, color: HT.colors.neutral[400], fontVariantNumeric: 'tabular-nums' }}>/ {totalWeeks}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...HT.type.footnote, color: HT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weeks out</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: HT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', marginTop: 2 }}>{weeksOut}</div>
            </div>
          </div>

          {/* Phase progress bar */}
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ height: 6, background: HT.colors.neutral[100], borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: `${weekProgress * 100}%`, height: '100%', background: blue, borderRadius: 999, transition: 'width 600ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}/>
              {/* tick markers every 4 weeks */}
              {[0.25, 0.5, 0.75].map((t) => (
                <div key={t} style={{ position: 'absolute', left: `${t * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.7)' }}/>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500] }}>Started Apr 1</span>
              <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500] }}>{Math.round(weekProgress * 100)}% in</span>
            </div>
          </div>

          {/* How we're doing — adherence bars */}
          <div style={{ borderTop: `1px solid ${HT.colors.neutral[100]}`, padding: '14px 16px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ ...HT.type.bodyStrong, color: HT.colors.neutral[900] }}>How we're doing</span>
              <span style={{
                fontSize: 13, fontWeight: 700, color: overall >= 90 ? HT.colors.success[700] : blue,
                fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
              }}>{overall}% on track</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {adherence.map((a) => (
                <div key={a.k}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ ...HT.type.callout, color: HT.colors.neutral[700], fontWeight: 500 }}>{a.k}</span>
                    <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>{a.hint}</span>
                  </div>
                  <div style={{ height: 5, background: HT.colors.neutral[100], borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{
                      width: `${a.v}%`, height: '100%',
                      background: a.v >= 90 ? HT.colors.success[500] : a.v >= 70 ? blue : HT.colors.warning[500],
                      borderRadius: 999, transition: 'width 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* MISSED INFO — only renders when there's something to log */}
      {missing.length > 0 && (
        <div style={{ padding: '12px 16px 0' }}>
          <Card padding={0} elevation={1}>
            <div style={{ padding: '12px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 999,
                  background: HT.colors.warning[50], color: HT.colors.warning[700],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>{missing.length}</div>
                <span style={{ ...HT.type.bodyStrong, color: HT.colors.neutral[900] }}>Catch up</span>
              </div>
              <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500] }}>missed entries</span>
            </div>
            <div>
              {missing.map((m, i) => (
                <button key={m.id} style={{
                  width: '100%', padding: '10px 16px', background: 'transparent',
                  border: 'none', borderTop: `1px solid ${HT.colors.neutral[100]}`,
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', fontFamily: HT.font,
                  borderBottomLeftRadius: i === missing.length - 1 ? 16 : 0,
                  borderBottomRightRadius: i === missing.length - 1 ? 16 : 0,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: HT.colors.warning[50],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon name={m.icon} size={16} color={HT.colors.warning[700]}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...HT.type.callout, color: HT.colors.neutral[900], fontWeight: 600 }}>{m.label}</div>
                    <div style={{ ...HT.type.footnote, color: HT.colors.neutral[500], marginTop: 1 }}>{m.detail}</div>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: blue, padding: '4px 10px', borderRadius: 999,
                    background: HT.colors.brand[50],
                  }}>Log</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Today's workout */}
      <div style={{ padding: '12px 16px 0' }}>
        <Card padding={16} elevation={1}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: HT.colors.brand[50], color: blue,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="dumbbell" size={22} color={blue}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...HT.type.bodyStrong, color: HT.colors.neutral[900] }}>Chest + Side Delts</div>
              <div style={{ ...HT.type.callout, color: HT.colors.neutral[500], marginTop: 2 }}>6 exercises · ~58 min · last: Tue</div>
            </div>
            <Button size="sm" variant="primary" style={{ background: blue }}>Start</Button>
          </div>
        </Card>
      </div>

      {/* Meals — expandable rows with timing + check-off */}
      <div style={{ padding: '12px 16px 0' }}>
        <MealsCard blue={blue}/>
      </div>

      {/* Weight (always) + Steps (only if there's a target today) */}
      <div style={{ padding: '12px 16px 0', display: 'flex', gap: 12 }}>
        <Card padding={14} elevation={1} style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="scale" size={16} color={HT.colors.neutral[600]}/>
            <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weight</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: HT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>92.4</span>
            <span style={{ ...HT.type.callout, color: HT.colors.neutral[400] }}>kg</span>
          </div>
          <div style={{ ...HT.type.footnote, color: HT.colors.success[700], marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="trending" size={11} color={HT.colors.success[500]} strokeWidth={2.5}/> −0.6 kg this week
          </div>
        </Card>

        {stepsTargetToday > 0 && (
          <Card padding={14} elevation={1} style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="footprints" size={16} color={HT.colors.neutral[600]}/>
              <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Steps to hit</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: HT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{(stepsTargetToday - stepsTaken).toLocaleString()}</span>
              <span style={{ ...HT.type.callout, color: HT.colors.neutral[400] }}>left</span>
            </div>
            <div style={{ height: 4, background: HT.colors.neutral[100], borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (stepsTaken / stepsTargetToday) * 100)}%`, height: '100%', background: blue, borderRadius: 999 }}/>
            </div>
          </Card>
        )}
      </div>

      {/* Week strip */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ ...HT.type.footnote, color: HT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 8, padding: '0 4px', letterSpacing: '0.06em' }}>This week</div>
        <Card padding={8} elevation={1}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[
              { d: 'M', n: 26, s: 'logged' },
              { d: 'T', n: 27, s: 'planned', today: true },
              { d: 'W', n: 28, s: 'planned' },
              { d: 'T', n: 29, s: 'rest' },
              { d: 'F', n: 30, s: 'planned' },
              { d: 'S', n: 1, s: 'planned' },
              { d: 'S', n: 2, s: 'planned' },
            ].map((d, i) => <DayChip key={i} day={d.d} num={d.n} status={d.s} isToday={d.today}/>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;

// ─── Meals card with per-meal time, expand-to-detail, and check-off ───────────
function MealsCard({ blue }) {
  const [meals, setMeals] = React.useState([
    { id: 'b',  i: 'coffee', label: 'Breakfast', time: '7:30 AM',  kcal: 540, p: 38, c: 62, f: 18, done: true,
      items: ['Oats + whey', '2 eggs', 'Berries', 'Black coffee'] },
    { id: 'pre', i: 'apple', label: 'Pre-workout', time: '11:00 AM', kcal: 320, p: 22, c: 48, f: 6, done: true,
      items: ['Banana', 'Rice cakes + honey', 'Espresso'] },
    { id: 'post', i: 'beef',  label: 'Post-workout', time: '2:15 PM', kcal: 720, p: 52, c: 78, f: 18, done: false,
      items: ['Chicken thigh 220g', 'Jasmine rice 1.5c', 'Broccoli', 'Soy + sesame'] },
    { id: 'sn', i: 'cookie', label: 'Snack', time: '5:30 PM', kcal: 180, p: 18, c: 12, f: 8, done: false,
      items: ['Greek yogurt', 'Walnuts'] },
  ]);
  const [openId, setOpenId] = React.useState('post');

  const target = 2480;
  const left = Math.max(0, target - meals.filter((m) => m.done).reduce((s, m) => s + m.kcal, 0));
  const completed = meals.filter((m) => m.done).length;

  const toggleDone = (id) => setMeals((p) => p.map((m) => m.id === id ? { ...m, done: !m.done } : m));
  const toggleOpen = (id) => setOpenId((p) => p === id ? null : id);

  return (
    <Card padding={0} elevation={1}>
      <div style={{ padding: '14px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...HT.type.bodyStrong, color: HT.colors.neutral[900] }}>Meals</span>
        <span style={{ ...HT.type.callout, color: HT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>
          {left} kcal left · {completed} of {meals.length}
        </span>
      </div>

      <div>
        {meals.map((m, idx) => {
          const open = openId === m.id;
          const last = idx === meals.length - 1;
          return (
            <div key={m.id} style={{
              borderTop: `1px solid ${HT.colors.neutral[100]}`,
              transition: 'background 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              background: open ? HT.colors.neutral[50] : 'transparent',
              borderBottomLeftRadius: last ? 16 : 0,
              borderBottomRightRadius: last ? 16 : 0,
            }}>
              <button
                onClick={() => toggleOpen(m.id)}
                style={{
                  width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
                  display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
                  fontFamily: HT.font,
                }}
              >
                <div
                  role="button"
                  onClick={(e) => { e.stopPropagation(); toggleDone(m.id); }}
                  style={{
                    width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                    background: m.done ? blue : 'transparent',
                    border: m.done ? 'none' : `1.5px solid ${HT.colors.neutral[300]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 180ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  {m.done && <Icon name="check" size={14} color="#fff" strokeWidth={3}/>}
                </div>

                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: m.done ? HT.colors.brand[50] : HT.colors.neutral[100],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon name={m.i} size={18} color={m.done ? blue : HT.colors.neutral[500]}/>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    ...HT.type.bodyStrong,
                    color: m.done ? HT.colors.neutral[500] : HT.colors.neutral[900],
                    textDecoration: m.done ? 'line-through' : 'none',
                    textDecorationColor: HT.colors.neutral[300],
                  }}>{m.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                    <Icon name="clock" size={11} color={HT.colors.neutral[400]} strokeWidth={2}/>
                    <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>{m.time}</span>
                    <span style={{ color: HT.colors.neutral[300] }}>·</span>
                    <span style={{ ...HT.type.footnote, color: HT.colors.neutral[500] }}>{m.items.length} items</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700,
                    color: m.done ? HT.colors.neutral[400] : HT.colors.neutral[900],
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em',
                  }}>{m.kcal}</span>
                  <Icon
                    name="chevron-down"
                    size={16}
                    color={HT.colors.neutral[400]}
                    style={{ transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </div>
              </button>

              <div style={{
                maxHeight: open ? 280 : 0, overflow: 'hidden',
                transition: 'max-height 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}>
                <div style={{ padding: '0 16px 14px 64px' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    {[
                      { k: 'P', v: m.p, c: blue },
                      { k: 'C', v: m.c, c: HT.colors.brand[400] },
                      { k: 'F', v: m.f, c: HT.colors.brand[300] },
                    ].map((x) => (
                      <div key={x.k} style={{
                        flex: 1, padding: '6px 10px', borderRadius: 8,
                        background: '#fff', border: `1px solid ${HT.colors.neutral[100]}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: x.c, letterSpacing: '0.04em' }}>{x.k}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: HT.colors.neutral[700], fontVariantNumeric: 'tabular-nums' }}>{x.v}g</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {m.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 4, height: 4, borderRadius: 999, background: HT.colors.neutral[300] }}/>
                        <span style={{ ...HT.type.callout, color: HT.colors.neutral[700] }}>{it}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{
                      flex: 1, height: 34, borderRadius: 10,
                      background: m.done ? '#fff' : blue,
                      color: m.done ? HT.colors.neutral[700] : '#fff',
                      border: m.done ? `1px solid ${HT.colors.neutral[200]}` : 'none',
                      fontFamily: HT.font, fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      cursor: 'pointer',
                    }}
                    onClick={(e) => { e.stopPropagation(); toggleDone(m.id); }}
                    >
                      <Icon name={m.done ? 'rotate' : 'check'} size={13} color={m.done ? HT.colors.neutral[700] : '#fff'} strokeWidth={2.5}/>
                      {m.done ? 'Mark not eaten' : 'Mark eaten'}
                    </button>
                    <button style={{
                      height: 34, padding: '0 14px', borderRadius: 10,
                      background: '#fff', color: HT.colors.neutral[700],
                      border: `1px solid ${HT.colors.neutral[200]}`,
                      fontFamily: HT.font, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer',
                    }}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
