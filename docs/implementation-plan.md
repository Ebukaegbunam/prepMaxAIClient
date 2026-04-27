Got it. Let me write a detailed, agent-ready, phase-by-phase plan that weaves the design system work into the build phases — not as a separate track, but baked into each phase. So when an agent implements a screen, the design tokens, the animations, the haptics, the empty/loading/error states are all part of the deliverable.Done. 1,446-line plan, 16 phases, design system woven in.

## Key things I changed from the previous plan

**1. Phase 1 is now pure design system work.** Before any feature screens, an agent builds the entire component library — 14 primitives, the diff view, SSE stream view, charts, haptics hook, reduced-motion utility, plus a hidden demo screen that renders every component for in-app reference. This phase pays for itself across every later phase. Every later screen "just" composes these primitives.

**2. Phase 0 includes the design tokens upfront.** The full `theme.ts` with colors, spacing, radius, typography, elevation, motion is right there in the doc — copy-paste ready. Tailwind config consumes it. An eslint rule (added in Phase 0) bans hardcoded colors, sizes, radii from anywhere else in the codebase.

**3. Every feature phase specifies its design.** When Phase 6 says "Home tab," it doesn't just say "build the home tab." It specifies:
- Today card layout with exact components used (`<StatRing>`, `<StatBar>`)
- Animation specifics (ring fills 0 → current on mount, 300ms ease-out, hero numeral tweens)
- Empty/loading/error states all listed
- Pull-to-refresh haptic (`impactMedium`)
- Reduced-motion fallback explicit

Same pattern for Phase 7 (set logger), Phase 9 (food today view), Phase 11 (progress), etc.

**4. "Exit criteria" now include design system compliance.** Every phase exit checklist requires animations match design system, haptics fire correctly, tokens used (not hardcoded). Not "design polish later" — done now or the phase isn't done.

**5. Phase 1's demo screen is a real engineering tool.** The agent renders every component variant in `/__demo__/`. When a future phase needs a Button, the agent looks at the demo screen first instead of inventing one. Prevents component drift.

**6. The "Cross-cutting requirements" section** is short but blunt: every PR with UI pulls from theme.ts (eslint enforced), every interactive element has its haptic, every animation respects reduced motion, every screen ships with empty/loading/error states.

## Three things to flag

**1. Phase ordering shifted.** Debug panel moved to Phase 3 (between auth and PowerSync). Reason: its infrastructure (log buffer, network buffer) is foundational, and shipping it before PowerSync means we can capture bug reports about PowerSync issues. The Phase 1.5/Backend numbering still works — backend Phase 1.5 (debug endpoint) lines up with client Phase 3.

**2. Phase 1 is the most expensive phase by tokens.** Building 14 primitives + diff + SSE + charts + haptics + demo screen is a meaty chunk. But every later phase becomes shorter because of it. If an agent splits it, do it 1a (primitives) and 1b (diff/SSE/charts/demo).

**3. Two enforcement mechanisms added.** Custom eslint rules: `no-console-log` (Phase 0), `no-hardcoded-design-tokens` (Phase 1). These mean "the design system is non-negotiable" isn't just a doc rule — it's a CI failure. Worth setting up properly because once they exist, every PR is automatically checked.

## What's next

Three real options:

1. **Reorganize all docs** into the actual `backend/` and `client/` repo structure (since they currently live flat under `prepai-docs/`).
2. **Mock up the two highest-stakes screens visually** (Home today card + set logger) using HTML/React, so we catch design issues before code is written.
3. **Move on to building** — start backend Phase 0 or client Phase 0 scaffold.

I'd lean (1) so the docs are ready for the actual repo. Then (2) before any code, since visualizing those two screens will catch any "looks fine in prose, fails in pixels" issues. What do you want?