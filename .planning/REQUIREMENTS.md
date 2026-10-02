# Requirements: Donna

**Defined:** 2026-10-02
**Core Value:** Fill any supported job application form accurately in one click without ever sending data off the applicant's device.

## v1 Requirements

### Extension Scaffold

- [ ] **SCAF-01**: Extension loads in Chrome/Edge/Brave as an unpacked MV3 extension with popup and options page
- [ ] **SCAF-02**: Extension uses WXT framework with TypeScript and React
- [ ] **SCAF-03**: Manifest declares only: storage, activeTab, scripting permissions (no all_urls)
- [ ] **SCAF-04**: Content script is injected on user-triggered fill action (activeTab), not on page load

### Profile Manager

- [ ] **PROF-01**: User can create a structured applicant profile with all pre-defined fields (see data model)
- [ ] **PROF-02**: User can edit any profile field at any time
- [ ] **PROF-03**: User can delete all profile data with a single "Delete all data" action
- [ ] **PROF-04**: Every profile field is optional — empty fields are left blank; Donna never infers or guesses
- [ ] **PROF-05**: Profile fields include both English and Bangla name fields where applicable
- [ ] **PROF-06**: Profile covers all sections: Basic Information, Present Address, Permanent Address, SSC, HSC, Graduation, Masters (optional), Job Experiences (list), Other Qualifications
- [ ] **PROF-07**: User can export profile as a JSON file
- [ ] **PROF-08**: User can import profile from a previously exported JSON file

### Fill Engine

- [ ] **FILL-01**: User can trigger a fill from the popup button
- [ ] **FILL-02**: Fill engine injects into the active tab's form on trigger
- [ ] **FILL-03**: Fill engine fills text inputs, textareas, number inputs, and date inputs from matching profile values
- [ ] **FILL-04**: Empty profile value leaves the form field untouched
- [ ] **FILL-05**: Field already containing a user-typed value is left untouched (no overwrite by default)
- [ ] **FILL-06**: Fill uses native property setter + input/change/blur event dispatch (works with React/Angular/Vue-controlled forms)
- [ ] **FILL-07**: Fill engine normalizes Bangla text (NFC, ZWJ/ZWNJ strip) before filling Bangla fields
- [ ] **FILL-08**: Fill engine does not submit forms, click Next/Submit, upload files, touch CAPTCHA, or tick declaration checkboxes (hard constraints R1-R4)
- [ ] **FILL-09**: Fill engine does not fill any field from an assumed or inferred value (hard constraint R5)

### Field Matching

- [ ] **MATCH-01**: Heuristic matching uses label text, name, id, placeholder, aria-label (in priority order)
- [ ] **MATCH-02**: Section-scoped matching groups fields by nearest fieldset/legend or heading to distinguish repeated labels (SSC vs HSC "Passing Year", Present vs Permanent "District")
- [ ] **MATCH-03**: Bilingual label normalization: normalize both English and Bangla label text for matching
- [ ] **MATCH-04**: Confidence threshold: only fill when match confidence exceeds threshold; otherwise report as unmatched
- [ ] **MATCH-05**: Per-site JSON mapping files provide exact CSS selector → profile key mappings for known portals
- [ ] **MATCH-06**: Per-site mapping takes priority over heuristic matching for any field it covers

### Dropdown Matching

- [ ] **DROP-01**: Native <select> dropdown filled by matching stored value against option text (normalized: lowercase, strip punctuation, collapse whitespace)
- [ ] **DROP-02**: Alias table supports bilingual matches (English ↔ Bangla option labels) and format variants (GPA formats, district name variants)
- [ ] **DROP-03**: Dependent dropdowns (District → Upazila/P.S.) filled sequentially: fill parent, wait for child options to load (MutationObserver + timeout), then fill child
- [ ] **DROP-04**: Dropdown with no confident match is left untouched and reported as unmatched

### Special Field Handling

- [ ] **SPEC-01**: Repeatable Job Experience sections: click "ADD MORE" button (n-1) times to create n rows, then fill each row in profile order
- [ ] **SPEC-02**: Permanent address fields filled directly from profile (does not tick "Same as Present" checkbox)
- [ ] **SPEC-03**: "Confirm Mobile" and similar duplicate fields filled from the same single profile value
- [ ] **SPEC-04**: Other Qualifications checkboxes (typing speed, word processing, email, fax) filled from yes/no/unset profile values; unset → untouched

### Fill Report

- [ ] **REPT-01**: After fill completes, popup shows a summary: count of filled / skipped / unmatched fields
- [ ] **REPT-02**: Unmatched fields (profile has data but no form field/option was found) are reported distinctly from skipped fields (no profile data)

### Privacy and Safety

- [ ] **PRIV-01**: All profile data stored in chrome.storage.local only; no remote calls with user data
- [ ] **PRIV-02**: Extension does not log profile field values in console or telemetry
- [ ] **PRIV-03**: Content script does not expose profile data to the page's JavaScript context
- [ ] **PRIV-04**: Extension includes a privacy policy for Chrome Web Store submission

## v2 Requirements

### UX Enhancements

- **UX-01**: Inline field highlights after fill (green = filled, amber = unmatched) with "Clear Highlights" action
- **UX-02**: Undo last fill: restore all filled fields to their pre-fill values
- **UX-03**: Keyboard shortcut to trigger fill (e.g., Alt+Shift+D)

### Security

- **SEC-01**: Optional profile passphrase encryption (AES-GCM via Web Crypto API)

### Multi-profile

- **MPRO-01**: Support multiple named profiles (family member helper use case)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Form submission / Next button clicks | Hard constraint R1 — Donna is fill-only |
| File upload (input type=file) | Hard constraint R2 |
| CAPTCHA solving or bypass | Hard constraint R3 |
| Declaration / consent checkbox | Hard constraint R4 |
| Cloud sync / user accounts | Local-only by design; PII transmission risk |
| Mobile browsers | v1 desktop Chromium only |
| Firefox | Later port, not v1 |
| AI-generated answers for custom questions | Hard constraint R5 — no inferred values |
| Auto-detect fill on page load (no user trigger) | Would require all_urls permissions |
| Custom JavaScript dropdowns (non-native select) | Report as unmatched in v1; v2 candidate |
| Shadow DOM / iframe field filling | Report as unmatched in v1; v2 candidate |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAF-01 to SCAF-04 | Phase 1 | Pending |
| PROF-01 to PROF-08 | Phase 1 | Pending |
| FILL-01 to FILL-09 | Phase 2 | Pending |
| MATCH-01 to MATCH-06 | Phase 2 | Pending |
| DROP-01 to DROP-04 | Phase 3 | Pending |
| SPEC-01 to SPEC-04 | Phase 4 | Pending |
| REPT-01 to REPT-02 | Phase 5 | Pending |
| PRIV-01 to PRIV-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0 ✓

---
*Requirements defined: 2026-10-02*
*Last updated: 2026-10-02 after initial definition*
