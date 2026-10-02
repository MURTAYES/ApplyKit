# Phase 03: Dropdown Matching + Dependent Selects - Research

**Date:** 2026-10-02
**Status:** Completed

## 1. Domain & Architecture Analysis

### Native `<select>` Autofilling Mechanics
Modern web frameworks (React, Angular, Vue) and vanilla JavaScript forms on job portals listen to `change` and `input` events on `<select>` elements.
To ensure full framework compatibility:
1. Use `HTMLSelectElement.prototype.value` descriptor setter or assign `.value` / `.selectedIndex`.
2. Dispatch `focus`, `input`, `change`, and `blur` events with `bubbles: true`.
3. Check placeholder values: An option is considered a placeholder if `value === ''`, `value === '0'`, or its text matches patterns like `/select/i`, `/choose/i`, `/নির্বাচন/i`, `/--+/`.

### Bilingual Option Matching
On Bangladesh recruitment portals (e.g. government, Teletalk, corporate portals):
- Many dropdowns use Bengali Unicode text (e.g. `ঢাকা`, `কুমিল্লা`, `প্রথম বিভাগ`), while profiles may store English (`Dhaka`, `Comilla`, `First Division`), or vice versa.
- User reported explicit portal validation requirements: `"Only Bangla Unicode is accepted!"`.
- **Solution:** A centralized bilingual dictionary mapping English keys/variants $\leftrightarrow$ Bengali Unicode equivalents across:
  - 64 Districts
  - 11 Education Boards
  - Religions (Islam, Hinduism, Buddhism, Christianity, Other)
  - Genders (Male, Female, Other)
  - Result Types (First/Second/Third Division, GPA, CGPA)
  - Quotas (Non-Quota, Freedom Fighter, etc.)

### Dependent Select Cascading (District $\rightarrow$ Upazila/Thana)
When District is selected, the application typically fires an AJAX request or client-side filter to populate the Upazila/Thana `<select>`.
- **Observation Pattern:**
  1. Fill parent select (`District`).
  2. If a dependent child select (`Upazila`/`Thana`) exists in the same section/form, attach a `MutationObserver` on the child select looking for `childList` additions.
  3. Set a safety timeout (e.g. 1000ms max) with 50ms polling fallback.
  4. Once child options are loaded (count > 1 or non-placeholder options exist), execute option matching on the child select.

## 2. Validation & Testing Strategy
- Unit tests for bilingual dictionaries (English $\rightarrow$ Bangla, Bangla $\rightarrow$ English, case/diacritic normalization).
- Unit tests for `findBestOptionMatch` covering exact matches, normalized token matches, alias matches, and low-confidence rejections (`DROP-01`, `DROP-02`, `DROP-04`).
- Async integration tests with JSDOM simulating dynamically populated dependent selects (`DROP-03`).
- Safety verification ensuring untouched dropdowns when profile has no matching data or user already selected a valid option (R5).
