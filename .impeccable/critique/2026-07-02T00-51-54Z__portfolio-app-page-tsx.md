---
target: homepage (app/page.tsx)
total_score: 30
p0_count: 0
p1_count: 3
timestamp: 2026-07-02T00-51-54Z
slug: portfolio-app-page-tsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Scroll progress + active nav state work well; no loading state for Achievements iframe embeds |
| 2 | Match System / Real World | 4 | Copy is numbers-first and direct ("27ms → 7ms", "96.5%") — reads like an engineer's log |
| 3 | User Control and Freedom | 3 | Lightbox and breadcrumbs exist; no visible Esc/backdrop-click affordance shown |
| 4 | Consistency and Standards | 2 | Copper marks both clickable links AND plain sequence numbers/table cells — breaks color=affordance convention |
| 5 | Error Prevention | 3 | Media placeholders degrade gracefully via `onError`; no equivalent for iframes |
| 6 | Recognition Rather Than Recall | 3 | Breakdowns sidebar keeps all projects visible; homepage nav has no scroll-position indicator |
| 7 | Flexibility and Efficiency | 3 | Deep links (`#laundromat`, `#alpha-planes`) support direct navigation |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained overall; Environment section's icon-in-ring is the one over-decorated moment |
| 9 | Error Recovery | 3 | No broken states observed; image fallback works |
| 10 | Help and Documentation | 3 | Case studies self-document (Alpha Planes Q&A is genuinely strong) |
| **Total** | | **30/40** | **Good — solid foundation, address weak areas** |

#### Anti-Patterns Verdict

**LLM assessment**: Largely clean. The site avoids nearly every item on its own anti-reference list — no Inter-as-visual-sameness (mono is used deliberately for data/labels), no cream bg, no gradients, no rounded-icon-tile-above-heading template, no pricing-card aesthetic, no eyebrow-on-every-homepage-section tic. The hairline 1px-grid-gap structure (stats/skills/process/projects) is a genuine structural signature, not a templated card grid. The one real slip: the **Environment section's centered icon-in-a-ring + "Coming Soon"** is the single most generic, SaaS-placeholder-feeling element on the entire site.

