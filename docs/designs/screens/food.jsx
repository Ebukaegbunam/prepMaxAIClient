// Food today screen — meal slots, macros header, freeform CTA
const FT = window.PrepAITheme;
const { Card: FCard, Button: FButton, Pill: FPill, StatBar: FBar } = window.PrepAIComponents;

function FoodScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || FT.colors.brand[500];
  const consumed = 1842, target = 2480;

  const meals = [
    { slot: 'Breakfast', time: '7:30 AM', name: 'Oats, whey, banana', kcal: 540, p: 42, c: 78, f: 8, state: 'logged', icon: 'coffee' },
    { slot: 'Pre-workout', time: '11:00 AM', name: 'Rice cakes + jam', kcal: 320, p: 8, c: 64, f: 2, state: 'logged', icon: 'apple' },
    { slot: 'Post-workout', time: '1:30 PM', name: 'Chicken, rice, broccoli', kcal: 720, p: 62, c: 84, f: 14, state: 'planned', icon: 'beef' },
    { slot: 'Snack', time: '4:30 PM', name: 'Greek yogurt + berries', kcal: 220, p: 22, c: 18, f: 4, state: 'planned', icon: 'cookie' },
    { slot: 'Dinner', time: '7:30 PM', name: 'Salmon, sweet potato', kcal: 680, p: 48, c: 56, f: 24, state: 'planned', icon: 'utensils' },
  ];

  return (
    <div style={{ background: FT.colors.neutral[50], minHeight: '100%', paddingBottom: 96, fontFamily: FT.font }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ ...FT.type.footnote, color: FT.colors.neutral[500], textTransform: 'uppercase' }}>Today's plan</div>
          <div style={{ ...FT.type.title1, color: FT.colors.neutral[900], marginTop: 2 }}>Food</div>
        </div>
        <button style={{
          background: FT.colors.neutral[0], border: `1px solid ${FT.colors.neutral[200]}`,
          padding: '8px 12px', borderRadius: 999, cursor: 'pointer',
          ...FT.type.callout, color: FT.colors.neutral[700], fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="sparkle" size={14} color={blue}/>
          Plan week
        </button>
      </div>

      {/* Targets card — compact */}
      <div style={{ padding: '8px 16px 0' }}>
        <FCard padding={16} elevation={1}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ ...FT.type.footnote, color: FT.colors.neutral[500], textTransform: 'uppercase' }}>Calories</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: FT.colors.neutral[900], fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{consumed.toLocaleString()}</span>
                <span style={{ ...FT.type.callout, color: FT.colors.neutral[400] }}>/ {target.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...FT.type.footnote, color: FT.colors.neutral[500], textTransform: 'uppercase' }}>Remaining</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: blue, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', marginTop: 2 }}>
                {(target - consumed).toLocaleString()}
              </div>
            </div>
          </div>
          {/* Calorie progress bar */}
          <div style={{ height: 6, background: FT.colors.neutral[100], borderRadius: 999, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(consumed/target)*100}%`, background: blue, borderRadius: 999, transition: 'width 700ms ease' }}/>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <FBar value={142} max={210} label="Protein" color={blue}/>
            <FBar value={186} max={248} label="Carbs" color={FT.colors.brand[400]}/>
            <FBar value={48} max={68} label="Fat" color={FT.colors.brand[300]}/>
          </div>
        </FCard>
      </div>

      {/* Meal list */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
          <span style={{ ...FT.type.footnote, color: FT.colors.neutral[500], textTransform: 'uppercase' }}>Meals</span>
          <span style={{ ...FT.type.footnote, color: FT.colors.neutral[400] }}>2 of 5 logged</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {meals.map((m, i) => (
            <FCard key={i} padding={0} elevation={1} onClick={() => {}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: m.state === 'logged' ? FT.colors.brand[50] : FT.colors.neutral[50],
                  color: m.state === 'logged' ? blue : FT.colors.neutral[400],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Icon name={m.icon} size={20} color={m.state === 'logged' ? blue : FT.colors.neutral[400]}/>
                  {m.state === 'logged' && (
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      width: 16, height: 16, borderRadius: 999,
                      background: FT.colors.success[500], color: '#fff',
                      border: `2px solid ${FT.colors.neutral[0]}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon name="check" size={8} color="#fff" strokeWidth={4}/>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ ...FT.type.footnote, color: FT.colors.neutral[500], textTransform: 'uppercase' }}>{m.slot}</span>
                    <span style={{ ...FT.type.footnote, color: FT.colors.neutral[400], fontVariantNumeric: 'tabular-nums' }}>{m.time}</span>
                  </div>
                  <div style={{ ...FT.type.bodyStrong, color: m.state === 'logged' ? FT.colors.neutral[700] : FT.colors.neutral[900], marginTop: 2, opacity: m.state === 'logged' ? 0.7 : 1 }}>{m.name}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: FT.colors.neutral[700], fontVariantNumeric: 'tabular-nums' }}>{m.kcal}<span style={{ color: FT.colors.neutral[400], fontWeight: 500 }}> kcal</span></span>
                    <span style={{ fontSize: 12, color: FT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>P {m.p}</span>
                    <span style={{ fontSize: 12, color: FT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>C {m.c}</span>
                    <span style={{ fontSize: 12, color: FT.colors.neutral[500], fontVariantNumeric: 'tabular-nums' }}>F {m.f}</span>
                  </div>
                </div>
                <Icon name="chevron-right" size={18} color={FT.colors.neutral[300]}/>
              </div>
            </FCard>
          ))}
        </div>
      </div>

      {/* Freeform CTA */}
      <div style={{ padding: '16px 16px 0' }}>
        <button style={{
          width: '100%', padding: '14px 16px', borderRadius: 14,
          background: FT.colors.neutral[0],
          border: `1px dashed ${FT.colors.neutral[300]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          cursor: 'pointer', color: FT.colors.neutral[600],
          ...FT.type.bodyStrong,
        }}>
          <Icon name="plus" size={18} color={FT.colors.neutral[500]} strokeWidth={2.5}/>
          Add freeform meal
        </button>
      </div>

      {/* Coach prompts */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ ...FT.type.footnote, color: FT.colors.neutral[500], textTransform: 'uppercase', marginBottom: 8, padding: '0 4px' }}>Ask coach</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: 'sparkle', label: 'What can I eat with my remaining macros?' },
            { icon: 'utensils', label: 'Find restaurants near me' },
          ].map((p, i) => (
            <FCard key={i} padding={14} elevation={1} onClick={() => {}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: FT.colors.brand[50],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={p.icon} size={16} color={blue}/>
                </div>
                <span style={{ ...FT.type.bodyStrong, color: FT.colors.neutral[800], flex: 1 }}>{p.label}</span>
                <Icon name="arrow-right" size={16} color={FT.colors.neutral[400]}/>
              </div>
            </FCard>
          ))}
        </div>
      </div>
    </div>
  );
}

window.FoodScreen = FoodScreen;
