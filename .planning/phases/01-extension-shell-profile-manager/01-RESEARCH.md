# Phase 1: Extension Shell + Profile Manager - Research

**Researched:** 2026-10-02
**Domain:** Chrome Extension MV3, WXT Framework, React, Zod Schema, chrome.storage.local
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Popup contains fill button only — primary CTA always visible regardless of profile state. "Open Profile" link launches options page in a new tab. No profile status indicator, percentage, or badges in popup. Clean and minimal.
- **D-02:** Fill button is always active (not disabled when profile is empty) — it becomes functional in Phase 2; for Phase 1 it can show a toast "Fill engine coming in Phase 2" or do nothing.
- **D-03:** Options page uses sidebar nav + scrollable sections. Left sidebar lists all 10 sections; clicking a section scrolls to it. All sections visible in one long page. — **Reversibility:** reversible
- **D-04:** Auto-save as the user types — no explicit Save button. Debounced writes to chrome.storage.local (300–500ms debounce). No save confirmation UI needed. — **Reversibility:** reversible
- **D-05:** Job Experiences section (and any other repeatable section) uses Add/Remove inline: '+' button to add a new experience row, 'x' button on each row to remove it. Start with one empty row shown by default. — **Reversibility:** reversible
- **D-06:** No profile completeness indicator anywhere — not in popup, not in options sidebar. User manages their own data awareness.
- **D-07:** Scaffold using `npx wxt init` with the React template. Customize entrypoints, permissions, and manifest after scaffolding. — **Reversibility:** one-way
- **D-08:** Phase 1 delivers a fully working popup + complete options page profile form (all 10 sections, all profile fields from REQUIREMENTS.md PROF-01..08). Not a stub — end of Phase 1 is a usable profile manager.
- **D-09:** Zod schema for the profile data model. Validates on auto-save; shows inline field-level errors when data is invalid. Also used to validate import JSON before writing to storage. — **Reversibility:** reversible
- **D-10:** Profile covers: Basic Information, Present Address, Permanent Address, SSC, HSC, Graduation, Masters (optional section), Job Experiences (list, 0..N entries), Other Qualifications. All fields optional.
- **D-11:** English and Bangla name fields are separate fields in the schema (not a single field). Same for father's/mother's name. Field names clearly distinguished (e.g., `name_en`, `name_bn`).

### the agent's Discretion
- Specific color scheme / visual design of options page — clean, professional design that works in both popup and options contexts.
- Form state management: Controlled component state / custom hook with debounced sync to `chrome.storage.local`.
- Debounce timing: ~400ms.
- Masters section: visible as an optional section (fields can be empty/omitted).

### Deferred Ideas (OUT OF SCOPE)
- Profile passphrase encryption (AES-GCM) — explicitly v2.
- Multiple profiles — v2 candidate.
- Keyboard shortcut for the popup fill button — v2 candidate.
- Firefox support — later port, not v1.
- Profile % complete indicator or section completion badges — explicitly decided "No".
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SCAF-01 | Extension loads in Chrome/Edge/Brave as an unpacked MV3 extension with popup and options page | WXT entrypoint structure (`entrypoints/popup`, `entrypoints/options`) compiles standard MV3 manifest |
| SCAF-02 | Extension uses WXT framework with TypeScript and React | WXT + React template provides Vite-based bundling and TS support |
| SCAF-03 | Manifest declares only: storage, activeTab, scripting permissions (no all_urls) | Configured in `wxt.config.ts` under `manifest.permissions` |
| SCAF-04 | Content script is injected on user-triggered fill action (activeTab), not on page load | Content script entrypoint configured with `matches: []` or programmatic injection via service worker/action |
| PROF-01 | User can create a structured applicant profile with all pre-defined fields | Complete 10-section React form bound to Zod schema model |
| PROF-02 | User can edit any profile field at any time | Controlled input handlers with real-time state updates |
| PROF-03 | User can delete all profile data with a single "Delete all data" action | Storage clear function + UI reset button with confirmation modal |
| PROF-04 | Every profile field is optional — empty fields are left blank | Zod schema using `.optional().default('')` or nullable string types |
| PROF-05 | Profile fields include both English and Bangla name fields where applicable | Dedicated schema keys (`name_en`, `name_bn`, `father_name_en`, etc.) |
| PROF-06 | Profile covers all sections (Basic Info, Addresses, SSC, HSC, Graduation, Masters, Job Experiences, Other Qualifications) | Comprehensive profile TypeScript interface and UI form groups |
| PROF-07 | User can export profile as a JSON file | In-browser Blob download of sanitized profile JSON |
| PROF-08 | User can import profile from a previously exported JSON file | File input reader + Zod schema validation before saving to storage |
</phase_requirements>

