# Phase 05: Fill Report + Live Portal Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-02
**Phase:** 05-fill-report-live-portal-hardening
**Areas discussed:** Popup Fill Report UI, Error handling & Tab edge-cases, Privacy & Storage safeguards

---

## Popup Fill Report UI

| Option | Description | Selected |
|--------|-------------|----------|
| 3-metric summary cards (Filled in Green, Skipped in Muted Gray, Unmatched in Amber) + expandable list of unmatched fields with field names and reasons. | Detailed telemetry dashboard directly in popup | ✓ |
| Simple one-line status badge with modal popup. | Minimal badge only | |

**User's choice:** 3-metric summary cards + expandable list of unmatched fields.

---

## Error Handling & Tab Edge-Cases

| Option | Description | Selected |
|--------|-------------|----------|
| Clear inline alert banner inside the popup describing the specific issue with a Dismiss button. | Inline contextual warning banner | ✓ |
| Disable the Fill button entirely on non-web pages with a tooltip. | Static disabled button | |

**User's choice:** Clear inline alert banner inside the popup describing the specific issue.

---

## Privacy & Storage Safeguards

- Verified 100% on-device storage in `chrome.storage.local`.
- Zero console logging of applicant PII.
- Privacy policy document `PRIVACY.md` for Chrome Web Store submission.

---

## Deferred Ideas

- None — discussion stayed within Phase 5 scope.
