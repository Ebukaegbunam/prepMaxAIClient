// Weekly Check-in screen — multi-step flow shown as one polished view (Photos step prominent)
const CT = window.PrepAITheme;
const { Card: CCard, Button: CButton, Pill: CPill } = window.PrepAIComponents;

function CheckInScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || CT.colors.brand[500];
  const [weight, setWeight] = React.useState(92.4);
  const [ratings, setRatings] = React.useState({ mood: 4, energy: 3, sleep: 4, training: 5 });

  const photos = [
    { angle: 'Front', captured: true },
    { angle: 'Side L', captured: true },
    { angle: 'Side R', captured: false },
    { angle: 'Back', captured: false },
  ];

  return (
    <div style={{ background: CT.colors.neutral[50], minHeight: '100%', paddingBottom: 24, fontFamily: CT.font }}>
      {/* Top bar */}
      <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="x" size={22} color={CT.colors.neutral[700]}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ ...CT.type.footnote, color: CT.colors.neutral[500], textTransform: 'uppercase' }}>Week 4 check-in</div>
          <div style={{ ...CT.type.title2, color: CT.colors.neutral[900] }}>Sunday, Apr 27</div>
        </div>
        <span style={{ ...CT.type.footnote, color: CT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>3 of 4</span>
      </div>

      {/* Progress dots */}
      <div style={{ padding: '0 16px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
        {['Weight', 'Measurements', 'Photos', 'Ratings'].map((step, i) => {
          const done = i < 2; const active = i === 2;
          return (
            <React.Fragment key={i}>
              <div style={{
                flex: 1, height: 4, borderRadius: 999,
                background: done ? blue : (active ? CT.colors.brand[300] : CT.colors.neutral[200]),
                transition: 'all 200ms ease',
              }}/>
            </React.Fragment>
          );
        })}
      </div>

      {/* Quick recap of completed steps */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
        <CCard padding={12} elevation={1} style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 999,
              background: CT.colors.success[500], color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="check" size={11} color="#fff" strokeWidth={3}/></div>
            <span style={{ ...CT.type.footnote, color: CT.colors.neutral[500], textTransform: 'uppercase' }}>Weight</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: CT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{weight}</span>
            <span style={{ ...CT.type.callout, color: CT.colors.neutral[400] }}>kg</span>
            <span style={{ ...CT.type.footnote, color: CT.colors.success[700], marginLeft: 4 }}>−0.6</span>
          </div>
        </CCard>
        <CCard padding={12} elevation={1} style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 999,
              background: CT.colors.success[500], color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name="check" size={11} color="#fff" strokeWidth={3}/></div>
            <span style={{ ...CT.type.footnote, color: CT.colors.neutral[500], textTransform: 'uppercase' }}>Measurements</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: CT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>7</span>
            <span style={{ ...CT.type.callout, color: CT.colors.neutral[400] }}>logged</span>
          </div>
        </CCard>
      </div>

      {/* Active step header */}
      <div style={{ padding: '8px 20px 16px' }}>
        <div style={{ ...CT.type.title1, color: CT.colors.neutral[900] }}>Progress photos</div>
        <div style={{ ...CT.type.body, color: CT.colors.neutral[500], marginTop: 4 }}>Same lighting, same angle, neutral pose. The AI compares week-over-week.</div>
      </div>

      {/* Photo grid */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {photos.map((p, i) => (
            <div key={i} style={{
              aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden', position: 'relative',
              background: p.captured
                ? `linear-gradient(135deg, ${CT.colors.neutral[300]}, ${CT.colors.neutral[500]})`
                : CT.colors.neutral[100],
              border: p.captured ? 'none' : `1.5px dashed ${CT.colors.neutral[300]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              {/* Silhouette outline (placeholder) */}
              {!p.captured && (
                <svg width="48" height="80" viewBox="0 0 48 80" style={{ opacity: 0.5 }}>
                  <ellipse cx="24" cy="14" rx="9" ry="11" fill="none" stroke={CT.colors.neutral[400]} strokeWidth="1.5"/>
                  <path d="M24 26 C 14 26, 8 36, 8 50 L 8 70 L 16 70 L 18 52 L 30 52 L 32 70 L 40 70 L 40 50 C 40 36, 34 26, 24 26 Z" fill="none" stroke={CT.colors.neutral[400]} strokeWidth="1.5"/>
                </svg>
              )}
              {/* Captured indicator */}
              {p.captured && (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4) 100%)' }}/>
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 22, height: 22, borderRadius: 999,
                    background: CT.colors.success[500], border: `2px solid #fff`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name="check" size={11} color="#fff" strokeWidth={3}/></div>
                </>
              )}
              <div style={{
                position: 'absolute', bottom: 8, left: 10,
                ...CT.type.callout, color: p.captured ? '#fff' : CT.colors.neutral[600], fontWeight: 600,
                textShadow: p.captured ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
              }}>{p.angle}</div>
              {!p.captured && (
                <div style={{
                  position: 'absolute', bottom: 8, right: 8,
                  width: 28, height: 28, borderRadius: 999,
                  background: blue, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(59,130,246,0.4)',
                }}><Icon name="camera" size={14} color="#fff"/></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ratings preview (collapsed/preview of next step) */}
      <div style={{ padding: '8px 16px 0' }}>
        <CCard padding={16} elevation={1}>
          <div style={{ ...CT.type.footnote, color: CT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 12 }}>How was this week?</div>
          {[
            { key: 'mood', label: 'Mood', icon: 'sparkle' },
            { key: 'energy', label: 'Energy', icon: 'bolt' },
            { key: 'sleep', label: 'Sleep', icon: 'moon' },
            { key: 'training', label: 'Training quality', icon: 'dumbbell' },
          ].map((r, i) => (
            <div key={r.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${CT.colors.neutral[100]}`,
            }}>
              <Icon name={r.icon} size={16} color={CT.colors.neutral[500]}/>
              <span style={{ ...CT.type.bodyStrong, color: CT.colors.neutral[800], flex: 1 }}>{r.label}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map((v) => (
                  <button key={v} onClick={() => setRatings({ ...ratings, [r.key]: v })} style={{
                    width: 24, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: v <= ratings[r.key] ? blue : CT.colors.neutral[100],
                    transition: 'all 150ms ease',
                  }}/>
                ))}
              </div>
            </div>
          ))}
        </CCard>
      </div>

      {/* Bottom actions */}
      <div style={{ padding: '20px 16px 0', display: 'flex', gap: 10 }}>
        <CButton variant="outline" size="lg" style={{ flex: 1 }}>Skip step</CButton>
        <CButton variant="primary" size="lg" style={{ flex: 2, background: blue }}>
          Submit check-in
          <Icon name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }}/>
        </CButton>
      </div>

      <div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
        <span style={{ ...CT.type.footnote, color: CT.colors.neutral[400] }}>
          AI weekly report generates after submit · usually 30s
        </span>
      </div>
    </div>
  );
}

window.CheckInScreen = CheckInScreen;
