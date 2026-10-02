# Phase 05: Fill Report + Live Portal Hardening - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Delivers a transparent fill telemetry report in the popup (counts of filled, skipped, and unmatched fields with an expandable unmatched details list), robust error handling for restricted or formless pages, and strict privacy/security verification (zero console logging of PII, content script context isolation, and Chrome Web Store privacy policy documentation).

In scope:
- Fill Report UI in Popup (`REPT-01`, `REPT-02`): 3-metric summary cards (Filled in emerald green, Skipped in muted gray, Unmatched in warning amber) plus an expandable accordion of unmatched fields.
- Edge-Case & Error UX: Inline warning banners when triggered on restricted pages (`chrome://`, `edge://`, `file://`), extension gallery, or pages with no fillable form elements.
- Privacy Hardening (`PRIV-01`, `PRIV-02`, `PRIV-03`): Strict code audit ensuring no profile values are logged to console or exposed to page window context.
- Privacy Documentation (`PRIV-04`): Formal `PRIVACY.md` defining local-only storage, zero network transmission, and data deletion rights.

Out of scope:
- Per-site JSON mappings & automated fixture tests (Phase 6)
- Form submission, file uploads, CAPTCHAs, declaration checkboxes (Hard constraints R1–R4)

</domain>

<decisions>
## Implementation Decisions

### 1. Fill Report UI in Popup (`REPT-01`, `REPT-02`)
- **D-01:** **3-Metric Summary Layout:**
  - Render a post-fill telemetry card in the popup:
    - **Filled** (Emerald Green badge/number): Count of fields successfully set.
    - **Skipped** (Muted Gray): Count of fields with no profile data or preserved user-typed values.
    - **Unmatched** (Amber/Orange badge/number): Count of fields where profile had data but no confident form match was found.
  - If `unmatchedCount > 0`, provide an expandable `<details>` section listing the specific field names and sections so the user knows what to inspect manually before submitting.
  - Include a "Done" / "Fill Again" button to reset the report view. — **Reversibility:** reversible.

### 2. Tab & Page Error Handling
- **D-02:** **Graceful Error Banners:**
  - Catch activeTab injection errors (e.g. `chrome://` URLs, web store) and display an inline banner: *"Donna cannot autofill browser internal or restricted pages. Please navigate to a job application form."*
  - If injection succeeds but 0 fillable fields exist, report: *"No fillable form fields detected on this page."* with 0 counts. — **Reversibility:** reversible.

### 3. Privacy & Safety Hardening (`PRIV-01`–`PRIV-04`)
- **D-03:** **Zero Console PII:** Ensure all `console.log` statements in content script, background, and popup contain only structural telemetry (e.g. `[Donna] 18 fields filled`), NEVER field values, names, or NIDs.
- **D-04:** **Content Script Isolation:** Keep profile data inside private closures during fill execution. Never attach profile objects to `window` or DOM datasets.
- **D-05:** **Privacy Policy Document (`PRIV-04`):** Provide `PRIVACY.md` specifying compliance with Chrome Web Store User Data Policy (100% on-device `chrome.storage.local`, no tracking, no external network requests).

### the agent's Discretion
- Styling of the metric cards and micro-animations in the popup to align with Swiss Stark Minimal aesthetic.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `.planning/PROJECT.md` — Project constraints, R1–R6 never-do rules, privacy guarantees.
- `.planning/REQUIREMENTS.md` — Requirements `REPT-01`, `REPT-02`, `PRIV-01`, `PRIV-02`, `PRIV-03`, `PRIV-04`.
- `.planning/ROADMAP.md` § Phase 5 — Phase 5 scope and success criteria.

### Prior Phase Context & Codebase
- `entrypoints/popup/App.tsx` — Popup component containing the Fill CTA and state handling.
- `entrypoints/popup/style.css` — Popup styles.
- `src/engine/fillEngine.ts` — Generates `FillReport` containing `{ filledCount, skippedCount, unmatchedCount, details }`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/engine/fillEngine.ts`: Already returns `FillReport` with `filledCount`, `skippedCount`, `unmatchedCount`, and structured `details: FillDetail[]`.
- `entrypoints/popup/App.tsx`: Currently receives `FillReport` from content script via `chrome.tabs.sendMessage` — expand state to display rich report UI.

### Established Patterns
- Swiss Stark Minimal typography (Space Grotesk + JetBrains Mono) with crimson / emerald accents.

</code_context>

<specifics>
## Specific Ideas

- Unmatched fields breakdown should show the field label and section so applicants can quickly glance at what's missing.

</specifics>

<deferred>
## Deferred Ideas

- In-page floating highlight overlay (green highlight on filled elements, amber on unmatched) — deferred to v2 (`UX-01`).

</deferred>

---

*Phase: 05-fill-report-live-portal-hardening*
*Context gathered: 2026-10-02*
