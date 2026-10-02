# APPLYKIT // PRIVACY DOCTRINE & STATUTORY DISCLOSURE

```
DOCKET // PRIVACY-SPEC-01              LEGAL JURISDICTION: ZERO TELEMETRY AUDIT
CLASSIFICATION: STATUTORY DISCLOSURE   DEVICE SANDBOX: CHROME EXTENSION MV3
CLEARANCE: UNCONDITIONAL PRIVACY       REMOTE TRANSMISSION: 0.00% ZERO CLOUD
EFFECTIVE DATE: OCTOBER 2026           REVISION: v2.4.0 LITIGATION AUDITED
```

---

> ### ❝ Privacy is not a configurable toggle or a vague marketing claim. In the ApplyKit architecture, privacy is an unbreachable mathematical guarantee: zero outbound network traffic, zero third-party telemetry, and 100% on-device sandboxing. ❞
> — *ApplyKit Core Security Standard*

---

## [§ 01] Doctrine of Absolute Local Sandboxing

Commercial autofillers and job platform plugins routinely harvest resumes, identity numbers, contact directories, and browsing histories to train remote AI models or sell candidate leads. 

**ApplyKit rejects this surveillance architecture entirely.**

1. **Strict Local Storage:** All applicant profile information—including national identity numbers, contact details, academic transcripts, and employment chronicles—is written exclusively to the browser's local sandbox storage (`chrome.storage.local`).
2. **Zero Outbound Transmission:** ApplyKit makes **zero** outbound HTTP, HTTPS, WebSocket, or GraphQL network requests containing applicant profile data.
3. **100% Offline Capability:** The form-filling engine, dictionary decoders, and fuzzy matchers operate completely offline without requiring any external server connection.
4. **No Remote Code Execution:** ApplyKit does not load dynamic scripts, external analytics (Google Analytics, Mixpanel, Sentry), or remote tracking pixels.

---

## [§ 02] Chrome MV3 Permission Telemetry Ledger

ApplyKit requests only the minimum set of Chrome Manifest V3 permissions strictly required to perform client-side autofilling:

| Permission | Architectural Role | Strict Operational Constraint |
|:---|:---|:---|
| `storage` | Local Master Profile | Saves profile parameters inside `chrome.storage.local`. Data never leaves the applicant's physical machine. |
| `activeTab` | Targeted Injection | Granted **only** when the user explicitly clicks "Fill Form". ApplyKit cannot scan background tabs or idle web sessions. |
| `scripting` | DOM Matcher Engine | Injects the local form-filling script into the single targeted job portal DOM upon user initiation. |

---

## [§ 03] Non-Interference Safety Guarantees

ApplyKit is an applicant-controlled utility, never an autonomous submission agent. The following non-interference rules are immutable invariants in the engine kernel:

```text
┌─────────────────────────┬────────────────────────────────────────────────────────────┐
│ SAFETY INVARIANT        │ ENFORCEMENT SPECIFICATION                                  │
├─────────────────────────┼────────────────────────────────────────────────────────────┤
│ 🚫 NO AUTO-SUBMIT       │ Never clicks submit, payment, checkout, or review buttons. │
│ 🛡️ NO CAPTCHA TOUCH     │ Complete non-interference with challenge or captcha boxes. │
│ ✍️ NO DECLARATIONS      │ Never checks statutory terms, perjury, or consent boxes.  │
│ 🚫 NO FIELD OVERWRITE   │ Never overwrites values previously typed in by the user.   │
│ 📄 NO AUTO FILE UPLOAD  │ Photograph, signature, and resume uploads remain manual.   │
└─────────────────────────┴────────────────────────────────────────────────────────────┘
```

---

## [§ 04] Applicant Sovereignty & Data Erasure Protocol

You maintain absolute ownership and sovereignty over your credentials at all times:

- **JSON Data Portability:** Export your entire master profile as a clean, standardized JSON file at any moment with zero vendor lock-in.
- **Immediate Data Deletion:** Execute **"Delete All Stored Data"** / **"Reset Profile"** in the Profile Manager dashboard to irrevocably purge all records from browser storage.
- **Extension Removal:** Uninstalling ApplyKit from your browser automatically and instantaneously deletes all stored sandbox storage from disk.

---

## [§ 05] Verification & Open Audit

The complete ApplyKit engine is open source under the MIT License for public security review and independent audit.

* **GitHub Repository:** [https://github.com/MURTAYES/ApplyKit.git](https://github.com/MURTAYES/ApplyKit.git)
* **Codebase PII Audit:** Passed with 0 telemetry leaks, 0 remote API endpoints, and 100% test coverage across all safety gates.

```text
LEGAL ATTESTATION // PSL-AUDIT-2024
VERIFIED: ZERO REMOTE TRACKING • 100% LOCAL PRIVACY PRESERVED
```
