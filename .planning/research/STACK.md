# Stack Research: Donna Browser Extension

**Domain:** Chrome MV3 extension with TypeScript + React
**Researched:** 2026-10-02
**Confidence:** HIGH

## Recommended Stack

**WXT + TypeScript + React** is the current industry consensus for new MV3 extensions. WXT (built on Vite) provides file-based entrypoints, automatic manifest management, reliable HMR, and Vitest/Playwright integration — all critical for a TypeScript+React extension targeting Chromium.

## Build Tooling

| Tool | Status | Notes |
|------|--------|-------|
| **WXT** (wxt.dev) | ✅ Recommended | Vite-based, active maintenance, best HMR, cross-browser packaging |
| Plasmo | ⚠️ Consider carefully | React-first but Parcel-based, HMR inconsistency in larger projects, growth plateaued |
| Custom Vite/Webpack | ❌ Avoid | High setup burden; modern frameworks solve this better |

WXT provides:
- `entrypoints/popup/index.html`, `entrypoints/options/index.html`, `entrypoints/content.ts` file-based routing
- Auto-generates manifest.json from config
- TypeScript types for chrome.* APIs out of the box
- Vitest for unit tests, Playwright for E2E
- Cross-browser output (Chrome, Firefox) from one codebase

## Project Structure (WXT convention)

```
donna/
├── entrypoints/
│   ├── popup/           # React popup UI (profile overview + fill button)
│   │   ├── index.html
│   │   └── App.tsx
│   ├── options/         # React options page (profile editor)
│   │   ├── index.html
│   │   └── App.tsx
│   └── content.ts       # Content script (field scanner + filler)
├── background/
│   └── index.ts         # Service worker (message routing, storage)
├── lib/
│   ├── profile/         # Profile data model + storage
│   ├── matcher/         # Field matching engine
│   ├── filler/          # Fill logic, native setter, event dispatch
│   └── report/          # Fill report generation
├── mappings/            # Per-site JSON mapping files
│   └── teletalk.gov.bd.json
├── wxt.config.ts
└── package.json
```

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

```typescript
// Typed storage with helper
type Profile = { ... };
const profileKey = 'donna_profile';

async function saveProfile(p: Profile): Promise<void> {
  await chrome.storage.local.set({ [profileKey]: p });
}

async function loadProfile(): Promise<Profile | null> {
  const result = await chrome.storage.local.get(profileKey);
  return (result[profileKey] as Profile) ?? null;
}
```

## MV3 Service Worker Lifecycle

- Service workers are ephemeral — terminated after 30s inactivity
- Store ALL state in chrome.storage.local, never in SW globals
- Keep message handlers stateless and self-contained
- DevTools presence keeps SW alive (can mask SW lifecycle bugs)

## Testing Strategy

1. **Unit tests (Vitest)**: Profile schema, field matcher, normalizer, dropdown matching
2. **Integration tests**: Content script with fixture HTML copies of the target form
3. **E2E (Playwright)**: Load extension, fill reference form, verify output
4. **Manual regression**: On live portal before each release

## TypeScript Config Notes

WXT pre-configures tsconfig for the extension environment. Key additions for Donna:
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
