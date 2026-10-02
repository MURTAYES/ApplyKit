# Phase 06: Reference Portal Mapping + Test Suite - Research

**Date:** 2026-10-02
**Status:** Completed

## 1. Domain & Architecture Analysis

### Per-Site JSON Mapping Architecture (`MATCH-05`, `MATCH-06`)
While heuristic matching achieves high coverage across arbitrary forms, popular high-volume recruitment portals (such as Teletalk Bangladesh government portals at `*.teletalk.com.bd` and `alljobs.teletalk.com.bd`) follow predictable markup conventions:
- Standard element names / IDs: `p_name`, `p_name_ban`, `father_name`, `mother_name`, `dob`, `nid`, `passport`, `breg`, `mobile`, `confirm_mobile`, `p_district`, `p_thana`, `per_district`, `per_thana`, `ssc_roll`, `hsc_roll`, etc.
- **Resolver Pattern:**
  - `src/mappings/teletalk.json`: Contains structured mapping definition with `name`, `urlPatterns: string[]`, and `fields: Record<string, { selector: string, profileKey: string, section?: SectionScope }>`.
  - `src/engine/siteResolver.ts`: Function `getMappingForUrl(url: string): SiteMapping | null` checks `window.location.href` against known site mapping patterns.
  - In `entrypoints/content.ts`, when fill is triggered, it automatically detects the current URL mapping and passes it to `executeFill(profile, document, siteMapping)`.
  - In `matchField(el, customMappings)`, any field matching `mapping.selector` is immediately mapped with `confidence: 1.0` (source: `custom_mapping`), bypassing heuristic guessing (`MATCH-06`).

### Full Reference Portal HTML Fixture
- Replicates real-world Teletalk HTML structure in `tests/fixtures/teletalk_application_form.html`:
  - Table-based 3-column layouts.
  - Bilingual text inputs.
  - Dependent dropdowns (District $\rightarrow$ Upazila) with simulated dynamic option loading.
  - "If Applicable" toggle checkboxes for Masters and Job Experience.
  - Job Experience table with "+ Add More" dynamic row script.
  - Declaration agreement checkbox (`#chk_declaration`) and CAPTCHA challenge input (`#captcha_code`).

### Master End-to-End Regression Suite
- Executes full form autofill against the complete HTML fixture.
- Verifies $\ge 95\%$ field accuracy.
- Confirms declaration checkbox and CAPTCHA remain untouched (R3, R4 constraints).
- Confirms non-overwrite protection (FILL-05, R5).

## 2. Validation Architecture
- Unit tests for `src/engine/siteResolver.ts` verifying URL regex matching.
- Integration tests verifying `teletalk.json` mapping integration in `matchField` and `executeFill`.
- Full-page regression test suite running against `teletalk_application_form.html`.
