---
phase: "1"
slug: "extension-shell-profile-manager"
status: validated
nyquist_compliant: true
wave_0_complete: true
created: "2026-10-02"
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.x |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test -- --run` |
| **Estimated runtime** | ~1.5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test -- --run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | SCAF-01, SCAF-02, SCAF-03 | T-01-01 | Extension manifest permissions strictly limited to storage, activeTab, scripting | Build / Unit | `npm run build` | ✅ | ✅ green |
| 1-01-02 | 01 | 1 | PROF-01, PROF-04, PROF-05, PROF-06 | T-01-02 | Profile schema parses optional fields with safe defaults and validates structure | Unit | `npx vitest run tests/profileSchema.test.ts` | ✅ | ✅ green |
| 1-01-03 | 01 | 2 | PROF-02, PROF-03, PRIV-01 | T-01-03 | Storage wrapper reads/writes chrome.storage.local safely without leaks | Unit | `npx vitest run tests/profileStorage.test.ts` | ✅ | ✅ green |
| 1-01-04 | 01 | 2 | PROF-07, PROF-08 | T-01-02 | Export produces sanitized JSON; import validates against Zod and rejects malformed payloads | Unit | `npx vitest run tests/exportImport.test.ts` | ✅ | ✅ green |
| 1-02-01 | 02 | 3 | SCAF-01, SCAF-04 | — | N/A | Component / Build | `npx vitest run tests/popup.test.tsx` | ✅ | ✅ green |
| 1-02-02 | 02 | 3 | PROF-01..06 | — | N/A | Component / Unit | `npx vitest run tests/options.test.tsx` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `vitest.config.ts` — Vitest configuration with jsdom environment
- [x] `tests/profileSchema.test.ts` — unit tests for Zod profile schema & default values
- [x] `tests/profileStorage.test.ts` — unit tests for chrome.storage.local wrapper
- [x] `tests/exportImport.test.ts` — unit tests for JSON import/export validation

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Unpacked extension load in Chrome | SCAF-01 | Requires browser runtime extension loader | Open chrome://extensions, enable Dev mode, Load unpacked `.output/chrome-mv3`, verify popup and options page launch |
| Visual smooth scroll across 10 sections | PROF-06 | Visual styling / UX check | Open Options page, click each sidebar nav item, verify page smoothly scrolls to target section |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-02
