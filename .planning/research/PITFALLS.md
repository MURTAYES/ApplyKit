# Domain Pitfalls: Donna Browser Extension

**Domain:** Chrome MV3 form-filling extension
**Researched:** 2026-10-02

## Critical Pitfalls

### Pitfall 1: React / Angular / Vue Synthetic Event & Property Descriptor Bypass Failure
**What goes wrong:** Programmatically filling `<input>`, `<textarea>`, or `<select>` elements by setting `input.value = "John"` causes the text to visually appear in the field, but when the user submits or clicks next, the form acts as if the field is empty or reverts to its previous value.
**Why it happens:** Modern frontend frameworks (React, Angular, Vue, Svelte) override native HTML input property descriptors. React attaches a hidden `_valueTracker` to track DOM value changes against virtual DOM state. Direct property assignment bypasses React's setter, so React's internal state remains unchanged. When synthetic events aren't fired properly, Angular's `NgControl` and Vue's reactivity system fail to detect changes.
**Consequences:** Forms appear completely filled to the user, but backend validation fails upon submission or submission sends blank/stale profile data.
**Prevention:**
1. Retrieve the native property descriptor setter:
   ```javascript
   const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
     window.HTMLInputElement.prototype, 'value').set;
   nativeInputValueSetter.call(inputElement, targetValue);
   ```
2. Dispatch a sequence of bubbling events immediately after updating value:
   ```javascript
   inputElement.dispatchEvent(new Event('input', { bubbles: true }));
   inputElement.dispatchEvent(new Event('change', { bubbles: true }));
   inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
   ```
**Detection:** Field contains visual text, but framework form submit button remains disabled, or form state inspection reveals `value: ""`.

---

### Pitfall 2: Service Worker Ephemeral Lifecycle & State Loss (MV3 Architecture)
**What goes wrong:** Long form filling sessions lose state, active field mappings, or user profile cache mid-fill. Event listeners fail to respond or throw "Extension context invalidated" errors.
**Why it happens:** Chrome MV3 replaces persistent background pages with ephemeral Service Workers. Chrome automatically terminates service workers after 30 seconds of inactivity. In-memory global variables are completely wiped when the SW goes idle.
**Consequences:** Multi-step job portal form filling fails halfway through.
**Prevention:**
1. Never rely on in-memory global state in the service worker.
2. Store all session state, profile data, and fill progress in `chrome.storage.local` or `chrome.storage.session`.
3. Keep message passing stateless and self-contained.
**Detection:** Unreproducible bugs where extension works when DevTools is open (which keeps SW alive) but fails silently in production.

---

### Pitfall 3: Dependent Dropdown Asynchronous Loading & Race Conditions
**What goes wrong:** Cascading/dependent dropdowns (Division -> District -> Upazila) fail to select child options, leaving child dropdowns empty or setting invalid selections.
**Why it happens:** Selecting a parent dropdown triggers an async network request to populate child `<option>` tags. If the fill engine attempts to select child options immediately, the target option does not exist yet.
**Consequences:** Geographic dependent fields in government forms (Teletalk, BPSC) are missed or filled with invalid values, failing validation.
**Prevention:**
1. After firing change event on parent, implement polling (every 100ms up to 5000ms) or MutationObserver on child `<select>` to wait for new `<option>` children.
2. Establish a sequential dependency execution queue for fill execution.
**Detection:** Child dropdown remains set to "Select District" despite parent dropdown being selected.

---

### Pitfall 4: Repeated Label Scoping & Nearest-Heading Heuristic Collapse
**What goes wrong:** The fill engine inserts HSC Passing Year into Bachelor Passing Year, or Present Address into Permanent Address.
**Why it happens:** Bangladesh government forms contain identical label strings ("Name", "Passing Year", "Roll No", "GPA") across multiple sections. Naive global querySelector matches the first occurrence regardless of section context.
**Consequences:** Wrong candidate data written into wrong sections, corrupting application details without user realization.
**Prevention:**
1. Segment forms into logical sections based on `<fieldset>`, `<legend>`, `<table>` boundaries, or heading nodes.
2. Require input matching to match both (Section Context, Field Label): e.g., Context: "SSC / Equivalent" -> Label: "GPA".
**Detection:** Multi-education or multi-address forms showing duplicate values across distinct sections.

