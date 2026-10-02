# Phase 04: Address Logic + Repeatable Job Experiences - Research

**Date:** 2026-10-02
**Status:** Completed

## 1. Domain & Architecture Analysis

### Repeatable Multi-Row Sections (Job Experience)
Government and corporate recruitment portals (such as Teletalk, Bdjobs, and private career portals) frequently allow candidates to list multiple job experiences.
- Forms typically render 1 initial empty experience row or table block.
- An "ADD MORE" / "+ Add Row" / "যোগ করুন" button or link triggers client-side JavaScript to append new row elements to the DOM.
- **Orchestration Pattern:**
  1. Determine the number of valid job experiences in the profile ($N$).
  2. If $N == 0$, skip or leave initial row empty.
  3. Unlock the Job Experience section checkbox if present (e.g. `If Applicable`).
  4. Count existing experience row containers ($M$) in the DOM.
  5. If $N > M$, find the section's "+ Add More" button and click it $(N - M)$ times.
  6. Use a `MutationObserver` or 150ms delay between clicks to allow DOM insertion to settle.
  7. Scope field resolution per row container: row $i$ inputs match against `profile.jobExperiences[i]`.

### Address Logic & Permanent Address Mirroring
- Portals often provide a "Same as Present" checkbox. However, ticking on-page checkboxes in client-side forms can trigger unpredictable side effects, form resets, or disabled field behaviors.
- **Direct Population Strategy (`SPEC-02`):**
  - Present Address and Permanent Address are treated as separate sections in section scoping.
  - If `permanent_same_as_present` is true (or if permanent address is empty in profile), Donna copies present address values directly into permanent address fields.
  - Both Present and Permanent address trigger their respective dependent selects (District $\rightarrow$ Upazila) sequentially.

### Mirror & Confirmation Fields
- Many forms include confirmation fields (e.g., "Confirm Mobile Number", "Re-type Email Address", "পুনরায় মোবাইল নম্বর").
- **Pattern Matching (`SPEC-03`):**
  - Matcher detects confirmation keywords (`confirm`, `re-enter`, `re-type`, `verify`, `পুনরায়`, `নিশ্চিত`).
  - Maps them to the base profile key (`basicInfo.phone`, `basicInfo.email`, `basicInfo.nid`).
  - Fills them with the exact primary profile value during execution.

### Other Qualifications & Checkbox/Radio Handling
- Qualifications (e.g. Computer Typing Speed, Driving License, Computer Literacy) are presented as checkboxes, radio pairs (Yes/No), or text inputs.
- **3-State Logic (`SPEC-04`):**
  - `true` $\rightarrow$ set checkbox `checked = true` (or select "Yes" / "হ্যাঁ" radio option).
  - `false` $\rightarrow$ set checkbox `checked = false` (or select "No" / "না" radio option).
  - `undefined`/unset $\rightarrow$ leave completely untouched.
- **Safety Blacklist (R4 Constraint):**
  - Strict blacklist for declaration/terms/CAPTCHA keywords (`declare`, `certify`, `terms`, `condition`, `agree`, `শর্তাবলী`, `ঘোষণা`, `captcha`).
  - Any matching element is completely skipped.

## 2. Validation Architecture
- Unit tests for row counter and multi-row addition handler.
- Unit tests for confirmation field pattern matching and resolution.
- Unit tests for 3-state checkbox/radio setters and declaration safety blacklist.
- Async integration tests with JSDOM simulating dynamic row additions, address mirroring, confirmation fields, and qualification toggles.
