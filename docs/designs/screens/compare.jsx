// Compare Photos — pre-analyze understanding + click-to-analyze + focus prompts
const AT = window.PrepAITheme;
const { Card: ACard, Button: AButton } = window.PrepAIComponents;

function ComparePhotosScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || AT.colors.brand[500];

  // Phases: 'preview' (default — show what we already know, no API yet), 'streaming', 'final'
  const [phase, setPhase] = React.useState('preview');
  const [focus, setFocus] = React.useState(new Set(['waist']));
  const [coachNote, setCoachNote] = React.useState('');

  const toggleFocus = (id) => {
    const next = new Set(focus);
    next.has(id) ? next.delete(id) : next.add(id);
    setFocus(next);
  };

  return (
    <div style={{ background: AT.colors.neutral[50], minHeight: '100%', fontFamily: AT.font, paddingBottom: 28 }}>
      {/* Top bar */}
      <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Icon name="chevron-left" size={24} color={AT.colors.neutral[700]}/>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ ...AT.type.footnote, color: AT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>Photo compare</div>
          <div style={{ ...AT.type.title2, color: AT.colors.neutral[900] }}>Front · Week 1 vs 4</div>
        </div>
      </div>

      {/* Photo pair */}
      <div style={{ padding: '0 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Week 1', date: 'Apr 6', tone: AT.colors.neutral[400] },
          { label: 'Week 4', date: 'Apr 27', tone: AT.colors.neutral[600] },
        ].map((p, i) => (
          <div key={i} style={{
            aspectRatio: '3/4', borderRadius: 14, overflow: 'hidden', position: 'relative',
            background: `linear-gradient(135deg, ${AT.colors.neutral[200]}, ${p.tone})`,
          }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="72" height="120" viewBox="0 0 48 80" style={{ opacity: 0.5 }}>
                <ellipse cx="24" cy="14" rx="9" ry="11" fill="rgba(255,255,255,0.4)"/>
                <path d="M24 26 C 14 26, 8 36, 8 50 L 8 70 L 16 70 L 18 52 L 30 52 L 32 70 L 40 70 L 40 50 C 40 36, 34 26, 24 26 Z" fill="rgba(255,255,255,0.4)"/>
              </svg>
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4) 100%)' }}/>
            <div style={{
              position: 'absolute', top: 8, left: 10,
              padding: '4px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
              ...AT.type.footnote, color: AT.colors.neutral[900], fontWeight: 700,
            }}>{p.label}</div>
            <div style={{
              position: 'absolute', bottom: 8, left: 10,
              ...AT.type.footnote, color: '#fff', fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}>{p.date}</div>
          </div>
        ))}
      </div>

      {/* WHAT WE ALREADY KNOW — measured trends, no AI call needed */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ ...AT.type.footnote, color: AT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 8, padding: '0 4px', letterSpacing: '0.06em', fontWeight: 600 }}>
          What we already know · 4 weeks
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { label: 'Weight', val: '−2.4', unit: 'kg', good: true },
            { label: 'Waist',  val: '−2.8', unit: 'cm', good: true },
            { label: 'Chest',  val: '+0.4', unit: 'cm', good: true },
          ].map((s, i) => (
            <ACard key={i} padding={12} elevation={1}>
              <div style={{ ...AT.type.footnote, color: AT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: s.good ? AT.colors.success[700] : AT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{s.val}</span>
                <span style={{ ...AT.type.footnote, color: AT.colors.neutral[400] }}>{s.unit}</span>
              </div>
            </ACard>
          ))}
        </div>

        <ACard padding={14} elevation={1}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: AT.colors.success[50], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="trending" size={14} color={AT.colors.success[700]} strokeWidth={2.5}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...AT.type.bodyStrong, color: AT.colors.neutral[900], marginBottom: 2 }}>You're tracking on plan</div>
              <div style={{ ...AT.type.callout, color: AT.colors.neutral[600], lineHeight: '20px' }}>
                Down 2.4 kg in 4 weeks (target: 0.5–0.7 kg/wk). Waist −2.8 cm with chest holding — exactly the ratio we want at week 4.
              </div>
            </div>
          </div>
        </ACard>
      </div>

      {/* CLICK TO ANALYZE — opt-in, with focus picker */}
      {phase === 'preview' && (
        <div style={{ padding: '6px 16px 0' }}>
          <ACard padding={16} elevation={1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name="sparkle" size={16} color={blue}/>
              <span style={{ ...AT.type.bodyStrong, color: AT.colors.neutral[900] }}>Want a deeper look?</span>
            </div>
            <div style={{ ...AT.type.callout, color: AT.colors.neutral[600], lineHeight: '20px', marginBottom: 12 }}>
              The numbers tell the story. If you want AI to look at the photos themselves, pick what to focus on:
            </div>

            {/* Focus chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {[
                { id: 'waist',     label: 'Waist + midsection' },
                { id: 'shoulders', label: 'Shoulder fullness' },
                { id: 'back',      label: 'Back development' },
                { id: 'legs',      label: 'Quad sweep' },
                { id: 'symmetry',  label: 'L/R symmetry' },
                { id: 'lighting',  label: 'Adjust for lighting' },
              ].map((f) => {
                const on = focus.has(f.id);
                return (
                  <button key={f.id} onClick={() => toggleFocus(f.id)} style={{
                    padding: '6px 12px', borderRadius: 999, cursor: 'pointer',
                    background: on ? blue : 'transparent',
                    color: on ? '#fff' : AT.colors.neutral[700],
                    border: on ? 'none' : `1px solid ${AT.colors.neutral[200]}`,
                    fontFamily: AT.font, fontSize: 13, fontWeight: 600,
                    transition: 'all 160ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}>{on ? '✓ ' : ''}{f.label}</button>
                );
              })}
            </div>

            {/* Coach note */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ ...AT.type.footnote, color: AT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, fontWeight: 600 }}>What did your coach mention? <span style={{ textTransform: 'none', fontWeight: 500, color: AT.colors.neutral[400] }}>(optional)</span></div>
              <textarea
                value={coachNote}
                onChange={(e) => setCoachNote(e.target.value)}
                placeholder="e.g. 'tighten waist before quads' or 'lats need more thickness'"
                rows={2}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: `1px solid ${AT.colors.neutral[200]}`,
                  background: AT.colors.neutral[50],
                  fontFamily: AT.font, fontSize: 14, color: AT.colors.neutral[800],
                  resize: 'none', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <button onClick={() => setPhase('streaming')} style={{
              width: '100%', height: 48, borderRadius: 12,
              background: blue, color: '#fff', border: 'none',
              fontFamily: AT.font, fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer',
            }}>
              <Icon name="sparkle" size={16} color="#fff" strokeWidth={2.5}/>
              Analyze {focus.size > 0 ? `· ${focus.size} focus area${focus.size > 1 ? 's' : ''}` : ''}
            </button>
            <div style={{ ...AT.type.footnote, color: AT.colors.neutral[400], textAlign: 'center', marginTop: 8 }}>
              Uses 1 AI credit · no auto-runs
            </div>
          </ACard>
        </div>
      )}

      {/* Streaming view */}
      {phase === 'streaming' && (
        <>
          <div style={{ padding: '0 16px 12px' }}>
            <ACard padding={16} elevation={1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: 999, background: blue,
                      animation: `pulseDot 1200ms infinite`, animationDelay: `${i * 200}ms`,
                    }}/>
                  ))}
                </div>
                <span style={{ ...AT.type.footnote, color: AT.colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Analyzing · focused on {[...focus].join(', ') || 'overall'}
                </span>
                <style>{`@keyframes pulseDot {0%,60%,100%{opacity:0.3;transform:scale(0.8)}30%{opacity:1;transform:scale(1.1)}}`}</style>
              </div>

              <div style={{ ...AT.type.body, color: AT.colors.neutral[800], lineHeight: '22px' }}>
                <span>Visible reduction in waist circumference, particularly the lower abdominal region. Upper chest and front delts appear </span>
                <span style={{ background: AT.colors.brand[50], padding: '0 2px', borderRadius: 2 }}>marginally fuller</span>
                <span> — likely water rather than tissue at this phase. Lighting in week 4 photo is slightly cooler which may exaggerate vascularity in the </span>
                <span style={{
                  display: 'inline-block', width: 8, height: 16, background: blue,
                  animation: 'blinkCursor 1s infinite', verticalAlign: 'text-bottom',
                }}/>
                <style>{`@keyframes blinkCursor {0%,50%{opacity:1}51%,100%{opacity:0}}`}</style>
              </div>
            </ACard>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Loading photos', state: 'done' },
                { label: 'Aligning angles', state: 'done' },
                { label: 'Generating observations', state: 'active' },
                { label: 'Composing recommendations', state: 'pending' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 999,
                    background: s.state === 'done' ? AT.colors.success[500] : (s.state === 'active' ? AT.colors.brand[100] : AT.colors.neutral[100]),
                    border: s.state === 'active' ? `2px solid ${blue}` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.state === 'done' && <Icon name="check" size={9} color="#fff" strokeWidth={4}/>}
                  </div>
                  <span style={{
                    ...AT.type.callout,
                    color: s.state === 'pending' ? AT.colors.neutral[400] : AT.colors.neutral[700],
                    fontWeight: s.state === 'active' ? 600 : 500,
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

window.ComparePhotosScreen = ComparePhotosScreen;
