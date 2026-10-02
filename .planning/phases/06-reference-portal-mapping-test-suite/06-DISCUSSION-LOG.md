# Phase 06: Reference Portal Mapping + Test Suite - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 06-reference-portal-mapping-test-suite
**Areas discussed:** Per-Site JSON Mapping Architecture, Standalone HTML Reference Form Fixture, End-to-End Regression Test Suite

---

## Per-Site JSON Mapping Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Include built-in mappings in `src/mappings/teletalk.json` that automatically activate when active tab URL matches `*.teletalk.com.bd`. | Built-in site mapping bundle with auto-resolver | ✓ |
| Keep mappings in external JSON files loaded on demand. | External files | |

**User's choice:** Include built-in mappings in `src/mappings/teletalk.json` that automatically activate when the active tab URL matches `*.teletalk.com.bd`.

---

## HTML Reference Form Fixture

| Option | Description | Selected |
|--------|-------------|----------|
| Standalone full-scale HTML fixture in `tests/fixtures/teletalk_application_form.html` with real DOM event scripts for dependent selects and dynamic rows. | Comprehensive full-page portal fixture | ✓ |
| Minimalist HTML snippet tests only. | Fragment tests | |

**User's choice:** Standalone full-scale HTML fixture in `tests/fixtures/teletalk_application_form.html`.

---

## End-to-End Regression Test Suite

- Automated regression tests asserting $\ge 95\%$ fill accuracy.
- Complete verification of zero wrong-field fills, zero declaration touches, and zero CAPTCHA touches.

---

## Deferred Ideas

- None — discussion stayed within Phase 6 scope.