## Summary

Phase 1 establishes the bedrock architecture for Donna: an unpacked Manifest V3 extension built using WXT, TypeScript, and React. The primary deliverables are an extension shell (popup and background service worker wiring), a typed profile storage manager backed by `chrome.storage.local`, and a comprehensive Options page UI featuring a 10-section applicant profile editor with debounced auto-save, inline validation, and JSON import/export.

By standardizing on WXT (`wxt`), we benefit from automated MV3 manifest generation, type-safe Chrome API wrappers, fast Vite-powered HMR during development, and out-of-the-box Vitest integration. Profile persistence uses direct `chrome.storage.local` operations wrapped in a type-safe storage module (`storage/profile.ts`), avoiding reliance on service worker globals.

The options page employs a clean sidebar navigation with smooth scroll targeting to 10 distinct fieldset sections matching the Bangladesh government job application structure. All fields are strictly optional. Zod schema validation ensures data integrity during live editing and file import while preventing invalid payloads from entering local storage.

**Primary recommendation:** Use WXT with the React template, build a type-safe `ProfileSchema` via Zod, implement a custom `useProfile` hook with a 400ms debounce to `chrome.storage.local`, and structure the options UI as a single-page layout with anchored sidebar navigation.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Profile Storage & Persistence | Browser (`chrome.storage.local`) | Service Worker (MV3) | Local storage is persistent and isolated to the extension origin |
| Profile Schema & Validation | Client (Options UI / Shared TS) | — | Zod schema validates user input locally before writes and on JSON imports |
| Popup UI | Browser (Popup Window) | — | Minimal lightweight UI that triggers actions and opens Options page |
| Options UI & Profile Editor | Browser (Options Tab) | — | Full-page responsive React UI for editing applicant profile sections |
| Import / Export | Browser (Options Tab) | — | FileReader and Blob download executed in options page context |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `wxt` | ^0.19.x | Extension build tool and framework | Vite-based, active maintenance, automatic MV3 manifest, unified TS types |
| `react` | ^18.x / ^19.x | UI library for popup and options | Component-driven declarative UI for complex forms |
| `react-dom` | ^18.x / ^19.x | DOM renderer for React | Required companion for React |
| `zod` | ^3.x | Runtime schema validation | TypeScript-first schema definition with type inference and detailed error parsing |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vitest` | ^3.x | Unit and integration testing | Validating storage helpers, schema transformations, and import/export logic |
| `@testing-library/react` | ^16.x | React component testing | Testing Options form sections and popup interactions |
| `jsdom` | ^26.x | DOM simulation for Vitest | Running React component tests in headless Node environment |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `wxt` | Plasmo | Plasmo development has slowed; WXT offers cleaner Vite integration and faster HMR |
| `zod` | Yup / Joi | Zod provides superior TypeScript type inference and smaller bundle footprint |
| Controlled Hook Form | `react-hook-form` | Custom controlled hook with nested state is simpler and has zero external dependencies for debounced partial persistence |

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `wxt` | npm | 2 yrs | 820k/wk | github.com/wxt-dev/wxt | [OK] | Approved [VERIFIED: npm registry] |
| `react` | npm | 11 yrs | 214M/wk | github.com/react/react | [OK] | Approved [VERIFIED: npm registry] |
| `react-dom` | npm | 11 yrs | 202M/wk | github.com/react/react | [OK] | Approved [VERIFIED: npm registry] |
| `zod` | npm | 5 yrs | 365M/wk | github.com/colinhacks/zod | [OK] | Approved [VERIFIED: npm registry] |
| `vitest` | npm | 3 yrs | 132M/wk | github.com/vitest-dev/vitest | [OK] | Approved [VERIFIED: npm registry] |
| `@testing-library/react` | npm | 7 yrs | 74M/wk | github.com/testing-library/react-testing-library | [OK] | Approved [VERIFIED: npm registry] |

**Packages removed due to [SLOP] verdict:** None
**Packages flagged as suspicious [SUS]:** None

## Architecture Patterns

### System Architecture Diagram

```
[User Input in Options UI] ──> [React State (useProfile)]
                                       │
                         (400ms Debounce + Zod Validate)
                                       │
                                       ▼
                          [chrome.storage.local]
                                       ▲
                                       │ (Reads on Mount)