---

### Pitfall 5: Bangla Unicode Normalization, ZWJ & Encoding Mismatches
**What goes wrong:** Bangla text filled into government forms fails regex validations or displays as garbled symbols.
**Why it happens:** NFC vs NFD canonical differences, Zero-Width Joiners (U+200D), Bangla vs ASCII digit mismatches, and legacy Bijoy/SutonnMJ encoding on older government sites.
**Consequences:** Form rejection by backend servers, invalid NID/Phone/GPA validation errors.
**Prevention:**
1. Apply `str.normalize('NFC')` on all stored profile text and scanned form labels.
2. Strip ZWJ/ZWNJ characters (`/[\u200B-\u200D\uFEFF]/g`).
3. Maintain bi-directional digit converter (0-9 <-> Bengali digits) and format per input type.
**Detection:** Input field shows red validation error "Invalid character" despite text visually looking correct.

---

## Moderate Pitfalls

### Pitfall 1: Dropdown Option Text Normalization Failure
**What goes wrong:** Options fail to match (profile: "B.Sc in Computer Science", dropdown: "B.Sc. (Honours) - CSE").
**Prevention:** Normalize both strings with NFC, replace `\u00A0` with space, collapse whitespace, lowercase. Implement multi-tier: exact -> case-insensitive -> substring -> fuzzy (>0.85 Levenshtein).

### Pitfall 2: Chrome Web Store PII & Privacy Policy Rejections
**What goes wrong:** Extension rejected under "User Data & Privacy Policy" guidelines.
**Prevention:** Store all data exclusively in `chrome.storage.local`. Limit permissions to `storage`, `activeTab`, `scripting`. Include clear privacy disclosure. Provide Privacy Policy URL in CWS dashboard.

### Pitfall 3: Cross-Origin Iframe & Shadow DOM Element Concealment
**What goes wrong:** Form fields inside iframes or shadow DOM are completely ignored by the fill engine.
**Prevention:** Use `"all_frames": true` in content_scripts for iframe support. Build recursive DOM walker for open Shadow DOM (`element.shadowRoot`).

### Pitfall 4: MutationObserver Loops & UI Performance Thrashing
**What goes wrong:** Content script causes CPU spikes and page freezing when filling large forms.
**Why it happens:** Setting values and dispatching events triggers framework re-renders, which fires the MutationObserver again in a loop.
**Prevention:** Tag modified elements with `data-donna-filled`. Debounce rescans with 200ms throttle. Ignore mutations from Donna's own writes.

## Minor Pitfalls

### Pitfall 1: Permissions Creep vs Auto-Detection Trade-off
Design Donna around `activeTab`. Use clear UI CTA or keyboard shortcut for trust and CWS compliance.

### Pitfall 2: Date Format Mismatches in Datepickers
Deconstruct dates into day/month/year components. Detect date picker format via placeholder or pattern attribute.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Fill Engine | React/Angular synthetic event bypass | Use `HTMLInputElement.prototype` setter + dispatch `input`, `change`, `blur` with `bubbles: true` |
| Dropdowns | Dependent dropdown AJAX race condition | Sequential fill queue with MutationObserver/polling wait for child option load |
| Section Scoping | Repeated labels across education/address sections | Parse DOM into sections; require (Section, Label) match |
| Bangla Text | NFC mismatch, ZWJ characters, Bengali numerals | Normalize NFC, strip ZWJ/ZWNJ, auto-convert digits |
| Architecture | Service worker termination losing session state | Store all state in chrome.storage.local; keep SW stateless |
| Security | Extension rejection due to permissions or PII | activeTab only, data 100% local, transparent privacy policy |

## Sources

- Chrome Developer Documentation: Migrate to Manifest V3 (https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers)
- Chrome Web Store Developer Policies: User Data & Privacy Guidelines (https://developer.chrome.com/docs/webstore/program-policies/user-data)
- React GitHub Issues: Value tracker and native input event dispatching (https://github.com/facebook/react/issues/11488)
- Unicode Consortium: Bengali Script Unicode Standard Specification (https://www.unicode.org/charts/PDF/U0980.pdf)
