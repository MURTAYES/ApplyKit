# Phase 04: Address Logic + Repeatable Job Experiences - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 04-address-logic-repeatable-job-experiences
**Areas discussed:** Repeatable Job Experiences (+ ADD MORE), Mirror / Confirmation fields, Other Qualifications & Boolean Checkboxes/Radios

---

## Repeatable Job Experiences (+ ADD MORE)

| Option | Description | Selected |
|--------|-------------|----------|
| Detect existing rows count M in DOM, click "+ Add More" (N - M) times with a MutationObserver / 150ms delay between clicks, then index and fill all rows in profile order. | Batch DOM row expansion followed by sequential row filling | ✓ |
| Click "Add More" once after filling each row until all profile experiences are filled. | Interleaved fill-and-click loop | |

**User's choice:** Detect existing rows count M in DOM, click "+ Add More" (N - M) times with MutationObserver / 150ms delay between clicks, then index and fill all rows in profile order.
**Add Button Detection:** Look inside/adjacent to the Job Experience section table/container for buttons/links with text like "Add More", "+ Add", "Add Row", "Add Experience", "যোগ করুন".

---

## Mirror / Confirmation Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Pattern match labels/names containing "confirm", "re-enter", "re-type", "পুনরায়", "নিশ্চিত" and map them to their primary profile counterpart (e.g. mobileNumber -> phone, email -> email). | Flexible regex pattern matching mapping to primary profile value | ✓ |
| Treat mirror fields as regular fields with explicit aliases in normalizer. | Static alias list | |

**User's choice:** Pattern match labels/names containing "confirm", "re-enter", "re-type", "পুনরায়", "নিশ্চিত" and map them to their primary profile counterpart.
**Fill Order:** Fill mirror fields with the exact primary profile value during the scan.

---

## Other Qualifications & Boolean Checkboxes/Radios

| Option | Description | Selected |
|--------|-------------|----------|
| Explicit 3-state logic: `true` -> tick checkbox / click 'Yes' radio; `false` -> untick / click 'No' radio; `undefined`/unset -> leave untouched (no interaction). | 3-state handling | ✓ |
| Only check `true` values; ignore `false` and `unset` completely. | 2-state active only | |

**Declaration Blacklist:** Strictly blacklist declaration terms ("declare", "certify", "terms", "condition", "শর্ত", "ঘোষণা", "agree", "captcha") and skip any checkbox matching them.

---

## the agent's Discretion

- Internal timeout parameters for DOM mutation waits (100–300ms window).
- CSS container grouping selectors for row-scoped field resolution in tables.

## Deferred Ideas

- None — discussion stayed within phase scope.