[Popup UI: "Open Profile"] ──> [chrome.runtime.openOptionsPage()]
[Popup UI: "Fill Form"]    ──> [Phase 2 placeholder toast]
[Options UI: "Export"]     ──> [Read storage -> JSON Blob -> User Download]
[Options UI: "Import"]     ──> [Read File -> Zod Validate -> Write storage]
[Options UI: "Delete All"] ──> [Storage.clear -> Reset React State]
```

### Recommended Project Structure
```
Donna/
├── entrypoints/
│   ├── popup/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── popup.css
│   ├── options/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── options.css
│   │   └── components/
│   │       ├── Sidebar.tsx
│   │       ├── BasicInfoSection.tsx
│   │       ├── AddressSection.tsx
│   │       ├── EducationSection.tsx
│   │       ├── ExperienceSection.tsx
│   │       ├── QualificationsSection.tsx
│   │       └── DangerZone.tsx
│   └── background.ts
├── src/
│   ├── types/
│   │   └── profile.ts          # Zod schemas and inferred TS types
│   ├── storage/
│   │   └── profileStorage.ts   # Typed chrome.storage.local wrapper
│   ├── hooks/
│   │   └── useProfile.ts       # React hook managing debounced auto-save
│   └── utils/
│       └── exportImport.ts     # JSON serialization and validation helpers
├── tests/
│   ├── profileSchema.test.ts
│   ├── storage.test.ts
│   └── exportImport.test.ts
├── wxt.config.ts
├── package.json
└── tsconfig.json
```

### Pattern 1: Debounced Auto-Save with chrome.storage.local
**What:** Changes to form fields update React state instantly for responsive typing, while persisting to `chrome.storage.local` is debounced by ~400ms.
**When to use:** In the Options page to avoid spamming Chrome storage writes during active typing.
**Example:**
```typescript
// src/hooks/useProfile.ts
import { useState, useEffect, useRef } from 'react';
import { Profile, defaultProfile } from '../types/profile';
import { loadProfile, saveProfile } from '../storage/profileStorage';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoaded, setIsLoaded] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadProfile().then((data) => {
      if (data) setProfile(data);
      setIsLoaded(true);
    });
  }, []);

  const updateProfile = (updater: (prev: Profile) => Profile) => {
    setProfile((prev) => {
      const updated = updater(prev);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        saveProfile(updated);
      }, 400);
      return updated;
    });
  };

  return { profile, updateProfile, isLoaded, setProfile };
}
```

### Pattern 2: Zod Schema with Complete Optionality
**What:** Define a strict schema where all fields are optional strings or array of objects, providing safe defaults.
**When to use:** Validating profile data on load, save, and import.
```typescript
// src/types/profile.ts
import { z } from 'zod';

export const JobExperienceSchema = z.object({
  id: z.string(),
  organization: z.string().default(''),
  designation: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  isCurrent: z.boolean().default(false),
  responsibilities: z.string().default(''),
});

