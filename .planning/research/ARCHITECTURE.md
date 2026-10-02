# Architecture Research: Donna Browser Extension

**Domain:** Chrome MV3 form-filling extension
**Researched:** 2026-10-02
**Confidence:** HIGH

## Recommended Architecture

```
┌──────────────────────────────────────────┐
│           Popup / Options UI             │  React, chrome.storage.local
│  Profile Editor | Fill Button | Report   │
└────────────────────┬─────────────────────┘
                     │ chrome.runtime.sendMessage
                     ▼
┌──────────────────────────────────────────┐
│           Service Worker (BG)            │  MV3 ephemeral SW
│  Message router | Storage access         │
└────────────────────┬─────────────────────┘
                     │ chrome.tabs.sendMessage
                     ▼
┌──────────────────────────────────────────┐
│           Content Script                 │  Injected via scripting API (activeTab)
│  DOM Scanner | Section Scoper            │
│  Field Matcher | Fill Engine             │
│  Event Dispatcher | Report Builder       │
└──────────────────────────────────────────┘
```

## Content Script ↔ Service Worker Communication

**Pattern: One-shot request/response messages (no long-lived ports for v1)**

```typescript
// types/messages.ts
type FillRequest = { type: 'FILL'; profile: Profile };
type FillResponse = { type: 'FILL_RESULT'; report: FillReport };
type UndoRequest = { type: 'UNDO' };

// popup → background
chrome.runtime.sendMessage<FillRequest>({ type: 'FILL', profile });

// background → content script (active tab)
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const response = await chrome.tabs.sendMessage<FillRequest, FillResponse>(
  tab.id!, { type: 'FILL', profile }
);
```

**Key MV3 rule**: Service worker is ephemeral (killed after 30s idle). All state must live in `chrome.storage.local` or `chrome.storage.session`. Never store fill state in SW globals.

## DOM Field Matching Strategy

### Step 1: Segment form into sections

Traverse the DOM and identify section boundaries by looking for, in priority order:
1. `<fieldset>` + `<legend>` — canonical HTML sections
2. `<div>` or `<section>` with heading child (`<h2>`, `<h3>`, `<h4>`)
3. Table rows with colspan header cells
4. Divs with class names containing "section", "panel", "group", "block"

Each section gets a label: normalize its heading text → "SSC / Equivalent", "Present Address", etc.

### Step 2: Match fields within their section

For each `<input>`, `<select>`, `<textarea>` in a section:
1. Find associated `<label>` via `for` attribute → `id` linkage
2. If no `for` label: look for preceding sibling text node or parent `<label>`
3. Fallback: `name`, `id`, `placeholder`, `aria-label` attributes
4. Normalize found label text: lowercase, NFC, strip punctuation, collapse whitespace

Match label against profile field map:
```typescript
type FieldKey = 'name_en' | 'name_bn' | 'dob' | 'district_present' | 'district_permanent' | ...;
type SectionKey = 'basic' | 'address_present' | 'address_permanent' | 'ssc' | 'hsc' | ...;
type Match = { section: SectionKey; field: FieldKey; confidence: number };
```

Only fill above confidence threshold (default: 0.8).

### Step 3: Per-site mapping override

If a mapping file exists for the current hostname:
```json
{
  "hostname": "bpsc.teletalk.com.bd",
  "fields": [
    { "selector": "#ssc_roll", "key": "ssc.roll_no" },
    { "selector": "select[name='presentDistrict']", "key": "address_present.district" }
  ]
}
```
Per-site mappings bypass heuristic matching entirely for known fields.

## Section Scoping Algorithm

```typescript
function getNearestSectionLabel(element: Element): string {
  let node: Element | null = element;
  while (node && node !== document.body) {
    // Check for fieldset legend
    if (node.tagName === 'FIELDSET') {
      const legend = node.querySelector('legend');
      if (legend) return normalize(legend.textContent ?? '');
    }
    // Check for preceding heading sibling or parent heading
    const heading = findPrecedingHeading(node);
    if (heading) return normalize(heading.textContent ?? '');
    node = node.parentElement;
  }
  return 'global'; // ungrouped field
}
```

