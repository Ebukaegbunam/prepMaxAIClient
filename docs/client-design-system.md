# PrepAI Client — Design System

**Status:** Source of truth for client visual design, motion, and interaction patterns.
**Scope:** Look, feel, and behavior. Information architecture and data flow are in `master-client-design.md`.
**Companion docs:** `master-client-design.md` (architecture), `implementation-plan.md` (build).

---

## 1. Design philosophy

Three rules govern every screen:

1. **Friction is the enemy.** Logging a set, a meal, or a weight should be possible in two taps from the relevant tab. Anything that gets between Ebuka and a completed action is debt.
2. **Calm, not exciting.** Prep is a 16-week grind. The app should feel like a steady professional companion, not a hype machine. No confetti, no congratulations animations on every interaction, no neon. Restraint earns trust.
3. **Show data clearly, hide it when not needed.** This is a data-dense app — sets, macros, measurements, photos, charts. Density is fine when intentional. Whitespace is used aggressively to separate concerns and let the eye rest.

Hevy and Strong nail rule 1. ASICS Studio nails rules 2 and 3. We model after the intersection.

---

## 2. Color system

Light-first palette (Ebuka asked for light blue + white). Dark mode comes later, designed against the same tokens.

### 2.1 Brand color

A single signature blue. Used for:

- Primary buttons and CTAs
- Selected state on tabs, segments, chips
- Progress fills (calorie ring, weight trend line, week strip)
- Brand glyphs in marketing surfaces

```
brand/blue/50    #EFF6FF   surface tint, hover background
brand/blue/100   #DBEAFE   subtle tint backgrounds, selected chips
brand/blue/200   #BFDBFE   borders, dividers in branded contexts
brand/blue/300   #93C5FD   secondary text on light blue backgrounds
brand/blue/400   #60A5FA   hover/active states
brand/blue/500   #3B82F6   PRIMARY — buttons, key accents
brand/blue/600   #2563EB   pressed states, headlines
brand/blue/700   #1D4ED8   high-emphasis text on light blue
brand/blue/900   #1E3A8A   dark accents, charts
```

The 500 is the workhorse. 50 and 100 do most of the "tint" work. 600 is the pressed-state default.

### 2.2 Neutrals

Where most of the UI lives. Slate-tinted (cool, modern) rather than pure gray (clinical) or warm gray (mushy).

```
neutral/0     #FFFFFF   page background, cards
neutral/50    #F8FAFC   alternate surface, scrim
neutral/100   #F1F5F9   muted surface, input fields, dividers
neutral/200   #E2E8F0   subtle borders, separators
neutral/300   #CBD5E1   disabled controls, low-emphasis borders
neutral/400   #94A3B8   placeholder text, tertiary icons
neutral/500   #64748B   secondary text
neutral/600   #475569   body text on muted surfaces
neutral/700   #334155   default body text
neutral/800   #1E293B   headlines, emphasized labels
neutral/900   #0F172A   hero numerals (current calories, weight, etc.)
```

### 2.3 Semantic colors

Used for state, never for decoration.

```
success/50    #ECFDF5
success/500   #10B981   workout complete, on-track trend, set marked done
success/700   #047857   high-emphasis success text

warning/50    #FFFBEB
warning/500   #F59E0B   approaching limits, calorie warnings
warning/700   #B45309

danger/50     #FEF2F2
danger/500   #EF4444    over limits, errors, failed sync
danger/700   #B91C1C
```

### 2.4 Color usage rules

- **One signature color per screen.** Don't mix brand blue with green and red unless you're showing real semantic state.
- **The hero number on a screen uses neutral/900, never blue.** Blue is for action, not for content. (Calorie target: 2,950 in dark slate. The progress arc filling around it: blue.)
- **Backgrounds are white or neutral/50.** Never pure gray. Never a tint of brand blue (looks dated).
- **Avoid gradients except in two specific cases:** the splash screen, and the optional progress arc fill on the today card. Gradients are easy to overdo; we don't.
- **Photos are sacrosanct.** Never overlay tints, never desaturate. Progress photos go on white with ample padding.

