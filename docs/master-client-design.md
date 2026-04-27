# PrepAI Client — Master Technical Design

**Status:** Source of truth for the client.
**Scope:** React Native mobile app (iOS-first). Visual design is a separate doc.
**Owner:** Ebuka.

---

## 1. Product summary

PrepAI client is a single-user iOS app (Android-capable later) for tracking a 16-week classic-physique prep. It is an offline-first thin layer over the PrepAI backend. The backend is the source of truth; the client mirrors a per-user slice into local SQLite via PowerSync and queues writes when offline.

The app has five tabs: Home, Workouts, Food, Progress, Competitions. Settings is a sub-screen reachable from Home.

---

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Expo SDK 52+ (React Native) | iOS-first; Android works but secondary |
| Language | TypeScript (strict) | No `any` without explicit comment |
| Navigation | Expo Router | File-based routing, deep links, modals |
| Local DB + sync | PowerSync (with `@powersync/react-native`) | Offline-first; bi-directional sync to Supabase Postgres |
| Server state | TanStack Query | For reads that don't use PowerSync (e.g. AI streaming, search) |
| UI state | Zustand | Modals, form drafts, current selections |
| Forms | React Hook Form + Zod | Schemas shared with backend types |
| Styling | NativeWind (Tailwind for RN) | Visual design doc will define tokens |
| Animations | Reanimated 3 + Moti | Smooth transitions, sheets, gestures |
| Charts | Victory Native XL | Trends and comparisons |
| Camera | expo-camera + expo-image-manipulator | Capture + compression |
| Notifications | expo-notifications | Local for MVP; push scaffolded |
| Push (post-MVP) | Expo Push (APNs) | Token registered with backend on first launch |
| Health | react-native-health (HealthKit) | Read steps/active energy/weight |
| Storage uploads | expo-file-system + presigned PUT | Direct to Supabase Storage |
| Icons | Lucide React Native | Consistent set |
| Testing | Jest + React Native Testing Library, Maestro for E2E | |
| Build/deploy | EAS Build + EAS Submit | TestFlight first |

---

## 3. Engineering decisions and tradeoffs

### 3.1 Offline-first with PowerSync, not hand-rolled

We chose PowerSync because:

- It's purpose-built for Supabase Postgres ↔ SQLite.
- It handles the queue, retries, conflict resolution, and partial replication that we'd otherwise hand-roll.
- It integrates with Supabase Auth JWTs and RLS — sync rules use the same `auth.uid()` predicates as the backend.
- "Consistency by construction" — SQLite on device is always a valid view of Postgres. Last-write-wins matches our single-device-per-user model.

Tradeoff: a new dependency and a sync rules config. Both are small relative to writing our own sync engine.

### 3.2 The split: PowerSync vs TanStack Query

Not everything is PowerSync-managed. The split:

**PowerSync (synced tables, available offline):**
- `profile`, `prep`, `weekly_plan`
- `workout_template`, `workout_day`, `exercise`
- `workout_session`, `set_log`, `cardio_log`
- `meal_plan`, `meal_log`, `weight_log`, `measurement_log`
- `photo` metadata, `check_in`, `check_in_photo`
- `ai_report`
- `saved_competition`
- `canonical_exercise`, `exercise_alias` (read-only on client)

**TanStack Query (online-only fetches, cached in memory):**
- AI endpoints (`POST /ai/*`) — proposals, never persisted client-side until accepted.
- Competition search (`GET /competitions/search`) — lots of data, rarely needed offline; cached for a session.
- Restaurant search (`POST /ai/restaurants-near`) — location-bound, online-only.
- File presigned URL requests — transient.
- SSE streams (`compare-photos`, `weekly-report`) — handled with a custom hook over `fetch` + `ReadableStream`; final result lands in PowerSync via the backend persisting it.

### 3.3 The split: TanStack Query vs Zustand

- **TanStack Query** owns *anything fetched from the server* that isn't already in PowerSync.
- **Zustand** owns *anything the server never sees*: open modals, current selected day in the workout view, form drafts, "which body part is selected on Progress," draft AI suggestions before user accepts them.

Rule: if it's persisted on the server, PowerSync. If it's transient server data, TanStack Query. If the server doesn't know about it, Zustand.

### 3.4 Writes always go to local first

