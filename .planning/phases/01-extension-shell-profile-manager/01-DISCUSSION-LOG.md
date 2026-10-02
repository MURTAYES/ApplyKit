# Phase 1: Extension Shell + Profile Manager - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 1-Extension Shell + Profile Manager
**Areas discussed:** Popup vs Options split, Profile form navigation, WXT project setup, Profile completeness signaling

---

## Popup vs Options Split

| Option | Description | Selected |
|--------|-------------|----------|
| Popup = fill button only | 'Open profile' link launches options page in a new tab | ✓ |
| Popup = inline profile mini-form | Most-used fields editable directly in popup | |
| Popup = fill button + profile summary | Shows name + completion %, links to options page | |

**User's choice:** Popup = fill button only (Recommended)
**Notes:** Fill button is always active regardless of profile state. No status indicators in popup.

---

## Fill Button Empty State

| Option | Description | Selected |
|--------|-------------|----------|
| Always visible and active | Primary CTA always visible regardless of profile state | ✓ |
| Only active when profile has data | Disabled state when profile is empty | |
| Fill button + last fill status | Shows 'Last filled: 3 fields' from previous run | |

**User's choice:** Always active fill button
**Notes:** Phase 1 scope — button becomes functional in Phase 2.

---

## Profile Form Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Sidebar nav + scrollable sections | Left sidebar shows all sections, clicking scrolls to section | ✓ |
| Vertical tabs | One section visible at a time | |
| Single long scrollable page | All sections stacked, no navigation | |
| Accordion | Sections collapse/expand | |

**User's choice:** Sidebar nav + scrollable sections (Recommended)

---

## Profile Save Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-save as user types | No explicit Save button, debounced writes | ✓ |
| Explicit Save button per section | User saves each section individually | |
| Single Save button at bottom | Saves entire profile at once | |

**User's choice:** Auto-save (Recommended)

---

## Repeatable Section UI (Job Experiences)

| Option | Description | Selected |
|--------|-------------|----------|
| Add / Remove buttons inline | '+' to add, 'x' to remove each row | ✓ |
| Fixed slots | 3 default rows | |
| Start empty | No rows until user clicks 'Add' | |

**User's choice:** Add/Remove inline (Recommended)

---

## WXT Bootstrapping

| Option | Description | Selected |
|--------|-------------|----------|
| WXT CLI scaffold | `npx wxt init` with React template | ✓ |
| Manual WXT setup | Install package and configure from scratch | |
| Existing boilerplate | chrome-extension-boilerplate-react-vite | |

**User's choice:** WXT CLI scaffold (Recommended)

---

## Phase 1 Scope Completeness

| Option | Description | Selected |
|--------|-------------|----------|
| Working popup + full options page UI | Complete profile form with all sections | ✓ |
| Extension shell + storage layer only | Options page is a stub | |
| Partial profile form | Subset of sections, expand later | |

**User's choice:** Full working profile manager at end of Phase 1 (Recommended)

---

## Profile Schema Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Zod schema | Runtime validation, inline errors, import validation | ✓ |
| TypeScript types only | No runtime validation in v1 | |
| Zod + export/import validation | Validate both on save and import | |

**User's choice:** Zod schema with inline field errors (Recommended)

---

## Profile Completeness Signaling

| Option | Description | Selected |
|--------|-------------|----------|
| No status indicator | Clean popup, fill button only | ✓ |
| Simple badge | 'Profile ready' vs 'No profile' label | |
| Section completion dots | Each section shows filled/empty indicator | |

**User's choice:** No status indicator — clean minimal popup

---

## the agent's Discretion

- Visual design / color scheme of options page
- React Hook Form vs controlled components for the profile form
- Exact debounce timing (300–500ms range)
- Whether Masters section shows/hides based on toggle or is always visible

## Deferred Ideas

- Profile passphrase encryption — v2
- Multiple profiles — v2
- Keyboard shortcut for fill — v2
- Firefox support — later port
- Profile completion percentage / section indicators — explicitly decided "No"
