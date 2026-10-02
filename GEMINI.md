<!-- GSD:project-start source:PROJECT.md -->

## Project

Donna is a Chrome/Chromium browser extension that fills online job application forms from a profile the applicant prepares once. On supported forms, one click fills all fields that have a matching profile value — text inputs, textareas, date pickers, number fields, dropdowns, and checkboxes. Fields with no data in the profile are left untouched. Donna never submits forms, never uploads documents, and never touches CAPTCHA or declaration checkboxes — the applicant always reviews and submits manually.

**Core Value:** Fill any supported job application form accurately in one click without ever sending data off the applicant's device.

### Constraints

- Platform: Chrome MV3 + Chromium-based browsers (Edge, Brave) — v1
- Tech Stack: TypeScript, React (popup/options UI), content script, service worker
- Permissions: storage, activeTab, scripting — no all_urls; inject on user click via activeTab
- Storage: chrome.storage.local only — no remote calls with user data
- Safety: R1-R6 never-do rules are hard constraints, not configurable defaults
- Privacy: Profile data must not be exposed to page JavaScript context; no console logging of field values

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## Recommended Stack

## Build Tooling

| Tool | Status | Notes |
|------|--------|-------|
| **WXT** (wxt.dev) | ✅ Recommended | Vite-based, active maintenance, best HMR, cross-browser packaging |
| Plasmo | ⚠️ Consider carefully | React-first but Parcel-based, HMR inconsistency in larger projects, growth plateaued |
| Custom Vite/Webpack | ❌ Avoid | High setup burden; modern frameworks solve this better |
- `entrypoints/popup/index.html`, `entrypoints/options/index.html`, `entrypoints/content.ts` file-based routing
- Auto-generates manifest.json from config
- TypeScript types for chrome.* APIs out of the box
- Vitest for unit tests, Playwright for E2E
- Cross-browser output (Chrome, Firefox) from one codebase

## Project Structure (WXT convention)

## Key Libraries

| Library | Purpose | Notes |
|---------|---------|-------|
| wxt | Extension framework | Replaces manual Vite/webpack config |
| react + react-dom | Popup + options UI | v18+, with concurrent features |
| @types/chrome | Chrome API type definitions | Included with WXT |
| vitest | Unit testing | Integrated in WXT |
| @playwright/test | E2E testing | WXT has built-in support |
| zod | Profile schema validation | TypeScript-first schema validation |

## chrome.storage.local Patterns

## MV3 Service Worker Lifecycle

- Service workers are ephemeral — terminated after 30s inactivity
- Store ALL state in chrome.storage.local, never in SW globals
- Keep message handlers stateless and self-contained
- DevTools presence keeps SW alive (can mask SW lifecycle bugs)

## Testing Strategy

## TypeScript Config Notes

- `"lib": ["DOM", "ES2022"]`
- `"strict": true`
- Separate tsconfig for content scripts (no JSX) vs popup/options (JSX)

## Alternatives Considered

- **Plasmo**: React-first but Parcel bundler causes HMR issues in larger projects; community growth plateaued; WXT preferred.
- **Manual Vite setup**: Possible but high boilerplate; WXT solves this problem already.

## Sources

- https://wxt.dev — WXT official docs
- https://github.com/nicolo-ribaudo/wxt vs Plasmo community discussion
- https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers
- https://merginit.com/post/modern-chrome-extension-development-2024/

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
