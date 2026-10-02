# Phase 1: Extension Shell + Profile Manager - Context

**Gathered:** 2026-10-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a loadable, installable Chrome extension (MV3, WXT + TypeScript + React) where the user can create, edit, and persist a complete structured applicant profile in chrome.storage.local — covering all sections of the Bangladesh government reference form. The phase ends when profile CRUD is fully working and the popup shows a functional fill button (non-functional for actual filling, which is Phase 2). No form-filling logic is in scope for this phase.

</domain>

<decisions>
## Implementation Decisions

### Popup Layout
- **D-01:** Popup contains fill button only — primary CTA always visible regardless of profile state. "Open Profile" link launches options page in a new tab. No profile status indicator, percentage, or badges in popup. Clean and minimal.
- **D-02:** Fill button is always active (not disabled when profile is empty) — it becomes functional in Phase 2; for Phase 1 it can show a toast "Fill engine coming in Phase 2" or do nothing.

### Profile Form (Options Page)
- **D-03:** Options page uses sidebar nav + scrollable sections. Left sidebar lists all 10 sections; clicking a section scrolls to it. All sections visible in one long page. — **Reversibility:** reversible
- **D-04:** Auto-save as the user types — no explicit Save button. Debounced writes to chrome.storage.local (300–500ms debounce). No save confirmation UI needed. — **Reversibility:** reversible
- **D-05:** Job Experiences section (and any other repeatable section) uses Add/Remove inline: '+' button to add a new experience row, 'x' button on each row to remove it. Start with one empty row shown by default. — **Reversibility:** reversible
- **D-06:** No profile completeness indicator anywhere — not in popup, not in options sidebar. User manages their own data awareness.

### WXT Project Setup
- **D-07:** Scaffold using `npx wxt init` with the React template. Customize entrypoints, permissions, and manifest after scaffolding. — **Reversibility:** one-way — project directory structure and manifest format are set at scaffold time; changing from WXT to another framework later would require a full rewrite.
- **D-08:** Phase 1 delivers a fully working popup + complete options page profile form (all 10 sections, all profile fields from REQUIREMENTS.md PROF-01..08). Not a stub — end of Phase 1 is a usable profile manager.
- **D-09:** Zod schema for the profile data model. Validates on auto-save; shows inline field-level errors when data is invalid. Also used to validate import JSON before writing to storage. — **Reversibility:** reversible (schema can be updated; old data migrates forward)

### Profile Data Model (all fields per REQUIREMENTS.md PROF-06)
- **D-10:** Profile covers: Basic Information, Present Address, Permanent Address, SSC, HSC, Graduation, Masters (optional section), Job Experiences (list, 0..N entries), Other Qualifications. All fields optional.
- **D-11:** English and Bangla name fields are separate fields in the schema (not a single field). Same for father's/mother's name. Field names clearly distinguished (e.g., `name_en`, `name_bn`).

### the agent's Discretion
- Specific color scheme / visual design of options page — agent chooses a clean, professional design that works in both popup and options contexts.
- Whether to use React Hook Form or a simpler controlled-component approach for the profile form — agent decides based on form complexity.
- Exact debounce timing for auto-save (300ms–500ms range).
- Whether Masters section shows/hides based on a toggle or is always visible (agent decides UX).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Definition
- `.planning/PROJECT.md` — Core value, constraints, key decisions (stack, permissions, storage)
- `.planning/REQUIREMENTS.md` — SCAF-01..04, PROF-01..08 are the v1 requirements for this phase

### Phase 1 Scope
- `.planning/ROADMAP.md` §Phase 1 — Goal, success criteria, requirement list

### Profile Data Model Reference
- User spec (Section 7.2 in original brief) — defines all profile fields; captured in REQUIREMENTS.md PROF-06. Key sections: Basic Information, Present Address, Permanent Address, Education (SSC/HSC/Graduation/Masters), Job Experiences, Other Qualifications.

No external ADRs or specs — all requirements are captured in planning artifacts above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project. WXT scaffold will generate the initial entrypoints.

### Established Patterns
- chrome.storage.local: All profile reads/writes go through chrome.storage.local only. No remote calls. Pattern: typed async helpers (`saveProfile`, `loadProfile`) wrapping `chrome.storage.local.set/get`.
- MV3 service worker: SW is ephemeral. Phase 1 storage layer must work without relying on SW globals; all state in storage.
- Permissions: Only `storage`, `activeTab`, `scripting` — confirmed at scaffold time in wxt.config.ts.

### Integration Points
- Phase 2 (fill engine) will read the profile from chrome.storage.local using the same typed helpers defined here. Schema defined in Phase 1 is the contract for all subsequent phases.
- The Zod schema exported from Phase 1 becomes the profile validation contract used by the fill engine and import/export.

</code_context>

<specifics>
## Specific Ideas

- User mentioned sharing a screenshot of the reference form for field-level context (mentioned during project init questioning). The Bangladesh government portal form structure is the ground truth for profile field definitions.
- Profile import/export: export produces a `.json` file (plain JSON, no encryption in v1). Import reads the file, validates with Zod, and writes to chrome.storage.local on success.

</specifics>

<deferred>
## Deferred Ideas

- Profile passphrase encryption (AES-GCM) — explicitly v2, was decided out of scope during project init.
- Multiple profiles — v2 candidate.
- Keyboard shortcut for the popup fill button — v2 candidate, deferred during init.
- Firefox support — later port, not v1.
- Profile % complete indicator or section completion badges — explicitly decided "No" during this discussion.

</deferred>

---

*Phase: 1-Extension Shell + Profile Manager*
*Context gathered: 2026-10-02*
