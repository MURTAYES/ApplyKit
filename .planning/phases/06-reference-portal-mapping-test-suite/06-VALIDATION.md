# Phase 06: Reference Portal Mapping + Test Suite - Validation Strategy

**Date:** 2026-10-02
**Status:** Completed

## Validation Dimensions

| Dimension | Target | Verification Method |
|---|---|---|
| **1. Site Mapping Bundle (`MATCH-05`)** | Exact selectors mapped in `src/mappings/teletalk.json` | JSON schema validation and integration test |
| **2. Auto Site Resolver (`MATCH-06`)** | URL pattern matching injects mapping with 1.0 confidence override | Unit test with various valid/invalid URLs |
| **3. Standalone HTML Fixture** | Comprehensive full-page government portal fixture in `tests/fixtures/` | HTML parsing and fixture validation |
| **4. Master Regression Suite** | $\ge 95\%$ field accuracy across full application form | Automated end-to-end Vitest test suite |
| **5. Non-Interference Safety Guardrails (R1-R4)** | Zero submit/upload clicks, zero declaration ticks, zero CAPTCHA touches | Automated assertion on final DOM state |
