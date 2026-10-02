# Phase 02: Core Fill Engine + Text/Date/Number Fields - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 02-core-fill-engine-text-date-number-fields
**Areas discussed:** Matching heuristics & section scoping, Pre-filled values & overwrite behavior, Date & number formatting, Fill execution & messaging architecture

---

## 1. Matching Heuristics & Section Scoping

| Option | Description | Selected |
|--------|-------------|:--------:|
| Recommended Architecture | Exact CSS selectors > Section-scoped heuristics (fieldset/heading context) > Weighted attributes (threshold 0.65) | ✓ |
| Custom rules | User-defined heuristic scoring | |

**User's choice:** Approved recommended architecture.
**Notes:** Traverses parent DOM for `<fieldset>` legend, table headers, or headings to accurately map repeated fields (e.g. SSC vs HSC passing year).

---

## 2. Pre-filled Values & Overwrite Policy

| Option | Description | Selected |
|--------|-------------|:--------:|
| Strict Non-Overwrite | Never overwrite any non-empty user-entered text (`value.trim() !== ''`) | ✓ |
| Overwrite All | Always replace with profile data | |

**User's choice:** Approved strict non-overwrite.
**Notes:** Adheres strictly to Hard Constraint R5. Placeholder text (e.g. `-- Select --`) is detected and allowed to fill.

---

## 3. Date & Number Formatting

| Option | Description | Selected |
|--------|-------------|:--------:|
| Automatic Conversion | Transliterate Bengali numerals (০-৯) to ASCII (0-9); format ISO / DD-MM-YYYY dates; strip ZWJ/ZWNJ | ✓ |
| Strict Raw String | Fill stored raw string without transformations | |

**User's choice:** Approved automatic conversion.
**Notes:** Prevents form submission errors on portal inputs requiring ASCII numbers and standard date formats.

---

## 4. Fill Execution & Messaging

| Option | Description | Selected |
|--------|-------------|:--------:|
| Native Setter & Events | Native prototype property setter + `focus`, `input`, `change`, `blur` dispatch; return telemetry to popup | ✓ |
| Simple `.value = ` assignment | Simple assignment (fails with React/Vue controlled inputs) | |

**User's choice:** Approved native prototype setter & event dispatch.
**Notes:** Ensures full compatibility with reactive web frameworks used across modern job portals.

---

## the agent's Discretion

- Regex pattern tuning for field label aliases.
- Content script message action schemas.

## Deferred Ideas

- None.
