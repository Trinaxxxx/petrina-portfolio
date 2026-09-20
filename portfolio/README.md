# Petrina Kinzel — Portfolio

Personal portfolio site for Petrina Kinzel, Technical Environment Artist. It
presents real-time environment work and pipeline/tooling projects (Blender
Python automation, CAD/Revit integration, Unreal Engine deployment) with
case studies and technical breakdowns.

Built with **Next.js 16 (App Router)** and **React 19**. All routes are
statically prerendered (static / SSG — no API routes or server actions) and
deployed on Vercel.

> The Next.js app lives in this `portfolio/` directory — it is the deployed
> site. Run all commands below from here.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**, TypeScript
- **Tailwind CSS v4** (configured via `@theme` in `app/globals.css`; most
  component styling is inline `style={{}}` with CSS custom properties)
- **shadcn/ui** primitives (`components/ui/`) + React Bits components
- Animation: `motion`, `gsap` (+ ScrollTrigger)
- **Inter** loaded via `next/font/google`; monospace UI text uses a
  JetBrains Mono CSS stack
- `next/image` for image optimisation (AVIF/WebP)

## Getting started

```bash
npm install
npm run dev      # dev server on http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (prerenders all routes)
npm run start    # serve the production build
npm run lint     # ESLint
npx tsc --noEmit # type check
```

## Structure

```
app/
  page.tsx                     # single-page home (Nav → Hero → About → …)
  case-study/[slug]/page.tsx   # SSG case-study route (generateStaticParams)
  ai-tools/                    # AI tools page
  technical-breakdowns/        # technical breakdowns page
  layout.tsx                   # metadata, fonts, security headers wiring
  globals.css                  # Tailwind v4 @theme + CSS custom properties
components/                    # section + page components
components/ui/                 # shadcn primitives
lib/                           # content data layers (case-studies, ai-tools, …)
public/projects/               # images and video
```

To add a case study, append an entry to the `caseStudies` array in
`lib/case-studies.ts` — the route picks it up automatically via
`generateStaticParams`.

## Deployment

Deployed on Vercel (see `vercel.json`). Security headers and a Content
Security Policy are defined in `next.config.ts`. CI (`.github/workflows/ci.yml`)
runs install, lint, and build on pushes to `master` and on pull requests.

## License

All rights reserved. See [`LICENSE`](../LICENSE) at the repository root.
