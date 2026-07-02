# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
# Dev server (run from portfolio/ directory)
npm run dev          # starts on :3000

# Type check
npx tsc --noEmit

# Build
npm run build
```

The `.claude/launch.json` (at repo root) runs `npm run dev` from `portfolio/` on port 3000. Clear `.next/` and restart the preview server if the compiler serves stale output after component swaps.

## Architecture

**Single-page home** (`app/page.tsx`) — vertical stack:
`Nav → Hero → About → Projects → Environment → Process → Achievements → Contact`

**Case study route** (`app/case-study/[slug]/page.tsx`) — async server component that awaits `params`, resolves slug via `lib/case-studies.ts`, returns `notFound()` if missing. Content rendered by `components/CaseStudyPage.tsx` (client component).

`components/skills.tsx` and `components/spore-canvas.tsx` exist on disk but are not imported anywhere — dead files.

---

### Styling rule — no Tailwind classes in components

All component styling uses inline `style={{ }}` with CSS custom properties. Tailwind v4 is configured via `@theme` in `globals.css` (no `tailwind.config.ts`). Tailwind utilities appear in `layout.tsx` (body classes) and `nav.tsx` (responsive show/hide: `hidden md:flex`, `md:hidden`) — nowhere else.

**Theme vars** (defined in `globals.css :root`, color-role system locked 2026-07-02):
```
--pk-bg / --pk-bg2 / --pk-bg3      dark background layers (#0b0b0d / #181e14 elevated card / #1e251a recessed panel)
--pk-border / --pk-border-accent   subtle olive-tinted borders
--pk-text / --pk-muted             bone body text / warm-muted secondary text (#d8d1bb / #918a7a)
--pk-accent                        olive — "data": brand mark, stat numbers, featured tags, secondary buttons (#9fae6b)
--pk-copper                        copper — "action": primary CTAs, sequence numbers, case-study links (#d18a4f)
--pk-mono                          JetBrains Mono stack
```

Media queries go in a `<style>` block inside the component (see `projects.tsx`, `CaseStudyPage.tsx`).

---

### Client components

Any component using event handlers, `useState`, `useEffect`, or `useRef` must have `"use client"` as the first line.

---

### React Bits components

Installed via `npx shadcn@latest add "@react-bits/ComponentName-TS-CSS"`. Registry in `components.json`.

| File | Purpose |
|---|---|
| `CountUp.tsx` | Animates stat numbers on scroll-into-view via `motion/react` springs. Returns a `<span>`. |
| `FadeContent.tsx` | GSAP + ScrollTrigger fade-in wrapper. Sets `visibility: hidden` initially. |
| `SpotlightCard.tsx` + `.css` | Cursor-tracking radial spotlight. `.css` stripped to `position: relative; overflow: hidden` only. |
| `Silk.tsx` | WebGL silk-shader canvas via `@react-three/fiber`. `frameloop="always"` — blocks screenshot tools. |
| `Stepper.tsx` + `.css` | Installed but not used on any page. Colors patched to sage green. |

Animation deps: `motion` (v12), `gsap` + `gsap/ScrollTrigger`, `@react-three/fiber`, `three`.

`components/ui/` contains shadcn primitives (Badge, Button, Card, Separator, NavigationMenu). `Badge` is actively used in `projects.tsx`. Check here before installing a component that may already exist.

---

### Key component notes

**`nav.tsx`** — Fixed. Custom vertical scroll progress indicator at `right: 20px`, `zIndex: 50`.

**`projects.tsx`** — `SpotlightCard` per project. Odd-indexed cards use `direction: rtl` for alternating layout. `caseStudy` field on a project renders a "Read Case Study →" link.

**`about.tsx`** — Stats data uses union: `{ value: number; suffix: string } | { staticDisplay: string }`. The `1:1` stat is static.

**`achievements.tsx`** — LinkedIn embed must use `?compact=1` (not `?collapsed=1`).

**`CaseStudyPage.tsx`** — Case study layout. Uses `FadeContent` for scroll animations and GSAP stagger for process cards. Responsive breakpoints handled via embedded `<style>` block with `.cs-*` class names.

---

### Images and media

Static assets in `public/projects/` — filenames must be URL-safe. Rename via PowerShell before referencing.

- PNGs/JPGs: `next/image` with `fill` + `sizes`
- GIFs and "show full image" (no crop): plain `<img>` — use `style={{ width: "100%", height: "auto" }}`
- `next/image` with `width={0} height={0}` causes browser hangs — use `<img>` instead for natural-size display

---

### Case study data layer (`lib/case-studies.ts`)

`getCaseStudy(slug)` and `getAllSlugs()` are the only exports used by the route. To add a new case study, add an entry to the `caseStudies` array — the route picks it up automatically via `generateStaticParams`.

The `CaseStudy` type has these sections: `stats`, `problem`, `technique`, `process`, `breakdown`, `qa`, `table`, `polycountJourney`, `results`, `techStack`. Each maps directly to a rendered section in `CaseStudyPage.tsx`.

---

## Planned work

- **Phase 3:** Public GitHub repo `blender-pipeline-tools` (Blender Python addons)
- **Phase 4:** Replace `environment.tsx` placeholder with a Three.js Draco-compressed GLB viewer (WASD, perf HUD, LOD toggle)
- **Phase 5:** Vercel deployment
