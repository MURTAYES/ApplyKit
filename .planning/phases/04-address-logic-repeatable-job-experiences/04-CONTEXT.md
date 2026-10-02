# Phase 04: Address Logic + Repeatable Job Experiences - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Delivers accurate multi-row dynamic section expansion (e.g. clicking "+ ADD MORE" for $N$ Job Experiences), direct Present vs Permanent address population (including `permanent_same_as_present` handling), mirror/confirmation field filling ("Confirm Mobile Number", "Re-type Email"), and 3-state Other Qualifications checkbox/radio handling while strictly adhering to safety rules (never touching declaration/terms checkboxes or CAPTCHA).

In scope:
- Multi-row Job Experiences dynamic row handling (`SPEC-01`): Count existing DOM rows $M$, click "+ Add More" $(N - M)$ times with MutationObserver / brief delay, then sequentially index and fill row fields in profile order.
- Present and Permanent Address independent filling & `permanent_same_as_present` support (`SPEC-02`): Populate permanent address fields directly with present address values from profile without clicking page "Same as present" checkbox.
- Mirror/Confirmation fields (`SPEC-03`): Detect verification fields ("Confirm Mobile", "Re-type Email", "পুনরায় মোবাইল নম্বর") and fill them with the exact primary profile value.
- Other Qualifications & special checkboxes/radios (`SPEC-04`): Support 3-state logic (`true` $\rightarrow$ checked / "Yes", `false` $\rightarrow$ unchecked / "No", `undefined`/unset $\rightarrow$ untouched).
- Strict declaration/terms blacklist (R4 safety constraint): Skip any checkbox/radio containing terms like "declare", "certify", "terms", "condition", "agree", "শর্তাবলী", "ঘোষণা", "captcha".

Out of scope:
- Full fill report telemetry UI (Phase 5)
- Automated site mapping JSON generator & fixture test suite (Phase 6)
- Form submission, file uploads, CAPTCHAs, declaration checkboxes (Hard constraints R1–R4)

</domain>

<decisions>
## Implementation Decisions

### 1. Repeatable Job Experiences (+ ADD MORE)
- **D-01:** **Sequential DOM Expansion & Indexing:** 
  - Count existing experience rows $M$ in the DOM.
  - If profile has $N > M$ experiences, find the section's "+ Add More" button/link (matching keywords "Add More", "+ Add", "Add Row", "Add Experience", "যোগ করুন") and dispatch native click events $(N - M)$ times with MutationObserver / 150ms delay between clicks to allow DOM insertion.
  - Index and scope each row container (table `<tr>` / container `<div>`) and fill row $i$ from profile job experience entry $i$. — **Reversibility:** costly — core multi-row orchestration.

### 2. Address Logic & Permanent Address Mirroring
- **D-02:** **Direct Permanent Address Fill:**
  - Present Address and Permanent Address fields are scoped by their respective section headers/fieldsets.
  - If `permanent_same_as_present: true` in the profile (or if permanent address profile data mirrors present address), Donna writes the present address values directly into the permanent address fields and executes any necessary dependent dropdown chains (District $\rightarrow$ Upazila) directly, without checking any on-page "Same as present" checkbox. — **Reversibility:** reversible.

### 3. Mirror / Confirmation Field Detection
- **D-03:** **Pattern-Matched Primary Value Mirroring:**
  - Fields whose labels or names match confirmation patterns (e.g. `confirm`, `re-enter`, `re-type`, `verify`, `পুনরায়`, `নিশ্চিত`) are resolved to their primary counterparts (`phone` $\rightarrow$ `confirmPhone`, `email` $\rightarrow$ `confirmEmail`, `nationalId` $\rightarrow$ `confirmNid`).
  - Mirror fields are populated with the exact primary profile value during the fill scan. — **Reversibility:** reversible.

### 4. Other Qualifications & Checkbox/Radio Handling
- **D-04:** **3-State Boolean Handling:**
  - `true`: Tick checkbox (or click "Yes" / "হ্যাঁ" radio option).
  - `false`: Untick checkbox (or click "No" / "না" radio option).
  - `undefined` / unset: Leave element completely untouched (no state mutation or event dispatch).
- **D-05:** **Declaration & Safety Blacklist:**
  - Blacklist keywords: `declare`, `certify`, `terms`, `condition`, `agree`, `consent`, `statement`, `শর্ত`, `ঘোষণা`, `স্বীকার`, `captcha`.
  - Donna will strictly ignore and never alter any checkbox or element matching any declaration blacklist keyword. — **Reversibility:** one-way — core non-negotiable safety constraint (R4).

### the agent's Discretion
- Internal timeout and mutation observer parameters when waiting for dynamic row additions (100–300ms window).
- CSS container grouping selectors for row-scoped field resolution in tables.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `.planning/PROJECT.md` — Project constraints, R1–R6 never-do rules.
- `.planning/REQUIREMENTS.md` — Requirements `SPEC-01`, `SPEC-02`, `SPEC-03`, `SPEC-04`.
- `.planning/ROADMAP.md` § Phase 4 — Phase 4 scope and success criteria.

### Prior Phase Context & Codebase
- `.planning/phases/03-dropdown-matching-dependent-selects/03-CONTEXT.md` — Dropdown matching and dependent selects.
- `src/engine/fillEngine.ts` — Main form fill orchestrator.
- `src/engine/matcher.ts` — Field pattern matching and label normalization.
- `src/engine/sectionScoper.ts` — Section scoper identifying section boundaries.
- `src/engine/fieldSetter.ts` — Native setter and event dispatching.
- `src/types/profile.ts` — Applicant profile schema.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/engine/fieldSetter.ts`: `setFieldValue`, `setSelectValue`, `dispatchFormEvents` — expand to support `setCheckboxValue` / `setRadioValue`.
- `src/engine/sectionScoper.ts`: Scopes fields by nearest heading/legend. Can be extended to scope repeated row containers (e.g. `tr` or row wrappers).
- `src/engine/dropdownMatcher.ts`: Used for District $\rightarrow$ Upazila cascading in both present and permanent address blocks.

### Established Patterns
- DOM traversal for label association via `findLabelForElement`.
- Framework-compatible event dispatch (`change`, `input`, `blur`).
- Live-portal verified field exclusions (Applicant Name vs Father/Mother Name mutual exclusions).

### Integration Points
- `src/engine/fillEngine.ts`: Integrate multi-row Job Experience loop, address mirroring, confirmation field resolution, and qualification checkbox toggles.

</code_context>

<specifics>
## Specific Ideas

- Row addition for Job Experience must support forms where the initial state has 1 row by default and additional rows are dynamically added by clicking "+ Add More".
- Mirror fields ("Confirm Mobile") should be populated seamlessly alongside or immediately after primary fields.

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed strictly within Phase 4 scope.

</deferred>

---

*Phase: 04-address-logic-repeatable-job-experiences*
*Context gathered: 2026-10-02*
