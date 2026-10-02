# Phase 02: Core Fill Engine + Text/Date/Number Fields - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Delivers one-click auto-filling of text inputs, textareas, number inputs, and date inputs on target job application forms from stored profile data with section-scoped matching and bilingual label normalization.

In scope:
- Content script injection on "Fill Form" button click in popup (via `activeTab` / `scripting`)
- Exact CSS selector overrides and heuristic field detection (labels, aria-labels, placeholders, names, ids)
- Section scoping (distinguishing repeated field names across SSC, HSC, Graduation, Masters, Present Address, Permanent Address, Basic Info)
- Bilingual text & digit normalization (Unicode NFC normalization, zero-width stripping, Bengali numeral to ASCII digit conversion)
- Native prototype property setter and synthetic `input`/`change`/`blur` event dispatches for reactive UI frameworks
- Safe non-overwrite behavior: leaving existing user-typed values untouched
- Telemetry feedback returned to popup (filled count, skipped count, unmatched count)

Out of scope:
- Dropdown selection & dependent select chaining (Phase 3)
- Multi-row "ADD MORE" repeatable sections & address checkboxes (Phase 4)
- Full visual fill reporting and inline field highlights (Phase 5)
- Form submission, file uploads, CAPTCHAs, declaration checkboxes (Hard constraints R1–R4, out of scope)

</domain>

<decisions>
## Implementation Decisions

### 1. Matching Heuristics & Section Scoping
- **D-01:** **Matching Hierarchy:** Exact per-site selector match > Section-scoped heuristic match > Global heuristic match. — **Reversibility:** costly — defines core matching pipeline and contract.
- **D-02:** **Section Scoping Container Detection:** Determine section context by traversing parent DOM trees to find the nearest `<fieldset>` (legend text), `<table/tr>` header, or preceding section heading (`h1-h6`, `.section-title`, `legend`).
- **D-03:** **Confidence Scoring:** Assign weights to match sources: explicit `<label for>` (1.0) > enclosing `<label>` (0.95) > `aria-label` (0.90) > `placeholder` (0.80) > `name`/`id` regex (0.75) > adjacent cell text (0.70). Require a minimum confidence threshold of 0.65 to fill.
- **D-04:** **Bilingual Label Mapping:** Build an alias dictionary of common English and Bengali field variations (e.g. `পিতার নাম` / `Father's Name`, `রোল নম্বর` / `Roll No`, `জন্ম তারিখ` / `Date of Birth`, `জাতীয় পরিচয়পত্র` / `NID`).

### 2. Pre-filled Values & Overwrite Policy
- **D-05:** **Strict Non-Overwrite Rule:** If an input already contains user-entered text (`value.trim() !== ''`), Donna will NOT overwrite it under any circumstance (R5).
- **D-06:** **Placeholder Detection:** Default placeholder prompts (e.g., `-- Select --`, `Type here...`) are treated as empty and eligible for fill.

### 3. Date, Number, and Text Normalization
- **D-07:** **Bengali Digit Conversion:** Automatically transliterate Bengali numerals (`০-৯`) to standard ASCII digits (`0-9`) when populating numeric, phone number, and postal code fields.
- **D-08:** **Date Format Transformation:** Support standard ISO (`YYYY-MM-DD`), British/BD (`DD/MM/YYYY`), and segmented Day-Month-Year dropdown/inputs based on the target element `type="date"` or pattern attribute.
- **D-09:** **Unicode Normalization:** Always apply `.normalize('NFC')` and strip zero-width characters (`\u200C`, `\u200D`, `\uFEFF`) before filling Bengali text fields.

### 4. Fill Execution & Event Dispatch
- **D-10:** **Framework-Compatible Value Setter:** Use native prototype setter `Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, val)` (and `HTMLTextAreaElement.prototype`) to trigger React/Vue/Angular state listeners.
- **D-11:** **Event Sequence:** Dispatch bubbling synthetic events in order: `focus`, `input`, `change`, `blur`.
- **D-12:** **Telemetry Result Return:** Content script responds to the popup message with a structured fill summary `{ filledCount, skippedCount, unmatchedCount, details: [...] }`.

### the agent's Discretion
- Exact regex pattern tuning and dictionary expansion for government/job portal field keywords.
- Content script message action names (`"TRIGGER_FILL"`, `"FILL_REPORT"`).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `.planning/PROJECT.md` — Project constraints, never-do rules (R1–R6), and local storage model.
- `.planning/REQUIREMENTS.md` — Requirements FILL-01 through FILL-09, and MATCH-01 through MATCH-06.
- `.planning/ROADMAP.md` § Phase 2 — Phase 2 scope and success criteria.

### Phase 1 Output
- `src/types/profile.ts` — Profile data model and Zod schema.
- `src/storage/profileStorage.ts` — `chrome.storage.local` interface (`loadProfile`).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/profile.ts` (`Profile`, `BasicInfo`, `Address`, `EducationEntry`, `JobExperience`): Use as canonical profile data types for matching and value extraction.
- `src/storage/profileStorage.ts` (`loadProfile`): Used in content script / background worker to load current applicant profile.

### Established Patterns
- Strict MV3 permissions: Content script injected on-demand via `activeTab` / `scripting` API upon popup button trigger.
- Zero external dependencies: All heuristic matching, DOM traversal, and string normalization are self-contained.

### Integration Points
- `entrypoints/popup/App.tsx`: "⚡ Fill Form" button triggers `chrome.runtime.sendMessage` or `chrome.scripting.executeScript` to run fill engine.
- `entrypoints/content.ts` (or `src/engine/`): Content script receiving the fill command, inspecting the page DOM, and executing fills.

</code_context>

<specifics>
## Specific Ideas

- No specific non-standard requirements; align strictly with Pearson Specter Litt brutalist styling for popup status and R1–R6 safety guarantees.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within Phase 2 scope.

</deferred>

---

*Phase: 02-core-fill-engine-text-date-number-fields*
*Context gathered: 2026-10-02*
