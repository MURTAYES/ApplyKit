# Phase 03: Dropdown Matching + Dependent Selects - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 03-dropdown-matching-dependent-selects
**Areas discussed:** Bilingual dictionary scope, Dependent selects dynamic loading delay, Ambiguity policy & match confidence

---

## Bilingual Dictionary Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Comprehensive dictionary | Comprehensive dictionary covering all BD portal dropdowns: 64 Districts, Education Boards, Religions, Genders, Result types (CGPA/Division), and Quota types | ✓ |
| Essential dictionary only | Essential dictionary only (Districts, Boards, Gender, Religion) and generic normalization for others | |

**User's choice:** Comprehensive dictionary covering BD recruitment portals; keep in mind portal requirement "Only Bangla Unicode is accepted!"
**Notes:** Bengali strings must be normalized to standard NFC Unicode and strictly validated.

---

## Dependent Selects Dynamic Loading

| Option | Description | Selected |
|--------|-------------|----------|
| MutationObserver with safety timeout | Event dispatch + MutationObserver with a configurable safety timeout (e.g. 1000ms max) to wait for child dropdown options to populate | ✓ |
| Fixed polling delay | Fixed polling delay (e.g. 400ms) after triggering change event on parent dropdown | |

**User's choice:** Event dispatch + MutationObserver with safety timeout (up to 1000ms max).
**Notes:** Guarantees responsiveness while reliably waiting for Ajax / script population on child `<select>` (e.g. District $\rightarrow$ Upazila).

---

## Ambiguity Policy & Match Confidence

| Option | Description | Selected |
|--------|-------------|----------|
| Strict safety | Strict safety: Only select when confident match (>0.75 or exact dictionary alias); leave untouched otherwise | ✓ |
| Best-effort | Attempt partial substring matches with lower confidence threshold | |

**User's choice:** Strict safety.
**Notes:** Dropdown remains untouched when confidence is below threshold to avoid incorrect data selection.

---

## the agent's Discretion

- Internal data structures for fast bilingual lookup dictionary.
- Timeout granularity for MutationObserver fallback polling.

## Deferred Ideas

- Non-native ARIA comboboxes and custom div dropdowns (v2).
