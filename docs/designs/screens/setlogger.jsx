// Set Logger — single working weight, intense default, edit per set only when different
const SLT = window.PrepAITheme;
const { Card: SLCard, Button: SLButton } = window.PrepAIComponents;

function SetLoggerScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || SLT.colors.brand[500];

  // The plan: working weight (the highest you can hit hard), target reps range
  const targetSets = 4;
  const targetReps = '8–10';
  const lastWorkingWeight = 32.5;

  // Working weight for THIS session — one number governs all sets unless edited
  const [workingWeight, setWorkingWeight] = React.useState(35); // bumped up from last (intense)

  // Sets: weight defaults to workingWeight; only differs if user explicitly edits
  const [sets, setSets] = React.useState([
    { reps: 10, done: true,  weightOverride: null },
    { reps: 9,  done: true,  weightOverride: null },
    { reps: 8,  done: true,  weightOverride: 32.5 }, // dropped weight on set 3
    { reps: null, done: false, weightOverride: null },
  ]);
  const [editingIdx, setEditingIdx] = React.useState(null);
  const [rest, setRest] = React.useState(67);

  React.useEffect(() => {
    if (rest <= 0) return;
    const id = setTimeout(() => setRest((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [rest]);

  const nextIdx = sets.findIndex((s) => !s.done);
  const completedCount = sets.filter((s) => s.done).length;
  const timerActive = rest > 0;

  const completeNext = (reps) => {
    setSets((p) => p.map((s, i) => i === nextIdx ? { ...s, reps, done: true } : s));
    setRest(90);
  };

  return (
    <div style={{ background: SLT.colors.neutral[50], minHeight: '100%', fontFamily: SLT.font, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="chevron-left" size={24} color={SLT.colors.neutral[700]}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ ...SLT.type.footnote, color: SLT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exercise 2 of 6 · Chest + Side Delts</div>
          <div style={{ ...SLT.type.title2, color: SLT.colors.neutral[900] }}>Incline DB Press</div>
        </div>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="more" size={20} color={SLT.colors.neutral[500]}/>
        </button>
      </div>

      {/* WORKING WEIGHT — the hero. One weight, all sets. */}
      <div style={{ padding: '0 16px 12px' }}>
        <SLCard padding={0} elevation={1}>
          <div style={{ padding: '14px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ ...SLT.type.footnote, color: SLT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Working weight · push hard</span>
            <span style={{ ...SLT.type.footnote, color: SLT.colors.neutral[400], fontVariantNumeric: 'tabular-nums' }}>last: {lastWorkingWeight}kg</span>
          </div>
          <div style={{ padding: '0 16px 14px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setWorkingWeight((w) => Math.max(0, +(w - 2.5).toFixed(2)))} style={bigStepBtn(SLT, blue)}>
              <Icon name="minus" size={20} color={blue} strokeWidth={2.5}/>
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 64, fontWeight: 700, color: SLT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.035em', lineHeight: '64px' }}>{workingWeight}</span>
                <span style={{ fontSize: 20, fontWeight: 600, color: SLT.colors.neutral[500] }}>kg</span>
              </div>
              <div style={{ ...SLT.type.footnote, color: workingWeight > lastWorkingWeight ? SLT.colors.success[700] : SLT.colors.neutral[500], marginTop: 4, fontWeight: 600 }}>
                {workingWeight > lastWorkingWeight && '↑ '}
                {workingWeight > lastWorkingWeight ? `+${(workingWeight - lastWorkingWeight).toFixed(1)}kg vs last · go` : workingWeight === lastWorkingWeight ? 'matching last · push for one more' : 'lighter than last'}
              </div>
            </div>
            <button onClick={() => setWorkingWeight((w) => +(w + 2.5).toFixed(2))} style={bigStepBtn(SLT, blue)}>
              <Icon name="plus" size={20} color={blue} strokeWidth={2.5}/>
            </button>
          </div>
        </SLCard>
      </div>

      {/* Rest timer */}
      <div style={{ padding: '0 16px 12px' }}>
        <SLCard padding={14} elevation={1} style={{ background: timerActive ? SLT.colors.brand[50] : SLT.colors.neutral[0] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 999,
              background: timerActive ? blue : SLT.colors.neutral[100],
              color: timerActive ? '#fff' : SLT.colors.neutral[400],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
            }}>
              {timerActive ? `0:${rest.toString().padStart(2, '0')}` : <Icon name="timer" size={18}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...SLT.type.bodyStrong, color: SLT.colors.neutral[900] }}>{timerActive ? 'Rest' : 'Ready when you are'}</div>
              <div style={{ ...SLT.type.callout, color: SLT.colors.neutral[500] }}>{timerActive ? 'Target 90s' : `${completedCount} of ${targetSets} sets · target ${targetReps} reps`}</div>
            </div>
            {timerActive && (
              <button onClick={() => setRest(0)} style={{
                background: 'transparent', border: 'none', color: blue,
                ...SLT.type.bodyStrong, cursor: 'pointer', padding: 8,
              }}>Skip</button>
            )}
          </div>
        </SLCard>
      </div>

      {/* Sets list — weight per set shown only when overridden */}
      <div style={{ padding: '0 16px 12px', flex: 1 }}>
        <SLCard padding={0} elevation={1}>
          {sets.map((s, i) => {
            const isNext = i === nextIdx;
            const isOverride = s.weightOverride != null;
            const w = isOverride ? s.weightOverride : workingWeight;
            const editing = editingIdx === i;
            return (
              <div key={i} style={{
                padding: '12px 16px',
                borderBottom: i < sets.length - 1 ? `1px solid ${SLT.colors.neutral[100]}` : 'none',
                background: isNext ? SLT.colors.brand[50] : 'transparent',
                transition: 'background 220ms ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: s.done ? SLT.colors.success[500] : isNext ? blue : 'transparent',
                    border: s.done || isNext ? 'none' : `1.5px solid ${SLT.colors.neutral[300]}`,
                    color: s.done || isNext ? '#fff' : SLT.colors.neutral[400],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {s.done ? <Icon name="check" size={13} color="#fff" strokeWidth={3}/> : i + 1}
                  </div>

                  {/* Reps display / input */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    {s.done ? (
                      <>
                        <span style={{ fontSize: 22, fontWeight: 700, color: SLT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{s.reps}</span>
                        <span style={{ ...SLT.type.callout, color: SLT.colors.neutral[500] }}>reps</span>
                      </>
                    ) : isNext ? (
                      <span style={{ ...SLT.type.bodyStrong, color: blue, fontWeight: 700 }}>Up next · {targetReps} reps</span>
                    ) : (
                      <span style={{ ...SLT.type.callout, color: SLT.colors.neutral[400] }}>—</span>
                    )}
                  </div>

                  {/* Weight chip — quiet unless overridden or editing */}
                  {(isOverride || editing) ? (
                    <div style={{
                      padding: '4px 10px', borderRadius: 999,
                      background: SLT.colors.warning[50],
                      border: `1px solid ${SLT.colors.warning[500]}`,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: SLT.colors.warning[700], fontVariantNumeric: 'tabular-nums' }}>{w}kg</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: SLT.colors.warning[700], textTransform: 'uppercase', letterSpacing: '0.06em' }}>diff</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingIdx(editing ? null : i)}
                      style={{
                        padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                        background: 'transparent', border: `1px dashed ${SLT.colors.neutral[200]}`,
                        fontSize: 12, fontWeight: 500, color: SLT.colors.neutral[500],
                        fontFamily: SLT.font, fontVariantNumeric: 'tabular-nums',
                      }}
                    >{w}kg</button>
                  )}

                  {/* More */}
                  {s.done && (
                    <button onClick={() => setEditingIdx(editing ? null : i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <Icon name="edit" size={14} color={SLT.colors.neutral[400]}/>
                    </button>
                  )}
                </div>

                {/* Inline override editor */}
                {editing && (
                  <div style={{ marginTop: 10, padding: 10, background: SLT.colors.neutral[0], borderRadius: 10, border: `1px solid ${SLT.colors.neutral[200]}` }}>
                    <div style={{ ...SLT.type.footnote, color: SLT.colors.neutral[600], marginBottom: 6 }}>Override weight for this set only</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => setSets((p) => p.map((x, j) => j === i ? { ...x, weightOverride: (x.weightOverride ?? workingWeight) - 2.5 } : x))} style={miniBtn(SLT)}>−</button>
                      <span style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{(s.weightOverride ?? workingWeight)}kg</span>
                      <button onClick={() => setSets((p) => p.map((x, j) => j === i ? { ...x, weightOverride: (x.weightOverride ?? workingWeight) + 2.5 } : x))} style={miniBtn(SLT)}>+</button>
                      {isOverride && (
                        <button onClick={() => { setSets((p) => p.map((x, j) => j === i ? { ...x, weightOverride: null } : x)); setEditingIdx(null); }} style={{
                          background: 'transparent', border: 'none', color: blue, fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: '0 8px',
                        }}>Reset</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </SLCard>
      </div>

      {/* Bottom: log next set with reps stepper only (weight inherited) */}
      {nextIdx >= 0 && (
        <NextSetPad
          setIdx={nextIdx + 1}
          weight={sets[nextIdx].weightOverride ?? workingWeight}
          targetReps={targetReps}
          onDone={completeNext}
          blue={blue}
        />
      )}
    </div>
  );
}

function NextSetPad({ setIdx, weight, targetReps, onDone, blue }) {
  const [reps, setReps] = React.useState(8);
  return (
    <div style={{ background: SLT.colors.neutral[0], padding: '16px 16px 24px', borderTop: `1px solid ${SLT.colors.neutral[100]}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ ...SLT.type.footnote, color: SLT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Set {setIdx} · {weight}kg</span>
        <span style={{ ...SLT.type.footnote, color: SLT.colors.neutral[400] }}>target {targetReps}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button onClick={() => setReps((r) => Math.max(0, r - 1))} style={bigStepBtn(SLT, blue)}>
          <Icon name="minus" size={20} color={blue} strokeWidth={2.5}/>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 56, fontWeight: 700, color: SLT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', lineHeight: '56px' }}>{reps}</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: SLT.colors.neutral[500] }}>reps</span>
          </div>
        </div>
        <button onClick={() => setReps((r) => r + 1)} style={bigStepBtn(SLT, blue)}>
          <Icon name="plus" size={20} color={blue} strokeWidth={2.5}/>
        </button>
      </div>

      <SLButton variant="primary" size="lg" full onClick={() => onDone(reps)} style={{ background: blue }}>
        <Icon name="check" size={18} color="#fff" strokeWidth={2.5} style={{ marginRight: 8 }}/>
        Done · log set {setIdx}
      </SLButton>
    </div>
  );
}

const bigStepBtn = (T, blue) => ({
  width: 52, height: 52, borderRadius: 14,
  background: T.colors.brand[50], border: `1px solid ${T.colors.brand[100]}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
});

const miniBtn = (T) => ({
  width: 32, height: 32, borderRadius: 8,
  background: T.colors.neutral[100], border: 'none',
  fontSize: 16, fontWeight: 700, color: T.colors.neutral[700],
  cursor: 'pointer', fontFamily: T.font,
});

window.SetLoggerScreen = SetLoggerScreen;