### 2.5 Dark mode (later)

Designed against the same tokens. Inversion is not automatic — neutral/900 doesn't become neutral/0. We pick a separate dark palette when we get there, anchored on slate-950 backgrounds and softened brand-blue-400 accents. Out of scope for MVP.

---

## 3. Typography

iOS native with one weight family for consistency across iOS and Android.

### 3.1 Font

**SF Pro on iOS** (native, free, perfect at all sizes).
**Inter as fallback / Android equivalent.** Visually compatible.

No custom display font for MVP. We earn weirdness later.

### 3.2 Type scale

Six steps, no more. iOS Human Interface Guidelines-aligned for Dynamic Type support.

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `text/display` | 40 | 48 | 700 | Hero numerals (today's calories, weight) |
| `text/title-1` | 28 | 34 | 700 | Screen titles, section heroes |
| `text/title-2` | 22 | 28 | 600 | Card titles, day titles |
| `text/title-3` | 18 | 24 | 600 | List section headers |
| `text/body` | 16 | 22 | 400 | Default body text |
| `text/body-strong` | 16 | 22 | 600 | Emphasized inline text |
| `text/callout` | 14 | 20 | 500 | Captions, helper text |
| `text/footnote` | 12 | 16 | 500 | Timestamps, micro-labels |

Tabular numerals for any numeric display (sets, reps, weights, calories): font-feature-settings: 'tnum'. Numbers should never jitter as they update.

### 3.3 Typography rules

- Body text is `neutral/700`, not black. Pure black on pure white is harsh.
- Hero numerals are `neutral/900`. They earn the weight.
- Never use color for emphasis when a weight change will do. Bold > color.
- Line lengths capped at ~36 characters for body text on mobile.

---

## 4. Spacing and layout

### 4.1 Spacing scale

Powers of 2 plus 12 and 24 for breathing. Tailwind-aligned.

```
space/0    0
space/1    4
space/2    8
space/3    12
space/4    16    DEFAULT padding for cards, screen edges
space/5    20
space/6    24    section gaps
space/8    32
space/10   40
space/12   48    hero margins
space/16   64
```

### 4.2 Layout rules

- **Screen horizontal padding: 16.** Always. Never more, never less.
- **Card internal padding: 16.** Same number, intentionally — visual rhythm.
- **Vertical rhythm: 16 between cards, 24 between sections, 32 before a screen-level CTA.**
- **Safe areas respected.** No element under the notch, no element behind the home indicator.
- **One column, always.** No two-column grids on mobile (they fight thumb reach). Exceptions: photo grids on Progress (3-column), calorie macros breakdown (2-column on summary cards).

### 4.3 Touch targets

Minimum 44×44 pt per Apple HIG. List rows are 56 pt minimum. Set logger buttons are 56×56 (gym hands, sweat, gloves — bigger than default).

### 4.4 Border radius scale

```
radius/sm    8     buttons, chips, small inputs
radius/md    12    cards (default)
radius/lg    16    sheets, modals
radius/xl    24    hero cards, photo containers
radius/full  9999  pill buttons, avatars
```

All radii consistent. Mixing 10s and 14s and 16s ages an app fast.

### 4.5 Elevation

Three levels. Shadows are subtle on light mode — overdone shadows look 2018.

```
elevation/0   none                                     flat surfaces, dividers
elevation/1   0 1px 2px rgba(15,23,42,0.04)            cards on neutral/50 background
elevation/2   0 4px 12px rgba(15,23,42,0.08)           sheets, popovers
elevation/3   0 8px 24px rgba(15,23,42,0.12)           modals
```

No `elevation/4`. If something needs more elevation, it's a full-screen modal.

---

## 5. Iconography

- **Lucide React Native** for all icons. ~1500 icons, consistent stroke weight, free.
- **Size scale:** 16 (inline), 20 (default), 24 (tabs/headers), 32 (empty states), 48+ (illustrations).
- **Stroke weight:** 2 (Lucide default).
- **Color:** matches surrounding text color by default. Brand blue for active/selected. Never multi-color.

Custom illustrations (empty states, onboarding, milestones) come from a single illustrator or Lottie set when added — out of scope for MVP. For MVP, iconography + thoughtful empty-state copy carries the weight.

---

## 6. Component library

### 6.1 Buttons

Three styles. No more. (Most apps over-multiply button styles — five tertiary variants etc. — and end up with inconsistency.)

**Primary** — brand/blue/500 fill, white label. The single CTA on a screen.
**Secondary** — neutral/100 fill, neutral/800 label. Side actions.
**Ghost** — transparent fill, brand/blue/600 label. Inline links, "more options."

Sizes: `sm` (32 pt), `md` (44 pt, default), `lg` (56 pt — set logger "Done", workout "Finish").

States: default, hover (web only), pressed (scale 0.97 + slightly darker fill), disabled (opacity 0.4), loading (spinner replaces label, button stays clickable but no-op).

### 6.2 Cards

The unit of content. Rules:

- White on neutral/50 background, OR neutral/0 with elevation/1.
- 16 padding, 12 radius.
- Optional title at top (text/title-3), content below.
- Optional CTA bar at bottom (right-aligned, ghost button).
- Tappable cards have full-bleed touch area, no inset hitbox.

### 6.3 Lists

Two styles:

- **Inset list** (iOS Settings-style): rounded group, 12 radius, dividers between rows, neutral/200.
- **Plain list** (Hevy-style): full-bleed rows, 1px neutral/100 dividers, no card wrapper.

Use plain lists for high-density data (set logger, exercise list). Use inset lists for settings, options, navigation.

### 6.4 Inputs

- Filled style: neutral/100 background, no border by default.
- 16 padding, 8 radius, 44 pt min height.
- Focus state: 2px brand/blue/500 border, no shift.
- Label above, helper below in text/callout.
- Error: 2px danger/500 border, danger/700 helper text.
- Inline numeric inputs (set logger weight/reps): larger touch targets, system numeric keypad, auto-focus next field.

### 6.5 Sheets and modals

- Bottom sheets default (better for thumb reach).
- 16 radius top corners only.
- Drag handle (neutral/300, 36×4 pill) at top.
- 24 vertical padding, 16 horizontal.
- Backdrop: neutral/900 at 40% opacity.
- Dismissible by drag down or backdrop tap.

Full-screen modals only for: onboarding, weekly check-in, AI streaming responses (compare-photos, weekly-report). Everything else is a sheet.

### 6.6 Tabs (bottom)

Five tabs, fixed bar.

- 56 pt height + safe area inset.
- Icon (24) + label (text/footnote).
- Active: brand/blue/500 icon + label.
- Inactive: neutral/500 icon + label.
- Subtle 1px top border (neutral/100). No floating tab bars (trendy but reduces hit area).

Tab order: **Home / Workouts / Food / Progress / Competitions.** Workouts and Food are highest-frequency, so they sit either side of Home (thumb-reachable).

### 6.7 Charts

Visualization library: Victory Native XL.

- Single accent color per chart (brand/blue/500 default).
- No 3D, no gradients beyond a single linear fill below trend lines.
- Axis labels: text/footnote, neutral/500.
- Hero number above chart, chart contextualizes it. (Today's weight: 84.2 kg in display; chart below shows 30-day trend.)
- Animations: line draws on mount (300ms), bars stagger in (50ms each, 300ms total).

### 6.8 Diff view

Critical custom component. AI suggestions are presented as accept/reject items. Visual treatment:

- Each suggestion row: 16 padding, 12 radius, neutral/50 background.
- Before/after shown side-by-side or stacked depending on width.
- Accept button: success/500 fill, "Accept."
- Reject button: ghost, neutral/600.
- Top of sheet: "Accept all" / "Reject all" pills.
- Rationale text in text/callout, neutral/600, max 2 lines truncated with "Read more."

### 6.9 SSE stream view

For compare-photos and weekly-report.

- Header with progress dots (3 dots, brand/blue/500, fading in sequence).
- Stage label ("Analyzing photo A...") in text/callout, neutral/500.
- Streaming text appears below in text/body, animated character reveal (no typing animation — too cute; just opacity fade per chunk).
- On `final` event, the stream view collapses into a static result card with subtle fade transition.

---

## 7. Motion and animation

We have Reanimated 3 + Moti. The principles:

### 7.1 Motion principles

1. **Animations are functional, not decorative.** They communicate state change, hierarchy, or relationship.
2. **Springs over curves.** Spring physics feel right; eased curves feel scripted.
3. **Fast.** 200-300ms for UI transitions. 100ms for micro-feedback (tap scale).
4. **120fps where possible.** Reanimated worklets, no JS-thread animations.
5. **Reduced motion respected.** When iOS Reduce Motion is on, we use opacity-only transitions.

### 7.2 Standard transitions

| Trigger | Animation | Duration | Easing |
|---|---|---|---|
| Screen push (Expo Router) | Slide from right | iOS default | iOS default |
| Sheet open | Slide up + backdrop fade | 300ms | spring (damping: 20, stiffness: 200) |
| Modal open | Fade + slight scale (0.98 → 1.0) | 250ms | spring |
| Button press | Scale 1.0 → 0.97 | 100ms | spring (damping: 30, stiffness: 400) |
| Card tap | Scale 1.0 → 0.99 + brightness -2% | 100ms | spring |
| List item entering | Fade + slide-up (8pt) | 200ms staggered 50ms | Layout.springify() |
| Tab change | Crossfade | 150ms | linear |
| Chart entrance | Path draw left-to-right | 400ms | ease-out |
| Number change (e.g., remaining calories) | Tween between values | 400ms | spring |
| Set logged confirmation | Checkmark scale 0 → 1 + opacity 0 → 1 | 200ms | spring |
| Sync indicator (queued → synced) | Color tween + brief scale pulse | 300ms | linear |

### 7.3 Signature interactions

These are the moments worth crafting.

**Set complete tick.**
When you log a set, the row gets a checkmark. The check appears with a spring scale + a haptic tick. The weight/reps text shifts to neutral/600 (de-emphasized — done with this one).

**Weekly check-in submit.**
After the multi-step flow, the submit button presses, fills with success/500, the screen dims slightly, a clean checkmark fades in centered, then the screen transitions to "Generating your weekly report..." with the SSE stream taking over. Earned weight, no party.

**Photo comparison reveal.**
Two photos side-by-side. Tap "Compare" — both photos subtly zoom in (1.0 → 1.02), AI streaming begins below. As text streams, a thin brand/blue/500 hairline traces under the active sentence. At final, hairline vanishes, photos relax back, recommendations slide up from below.

**Today card progress arc.**
The hero on Home. Calorie progress as a circular arc, brand/blue/500 fill, animating from 0 to current value on every entry to the screen (300ms ease-out). Number inside ticks up via tween. As you log meals throughout the day, the arc fills smoothly (200ms spring).

**Day strip selection.**
Tapping a day in the workout week strip slides the active indicator (a 4pt brand/blue/500 underline) to the new day, 200ms spring. Combined with subtle haptic selection.

### 7.4 What NOT to animate

- Page content fading in over data load. Use skeletons instead — predictable, not jarring.
- "Hello!" splash screens with extended logo animation. Splash is < 800ms.
- Confetti, fireworks, glow effects on completing a workout. Quiet success. Maybe an optional celebratory haptic, but no visual party.
- Numbers rolling odometer-style. Tween, don't roll.

---

## 8. Haptics

Underused in most fitness apps. Done well, makes the app feel premium.

Library: `expo-haptics` for MVP. Wrapped in a `useHaptic()` hook that respects user settings (Settings > Notifications > Haptics toggle).

### 8.1 Haptic mappings

| Trigger | Haptic |
|---|---|
| Tab change | `selection` |
| Day change in week strip | `selection` |
| Button press (any) | `impactLight` |
| Set logged | `impactMedium` |
| Workout complete | `notificationSuccess` |
| Meal logged | `impactLight` |
| Weekly check-in submitted | `notificationSuccess` |
| Photo captured | `impactMedium` |
| AI suggestion accepted | `selection` |
| AI suggestion rejected | `selection` |
| Error toast | `notificationError` |
| Warning toast (approaching calorie limit) | `notificationWarning` |
| Sync completed | (none — silent is fine) |
| Long-press start | `impactHeavy` |
| Pull-to-refresh threshold | `impactMedium` |

### 8.2 Rules

- Never haptic on every render. Only on user-initiated actions.
- Never two haptics within 100ms of each other.
- Allow user to disable globally.
- Test on real device — simulator has no haptic engine.

---

## 9. Empty states

Empty states are first impressions of features. Each tab needs one before the user has data. Pattern:

- Centered Lucide icon (48 pt, neutral/300).
- Title (text/title-3, neutral/800).
- One-line description (text/body, neutral/500).
- Optional primary CTA.
- Vertically centered in available space.

Examples:

- **No prep yet:** Icon: `Target`. "No prep set up." "Set up your first prep to start tracking." [Set up prep]
- **No workouts logged for today:** Icon: `Dumbbell`. "Rest day." "No workout scheduled for today. Looking for some movement? [Start a workout]"
- **No photos:** Icon: `Camera`. "Add your first progress photo." "Photos help you (and the AI) see real change over time." [Take photo]
- **No competitions saved:** Icon: `Trophy`. "Browse upcoming shows." "Find a competition that fits your prep window." [Search]

### 9.1 Loading states

- Lists: 3-5 skeleton rows (neutral/100 background, neutral/200 shimmer at 8% opacity, 1.5s loop).
- Cards: shape-matching skeleton (same dimensions as final content).
- Charts: empty axes with subtle pulse on title.
- Streaming AI: animated 3-dot loader in brand/blue/500.

Never spinner-only. Spinners are 2014.

### 9.2 Error states

- Toast for transient (network, retry available).
- Inline message for persistent (rate limit, cost cap).
- Full-screen for catastrophic (sign out + back to sign-in).

Friendly, action-oriented copy. Never "Error 500." Always: "We couldn't reach the server. [Retry]."

---

## 10. Onboarding visual treatment

The onboarding flow is the user's first taste of the app's character. It should feel deliberate but not slow.

- Full-screen pages with single-purpose UI per step.
- Hero illustration or simple typography per step (no stock photos).
- Progress dots at top showing position in the flow.
- Smooth left-to-right transitions between steps.
- Skip / Back / Continue affordances always visible.
- Final "Done" screen has the one earned animation: a clean check mark with spring scale, then auto-routes to Home after 1.2s.

---

## 11. Photography direction

Progress photos are the most personal content in the app. Treatment:

- Display on white (or neutral/50 in dark mode).
- 16 padding minimum around photo on photo-detail screens.
- 12 radius rounded corners.
- No filters, no overlays, no vignettes.
- Compare view: side-by-side with 8 px gap, equal heights, same aspect ratio.
- Timeline thumbnails: 3-column grid, 4 px gaps, square crop, week label below.

The app respects the photos. No "fun" treatment.

---

## 12. Accessibility

Not optional. All of this also makes the app usable in the gym with sweaty hands.

### 12.1 Color contrast

- Body text on white: WCAG AA (≥ 4.5:1) — neutral/700 hits this.
- Hero numerals on white: WCAG AAA (≥ 7:1) — neutral/900.
- Brand blue on white for buttons/text: WCAG AA — brand/blue/600 for text, brand/blue/500 acceptable for non-text UI.
- Status colors verified against neutral backgrounds.

### 12.2 Dynamic Type

All text uses iOS Dynamic Type. Type scale tokens map to system text styles where possible.

### 12.3 VoiceOver

Every interactive element has an accessibility label. Decorative icons are aria-hidden. Charts have summary labels (e.g., "Weight trend, currently 84.2 kilograms, down 0.3 kilograms over 7 days").

### 12.4 Reduced motion

iOS Reduce Motion respected. When enabled:

- All spring animations fall back to opacity transitions.
- Sheets fade rather than slide.
- Page transitions become crossfades.
- Charts skip path-draw animation.

### 12.5 Tap targets

44 pt minimum. 56 pt for high-frequency actions in the gym (set logger).

---

## 13. Brand voice in microcopy

The app talks to Ebuka. The voice:

- Direct, never bossy.
- Knowledgeable but not preachy.
- Uses the user's name occasionally, not constantly.
- Avoids fake-friendly ("Awesome!", "You crushed it!"). Saves enthusiasm for moments that earn it.
- Uses bodybuilding language correctly. "RPE 8 felt right today." not "Wow, you went hard!"
- Empathic on harder days. "Sleep was rough this week — coach is recommending a deload."

Examples:

- Set logged: just the haptic and a checkmark. No text.
- Workout complete: "Workout logged. 6 exercises, 18 sets, 45 minutes."
- Weekly report ready: "This week's report is ready."
- Approaching calorie limit: "300 calories left for the day."
- Over calorie limit: "150 over today. AI will adjust tomorrow."
- Sync error: "Couldn't sync your last set. We'll retry automatically."

Never:
- "Yay!"
- "Way to go, champ!"
- "You're a beast!"
- "Don't give up!"

---

## 14. Apps we're learning from (and what we're taking)

| App | What it does well | What we take |
|---|---|---|
| Hevy | Single-screen workout logging, minimal taps to log a set, clean exercise selection | Set logger flow, exercise picker pattern, day strip |
| Strong | Data density done right, exercise history clarity, no social feed clutter | History views, chart design, no "social" surfaces in MVP |
| ASICS Studio | Calm blue-and-white palette, big confident typography, audio-first calm pacing | Color direction, typography hierarchy, restraint |
| Apple Fitness+ | Hero-numbers-with-context pattern (rings + ring fill in motion) | Today card with progress arc + hero numeral |
| Strava | Activity card pattern, route map embed, social done classy | Activity-card pattern (will use for sessions list later) |
| MyFitnessPal | Bar-and-circle macro breakdowns | Macro display patterns |

What we're explicitly avoiding:
- BetterMe / Noom-style hyper-saturated onboarding with cartoon mascots. No.
- "Your streak!" everywhere apps. We don't gamify the prep — the show is the gamification.
- Any app that puts a leaderboard or social feed in the user's primary view.

---

## 15. Implementation notes for engineering

- All tokens live in `src/constants/theme.ts` exported as a typed object. Tailwind config reads from there.
- NativeWind classes used where they're cleaner than StyleSheet (most layouts, simple variants). StyleSheet for complex animated styles.
- Reanimated worklets for any animation tied to gesture or scroll.
- Moti for declarative entry/exit animations on simple components.
- Haptics centralized in `src/lib/haptics/` with `useHaptic()` hook.
- All animations respect `useReducedMotion()`.
- Icon imports tree-shaken: `import { Dumbbell } from 'lucide-react-native'` per file, not barrel imports.

---

## 16. Debug panel (shake to report)

Built into the app from the start. Available in dev and TestFlight builds; gated off in App Store production.

### 16.1 Trigger

Shake gesture activates an iOS-style action sheet via `expo-sensors` accelerometer subscription. Threshold tuned so a casual phone bump doesn't fire it but a deliberate shake does (typical: magnitude > 1.8 over 200ms, with 3s cooldown after open).

Fallback: triple-tap on the version number in Settings opens the same panel. Accelerometer can be unreliable on some hardware and the gesture is occasionally suppressed by other libraries.

### 16.2 Panel UI

Bottom sheet, full-height (90% screen). Same visual language as other sheets — drag handle, 16 radius, neutral/0 background.

Contents top to bottom:

- **Title:** "Report an issue"
- **Subtitle:** "Tell us what went wrong. We'll attach context automatically."
- **Text area:** Free-form description, multiline, `text/body`, neutral/100 fill, 16 padding, min 6 rows. Placeholder: "What happened? What were you trying to do?"
- **Auto-attached context section** (collapsible, default expanded):
  - App version + build number
  - User ID (hashed)
  - Current route / screen name
  - Active prep ID + week number
  - Last 50 console log lines (in-memory ring buffer; we maintain this regardless of debug panel)
  - Last 20 network requests (method, URL, status, duration — bodies redacted by default)
  - Device info: model, OS version, locale, timezone
  - Sentry replay ID (if Sentry session replay is enabled)
  - Sync state: PowerSync queue depth, last successful sync, online/offline
- **Optional toggle:** "Include screenshot" — captures current screen via `expo-screen-capture`. Default on.
- **Optional toggle:** "Include recent network bodies" — default OFF (privacy). When on, includes request/response bodies from last 5 calls, with sensitive headers stripped.
- **Submit button:** primary, full-width, "Send report."
- **Cancel button:** ghost, full-width below.

### 16.3 Submission flow

For MVP, the API doesn't exist yet — but the client treats it as if it does:

1. Build a `DebugReport` payload (shape below).
2. POST to `/debug-reports` on the backend.
3. If endpoint returns 404 or 501 (i.e. not implemented yet), fall back to:
   - Save the report locally (`expo-file-system` to `documents/debug-reports/<uuid>.json`).
   - Show success toast: "Report saved locally. We'll upload when the endpoint is ready."
   - On every app foreground, attempt to upload any locally-saved reports; remove on success.
4. If endpoint returns 200/201, show success toast: "Report sent. Thanks."
5. If endpoint errors out (5xx, network), save locally and retry on foreground.

This means we ship the feature now, the local queue starts collecting reports immediately, and the backend endpoint can be added at any time and we'll automatically backfill.

### 16.4 Payload shape

```ts
interface DebugReport {
  id: string;                          // client-generated UUID
  created_at: string;                  // ISO8601
  client_version: string;              // app version
  build_number: string;
  user_id_hashed: string;
  description: string;                 // user's free-text
  context: {
    route: string;                     // current route path
    prep_id: string | null;
    week_number: number | null;
    sync_state: {
      online: boolean;
      queue_depth: number;
      last_sync_at: string | null;
    };
    device: {
      model: string;
      os: string;
      os_version: string;
      locale: string;
      timezone: string;
    };
    sentry_replay_id: string | null;
  };
  logs: LogEntry[];                    // last 50 lines from log buffer
  network: NetworkEvent[];             // last 20 requests, optionally with bodies
  screenshot?: string;                 // base64 PNG, optional
}

interface LogEntry {
  timestamp: string;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  context?: Record<string, unknown>;
}

interface NetworkEvent {
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  duration_ms?: number;
  request_body?: string;               // only if user opted in
  response_body?: string;              // only if user opted in
  request_id?: string;                 // matches backend request_id
}
```

### 16.5 Plumbing required

These need to exist *before* the panel works:

- **Log ring buffer** in `src/lib/logger.ts`: in-memory circular buffer of last 50 log entries.
- **Network ring buffer** in `src/api/client.ts`: tracks last 20 requests with metadata (bodies excluded by default).
- **Shake detector** in `src/lib/debug/shake-detector.ts`: accelerometer subscription with threshold + cooldown.
- **Debug context provider**: pulls current route, prep, sync state on demand.
- **Local report queue** in `src/lib/debug/report-queue.ts`: persists to disk, drains on foreground.

### 16.6 Privacy

- User's photo content is **never** in a debug report.
- Meal log free-text is **never** in a debug report.
- Network bodies are off by default and require explicit opt-in per report.
- Sensitive headers (`Authorization`, `Cookie`) are stripped from the network log unconditionally.
- Logs are scrubbed of any string matching JWT pattern before inclusion.

### 16.7 Production gating

In App Store production builds, the shake handler is registered but does nothing — the panel does not open. The triple-tap fallback in Settings is removed entirely. We can override this for a specific user with a remote config flag if we ever need to debug in production. For MVP, the simpler rule: dev + TestFlight only.

---

## 17. What's out of scope for this design system

- Dark mode tokens (specified later).
- Custom illustration set (deferred; Lucide + thoughtful empty states for MVP).
- Lottie animations (no MVP need).
- Custom typeface (no MVP need).
- iPad layouts (works but not designed for tablet).
- Apple Watch design.
- Social/community surfaces (no plan to add).
- Marketing site / landing page.