## Framework-Controlled Inputs (React / Angular / Vue)

**The native setter technique — required for all fill operations:**

```typescript
function fillInput(element: HTMLInputElement, value: string): void {
  // Use native prototype setter to bypass React's value tracker
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype, 'value'
  )?.set;
  nativeSetter?.call(element, value);
  
  // Dispatch events React/Angular/Vue listen to
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

function fillSelect(element: HTMLSelectElement, value: string): void {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype, 'value'
  )?.set;
  nativeSetter?.call(element, value);
  element.dispatchEvent(new Event('change', { bubbles: true }));
}
```

For `<textarea>`:
```typescript
const textareaSetter = Object.getOwnPropertyDescriptor(
  HTMLTextAreaElement.prototype, 'value'
)?.set;
```

## Dependent Dropdown Handling

**Pattern: Sequential queue with MutationObserver wait**

```typescript
async function fillDependentSelect(
  parent: HTMLSelectElement,
  child: HTMLSelectElement,
  parentValue: string,
  childValue: string,
  timeout = 5000
): Promise<boolean> {
  // 1. Fill parent
  fillSelect(parent, parentValue);
  
  // 2. Wait for child options to change via MutationObserver
  const changed = await waitForOptions(child, timeout);
  if (!changed) return false; // timeout → report as unmatched
  
  // 3. Fill child
  fillSelect(child, childValue);
  return true;
}

function waitForOptions(select: HTMLSelectElement, timeout: number): Promise<boolean> {
  return new Promise(resolve => {
    const initial = select.options.length;
    const observer = new MutationObserver(() => {
      if (select.options.length !== initial) {
        observer.disconnect();
        resolve(true);
      }
    });
    observer.observe(select, { childList: true });
    setTimeout(() => { observer.disconnect(); resolve(false); }, timeout);
  });
}
```

## Fill State & Undo

```typescript
type PreFillSnapshot = Map<string, string>; // selector → original value

function captureSnapshot(fields: FieldMatch[]): PreFillSnapshot {
  const snapshot = new Map<string, string>();
  for (const match of fields) {
    const el = document.querySelector(match.selector) as HTMLInputElement;
    if (el) snapshot.set(match.selector, el.value);
  }
  return snapshot;
}

async function restoreSnapshot(snapshot: PreFillSnapshot): Promise<void> {
  for (const [selector, value] of snapshot) {
    const el = document.querySelector(selector) as HTMLInputElement;
    if (el) fillInput(el, value);
  }
}
```

Store snapshot in `chrome.storage.session` (auto-cleared on browser close).

## Per-Site Mapping Structure

```typescript
interface SiteMapping {
  hostname: string;
  version: number;
  description: string;
  fields: FieldMapping[];
}

interface FieldMapping {
  selector: string;          // CSS selector
  key: string;               // profile key path (dot notation)
  section?: string;          // optional section label for disambiguation
  transform?: string;        // optional: 'date_ymd', 'digits_only', etc.
}
```

Bundle mapping files in `mappings/` directory in the extension package. Load at runtime:
```typescript
const mapping = await fetch(chrome.runtime.getURL(`mappings/${hostname}.json`))
  .then(r => r.json());
```

## Shadow DOM & Iframes

For v1: report as unmatched (don't attempt to fill).
- Shadow DOM: check `element.shadowRoot` during scan; skip and report
- Iframes: scan only the main frame; cross-origin iframes cannot be accessed without `all_frames` permission
- Document this clearly in the fill report: "Some fields may be in iframes or shadow DOM"

For v2: add `"all_frames": true` to content script manifest entry.

## Sources

- https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
- https://developer.chrome.com/docs/extensions/reference/api/scripting
- React GitHub: https://github.com/facebook/react/issues/11488 (native setter technique)
- https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
- WXT messaging docs: https://wxt.dev/guide/messaging
