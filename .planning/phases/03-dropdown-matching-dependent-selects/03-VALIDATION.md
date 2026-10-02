# Phase 03: Dropdown Matching + Dependent Selects - Validation Strategy

**Date:** 2026-10-02
**Status:** Approved

## Validation Criteria

| Req ID | Description | Automated Test Target |
|---|---|---|
| `DROP-01` | Native `<select>` dropdowns fill with matching option using normalized text | `tests/engine/dropdownMatcher.test.ts` |
| `DROP-02` | Bilingual option matching (English $\leftrightarrow$ Bangla) across standard dictionaries | `tests/engine/bilingualDictionaries.test.ts` |
| `DROP-03` | Dependent select chain fills correctly (District $\rightarrow$ Upazila dynamic wait) | `tests/engine/dependentSelects.test.ts` |
| `DROP-04` | Dropdown with no confident match is left untouched; counted as unmatched | `tests/engine/fillEngineDropdowns.test.ts` |

## Test Suite Execution
- `npm run test` executes all Vitest suites.
- Coverage threshold: 100% pass on all dropdown matching and dependent select test cases.