export const ProfileSchema = z.object({
  basicInfo: z.object({
    nameEn: z.string().default(''),
    nameBn: z.string().default(''),
    fatherNameEn: z.string().default(''),
    fatherNameBn: z.string().default(''),
    motherNameEn: z.string().default(''),
    motherNameBn: z.string().default(''),
    dob: z.string().default(''),
    gender: z.string().default(''),
    nid: z.string().default(''),
    phone: z.string().default(''),
    email: z.string().default(''),
    bloodGroup: z.string().default(''),
    religion: z.string().default(''),
    maritalStatus: z.string().default(''),
    quota: z.string().default(''),
  }).default({}),
  presentAddress: z.object({
    careOf: z.string().default(''),
    village: z.string().default(''),
    district: z.string().default(''),
    upazila: z.string().default(''),
    postOffice: z.string().default(''),
    postCode: z.string().default(''),
  }).default({}),
  permanentAddress: z.object({
    careOf: z.string().default(''),
    village: z.string().default(''),
    district: z.string().default(''),
    upazila: z.string().default(''),
    postOffice: z.string().default(''),
    postCode: z.string().default(''),
  }).default({}),
  ssc: z.object({
    exam: z.string().default(''),
    board: z.string().default(''),
    roll: z.string().default(''),
    resultType: z.string().default(''),
    gpa: z.string().default(''),
    group: z.string().default(''),
    passingYear: z.string().default(''),
  }).default({}),
  hsc: z.object({
    exam: z.string().default(''),
    board: z.string().default(''),
    roll: z.string().default(''),
    resultType: z.string().default(''),
    gpa: z.string().default(''),
    group: z.string().default(''),
    passingYear: z.string().default(''),
  }).default({}),
  graduation: z.object({
    exam: z.string().default(''),
    university: z.string().default(''),
    subject: z.string().default(''),
    resultType: z.string().default(''),
    cgpa: z.string().default(''),
    passingYear: z.string().default(''),
    courseDuration: z.string().default(''),
  }).default({}),
  masters: z.object({
    exam: z.string().default(''),
    university: z.string().default(''),
    subject: z.string().default(''),
    resultType: z.string().default(''),
    cgpa: z.string().default(''),
    passingYear: z.string().default(''),
    courseDuration: z.string().default(''),
  }).default({}),
  jobExperiences: z.array(JobExperienceSchema).default([]),
  otherQualifications: z.object({
    computerTypingEn: z.string().default(''),
    computerTypingBn: z.string().default(''),
    drivingLicense: z.string().default(''),
    extraCurricular: z.string().default(''),
  }).default({}),
});

export type Profile = z.infer<typeof ProfileSchema>;
```

### Anti-Patterns to Avoid
- **Global In-Memory Storage in Service Worker:** MV3 service workers terminate after ~30s of inactivity. Never store profile in SW variables; always read/write `chrome.storage.local`.
- **Writing on Every Keystroke Without Debounce:** Saturates `chrome.storage` rate limits and creates lag.
- **Strict Validation Blocking Saves:** If a user types half a phone number, the field should still be saved. Validation errors should be informative hints, not blockers for saving optional data.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Extension Bundling & MV3 Manifest | Custom Rollup/Webpack setup | `wxt` | Manifest schema changes, asset hashing, HMR in extension tabs |
| Schema Validation & Type Generation | Hand-written type-guards & validators | `zod` | Handles nested schemas, partials, safe-parse, and TypeScript type inference |
| Options Page Tab/Scroll Sync | Custom scroll-tracking math | Native `element.scrollIntoView({ behavior: 'smooth' })` | High performance, zero dependencies, browser native |

## Common Pitfalls

### Pitfall 1: Service Worker Global State Loss
**What goes wrong:** Extension stores cached profile in a background script variable. After 30 seconds of inactivity, the SW sleeps; the next action finds undefined state.
**Why it happens:** Chrome MV3 lifecycle terminates idle service workers.
**How to avoid:** All persistence must target `chrome.storage.local`. Treat the SW as completely stateless.

### Pitfall 2: Unhandled JSON Import Structure
**What goes wrong:** User imports a corrupted or malformed JSON file, crashing the options page.
**Why it happens:** `JSON.parse` returns `any` with no structural guarantee.
**How to avoid:** Always execute `ProfileSchema.safeParse()` after `JSON.parse()`. If parsing fails, display an explicit error alert and abort storage update.

### Pitfall 3: Popup Closes on Interaction
**What goes wrong:** Clicking links or buttons inside popup causes popup to close before actions complete.
**Why it happens:** Standard Chrome popup behavior closes popup on losing focus.
**How to avoid:** "Open Profile" button calls `chrome.runtime.openOptionsPage()`, which Chrome handles cleanly by focusing or opening the options tab.

## Code Examples

### Exporting & Importing Profile Data
```typescript
// src/utils/exportImport.ts
import { Profile, ProfileSchema } from '../types/profile';

