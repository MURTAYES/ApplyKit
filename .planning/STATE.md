# STATE.md — Donna Project Memory

## Project Reference

See: .planning/PROJECT.md (updated 2026-10-02)

**Core value:** Fill any supported job application form accurately in one click without ever sending data off the applicant's device.
**Current focus:** Phase 1 — Extension Shell + Profile Manager

## Current Status

**Milestone:** v1 — Working Form Filler
**Active Phase:** None yet — ready to start Phase 1
**Last Action:** Project initialized; roadmap created (6 phases, 37 v1 requirements)

## Phase History

(None completed yet)

## Key Decisions Log

| Decision | Phase | Date |
|----------|-------|------|
| WXT framework for MV3 + TypeScript + React | Init | 2026-10-02 |
| Plain chrome.storage.local, no encryption in v1 | Init | 2026-10-02 |
| Fill permanent address directly (not via checkbox) | Init | 2026-10-02 |
| ADD MORE clicks permitted for repeatable sections | Init | 2026-10-02 |
| activeTab only permissions (no all_urls) | Init | 2026-10-02 |
| Native property setter + event dispatch for all fills | Init | 2026-10-02 |

## M0 Blockers (before Phase 2/3 planning)

- [ ] Inspect live reference portal: confirm iframe presence, JS framework
- [ ] Document exact dropdown option values: Board, Group, Result, District
- [ ] Confirm NID/Passport field types (text input vs dropdown + follow-up)

## Next Steps

1. `/gsd-discuss-phase 1` — gather context for Phase 1 planning
2. Run M0 inspection on live portal (parallel with Phase 1 build)

---
*State initialized: 2026-10-02*
