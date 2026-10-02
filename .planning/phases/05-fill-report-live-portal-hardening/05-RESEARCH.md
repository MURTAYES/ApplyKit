# Phase 05: Fill Report + Live Portal Hardening - Research

**Date:** 2026-10-02
**Status:** Completed

## 1. Domain & Architecture Analysis

### Popup Fill Telemetry UI (`REPT-01`, `REPT-02`)
The user triggers form filling from the extension popup. Upon completion, the content script sends back a `FillReport`:
```typescript
interface FillReport {
  filledCount: number;
  skippedCount: number;
  unmatchedCount: number;
  details: FillDetail[];
}
```
- **UI Architecture:**
  - Standard state: Large "Fill Application Form" CTA + link to Open Profile options.
  - Active fill state: Loading spinner / pulse animation.
  - Completed state:
    - 3 Metric stat boxes: Filled (emerald `#10b981`), Skipped (muted gray `#6b7280`), Unmatched (amber `#f59e0b`).
    - Expandable `<details>` element showing all `unmatched` items (Field Name + Section).
    - "Done" / "Fill Again" button to return to initial state.

### Tab Error Handling & Edge Cases
When `activeTab` cannot be scripted (e.g. `chrome://`, `chrome-extension://`, Edge settings, Chrome Web Store, or empty `about:blank`):
- `chrome.scripting.executeScript` throws an error (`Cannot access contents of url`).
- Catch this error in `entrypoints/popup/App.tsx` and render an alert banner with a user-friendly explanation rather than failing silently.
- If a page has 0 forms or fillable elements, display "No application form detected on this page".

### Privacy & Security Guarantees (`PRIV-01` to `PRIV-04`)
- **`PRIV-01`**: Verify all storage operations only use `chrome.storage.local`.
- **`PRIV-02`**: Audit all source files to guarantee NO `console.log` logs applicant PII (names, NIDs, phone, emails, dates of birth).
- **`PRIV-03`**: Ensure content script isolates applicant data in memory closures, preventing page JavaScript from accessing profile objects via `window` or DOM element properties.
- **`PRIV-04`**: Author a comprehensive `PRIVACY.md` document for Chrome Web Store submission that specifies:
  - Local-first architecture (0 remote servers, 0 third-party trackers).
  - Data retention and one-click data deletion.
  - User permissions rationale (`storage`, `activeTab`, `scripting`).

## 2. Validation Architecture
- Unit and UI tests for `entrypoints/popup/App.tsx` verifying:
  - Rendering 3 metric boxes when fill report arrives.
  - Displaying unmatched details list when `unmatchedCount > 0`.
  - Error banner on restricted URLs or script failure.
- Privacy audit tests verifying:
  - No PII in console calls.
  - `PRIVACY.md` exists and contains required sections.
