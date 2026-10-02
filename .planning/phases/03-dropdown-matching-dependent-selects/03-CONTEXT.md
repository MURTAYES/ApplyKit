# Phase 03: Dropdown Matching + Dependent Selects - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Delivers accurate selection of native `<select>` dropdowns (and standard select elements) on job application forms from stored profile values, including bilingual English $\leftrightarrow$ Bangla option mapping and dynamic dependent select chaining (e.g. District $\rightarrow$ Upazila/Thana).

In scope:
- Matching native `<select>` dropdowns using normalized text and dictionary aliases (`DROP-01`, `DROP-02`, `DROP-04`)
- Comprehensive bilingual dictionaries (English $\leftrightarrow$ Bengali Unicode) for Districts (64), Education Boards, Religions, Genders, Result types (CGPA/Division scales), and Quota categories (`DROP-02`)
- Strict Unicode handling ensuring valid Bangla Unicode formatting without corruption (`"Only Bangla Unicode is accepted!"` compliance)
- Chained dependent selects (e.g. District selection triggers `change` event, uses MutationObserver/polling with timeout to wait for child dropdown options to populate before filling Upazila) (`DROP-03`)
- Native prototype setter `HTMLSelectElement.prototype` and synthetic event dispatch (`focus`, `input`, `change`, `blur`)
- Safe non-overwrite and ambiguity policy: leave dropdown untouched when already selected by user or if confidence is low (`DROP-04`)
- Integration with fill telemetry report (filled/skipped/unmatched dropdowns)

Out of scope:
- Multi-row "ADD MORE" repeatable Job Experience sections (Phase 4)
- Address synchronization logic (Phase 4)
- Complex custom non-select div/span comboboxes (v2)
- Form submission, file uploads, CAPTCHAs, declaration checkboxes (Hard constraints R1–R4)

</domain>

<decisions>
## Implementation Decisions

### 1. Bilingual Dictionary & Normalization Scope
- **D-01:** **Comprehensive Bilingual Dictionary:** Build exhaustive bidirectional mappings between English and Bengali Unicode for all standard BD recruitment portal options:
  - 64 Districts (e.g. `Dhaka` $\leftrightarrow$ `ঢাকা`, `Chattogram` / `Chittagong` $\leftrightarrow$ `চট্টগ্রাম`)
  - Education Boards (e.g. `Dhaka` $\leftrightarrow$ `ঢাকা`, `Cumilla` / `Comilla` $\leftrightarrow$ `কুমিল্লা`, `Technical` $\leftrightarrow$ `কারিগরি`, `Madrasah` $\leftrightarrow$ `মাদ্রাসা`)
  - Genders (`Male` $\leftrightarrow$ `পুরুষ`, `Female` $\leftrightarrow$ `মহিলা`, `Other` $\leftrightarrow$ `অন্যান্য`)
  - Religions (`Islam` $\leftrightarrow$ `ইসলাম`, `Hinduism` $\leftrightarrow$ `হিন্দু`, `Buddhism` $\leftrightarrow$ `বৌদ্ধ`, `Christianity` $\leftrightarrow$ `খ্রিস্টান`)
  - Result Types (`First Division/Class`, `Second Division`, `GPA (out of 5)`, `CGPA (out of 4)`)
  - Quotas (`Non-Quota`, `Freedom Fighter`, `Child/Grandchild of Freedom Fighter`, `Physically Handicapped`, `Orphan`, `Ethnic Minority`, `Ansar/VDP`). — **Reversibility:** costly — core dictionary data powering match accuracy.
- **D-02:** **Bangla Unicode Enforcement:** Normalize all Bengali strings to standard Unicode NFC and strip legacy encoding / zero-width artifacts so that fields requiring `"Only Bangla Unicode is accepted!"` do not trigger form validation errors.

