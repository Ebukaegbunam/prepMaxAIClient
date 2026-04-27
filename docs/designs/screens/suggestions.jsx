// AI Suggestions — review proposed plan changes before they apply
const SGT = window.PrepAITheme;
const { Card: SGCard } = window.PrepAIComponents;

function AISuggestionsScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || SGT.colors.brand[500];

  const [accepted, setAccepted] = React.useState(new Set(['s2']));

  const why = [
    'Weight ↓ 0.6 kg/wk · on plan',
    'Chest volume hit · back 14/16 sets',
    'RPE on Incline DB averaging 8.5 — room to push',
    'Sleep flagged 5.4h Tue · recovery factor',
  ];

  const suggestions = [
    {
      id: 's1', kind: 'workout',
      title: 'Add 2 sets of Pulldowns on Wed',
      detail: 'Back lagging vs target (14 → 16 sets). Slot before rows.',
      impact: '+2 sets back', confidence: 'High',
    },
    {
      id: 's2', kind: 'workout',
      title: 'Bump Incline DB working weight to 35kg',
      detail: 'Last 3 sessions hit 32.5kg × 8 at RPE 8.5. Time to load.',
      impact: '+2.5kg', confidence: 'High',
    },
    {
      id: 's3', kind: 'nutrition',
      title: 'Hold calories at 2480',
      detail: 'Rate of loss is right at 0.6 kg/wk — no cut needed yet.',
      impact: 'No change', confidence: 'Med',
    },
    {
      id: 's4', kind: 'cardio',
      title: 'Drop Sat cardio · sleep debt',
      detail: 'Sleep < 6h three nights. Recovery > NEAT this week.',
      impact: '−30 min cardio', confidence: 'Med',
    },
  ];

  const toggle = (id) => {
    const next = new Set(accepted);
    next.has(id) ? next.delete(id) : next.add(id);
    setAccepted(next);
  };

  return (
    <div style={{ background: SGT.colors.neutral[50], minHeight: '100%', fontFamily: SGT.font, paddingBottom: 110 }}>
      {/* Top */}
      <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="chevron-left" size={24} color={SGT.colors.neutral[700]}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ ...SGT.type.footnote, color: SGT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weekly review · Sun</div>
          <div style={{ ...SGT.type.title2, color: SGT.colors.neutral[900] }}>AI suggestions</div>
        </div>
        <div style={{
          padding: '4px 10px', borderRadius: 999,
          background: SGT.colors.brand[50], color: blue,
          fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Icon name="sparkle" size={11} color={blue} strokeWidth={2.5}/> 4 NEW
        </div>
      </div>

      {/* Why now — show context first */}
      <div style={{ padding: '0 16px 12px' }}>
        <SGCard padding={14} elevation={1}>
          <div style={{ ...SGT.type.footnote, color: SGT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>Based on this week</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {why.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 4, height: 4, borderRadius: 999, background: blue, marginTop: 8, flexShrink: 0 }}/>
                <span style={{ ...SGT.type.callout, color: SGT.colors.neutral[700], lineHeight: '20px' }}>{w}</span>
              </div>
            ))}
          </div>
        </SGCard>
      </div>

      {/* Suggestions list */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ ...SGT.type.footnote, color: SGT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 8, padding: '0 4px', letterSpacing: '0.06em', fontWeight: 600 }}>Proposed changes · pick what you'll apply</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {suggestions.map((s) => {
            const on = accepted.has(s.id);
            const kindColor = s.kind === 'workout' ? blue : s.kind === 'nutrition' ? SGT.colors.success[500] : SGT.colors.warning[500];
            return (
              <SGCard key={s.id} padding={0} elevation={1} style={{
                borderLeft: `3px solid ${on ? kindColor : SGT.colors.neutral[200]}`,
                transition: 'border-color 220ms ease',
              }}>
                <button onClick={() => toggle(s.id)} style={{
                  width: '100%', padding: 14, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: SGT.font,
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: on ? kindColor : 'transparent',
                    border: on ? 'none' : `1.5px solid ${SGT.colors.neutral[300]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                  }}>
                    {on && <Icon name="check" size={13} color="#fff" strokeWidth={3}/>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: kindColor,
                      }}>{s.kind}</span>
                      <span style={{ color: SGT.colors.neutral[300] }}>·</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: SGT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.confidence} confidence</span>
                    </div>
                    <div style={{ ...SGT.type.bodyStrong, color: SGT.colors.neutral[900], marginBottom: 4 }}>{s.title}</div>
                    <div style={{ ...SGT.type.callout, color: SGT.colors.neutral[600], lineHeight: '20px' }}>{s.detail}</div>
                    <div style={{
                      display: 'inline-flex', marginTop: 8, padding: '3px 8px', borderRadius: 6,
                      background: SGT.colors.neutral[50], border: `1px solid ${SGT.colors.neutral[100]}`,
                      fontSize: 11, fontWeight: 700, color: SGT.colors.neutral[700], fontVariantNumeric: 'tabular-nums',
                    }}>{s.impact}</div>
                  </div>
                </button>
              </SGCard>
            );
          })}
        </div>

        {/* Re-think with focus */}
        <SGCard padding={14} elevation={1} style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="sparkle" size={14} color={blue}/>
            <span style={{ ...SGT.type.bodyStrong, color: SGT.colors.neutral[900] }}>Ask AI to re-think</span>
          </div>
          <div style={{ ...SGT.type.callout, color: SGT.colors.neutral[600], marginBottom: 10, lineHeight: '20px' }}>
            What should we focus on, or what did your real coach mention?
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {['Less back volume', 'More legs', 'Coach said push waist', 'I felt drained Tue', 'Travel Sat'].map((c, i) => (
              <span key={i} style={{
                padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
                background: SGT.colors.neutral[50], border: `1px solid ${SGT.colors.neutral[200]}`,
                fontSize: 12, fontWeight: 500, color: SGT.colors.neutral[700],
              }}>{c}</span>
            ))}
          </div>
          <textarea rows={2} placeholder="Optional · what should the AI focus on this round?" style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            border: `1px solid ${SGT.colors.neutral[200]}`, background: SGT.colors.neutral[50],
            fontFamily: SGT.font, fontSize: 14, color: SGT.colors.neutral[800],
            resize: 'none', outline: 'none', boxSizing: 'border-box',
          }}/>
          <button style={{
            width: '100%', height: 42, borderRadius: 10, marginTop: 10,
            background: SGT.colors.neutral[0], color: blue, border: `1px solid ${SGT.colors.brand[100]}`,
            fontFamily: SGT.font, fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
          }}>
            <Icon name="rotate" size={14} color={blue} strokeWidth={2.5}/> Re-think · uses 1 credit
          </button>
        </SGCard>
      </div>

      {/* Sticky apply bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 16px 24px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${SGT.colors.neutral[100]}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...SGT.type.footnote, color: SGT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Selected</div>
          <div style={{ ...SGT.type.bodyStrong, color: SGT.colors.neutral[900], fontVariantNumeric: 'tabular-nums' }}>{accepted.size} of {suggestions.length} changes</div>
        </div>
        <button style={{
          height: 46, padding: '0 22px', borderRadius: 12,
          background: accepted.size > 0 ? blue : SGT.colors.neutral[200],
          color: '#fff', border: 'none', cursor: accepted.size > 0 ? 'pointer' : 'default',
          fontFamily: SGT.font, fontSize: 15, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Apply <Icon name="arrow-right" size={15} color="#fff" strokeWidth={2.5}/>
        </button>
      </div>
    </div>
  );
}

window.AISuggestionsScreen = AISuggestionsScreen;
