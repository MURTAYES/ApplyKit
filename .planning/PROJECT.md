# Donna

## What This Is

Donna is a Chrome/Chromium browser extension that fills online job application forms from a profile the applicant prepares once. On supported forms, one click fills all fields that have a matching profile value — text inputs, textareas, date pickers, number fields, dropdowns, and checkboxes. Fields with no data in the profile are left untouched. Donna never submits forms, never uploads documents, and never touches CAPTCHA or declaration checkboxes — the applicant always reviews and submits manually.

## Core Value

Fill any supported job application form accurately in one click without ever sending data off the applicant's device.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Profile manager: create, edit, delete a structured applicant profile stored locally
- [ ] Every profile field is optional — no guessing or inference for empty fields
- [ ] Profile import/export as a JSON file for backup
- [ ] One-click fill from the popup (and optional keyboard shortcut)
- [ ] Skip policy: empty profile field → field untouched; already-filled field → untouched by default
- [ ] Field matching engine: label text, name, id, placeholder, aria-label, section context
- [ ] Section-scoped matching (distinguish "Present Address" vs "Permanent Address", SSC vs HSC)
- [ ] Dropdown matching with normalization and aliases (bilingual labels, GPA format variants)
- [ ] Dependent dropdown support: fill sequentially, wait for options to load
- [ ] Repeatable section support: click ADD MORE as needed, then fill each entry
- [ ] Fill report: filled / skipped / unmatched — shown after each fill run
- [ ] Filled field highlight with "Clear highlights" action
- [ ] Undo last fill (restore pre-fill field values)
- [ ] Per-site mapping files (JSON) for known portals
- [ ] Support for the Bangladesh government reference portal and structurally similar forms
- [ ] Never-do rules enforced: no submit, no file upload, no CAPTCHA, no declaration, no inference

### Out of Scope

- Form submit / Next button clicks — Donna is explicitly fill-only
- File upload (input type=file) — excluded by hard constraint R2
- CAPTCHA solving or bypass — excluded by hard constraint R3
- Declaration / consent checkbox — excluded by hard constraint R4
- Cloud sync, user accounts, multi-user support — local-only by design
- Mobile browsers — v1 desktop Chromium only
- Firefox — later port, not v1
- Profile passphrase encryption — v2 candidate (data never leaves device in v1)
- Multiple profiles — v2 candidate (flagged open question)
- Auto-detect and inject on known portals without user click — would require all_urls host permissions; deferred

## Context

- Target form: Bangladesh government-style job application portal with sections: Basic Information, Present/Permanent Address, SSC, HSC, Graduation, Masters (optional), Job Experiences (optional, repeatable), Other Qualifications, Verification Code (CAPTCHA), Declaration + Submit.
- Repeat-label problem: Many section labels repeat across education and address sections (District, Roll No, Result, Passing Year) — section context via nearest heading/legend is the primary disambiguation mechanism.
- Framework-controlled inputs: React/Angular/Vue forms require the native property setter + dispatched input, change, blur events to register fills.
- Dependent dropdowns: District to Upazila/P.S. chains require sequential fill with MutationObserver or polling before moving to the child field.
- Bangla text: Profile stores Unicode exactly; no transliteration. Bilingual field labels need normalization.
- Distribution: Initially unpacked personal use; Chrome Web Store as a target when ready.
- Live portal inspection (M0): Option lists for dropdowns must be verified against the live portal before build.

## Constraints

- Platform: Chrome MV3 + Chromium-based browsers (Edge, Brave) — v1
- Tech Stack: TypeScript, React (popup/options UI), content script, service worker
- Permissions: storage, activeTab, scripting — no all_urls; inject on user click via activeTab
- Storage: chrome.storage.local only — no remote calls with user data
- Safety: R1-R6 never-do rules are hard constraints, not configurable defaults
- Privacy: Profile data must not be exposed to page JavaScript context; no console logging of field values

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manifest V3 (not V2) | MV2 end-of-life in Chrome; MV3 is the current standard | — Pending |
| TypeScript + React for UI | Type safety for the data model; React for profile form CRUD | — Pending |
| Plain chrome.storage.local (no encryption in v1) | Reduces setup friction; data never leaves device so risk is lower | — Pending |
| Fill directly into permanent address fields (not ticking Same as Present checkbox) | Avoids reliance on page scripts that may not fire correctly | — Pending |
| Clicking ADD MORE for job experiences is permitted | Non-destructive DOM interaction, not a form submit | — Pending |
| Profile char-limit enforcement at save time | Textarea max-300 overflow becomes a non-issue at fill time | — Pending |
| activeTab permission only (no all_urls) | Minimal permission footprint; user explicitly triggers fill | — Pending |
| No auto-submit, no file upload, no CAPTCHA, no declaration | Core trust contract with the user — non-negotiable | Done |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via /gsd-transition):
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone** (via /gsd-complete-milestone):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-02 after initialization*