### 2. Dependent Select Handling & Asynchronous Loading
- **D-03:** **MutationObserver with Fallback Timeout for Dependent Selects:**
  - After setting a parent dropdown (e.g. District), dispatch bubbling `change` and `input` events to trigger the page's Ajax/client-side script.
  - For dependent child fields (e.g. Upazila/Thana), observe child `<select>` for option mutations with a safety timeout (maximum 1000ms).
  - Once options populate (or timeout expires), execute matching and selection on the child dropdown. — **Reversibility:** costly — dictates async fill execution flow.

### 3. Match Confidence & Safety Policy
- **D-04:** **Strict Match Confidence Threshold:** Donna will only select an option if confidence $\ge 0.75$ or an exact normalized/dictionary match is found. If no confident match is found, Donna leaves the dropdown untouched and records it as unmatched/skipped.
- **D-05:** **Placeholder Option Detection:** Options with empty value, `0`, `-- Select --`, `Select One`, `নির্বাচন করুন`, etc., are treated as empty prompts eligible for filling. If a select has a meaningful non-placeholder option selected prior to autofill, Donna adheres to non-overwrite rule (R5) and skips it.

### 4. Selection Execution & Framework Triggers
- **D-06:** **Native Select Prototype Setter:** Use `HTMLSelectElement.prototype` descriptor or `.selectedIndex` / `.value` setter combined with `dispatchEvent(new Event('change', { bubbles: true }))` to ensure compatibility with vanilla JS, jQuery, and reactive frontend frameworks.

### the agent's Discretion
- Exact dictionary data structures and lookup performance indexing.
- Internal timeout constants (e.g. 50ms polling tick, 1000ms max observer timeout).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `.planning/PROJECT.md` — Project constraints, never-do rules (R1–R6), and local execution model.
- `.planning/REQUIREMENTS.md` — Requirements `DROP-01`, `DROP-02`, `DROP-03`, `DROP-04`.
- `.planning/ROADMAP.md` § Phase 3 — Phase 3 scope and success criteria.

### Prior Phase Context & Codebase
- `.planning/phases/02-form-field-detection-engine/02-CONTEXT.md` — Section scoping, event dispatch, and normalizer decisions.
- `src/engine/matcher.ts` — Existing field matching heuristics and confidence scoring.
- `src/engine/normalizer.ts` — Unicode NFC normalization and Bengali numeral conversion.
- `src/engine/fieldSetter.ts` — Framework-compatible DOM value setting and event dispatching.
- `src/engine/fillEngine.ts` — Content script orchestrator for discovering and filling form fields.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/engine/normalizer.ts`: `normalizeText`, `toAsciiDigits`, `normalizeDate` — expand to support dropdown token comparison and Bengali Unicode normalization.
- `src/engine/fieldSetter.ts`: `setFieldValue`, `dispatchFormEvents` — expand to support `setSelectValue` using native `HTMLSelectElement` property setters.
- `src/engine/sectionScoper.ts`: `getSectionForField` — reusable to scope repeated dropdowns across education levels (SSC Board vs HSC Board).

### Established Patterns
- Content script message handler returns structured fill summary `{ filledCount, skippedCount, unmatchedCount, details: [...] }`.
- Pure unit-testable modules in `src/engine/` tested via Vitest with JSDOM fixtures.

### Integration Points
- `src/engine/dropdownMatcher.ts` (new): Option normalization, bilingual dictionary lookup, and confidence scoring for `<select>` elements.
- `src/engine/fillEngine.ts`: Incorporate dropdown matching and dependent select sequencing into `fillForm`.

</code_context>

<specifics>
## Specific Ideas

- "Only Bangla Unicode is accepted!" portal validation must be strictly honored: Bengali text strings must be well-formed NFC Unicode without invalid ASCII mixes or legacy character codes.

</specifics>

<deferred>
## Deferred Ideas

- Custom non-native ARIA combobox dropdowns (e.g. `div[role="listbox"]` / Select2 / React-Select) — deferred to v2.

</deferred>

---

*Phase: 03-dropdown-matching-dependent-selects*
*Context gathered: 2026-10-02*