**Deterministic scan**: Two layers were run and they disagree, which is itself informative.
- **CLI/AST scan** (`detect.mjs` over `portfolio/app` + `portfolio/components`): exit 0, **zero findings**.
- **Browser-runtime overlay** (live DOM on the running dev server, 3 routes): caught real issues the static AST pass couldn't see, because they live in computed/cascaded styles, not literal source tokens:
  - Homepage: `wide-tracking` (0.06–0.08em on body text), `tiny-text` (9–11px on several spans/divs), `overused-font` (Inter, 46% of text), `line-length` (~85 and **~184 chars/line** on paragraphs — well past the 65–75ch guideline), `layout-transition` (width/height transition on `<body>`).
  - `/case-study/alpha-planes`: **`repeated-section-kickers` — 7 numbered section labels on one page** (01/Challenge → 07/Results), and a `dark-glow` flag on the scroll-progress dot's box-shadow.
  - `/technical-breakdowns`: `tiny-text`, `line-length` (~130 chars/line), `overused-font` (Inter, 77%).

  The **7-numbered-kicker finding is worth taking seriously** — it lands squarely on the skill's own "numbered section markers as default scaffolding" ban (01/02/03 above every section vs. one deliberate sequence), and it's an independent signal the LLM reviewer didn't flag on its own. I'm folding it in as a real priority issue below, not a false positive.

  **Likely false positive**: `dark-glow` on the scroll-progress dot — that's a 6px position indicator with a soft shadow, a functional micro-affordance, not decorative glassmorphism. No action needed.

  **Not actionable now**: `overused-font` (Inter) predates today's color-token work — it's an existing identity choice (`--font-inter` was already the site's committed font), so per the skill's own identity-preservation rule this isn't a new-design violation, just a fact worth knowing.

**Visual overlays**: Injection succeeded and the detector script did run live in the browser and print console findings at the time of the scan — but the live-server that served the overlay has since been stopped and the page has navigated on, so there is **no persistent visible overlay in your browser right now** to inspect. The findings above are transcribed from the console output captured during the run, not something currently on screen.

#### Overall Impression

This is a well-executed, distinctive dark portfolio that mostly earns its confidence. The structural hairline-grid system and the case-study writing (especially the Q&A sections) are doing real work toward the "technical depth is the brand" goal. The two things holding it back from "excellent": the brand-new copper/olive split doesn't yet distinguish "clickable" from "just data" reliably, and the Environment section is a visible unfinished patch sitting right in the main scroll path, undercutting the "practice what you preach" principle at exactly the moment a hiring manager is forming their final impression.

#### What's Working

1. **The hairline 1px-grid system** (stats row, skills grid, process steps, project list, achievements) — a cohesive structural signature specific to this site, not a copied card-grid template.
2. **Alpha Planes' Q&A section** ("Why use Alpha Masking instead of geometry for structural assets?") — the strongest writing on the site; it anticipates a technical reviewer's real objections instead of just showing renders.
3. **Contrast is uniformly excellent** — every text/background pairing measured (bone, muted, olive, copper against both `#0b0b0d` and the card `#181e14`) clears WCAG AA with wide margin, even at small caption sizes.

#### Priority Issues

**[P1] Copper's dual role (action vs. plain label) creates real ambiguity**
- **Why it matters**: `--pk-copper` marks primary CTAs and case-study links (clickable) *and* plain, non-clickable sequence numbers/table cells (Step 01, "~3× Faster" verdict cells). A reviewer skimming Process will see "Step 01" in the identical color as "Read the breakdown →" elsewhere on the same page and reasonably expect it to be a link. This is the specific Heuristic-4 failure a hiring manager who tests affordances (a fellow technical artist) is likely to notice first.
- **Fix**: Give non-interactive numbers/cells a distinct treatment (e.g., muted weight with copper only on the digit, or reserve full-saturation copper strictly for `<a>`/`<button>` elements).
- **Suggested command**: `/impeccable polish`

**[P1] Environment section is a prominent, unqualified placeholder mid-scroll**
- **Why it matters**: it sits directly after four real, numbers-backed projects, with no completion date or concrete signal — a hiring manager hits it right as they're forming their closing impression. It's also the single most generic-looking element on the site (centered icon-in-circle, all-caps micro-label) — exactly the SaaS-placeholder pattern the brand brief explicitly wants to avoid.
- **Fix**: either cut the section until there's something real to show (Projects → Process flows fine without it), or replace the decorative ring/icon with something concrete — a WIP screenshot, a % complete, or a target date.
- **Suggested command**: `/impeccable distill`

**[P1] Seven numbered section-kickers on one case-study page reads as AI-scaffolding**
- **Why it matters**: caught independently by the deterministic browser scan, not just a style call — 01/Challenge through 07/Results on `/case-study/alpha-planes` matches the skill's own explicit ban on numbered section markers as default per-section scaffolding rather than one deliberate sequence. Two independent signals (detector + brief cross-reference) agreeing raises confidence this is real, not a matter of taste.
- **Fix**: keep numbering only where the section genuinely is a sequence (e.g., the 3-step Workflow), drop it from sections that aren't ordered (Q&A, Benchmarks, Results) and use a different, non-numbered cadence for those.
- **Suggested command**: `/impeccable quieter`

**[P2] Olive and copper are perceptually close at a glance**
- **Why it matters**: measured contrast between the two colors themselves is ~1.17 (barely distinguishable in luminance, differing mainly by hue) — for a colorblind reviewer or a fast skim, "data" (olive) and "action" (copper) labels may not reliably separate by color alone, undermining the two-role system's whole point.
- **Fix**: don't rely on hue alone for interactive copper — add a consistent secondary cue (always-visible arrow/chevron, or a weight/underline difference) rather than relying on hover-only reveal, which isn't consistently applied yet.
- **Suggested command**: `/impeccable polish`

**[P2] Case-study nav is a slightly inconsistent variant of the homepage nav**
- **Why it matters**: `CaseStudyNav` shows "PK // TEA" instead of the homepage's "PK," and none of its links (`/#about`, `/#work`, etc.) show an active state — a small thing, but the kind of detail a technical reviewer who notices systems will register as an unfinished variant rather than a deliberate one.
- **Fix**: align the brand-mark label and add active-state logic consistent with the homepage nav.
- **Suggested command**: `/impeccable polish`

#### Persona Red Flags

**Hiring manager / recruiter**: the Environment "Coming Soon" section is the single biggest risk in the whole scroll — it lands right after Projects, exactly where a 90-second skim is forming its final opinion, and reads as "not ready yet."

**Fellow technical artist**: will likely appreciate the Q&A section and polycount-journey breakdown, but is also the persona most likely to test affordances (hover/click) and hit the copper Step-number-as-fake-link ambiguity first.

#### Minor Observations

- Hero's secondary-CTA hover (olive fill + dark text) is a small, well-executed detail reinforcing olive as "secondary action."
- Achievements' LinkedIn/YouTube iframes have no fallback or loading placeholder if an embed is blocked (e.g., on a corporate network) — unlike the graceful placeholder pattern already built for project media.
- `overused-font` (Inter, 46–77% of text) is a pre-existing identity choice, not something introduced today — flagged for awareness, not action.
- Long paragraph lines (~184 chars on the homepage, ~130 on Technical Breakdowns) exceed the 65–75ch readability guideline; worth a `max-width` pass on prose blocks.
- Footer copyright line ("© 2026 · Built for real-time") is a nice quiet brand-voice moment consistent with the "colleague's work log" tone.

#### Questions to Consider

1. If Environment stays a placeholder for weeks, would removing it entirely score higher on "practice what you preach" than a visible gap?
2. Copper currently does three jobs (CTA, sequence number, table verdict) — does the system need a third, quieter color for non-interactive numbers, or should copper simply be reserved for interactive elements only?
3. Now that contrast is confirmed excellent everywhere, is the color system's remaining risk purely about role clarity (what's clickable) rather than accessibility compliance?
