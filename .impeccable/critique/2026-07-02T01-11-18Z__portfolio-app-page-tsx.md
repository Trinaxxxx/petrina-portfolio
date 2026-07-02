---
target: homepage (app/page.tsx)
total_score: 32
p0_count: 0
p1_count: 1
timestamp: 2026-07-02T01-11-18Z
slug: portfolio-app-page-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll progress + graceful media placeholders; no loading state for iframes |
| 2 | Match System / Real World | 4 | Copy stays numbers-first and precise throughout |
| 3 | User Control and Freedom | 3 | Lightbox/breadcrumb exits exist; no forms/flows to need more |
| 4 | Consistency and Standards | 3 | Copper=links / olive=data now holds, except one residual numbered eyebrow |
| 5 | Error Prevention | 4 | `onError` media fallback degrades gracefully everywhere |
| 6 | Recognition Rather Than Recall | 3 | Breakdowns sidebar keeps context; case-study pages lack a jump/TOC |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts or in-page jump links for skimming long case studies |
| 8 | Aesthetic and Minimalist Design | 4 | Restrained, no gradients/rounded-tiles; grid-line pattern reads considered |
| 9 | Error Recovery | 3 | No broken states observed; graceful fallback confirmed |
| 10 | Help and Documentation | 3 | Self-evident interface; case studies double as documentation |
| **Total** | | **32/40** | **Good, trending toward Excellent** |

**Trend: 33 → 30 → 32**

#### Anti-Patterns Verdict

**LLM assessment**: All three fixes verified live and correct — `process.tsx` Step 01-05 and `CaseStudyPage.tsx` Workflow steps render olive (not copper); the Benchmarks table's Verdict column renders plain bone (`rgb(216,209,187)`), matching the Metric column; both case-study nav variants show plain "PK". One residual instance of the same pattern slipped through: **`lib/case-studies.ts:47` — `eyebrow: "Case Study — 02"`** still renders in the case-study hero breadcrumb. The earlier fix targeted the 7 in-page section labels but missed this hero-level field. Worth noting: there's currently only one entry in the case-studies data array, so "02" is an orphaned number with no "01" anywhere — it reads as an artifact, not a real sequence.

Separately (not a fix miss, a judgment call worth confirming): the Q&A grid still labels items "Q01/Q02/Q03" (`CaseStudyPage.tsx:793`). This is a different, more defensible case than the section kickers — it's literally numbering distinct question items in a grid, a normal FAQ convention, not a decorative eyebrow repeated above unrelated content. Flagging for a conscious yes/no rather than auto-changing it.

**Deterministic scan**: CLI/AST scan stays clean (0 findings). Browser-runtime overlay **confirms `repeated-section-kickers` no longer fires** on `/case-study/alpha-planes` — the fix is verified working at the DOM level, not just in source. Other overlay findings persist unchanged from the last scan (tiny-text, wide-tracking, overused-font/Inter, layout-transition, long paragraph lines up to ~184 chars) — none of these were part of this round's fix scope. One new-to-this-scan finding: `body-text-viewport-edge` on the homepage — 3 paragraphs (~124 chars) bleed to the viewport edge (0px left/right), worth a look.

**Visual overlay**: injection succeeded and ran live across all three routes during the scan; the live-server has since been stopped, so nothing is currently visible in-browser to inspect — findings above are transcribed from that run.

#### Overall Impression

The three targeted fixes landed cleanly and are verified both in source and live DOM — copper now means "click," olive means "data," and the section-kicker AI-scaffolding pattern is gone from the case-study page. Score moved 30 → 32. The one thing that slipped through is small but pointed: the exact same numbered-eyebrow instinct that was just fixed everywhere else still exists in one place the fix didn't reach.

#### What's Working

1. **All three prior fixes verified correct, not just applied** — confirmed via `preview_inspect` computed styles and DOM presence checks, not just source-reading.
2. **The 1px-grid-line "table" pattern** (border-as-gridline across Process, stats, and case-study grids) remains a distinctive, non-templated structural signature.
3. **Copy discipline holds** — every description leads with a number or concrete verb, zero filler adjectives.

#### Priority Issues

**[P1] One numbered-eyebrow instance survived the sweep**
- **Why it matters**: `study.eyebrow: "Case Study — 02"` (`lib/case-studies.ts:47`) is the identical pattern just fixed everywhere else, and it's an orphaned number (no "01" exists in the data). A sharp reviewer who notices the fix elsewhere could read this as an inconsistency rather than a deliberate choice.
- **Fix**: drop the "— 02" suffix, or replace with something meaningful (project year, or just "Case Study").
- **Suggested command**: `/impeccable clarify`

**[P2] No in-page section jump/TOC on case-study pages**
- **Why it matters**: each case study runs ~9 sections; a hiring manager skimming several case studies back-to-back has no way to jump straight to Results/Benchmarks without a full linear scroll each time.
- **Fix**: add anchor links in the case-study nav, or a small sticky mini-TOC.
- **Suggested command**: `/impeccable layout`

**[P2] Verdict/Metric color parity loses the "so what" cue**
- **Why it matters**: now that Verdict is plain bone (matching Metric), the table's three-part before/after/result story relies entirely on the middle "Alpha Mass Model" olive column — a fast skim or colorblind reader may lose the payoff column.
- **Fix**: add a non-color cue on Verdict cells (bold weight, or a small ✓ glyph) without reintroducing copper's false-affordance problem.
- **Suggested command**: `/impeccable polish`

**[P3] `body-text-viewport-edge` — paragraphs bleeding to 0px edge**
- **Why it matters**: 3 homepage paragraphs (~124 chars) touch the viewport edge with no padding — likely a narrow-viewport/mobile issue.
- **Fix**: verify padding/max-width on the affected prose blocks at mobile widths.
- **Suggested command**: `/impeccable adapt`

#### Persona Red Flags

**Hiring manager**: still most likely to pause at the Environment "Coming Soon" placeholder (known, deferred) — positioned between the site's two strongest sections.
**Fellow technical artist**: will likely scrutinize the Benchmarks table hardest post-fix — the change is correct, but they may consciously notice Verdict no longer "pops" and wonder if that was intentional.

#### Minor Observations

- Q01/Q02/Q03 in the Q&A grid — contextually defensible (FAQ-style numbering), but worth a deliberate keep/change decision rather than leaving it as an oversight.
- Case-study nav (`CaseStudyNav`/`PipelineNav`) links are `hidden md:flex` with no visible mobile fallback — worth confirming it degrades acceptably below 768px.
- PipelineX's `f.num` (feature numbers) are correctly olive and read as non-clickable — good, consistent with the fix.

#### Questions to Consider

1. If "Case Study — 02" implies an ordered portfolio, does the homepage's own separate 01–04 project numbering ever need to relate to it, or are these two numbering systems meant to stay independent?
2. Now that Verdict is plain bone, is the Benchmarks table's story still readable in under 3 seconds, or does it now require reading the Metric label first?
3. Is "Coming Soon" better positioned between Projects and Process long-term, or would it land softer as the final section before Contact?
