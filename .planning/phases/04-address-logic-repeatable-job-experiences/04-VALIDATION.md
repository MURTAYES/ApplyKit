# Phase 04: Address Logic + Repeatable Job Experiences - Validation Strategy

**Date:** 2026-10-02
**Status:** Completed

## Validation Dimensions

| Dimension | Target | Verification Method |
|---|---|---|
| **1. Multi-row Experiences (`SPEC-01`)** | Dynamically click "+ Add More" $(N - M)$ times and fill each row from `jobExperiences[i]` | Automated integration test with dynamic table DOM simulating JS row insertion |
| **2. Direct Permanent Address Fill (`SPEC-02`)** | Fill permanent address directly from profile or present address without clicking "Same as Present" checkbox | Automated test verifying both present and permanent address fields populated independently |
| **3. Confirmation Fields (`SPEC-03`)** | Auto-populate "Confirm Mobile Number" / "Re-type Email" from primary profile values | Unit & integration tests asserting mirror fields receive identical sanitized values |
| **4. Qualification Checkboxes/Radios (`SPEC-04`)** | 3-state boolean handling (`true` $\rightarrow$ checked / Yes, `false` $\rightarrow$ unchecked / No, unset $\rightarrow$ untouched) | Unit tests verifying DOM state mutations and change event dispatches |
| **5. Declaration Safety (R4)** | Never check or alter declaration, terms, or CAPTCHA elements | Automated test verifying declaration checkbox remains untouched |
| **6. Non-Overwrite (FILL-05, R5)** | User-typed values in any row or field are strictly preserved | Automated test verifying pre-filled fields remain unchanged |
