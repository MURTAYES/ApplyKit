# Features Research: Donna Browser Extension

**Domain:** Form autofill / job application assistant
**Researched:** 2026-10-02
**Confidence:** HIGH

## Table Stakes

Features users expect in any form-fill tool:
- **One-profile setup** — Enter details once, fill many forms; not per-site configuration
- **Field type coverage** — Text, number, date, select, textarea, checkbox
- **Skip unknown fields** — Graceful handling: untouched field is always safer than a wrong fill
- **Non-destructive** — Never overwrite user-typed values, never submit, never upload
- **Visual confirmation** — Users need to see what was filled vs skipped before trusting the tool
- **Profile editing** — Easy CRUD for stored data; change of address/email is common
- **Keyboard shortcut** — Power users prefer Alt+key over clicking popup
- **Error-graceful** — One field failing must not abort the entire fill run

## Differentiators

Features that would make Donna stand out:
- **Section-scoped matching** — Handles forms with repeated labels (SSC vs HSC "Passing Year") correctly; most generic autofill tools fail here
- **Bangla text support** — Unicode-exact fill for Bangla name/address fields; no transliteration
- **Dependent dropdown sequencing** — Waits for child options to load before filling; most tools race and fail
- **Structured fill report** — Three-tier report (filled / skipped / unmatched) with inline field highlights; better than a generic "X fields filled" count
- **Repeatable section support** — Clicks ADD MORE and fills each job experience row in order
- **Undo fill** — One-click restore to pre-fill state; rare in form-fill tools
- **Per-site JSON mappings** — Known portals get exact selector mappings; no heuristic errors on the target form
- **Local-only privacy** — Data never leaves the device; no analytics, no account required

## Anti-Features

Features that sound good but cause problems:
- **AI-generated answers** — Inferring what to write for "Why do you want this role?" introduces hallucinations and non-user-authored text; excluded by R5 (no inferred values)
- **Auto-submit** — Obvious catastrophic risk; universally the #1 complaint in autofill tool reviews
- **Auto-CAPTCHA bypass** — Legal risk, terms-of-service violation, security concern
- **Broad host permissions (all_urls)** — Users distrust it; Chrome Web Store scrutinizes it heavily
- **Cloud profile sync** — Introduces PII transmission risk; contradicts the trust contract
- **Guessing from context** — Filling a field the user never provided creates wrong data; R5 prohibits this
- **Multiple-profile switcher in v1** — High UI complexity for marginal v1 value; defer to v2

## Fill Report UX Patterns

Based on existing tools (Simplify, Jobright, RoboForm):
- **Inline highlight** — Filled fields get a colored border/background (green); unmatched get amber/orange
- **Popup panel** — Summary shown in popup after fill completes, not as a page overlay
- **Count summary** — "12 filled / 3 skipped / 2 unmatched" at the top
- **Per-field list** — Expandable list showing exactly which field → which value was filled
- **Clear highlights action** — One-click to remove visual indicators before submission
- Best tools show the list immediately and let users click individual fields to scroll to them

## Dropdown Matching Techniques

1. **Exact match** — `option.text === storedValue` (case-normalized)
2. **Case-insensitive normalized** — lowercase, collapse whitespace, strip punctuation
3. **Alias table** — Pre-defined aliases: "Dhaka" ↔ "ঢাকা", "GPA" → "Grade Point Average"
4. **Substring match** — `option.text.includes(storedValue)` for partial matches
5. **Fuzzy / Levenshtein** — >0.85 similarity threshold as last resort
6. **Confidence threshold** — Only fill above a confidence level; below → report as unmatched
7. **Bengali ↔ English bi-directional** — Match stored English value against Bangla option text and vice versa

For custom JavaScript dropdowns (not `<select>`):
- Click to open, scan rendered option list, click matching option
- Donna should detect and report these as unmatched if they can't be standard-filled (v1 scope: native `<select>` only)

## Repeatable Section Patterns

- **ADD MORE button detection** — Scan for buttons with text matching "Add", "Add More", "+" near repeatable containers
- **Row count management** — Fill engine knows how many experience entries are in profile; clicks ADD MORE (n-1) times to create n rows, then fills each
- **Sequence ordering** — Fill entries in chronological order (newest first or oldest first per form convention)
- **Partial fill gracefully** — If form has 2 existing rows but profile has 3 entries, add 1 more row then fill all 3

## Undo / Restore Pattern

- **Pre-fill snapshot** — Before any fills, capture `{selector: currentValue}` for all fields that will be touched
- **Store in chrome.storage.session** (cleared on browser close) — Not chrome.storage.local (would persist longer than useful)
- **Undo button** — In popup, shown after fill completes; disappears on page navigation
- **Restore loop** — Re-apply native setter + event dispatch for each captured field

## Sources

- Chrome Web Store: Simplify Jobs, JobRight, Autofill by Roboform — user review analysis
- reddit.com/r/jobsearchhacks — form fill tool complaints and requests
- https://simplify.jobs — fill report UX pattern reference
- https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
