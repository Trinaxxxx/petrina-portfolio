---
target: about.tsx skills grid
total_score: 31
p0_count: 0
p1_count: 1
timestamp: 2026-06-28T22-38-39Z
slug: portfolio-components-about-tsx
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | FadeContent + CountUp give clear entrance feedback |
| 2 | Match System / Real World | 3 | "DCC Tools" is insider jargon |
| 3 | User Control and Freedom | 3 | Static read-only section |
| 4 | Consistency and Standards | 2 | Skill cards have redundant individual borders on top of gap-border grid |
| 5 | Error Prevention | 4 | Static content |
| 6 | Recognition Rather Than Recall | 3 | All categories and items visible |
| 7 | Flexibility and Efficiency | 3 | Keyboard navigable |
| 8 | Aesthetic and Minimalist Design | 3 | Double-border at card junctions |
| 9 | Error Recovery | 4 | n/a static content |
| 10 | Help and Documentation | 3 | Self-explanatory |
| **Total** | | **31/40** | **Good** |

### Anti-Patterns Verdict
Detector: clean (0 findings). LLM: not AI-slop — content specificity saves the identical-card pattern.

### Priority Issues
- [P1] Double-border on skill cards — remove `border` from each card, grid gap handles it
- [P2] "Technical" category is vague and contains "Cross-team collaboration" (non-technical soft skill) + duplicate Python scripting
- [P2] "DCC Tools" jargon — freelance audience won't parse DCC
- [P2] "Maya, Unity" is two tools in one list item
- [P3] Dead `code` property on skills data after label was removed