Every user-initiated write goes through PowerSync's local SQLite write API. PowerSync queues the upload to Supabase Postgres in the background. The UI re-renders immediately from local state. If the device is offline, the queue holds; when online, it drains.

This means **the UI never blocks on the network** for normal logging operations (sets, meals, weights, measurements). It does for AI features by design — those are explicitly online operations and the UI surfaces a "queued" or "processing" state.

### 3.5 Auth via backend, not direct Supabase

The client never talks to Supabase Auth directly. Flow:

1. Client calls `GET /auth/google/start` on backend → receives an OAuth URL.
2. Client opens the URL in `expo-web-browser` (in-app browser session).
3. Browser completes Google OAuth → redirects back to a deep link the app handles.
4. App calls `POST /auth/google/callback` with the code → backend returns sanitized session (`access_token`, `refresh_token`, `expires_at`, `user`).
5. Client stores tokens in `expo-secure-store` (Keychain on iOS).
6. PowerSync is initialized with the `access_token`.
7. On token expiry, client calls `POST /auth/refresh` → updates secure store and PowerSync token.

This keeps Supabase as a backend implementation detail. If we ever switch auth providers, the client doesn't change.

### 3.6 Photo flow

1. User captures with `expo-camera`.
2. Image manipulated to ≤2048px long edge, JPEG quality 85, saved to local files.
3. Client calls `POST /files/upload-url` → presigned PUT.
4. Client uploads with `expo-file-system` directly to Supabase Storage.
5. Client calls `POST /preps/{id}/photos` with the storage key → server creates metadata row.
6. PowerSync replicates the metadata row to local SQLite.
7. Photo appears in the UI.

If offline at step 3, the photo is queued: the local file path + intended metadata is saved to a Zustand-backed `photo_upload_queue` slice (persisted via `expo-file-system`). On reconnect, the queue drains.

### 3.7 Notifications: local now, push soon

For MVP:
- Local notifications scheduled by the client via `expo-notifications`.
- Daily check-in reminder (default 9pm), weekly check-in (Sunday 9am), optional pre-workout, optional meal reminders.

Scaffolding for push:
- `expo-notifications` requests permissions and obtains a push token at first launch.
- Client calls `POST /devices/register-push-token` with the token.
- Backend stores it in a `push_token` table (one row per user per device).
- Server endpoint to send pushes is **not** built in MVP — the table just exists.

When push is wired up post-MVP, no client refactor is needed. The token is already being sent.

### 3.8 HealthKit minimal scope

For MVP:
- Read steps (rolled into Home today card).
- Read active energy.
- Read body weight (offer to import on weight log screen).
- No writes to HealthKit.

Heart rate, sleep, workouts written back, etc., explicitly deferred.

### 3.9 Workout authoring lives in two places

- **Onboarding:** First-time setup includes building Week 1 (NL paste or direct entry).
- **Workouts tab:** Edit-week sheet reachable anytime. Most weeks are auto-generated server-side from prior week + AI; manual editing is the escape hatch.

### 3.10 Single-user-per-device

No account switcher in MVP. Sign-out clears local data and tokens. To switch users, sign out and sign in. PowerSync's local DB is keyed to user_id; sign-out triggers a database wipe before next sign-in.

### 3.11 What we explicitly defer

