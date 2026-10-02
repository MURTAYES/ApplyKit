# Project Research Summary: Donna Browser Extension

**Project:** Donna — Chrome MV3 job application form filler
**Researched:** 2026-10-02
**Confidence:** HIGH

## Key Findings

### Stack
- **WXT framework** (Vite-based) is the current industry standard for MV3 + TypeScript + React extensions. Avoids manual bundler configuration, provides HMR, and has built-in Vitest/Playwright support.
- Service workers in MV3 are **ephemeral** (killed after 30s idle) — all state must persist in `chrome.storage.local`, never in SW globals.
- chrome.storage.local typed helpers via `zod` for profile schema validation are the right pattern.

### Features
- **Section-scoped matching** is the critical differentiator — existing tools fail on forms with repeated labels (Donna's primary target use case).
- **Fill report with three tiers** (filled / skipped / unmatched) + inline field highlights is table stakes UX for user trust.
- **Local-only privacy** is both a differentiator and a hard requirement — never cloud-sync PII.
- Anti-features to hard-exclude: AI inference, auto-submit, all_urls permissions, cloud sync.

### Architecture
- **Native property setter + event dispatch** is the only reliable way to fill React/Angular/Vue controlled inputs. Direct `element.value = x` silently fails.
- **MutationObserver + timeout** pattern is the right approach for dependent dropdowns (District → Upazila chains).
- **Section boundary detection** via `<fieldset>/<legend>`, heading hierarchy, and class-name heuristics provides adequate section scoping for the reference form.
- Per-site JSON mappings bundled in the extension provide exact-selector accuracy for known portals.

### Pitfalls
- **Service worker termination** is the #1 MV3 architecture risk — masked by DevTools presence.
- **Synthetic event dispatch is mandatory** — React's value tracker makes direct value assignment invisible to the framework.
- **Dependent dropdown race conditions** will cause silent failures without explicit wait logic.
- **Section scope collapse** (wrong field in wrong education/address section) is the highest UX risk for this specific use case.
- **Bangla text Unicode normalization** (NFC, ZWJ/ZWNJ stripping, digit conversion) must be applied at profile save and field compare time.

## Implications for Roadmap

1. **M0 (live form inspection) is non-negotiable** — dropdown option lists, iframe presence, and JS framework must be verified before M2 begins.
2. **Fill engine must be built around native setter + event dispatch from day 1** — retrofitting later is painful.
3. **Section scoping must be implemented before repeatable sections** — the education sections (SSC/HSC/Graduation) share labels and must be correctly distinguished.
4. **WXT framework should be set up in Phase 1** alongside profile manager — avoids architectural debt if added later.
5. **Per-site mapping for the reference portal** should be built in Phase 2 alongside the generic fill engine — the reference form is Donna's primary target.
6. **MutationObserver-based dependent dropdown wait** belongs in Phase 3 (Dropdown matching), not bolted on later.
7. **Fill report and undo** can be Phase 4/5 features — they don't block the core fill loop.

## Roadmap Phase Suggestions

| Phase | Focus | Key Deliverable |
|-------|-------|----------------|
| 1 | Extension scaffold + profile manager | WXT project, React popup, profile CRUD, chrome.storage.local |
| 2 | Fill engine for text/date/number fields | Native setter, event dispatch, generic heuristic matcher, section scoper |
| 3 | Dropdown matching + dependent selects | Option normalization, alias table, MutationObserver wait |
| 4 | Address logic + repeatable job experiences | Same-as-present fill, ADD MORE button, multi-entry fill |
| 5 | Fill report + highlights + undo | Three-tier report, inline highlights, snapshot/restore |
| 6 | Per-site mappings + hardening | Reference portal mapping file, fixture tests, live portal regression |

## Sources

- WXT docs: https://wxt.dev
- Chrome MV3 migration: https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers
- React native setter: https://github.com/facebook/react/issues/11488
- MutationObserver MDN: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
- Form fill UX research: Simplify Jobs, JobRight, RoboForm extension reviews
- Unicode Bangla: https://www.unicode.org/charts/PDF/U0980.pdf
