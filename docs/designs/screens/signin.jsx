// Sign-in / Welcome — PrepMaxAI brand, custom logo
const ST = window.PrepAITheme;

// Custom logo: bold P + lightning bolt — clean, single visual idea, modern
function PrepMaxLogo({ size = 88, color = '#3B82F6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <defs>
        <linearGradient id="pmShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.82"/>
        </linearGradient>
      </defs>
      {/* Solid rounded tile */}
      <rect x="0" y="0" width="96" height="96" rx="24" fill="url(#pmShine)"/>
      {/* Bold geometric P — single shape, white */}
      <path d="M28 22 h22 a18 18 0 0 1 0 36 H42 V74 H28 V22 Z M42 34 V46 H49 a6 6 0 0 0 0-12 H42 Z" fill="#fff"/>
      {/* Lightning bolt — overlaid in the negative space, single bold accent */}
      <path d="M64 22 L52 50 H62 L56 74 L74 44 H64 L70 22 Z" fill="#fff" opacity="0.95"/>
    </svg>
  );
}

function SignInScreen({ tweaks = {} }) {
  const blue = tweaks.brandHue || ST.colors.brand[500];
  return (
    <div style={{
      background: ST.colors.neutral[0], minHeight: '100%', fontFamily: ST.font,
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      {/* Soft brand washes */}
      <div style={{
        position: 'absolute', top: -120, right: -120, width: 360, height: 360, borderRadius: 999,
        background: `radial-gradient(circle, ${ST.colors.brand[100]} 0%, transparent 70%)`,
        opacity: 0.7, pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: -100, left: -80, width: 280, height: 280, borderRadius: 999,
        background: `radial-gradient(circle, ${ST.colors.brand[50]} 0%, transparent 70%)`,
        opacity: 0.9, pointerEvents: 'none',
      }}/>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <div style={{
          marginBottom: 28,
          filter: `drop-shadow(0 12px 28px ${blue}40)`,
        }}>
          <PrepMaxLogo size={92} color={blue}/>
        </div>

        {/* Wordmark with split styling */}
        <div style={{
          fontFamily: ST.font, textAlign: 'center', marginBottom: 12,
          fontSize: 40, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1,
        }}>
          <span style={{ color: ST.colors.neutral[900] }}>prep</span>
          <span style={{ color: blue }}>max</span>
          <span style={{
            display: 'inline-block', marginLeft: 4, padding: '4px 8px', borderRadius: 8,
            background: blue, color: '#fff', fontSize: 18, fontWeight: 800, letterSpacing: '0.02em',
            verticalAlign: 'middle', transform: 'translateY(-4px)',
          }}>AI</span>
        </div>

        {/* Tagline — fun + AI + prep-focused */}
        <div style={{
          ...ST.type.body, color: ST.colors.neutral[700],
          textAlign: 'center', maxWidth: 300, lineHeight: '24px',
          fontSize: 17, fontWeight: 500,
        }}>
          Train hard. Eat dialed. Let the AI handle the math —
          <span style={{ color: blue, fontWeight: 700 }}> you handle the reps.</span>
        </div>

        <div style={{
          ...ST.type.footnote, color: ST.colors.neutral[500],
          textAlign: 'center', marginTop: 10,
          textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
        }}>
          16 weeks · every set · every meal
        </div>

        {/* Feature row */}
        <div style={{ display: 'flex', gap: 18, marginTop: 36 }}>
          {[
            { icon: 'dumbbell', label: 'Lift' },
            { icon: 'utensils', label: 'Fuel' },
            { icon: 'camera',   label: 'Pose' },
            { icon: 'sparkle',  label: 'Coach' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: ST.colors.brand[50], color: blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={f.icon} size={20} color={blue}/>
              </div>
              <span style={{ ...ST.type.footnote, color: ST.colors.neutral[600], textTransform: 'uppercase', fontWeight: 600 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign-in actions */}
      <div style={{ padding: '0 24px 32px', position: 'relative', zIndex: 1 }}>
        <button style={{
          width: '100%', height: 52, borderRadius: 14,
          background: ST.colors.neutral[0], color: ST.colors.neutral[800],
          border: `1px solid ${ST.colors.neutral[200]}`,
          fontFamily: ST.font, fontSize: 16, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          marginBottom: 16, cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <div style={{ ...ST.type.footnote, color: ST.colors.neutral[400], textAlign: 'center', lineHeight: '16px' }}>
          By continuing, you agree to our <span style={{ color: ST.colors.neutral[600], textDecoration: 'underline' }}>Terms</span> and <span style={{ color: ST.colors.neutral[600], textDecoration: 'underline' }}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

window.SignInScreen = SignInScreen;
window.PrepMaxLogo = PrepMaxLogo;
