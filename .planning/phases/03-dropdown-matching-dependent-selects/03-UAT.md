# Phase 03 UAT: Dropdown Matching + Dependent Selects

**Phase:** 03-dropdown-matching-dependent-selects
**Status:** Verification Ready

## Acceptance Test Scenarios

### 1. Bilingual Dropdown Selection (`DROP-01`, `DROP-02`)
- **Action:** Form has native `<select>` dropdowns for Gender (`পুরুষ`/`মহিলা`), Religion (`ইসলাম`/`হিন্দু`/`খ্রিস্টান`), Board (`ঢাকা`/`চট্টগ্রাম`/`কুমিল্লা`), and Quota (`Non-Quota`/`Freedom Fighter`).
- **Expected:** Donna matches stored profile values to the appropriate `<option>` regardless of language direction and dispatches `change`/`input` events.

### 2. Dependent Select Cascading (`DROP-03`)
- **Action:** Form has cascading District $\rightarrow$ Upazila dropdowns where selecting District triggers AJAX/script population of Upazila options.
- **Expected:** Donna selects District, waits for Upazila `<option>` nodes to populate, then successfully selects Upazila.

### 3. Safe Skip for Unmatched Dropdowns (`DROP-04`)
- **Action:** Form has a dropdown with options that do not match profile values (e.g. unknown custom categories).
- **Expected:** Dropdown is left untouched (remains at default placeholder), no arbitrary option is chosen, and field is reported as unmatched/skipped in telemetry.

### 4. Non-Overwrite Protection (R5)
- **Action:** User manually selects an option in a dropdown before clicking "Fill Form".
- **Expected:** Donna respects the pre-selected option and leaves it untouched.
