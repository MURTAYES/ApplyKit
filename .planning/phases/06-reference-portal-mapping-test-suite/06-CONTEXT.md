# Phase 06: Reference Portal Mapping + Test Suite - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Delivers per-site JSON mapping for Teletalk Bangladesh government portals (`*.teletalk.com.bd`), automatic site-mapping resolver matching the active tab URL (`MATCH-05`, `MATCH-06`), a full standalone HTML reference form fixture (`tests/fixtures/teletalk_application_form.html`), and an exhaustive end-to-end regression test suite ensuring 100% field accuracy, dependent select cascading, multi-row experience additions, and strict safety non-interference.

In scope:
- Built-in site mapping dictionary (`src/mappings/teletalk.json`): Exact CSS selectors mapped to profile keys for Teletalk government recruitment portals (`MATCH-05`, `MATCH-06`).
- Automatic Site Mapping Resolver (`src/engine/siteResolver.ts`): Resolves tab URL against known site pattern registries and injects site-specific mappings into `fillEngine`.
- Comprehensive Reference Portal HTML Fixture (`tests/fixtures/teletalk_application_form.html`): Complete full-page standalone HTML document replicating all sections (Basic Info, Address x2, SSC, HSC, Graduation, Masters with toggle checkbox, Job Experience with "+ ADD MORE", Other Qualifications, and Declaration / CAPTCHA footer).
- End-to-End Regression Suite: Comprehensive Vitest / JSDOM test suite executing a complete fill run against the HTML fixture and verifying $\ge 95\%$ accuracy, zero wrong-field fills, zero declaration checkbox ticks, and zero CAPTCHA touches.

Out of scope:
- Remote cloud storage / multi-device sync (Out of scope for v1)
- Custom JavaScript virtual comboboxes (v2)
- Form submission, file uploads, CAPTCHAs, declaration checkboxes (Hard constraints R1–R4)

</domain>

<decisions>
## Implementation Decisions

### 1. Per-Site Mapping Registry (`src/mappings/teletalk.json`, `MATCH-05`, `MATCH-06`)
- **D-01:** **Built-In Mapping Bundle:** Bundle known site mappings directly into the extension (`src/mappings/teletalk.json`), indexed by URL regex pattern (`/^https?:\/\/([a-zA-Z0-9-]+\.)?teletalk\.com\.bd\//i`, `/alljobs\.teletalk\.com\.bd/i`).
- **D-02:** **Mapping Priority:** When a site mapping matches the current page URL, `matchField` resolves mapped fields with confidence `1.0` (source: `custom_mapping`), bypassing heuristic guessing and eliminating ambiguity. Any field not explicitly mapped falls back safely to heuristic matching. — **Reversibility:** reversible.

### 2. Standalone HTML Reference Form Fixture (`tests/fixtures/teletalk_application_form.html`)
- **D-03:** **Realistic Portal Architecture:** Create a full-page HTML fixture containing:
  - 3-column table layouts (`<td>Label</td><td>:</td><td><input></td>`)
  - Bilingual name fields (English & Bangla)
  - Toggle dropdowns (NID, Birth Registration, Passport) with dynamic numeric inputs
  - Dependent District $\rightarrow$ Upazila dropdowns in Present & Permanent address
  - Masters unlock checkbox
  - Multi-row Job Experience table with "+ Add More" dynamic row addition
  - Declaration agreement checkbox & CAPTCHA image challenge box.

### 3. Master Regression Test Suite
- **D-04:** **Comprehensive End-to-End Verification:** Automated test suite loading the complete HTML fixture, executing `executeFill`, and verifying:
  - 100% of populated profile fields are accurately filled.
  - Dependent dropdowns (District $\rightarrow$ Upazila) properly cascade and select.
  - Multi-row experiences are dynamically added and filled in order.
  - Declaration checkbox remains strictly `checked = false`.
  - CAPTCHA input remains untouched.
  - FillReport returns accurate filled/skipped/unmatched counts.

### the agent's Discretion
- Selector naming conventions in `teletalk.json`.
- Event listeners inside the HTML fixture to simulate portal client-side scripts.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `.planning/PROJECT.md` — Constraints, never-do rules (R1–R6), and local-first architecture.
- `.planning/REQUIREMENTS.md` — Requirements `MATCH-05`, `MATCH-06`, `FILL-01`–`FILL-09`, `DROP-01`–`DROP-04`, `SPEC-01`–`SPEC-04`.
- `.planning/ROADMAP.md` § Phase 6 — Phase 6 scope and success criteria.

### Prior Phase Context & Codebase
- `src/types/mapping.ts` — `SiteMapping` schema definition.
- `src/engine/matcher.ts` — Site mapping override integration in `matchField`.
- `src/engine/fillEngine.ts` — Core fill engine orchestrator.
- `entrypoints/content.ts` — Content script message handler.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/engine/matcher.ts`: Already checks `customMappings.fields` before heuristic matching (`MATCH-05`, `MATCH-06`).
- `src/types/mapping.ts`: Defines `SiteMapping` and `FieldMapping` types.

### Integration Points
- `src/mappings/teletalk.json`: Site mapping configuration for Teletalk portals.
- `src/engine/siteResolver.ts`: Matches `window.location.href` to retrieve site mappings.
- `entrypoints/content.ts`: Resolves active site mapping and passes it to `executeFill`.

</code_context>

<specifics>
## Specific Ideas

- Ensure `teletalk.json` covers common Teletalk selector variants: `p_name`, `p_name_ban`, `father_name`, `mother_name`, `dob`, `mobile`, `confirm_mobile`, `ssc_roll`, `hsc_roll`, `job_exp_table`.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within Phase 6 scope.

</deferred>

---

*Phase: 06-reference-portal-mapping-test-suite*
*Context gathered: 2026-10-02*