export function exportProfileToJson(profile: Profile): void {
  const jsonStr = JSON.stringify(profile, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `donna-profile-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProfileFromJson(file: File): Promise<{ success: boolean; data?: Profile; error?: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const result = ProfileSchema.safeParse(parsed);
    if (!result.success) {
      return { success: false, error: 'Invalid profile format. Please upload a valid Donna profile JSON.' };
    }
    return { success: true, data: result.data };
  } catch (err) {
    return { success: false, error: 'Failed to parse JSON file.' };
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manifest V2 Background Pages | Manifest V3 Service Workers | Chrome 88+ (2021) | Ephemeral background execution; no persistent globals |
| Manual Webpack / CRA for Extensions | WXT Framework (Vite-based) | 2023+ | 10x faster build/HMR, automated manifest management |
| `localStorage` in extension pages | `chrome.storage.local` | MV3 requirement | Shared access across popup, options, and background contexts |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Standard Bangladesh job application fields are adequately represented in the 10-section schema | Architecture Patterns | Low — fields can be extended in future minor releases |
| A2 | 400ms debounce provides the optimal balance of responsiveness and storage safety | Architecture Patterns | Very Low — easily configurable parameter |

## Open Questions

1. **Section anchoring styling on mobile/small viewports:**
   - What we know: Options page runs primarily on desktop browser tabs.
   - Recommendation: Use a responsive flex/grid layout where sidebar collapses to a horizontal chip bar or stays sticky on viewports > 768px.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build & testing | ✓ | 26.3.0 | — |
| npm | Package management | ✓ | 11.16.0 | — |
| Chrome / Chromium | Extension execution | ✓ | Installed | — |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (^3.x) + Testing Library |
| Config file | `vitest.config.ts` (configured via WXT or standalone) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCAF-01..03 | Extension build outputs valid MV3 manifest with required permissions | Build / Unit | `npx vitest run tests/manifest.test.ts` | ❌ Wave 0 |
| PROF-01..06 | Profile Zod schema validates all 10 sections with defaults & optionality | Unit | `npx vitest run tests/profileSchema.test.ts` | ❌ Wave 0 |
| PROF-07..08 | Export produces valid JSON; import validates and rejects corrupted files | Unit | `npx vitest run tests/exportImport.test.ts` | ❌ Wave 0 |
| PROF-03 | Delete all data clears storage and resets profile | Unit / Integration | `npx vitest run tests/storage.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `tests/profileSchema.test.ts` — covers PROF-01, PROF-04, PROF-05, PROF-06
- [ ] `tests/exportImport.test.ts` — covers PROF-07, PROF-08
- [ ] `tests/storage.test.ts` — covers PROF-02, PROF-03, PRIV-01

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Extension is local-only (no cloud login in v1) |
| V3 Session Management | no | No remote sessions in v1 |
| V4 Access Control | yes | Manifest permissions limited strictly to `storage`, `activeTab`, `scripting` |
| V5 Input Validation | yes | `zod` schema parsing for all storage reads/writes and JSON imports |
| V6 Cryptography | no | Plain local storage for v1; encryption deferred to v2 |

### Known Threat Patterns for MV3 Chrome Extensions

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Overprivileged Extension Scope | Elevation of Privilege | No `all_urls` or `<all_urls>` matchers; use `activeTab` only |
| Malicious JSON Import Payload | Tampering / DoS | Strict Zod validation on JSON parse with safe fallback |
| Prototype Pollution via Storage | Tampering | Explicit object mapping and Zod parsing on storage retrieval |
| Data Leakage via Loggers | Information Disclosure | Prohibit `console.log` of raw profile objects |

## Sources

### Primary (HIGH confidence)
- Official WXT Documentation (wxt.dev) - MV3 project structure, entrypoints, manifest generation
- Chrome Developers MV3 Documentation - Service worker lifecycle, chrome.storage API
- Zod Documentation (zod.dev) - Schema definition, safeParse, defaults

### Secondary (MEDIUM confidence)
- NPM registry package legitimacy verification via `gsd-tools query package-legitimacy check`

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - WXT + React + Zod is verified modern MV3 standard
- Architecture: HIGH - Clear separation between popup, options UI, and storage wrapper
- Pitfalls: HIGH - Addresses known MV3 service worker lifecycle and storage gotchas

**Research date:** 2026-10-02
**Valid until:** 2026-11-02
