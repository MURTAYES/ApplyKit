# Donna — Project Roadmap

**Project:** Donna browser extension (Chrome MV3, TypeScript + React)
**Mode:** MVP — each phase delivers an end-to-end user capability
**Requirements:** 37 v1 requirements across 8 categories
**Phases:** 6

---

## Milestone 1: v1 — Working Form Filler

### Phase 1: Extension Shell + Profile Manager

**Goal:** A loadable Chrome extension where the user can create and store a complete applicant profile.
**Mode:** mvp
**Requirements:** SCAF-01, SCAF-02, SCAF-03, SCAF-04, PROF-01, PROF-02, PROF-03, PROF-04, PROF-05, PROF-06, PROF-07, PROF-08

**Success Criteria:**
1. Extension loads in Chrome as an unpacked extension with popup visible and options page accessible
2. User can open the options page and enter values in all profile sections (Basic Info, Address x2, SSC, HSC, Graduation, Masters, Job Experiences, Other Qualifications)
3. Profile data persists across browser restarts (stored in chrome.storage.local)
4. User can export profile as a .json file and re-import it to restore the profile
5. All profile fields are optional — saving with any subset of fields filled works without error

---

### Phase 2: Core Fill Engine + Text/Date/Number Fields

**Goal:** One-click fill of text, date, and number fields on the reference form with correct section-scoped matching.
**Mode:** mvp
**Requirements:** FILL-01, FILL-02, FILL-03, FILL-04, FILL-05, FILL-06, FILL-07, FILL-08, FILL-09, MATCH-01, MATCH-02, MATCH-03, MATCH-04, MATCH-05, MATCH-06

**Success Criteria:**
1. Clicking "Fill form" in the popup fills all text/date/number fields on the reference form that have matching profile data
2. Fields with no profile data remain untouched after fill
3. Fields the user typed manually before clicking fill are not overwritten
4. SSC "Passing Year" fills into the SSC section, not the HSC or Graduation section (section scoping works)
5. English name field receives English name; Bangla name field receives Bangla name (bilingual detection works)
6. Donna does not click any submit, next, or upload buttons during the fill run

---

### Phase 3: Dropdown Matching + Dependent Selects

**Goal:** Dropdown fields (Board, Result, District, Upazila, Religion, etc.) fill correctly including chained dependent selects.
**Mode:** mvp
**Requirements:** DROP-01, DROP-02, DROP-03, DROP-04

**Success Criteria:**
1. Native <select> dropdowns fill with the matching option using normalized text comparison (case-insensitive, punctuation-stripped)
2. Bilingual option matching works: stored English "Dhaka" matches Bangla "ঢাকা" dropdown option (and vice versa)
3. District → Upazila/P.S. dependent chain fills correctly: Upazila options load after District is selected before Upazila is filled
4. Dropdown with no confident match is left untouched and not counted as filled in the report

---

### Phase 4: Address Logic + Repeatable Job Experiences

**Goal:** Present/Permanent address handling and multi-row Job Experience section fill work correctly.
**Mode:** mvp
**Requirements:** SPEC-01, SPEC-02, SPEC-03, SPEC-04

**Success Criteria:**
1. Present Address and Permanent Address fill separately from independent profile values (not via checkbox)
2. If profile has permanent_same_as_present flag, permanent address fills with present address values directly into the permanent address fields
3. Job Experiences section: if profile has 2 experience entries, the extension clicks ADD MORE once and fills both rows in profile order
4. "Confirm Mobile" and similar mirror fields fill from the same single profile value as their primary counterpart
5. Other Qualifications checkboxes fill correctly: yes/no profile values set checked state; unset profile values leave checkboxes untouched

---

### Phase 5: Fill Report + Live Portal Hardening

**Goal:** Fill report shows what was filled/skipped/unmatched, and the extension reliably fills the live reference portal.
**Mode:** mvp
**Requirements:** REPT-01, REPT-02, PRIV-01, PRIV-02, PRIV-03, PRIV-04

**Success Criteria:**
1. After fill completes, popup shows count of filled / skipped (no data) / unmatched (has data, no field found) fields
2. Unmatched fields are listed distinctly from skipped fields in the report
3. Profile data does not appear in browser console logs or network requests
4. Content script cannot expose profile values to page JavaScript (no window-level injection of profile data)
5. Extension fills the live reference portal with ≥95% field accuracy across a full manual test run
6. Extension does not interact with the CAPTCHA, declaration checkbox, or any submit/next button during the live portal test

---

### Phase 6: Reference Portal Mapping + Test Suite

**Goal:** Per-site JSON mapping for the reference portal eliminates heuristic guesses on known fields, and a fixture-based test suite catches regressions.
**Mode:** mvp
**Requirements:** (Quality and hardening — all v1 requirements fully covered and regression-tested)

**UI Hint:** no

**Success Criteria:**
1. A JSON mapping file for the reference portal exists in mappings/ directory with exact selectors for all known fields
2. Per-site mapping is loaded and applied at fill time; mapped fields bypass heuristic matching
3. Fixture HTML copy of the reference form exists and fill engine tests run against it (Vitest/Playwright)
4. Unit tests exist for: field normalizer, section scoper, dropdown matcher, profile schema validator
5. Manual regression on live portal passes with 0 wrong-field fills and 0 unintended submit/upload/CAPTCHA interactions

---

## Phase Coverage

| Phase | Requirements | Count |
|-------|-------------|-------|
| Phase 1: Extension Shell + Profile Manager | SCAF-01–04, PROF-01–08 | 12 |
| Phase 2: Core Fill Engine | FILL-01–09, MATCH-01–06 | 15 |
| Phase 3: Dropdown Matching | DROP-01–04 | 4 |
| Phase 4: Address Logic + Repeatable Sections | SPEC-01–04 | 4 |
| Phase 5: Fill Report + Hardening | REPT-01–02, PRIV-01–04 | 6 |
| Phase 6: Per-Site Mapping + Tests | (Quality phase) | — |
| **Total v1 covered** | | **37 ✓** |

---

## Open Questions (to answer before Phase 1 planning)

- Q1: Does the live reference portal use iframes for any form sections?
- Q2: Is the reference portal form built with a JS framework (React/Angular/Vue) or plain HTML?
- Q3: What are the exact option values for Board, Group, and Result dropdowns on the reference form?
- Q4: Are NID/Passport fields text inputs or dropdowns with a type selector followed by a number input?

These are captured as M0 tasks (live form inspection) — Phase 1 can proceed in parallel while M0 answers Q3/Q4; Phase 2/3 planning should not start until Q1/Q2 are confirmed.

---

*Roadmap created: 2026-10-02*