- Account switcher.
- Apple Sign-In (added pre-TestFlight).
- Push notifications wired up (token capture only).
- HealthKit writes; heart rate; sleep.
- Watch app.
- iPad layout (works but unstyled for tablet).
- Dark mode toggle (visual design doc decides default; toggle later).
- Background sync optimization beyond PowerSync defaults.
- Multi-device sync (we have one device per user; PowerSync supports many but we don't UX for it).

---

## 4. App structure

### 4.1 Tabs

- **Home** — today card (week, phase, calories, today's workout, today's meals, steps), quick actions.
- **Workouts** — week strip, day view, set logger, edit-week.
- **Food** — today view, meal logger, mid-day chat, week meal planner.
- **Progress** — body-part timeline, photo capture, weekly check-in flow, AI weekly report, photo compare.
- **Competitions** — search, saved shows, current target.

### 4.2 Off-tab screens

- **Onboarding flow** (modal stack, runs on first launch when no profile exists).
- **Settings** (reachable from Home avatar tap).
- **AI proposal screens** (modal sheets shown after AI endpoint returns; user accepts/rejects).

### 4.3 File-based routing layout (Expo Router)

```
app/
  _layout.tsx                          // Root: providers, auth gate, PowerSync init
  index.tsx                            // Splash → routes to onboarding or tabs

  (auth)/
    sign-in.tsx                        // Google sign-in screen

  (onboarding)/
    _layout.tsx                        // Modal stack
    welcome.tsx
    profile-chat.tsx                   // NL onboarding chat with backend
    review-profile.tsx                 // Confirm extracted fields + show narrative
    select-competition.tsx             // Pick target show
    review-prep.tsx                    // Confirm prep config
    setup-week-1.tsx                   // NL paste or direct entry for first week
    done.tsx

  (tabs)/
    _layout.tsx                        // Tab bar
    home/
      index.tsx
    workouts/
      index.tsx                        // Week strip
      [day].tsx                        // Day view
      exercise/[id].tsx                // Set logger
      edit-week.tsx                    // NL paste + diff modal
      history/[canonicalId].tsx        // Per-exercise history
    food/
      index.tsx                        // Today view
      plan-week.tsx                    // Weekly meal planner
      meal/[id].tsx                    // Meal detail / log
      chat.tsx                         // Mid-day coach chat (Food only for MVP)
      restaurants.tsx                  // Restaurant lookup results
    progress/
      index.tsx                        // Body-part timeline
      check-in.tsx                     // Weekly check-in flow
      compare.tsx                      // Photo compare
      reports/[id].tsx                 // AI weekly report viewer
    competitions/
      index.tsx                        // Search + saved
      [id].tsx                         // Detail

  settings/
    index.tsx
    profile.tsx
    notifications.tsx
    units.tsx
    data-export.tsx
    sign-out.tsx
```

### 4.4 Module structure

```
src/
  api/                                 // Typed backend client
    client.ts                          // fetch wrapper with auth + retry
    endpoints/                         // One file per resource group
      auth.ts
      profile.ts
      preps.ts
      workouts.ts
      meals.ts
      progress.ts
      competitions.ts
      ai.ts
      files.ts
      devices.ts
    sse.ts                             // SSE handler
    schemas.ts                         // Zod schemas mirroring backend
  db/                                  // PowerSync setup
    schema.ts                          // Local SQLite schema (mirrors synced tables)
    powersync.ts                       // Database instance + sync rules client config
    queries/                           // Reusable read queries (returns observable)
      profile.ts
      prep.ts
      workouts.ts
      meals.ts
      progress.ts
    mutations/                         // Local writes that PowerSync syncs
      log_set.ts
      log_meal.ts
      log_weight.ts
      ...
  features/                            // Feature-grouped UI logic
    auth/
    onboarding/
    home/
    workouts/
    food/
    progress/
    competitions/
    settings/
  components/                          // Cross-feature reusable UI
    ui/                                // Buttons, cards, inputs, sheets
    diff/                              // AI diff accept/reject
    sse-stream/                        // Live SSE rendering
    charts/
  state/                               // Zustand stores
    ui-store.ts                        // Modal state, current selections
    upload-queue-store.ts              // Photo upload queue
    onboarding-store.ts                // Draft state during onboarding flow
  lib/
    auth/                              // Token storage, refresh logic
    notifications/                     // Schedule + permission helpers
    health/                            // HealthKit wrapper
    photos/                            // Capture + compress utilities
    calorie/                           // Local calorie calc (mirrors backend math)
    units/                             // kg↔lb, cm↔in conversion
    time/                              // Timezone-aware date utilities
  config/
    env.ts                             // Runtime config
    constants.ts
```

---

## 5. Data flow

### 5.1 Read path (typical screen)

1. Component mounts.
2. Calls a `db/queries/` function returning a PowerSync observable query.
3. Query reads from local SQLite. Returns immediately with cached data.
4. PowerSync continues to push updates from server in background; observable re-emits when local DB changes.
5. UI re-renders automatically via React hook (`usePowerSyncQuery` or similar).

No network in the hot path. UI never blocks on fetch.

### 5.2 Write path (typical user action, e.g. log a set)

1. User taps "Done" on set logger.
2. Component calls a `db/mutations/log_set.ts` function.
3. Function writes to local SQLite via PowerSync's transactional write API.
4. Local DB emits change → all subscribed queries re-render with new state.
5. PowerSync queues the row for upload to Postgres.
6. When online, upload succeeds; row's sync state flips to "synced."
7. If offline, queue persists; uploads when online.

UI shows "synced" / "syncing" / "queued offline" indicator on the set logger if relevant.

### 5.3 AI request path (e.g. parse-workout)

1. User pastes text, taps "Parse."
2. Component calls TanStack Query mutation pointing at `POST /ai/parse-workout`.
3. Loading state shown.
4. Response returns parsed template + suggestions. Held in component state (or onboarding Zustand store).
5. User reviews diff, accepts/rejects per item.
6. On confirm, component calls `POST /preps/{id}/workout-templates` with the final structure.
7. Backend writes to Postgres.
8. PowerSync pulls the new rows to local SQLite.
9. UI re-renders from local state.

The proposal lives in component/Zustand state, not PowerSync. Only the *accepted* version becomes synced data.

### 5.4 SSE path (e.g. compare-photos)

1. User picks two photos and a body part, taps "Compare."
2. Component opens an SSE stream to `POST /ai/compare-photos`.
3. Stream events render live: progress dots, then text deltas appended.
4. On `final` event, the result is a row written to backend.
5. PowerSync replicates the `ai_report` (or compare result) row to local SQLite.
6. Stream closes; UI shows the persisted row.

### 5.5 Photo upload path

1. User takes a photo on check-in screen.
2. `expo-camera` returns a local URI.
3. `expo-image-manipulator` resizes to ≤2048px / Q85.
4. Resized file saved to local app cache.
5. **If online:**
   a. Call `POST /files/upload-url` → get presigned URL + storage_key.
   b. PUT to presigned URL via `expo-file-system`.
   c. Call `POST /preps/{id}/photos` with the storage_key.
   d. Backend writes metadata row.
   e. PowerSync replicates the metadata to local SQLite.
6. **If offline:**
   a. Add to `upload-queue-store` with: local URI, intended metadata, retry count.
   b. UI shows photo with "queued" badge from local URI.
   c. On reconnect, drain queue: presigned URL → PUT → register.
   d. Replace local URI reference with the synced photo row.

Queue is persisted to disk so it survives app restart.

---

## 6. State management rules

- **PowerSync first.** If the data exists on the server, it lives in PowerSync.
- **TanStack Query for online-only.** Anything fetched but not synced (AI proposals, search results, presigned URLs).
- **Zustand for ephemeral UI.** Modal open/closed, currently-selected day, draft form values, accept-reject diff state.
- **No prop drilling.** If two unrelated components need the same UI state, it goes in Zustand.
- **No global mutable state outside these three.** No `useContext` for state; contexts only for stable services (`PowerSyncProvider`, `QueryClientProvider`, theme).

---

## 7. Auth and session lifecycle

### 7.1 Storage

- Access token + refresh token + expiry in `expo-secure-store` (iOS Keychain).
- User profile row replicated by PowerSync into local SQLite.

### 7.2 App start

1. App reads tokens from secure store.
2. If no tokens → route to `(auth)/sign-in`.
3. If tokens present and not expired → initialize PowerSync with token, route to `(tabs)/home/`.
4. If tokens present but expired → call `POST /auth/refresh`. On success, init PowerSync. On failure, route to sign-in.

### 7.3 Mid-session

- API client wraps every fetch.
- On `401`: try refresh once; if it succeeds, retry the original request; if it fails, force sign-out.
- PowerSync's auth callback returns the current valid token to its sync engine.

### 7.4 Sign-out

1. Cancel any in-flight requests.
2. Stop PowerSync sync.
3. Wipe local SQLite database.
4. Clear secure store.
5. Clear Zustand stores.
6. Call `POST /auth/sign-out`.
7. Route to sign-in.

---

## 8. Onboarding flow

A modal stack overlay on top of the auth gate. Runs on first launch (no profile exists in local DB).

1. **Welcome** — value prop, "Sign in with Google" button.
2. **Profile chat** — chat UI calls `POST /ai/coach-chat` (deferred; for MVP this is a guided form, not a chat). User answers structured prompts: name, age, sex, height, weight, BF estimate, measurements, food preferences, lifestyle context, free-text "tell me about yourself."
3. **Review profile** — extracted structured fields + generated narrative shown for confirmation. User can edit any field.
4. **Select competition** — `GET /competitions/search` for shows in next 16+ weeks. User picks one or chooses "no specific show."
5. **Review prep** — auto-generated prep config (16 weeks, target weight, target BF, phase split) shown. User can adjust targets.
6. **Set up week 1** — option A: paste NL workout text → AI parse → diff. Option B: skip, build later. Option C: pre-fill a default classic-physique split.
7. **Done** — create profile via `POST /profile/initialize`, create prep via `POST /preps`, create week 1 template, route to home.

Onboarding state held in `onboarding-store.ts` (Zustand) until the final commit that writes to backend + waits for PowerSync to replicate.

---

## 9. Notifications

### 9.1 Permission flow

- On first run, after sign-in, app asks for notification permission via `expo-notifications`.
- If granted, app obtains push token (for future use) and calls `POST /devices/register-push-token` to register it with backend.
- If denied, app continues; user can enable in Settings later.

### 9.2 Local schedules (MVP)

- **Daily check-in:** every day at user-configured time (default 21:00 local). Tapping opens the quick-log sheet on Home.
- **Weekly check-in:** every Sunday at user-configured time (default 09:00 local). Tapping opens the check-in flow on Progress.
- **Pre-workout:** optional, user-configurable.
- **Meal reminders:** optional, per-slot, user-configurable.

Schedules are managed by `lib/notifications/` and stored in Zustand + persisted.

### 9.3 Push (post-MVP)

When wired up:
- Backend triggers push for: weekly report ready, AI compare-photos result ready, milestone achievements, custom coach nudges.
- Token already on file from MVP scaffolding; no client refactor.

---

## 10. HealthKit (minimal MVP)

- On first launch (or first time Home tab opens), app requests HealthKit read permission for: step count, active energy, body weight.
- Home today card displays today's step count vs step floor.
- Weight log screen offers "Import from Health" button to pull most recent body weight and prefill log.
- All HealthKit code isolated in `lib/health/`. Read-only. No subscriptions, no background queries.

---

## 11. Performance budgets

- **App cold start to interactive Home:** ≤ 2s on iPhone 13+.
- **Tab switch:** ≤ 100ms.
- **Set log save:** ≤ 50ms (local SQLite write).
- **First read from local DB on screen mount:** ≤ 50ms.
- **AI request first byte:** ≤ 3s on good network; user sees a loading indicator within 100ms regardless.
- **Photo capture → compressed file ready:** ≤ 1s.
- **List rendering:** FlashList for any list > 20 items.

---

## 12. Error handling

- **Network errors:** writes queue silently; reads return cached data with a stale indicator.
- **Auth errors (401):** auto-refresh once, force sign-out on second failure.
- **Validation errors (400):** surface inline next to the offending field.
- **Server errors (5xx):** generic friendly message + "Retry" button + Sentry log.
- **AI errors (rate limit, cost cap, provider error):** specific user-facing message ("AI features paused for the day — try again tomorrow.").
- **PowerSync errors:** logged to Sentry; surfaced as a "Sync issue — tap to retry" banner if persistent.

---

## 13. Observability

- **Sentry RN SDK** for crashes and unhandled errors.
- **Structured logging** to console in dev; redacted in prod.
- **No PII in logs.** No photo bytes, no chat content, no tokens.
- **Performance monitoring** via Sentry's RN performance tooling for screen mounts and key transitions.

---

## 14. Testing

Detail in `client/docs/testing-plan.md` (to be written). Layers:

- **Unit:** lib functions (calorie calc, units, time math), Zustand stores, schema validation.
- **Component:** RN Testing Library on key components (set logger, diff view, photo capture).
- **Integration:** mocked PowerSync DB + mocked API, full screen flows.
- **E2E:** Maestro flows for onboarding, log a set, log a meal, weekly check-in.

---

## 15. Build and release

- **Dev:** `expo start` against staging backend.
- **Staging:** EAS Build → internal TestFlight + Expo Go preview.
- **Production:** EAS Build → public TestFlight → App Store.
- **OTA updates** via EAS Update for non-native changes.
- **Versioning:** semver tied to git tags; build number auto-incremented by EAS.

---

## 16. What's explicitly out of scope for MVP

- Account switcher
- Apple Sign-In (pre-TestFlight)
- Push notifications fully wired (token capture only)
- HealthKit writes / heart rate / sleep
- Apple Watch
- iPad-specific layouts
- Background app refresh tuning
- Localization (English only)
- Coach view, multi-user