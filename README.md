<p align="center">
  <img src="public/icon-128.png" width="96" height="96" alt="ApplyKit Logo" />
</p>

<h1 align="center">ApplyKit — Local-First Job Application Autofiller</h1>

<p align="center">
  <strong>One Profile. Infinite Applications. 1-Click Form Autofiller.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue?style=flat-square" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/WXT-Framework-F43F5E?style=flat-square" alt="WXT" />
  <img src="https://img.shields.io/badge/Vitest-Passing-brightgreen?style=flat-square&logo=vitest&logoColor=white" alt="Vitest Passing" />
  <img src="https://img.shields.io/badge/Privacy-100%25%20Local-success?style=flat-square" alt="100% Local" />
</p>

---

## 💡 The ApplyKit Brand Story

Job application portals are notoriously tedious, asking applicants to re-enter the exact same biographical, academic, and professional details hundreds of times. Existing commercial autofillers often transmit personal data, resumes, and sensitive civic IDs to third-party cloud servers.

**ApplyKit** was built on a different philosophy: **Absolute Local Privacy and Precision Engineering**.

- **One Profile:** Applicants configure their full master profile once in a clean, distraction-free dashboard.
- **1-Click Autofill:** Navigating to a supported portal (such as Teletalk Bangladesh government and corporate portals) and clicking **"Fill Form"** populates text inputs, textareas, date pickers, numbers, dropdowns, and checkboxes across all sections in seconds.
- **Zero Cloud Transmission:** 100% of profile data stays strictly inside the browser sandbox (`chrome.storage.local`).

---

## 🔒 Ironclad Privacy & Safety Constraints

ApplyKit strictly enforces non-negotiable safety rules built into its core engine:

| Rule | Constraint Description |
|---|---|
| 🚫 **No Auto-Submit** | ApplyKit **never** submits forms or clicks submission buttons. You always review and submit manually. |
| 🛡️ **No CAPTCHA Touching** | ApplyKit completely ignores CAPTCHA inputs, challenge boxes, and security verification codes. |
| ✍️ **No Declaration Ticking** | ApplyKit never ticks declaration, consent, or terms & conditions checkboxes. |
| 🔒 **100% Local-First** | All profile data stays in `chrome.storage.local` on your machine. Zero network requests, zero remote analytics. |
| 🚫 **No Overwrite** | ApplyKit respects your edits and never overwrites fields you have already typed in manually. |
| 📄 **No Auto File Upload** | File inputs (photographs, signatures, CV attachments) are left for manual user review. |

---

## ✨ Key Features

- **🌐 Comprehensive Bilingual Intelligence:**
  - Full bidirectional English $\leftrightarrow$ Bengali support.
  - Native recognition for all **64 Districts** and **495+ Upazilas/Thanas**.
  - Built-in database of **320+ Higher Education Institutions** (Public Universities, Private Universities, Medical Colleges, Dental Colleges).
  - Education Boards, Examination titles, Groups, Quotas, and Religions.

- **📑 Cascading Dependent Dropdowns:**
  - Handles dynamic `District` $\rightarrow$ `Upazila/Thana` selects with automated option stabilization and event bubbling.

- **➕ Repeatable Job Experiences:**
  - Detects multi-row experience containers and dynamically clicks `+ Add More` to expand and populate complete work histories in chronological order.

- **🔓 Section Unlocking & Toggle Selects:**
  - Auto-unlocks optional sections (e.g., Masters degree, Job Experience) when data exists in the profile.
  - Handles *Yes/No* toggle selects (such as National ID, Passport, Birth Registration) and fills the revealed sub-inputs.

- **🎨 Modern Minimalist Profile Manager:**
  - Clean, high-contrast dashboard with dark-mode typography and responsive layout.
  - 10 structured sections with 400ms debounced auto-save and instant JSON Import/Export.

---

## 🛠️ Technology Stack

- **Extension Framework:** [WXT](https://wxt.dev) (Vite-powered Chrome Manifest V3)
- **Frontend:** React 19, TypeScript, Vanilla CSS
- **Validation:** [Zod](https://zod.dev) schemas for runtime profile integrity
- **Storage:** `chrome.storage.local`
- **Testing:** [Vitest](https://vitest.dev) + JSDOM with 78 unit, integration, and end-to-end regression tests

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/MURTAYES/ApplyKit.git
cd applykit
npm install
```

### 2. Build the Extension
```bash
npm run build
```
The compiled extension bundle will be generated in `.output/chrome-mv3`.

### 3. Load into Chrome / Edge / Brave
1. Open your browser and navigate to `chrome://extensions/` (or `edge://extensions/`).
2. Toggle on **Developer mode** (top-right corner).
3. Click **Load unpacked** and select the `.output/chrome-mv3` folder inside the ApplyKit repository.

### 4. Development Mode (Hot Reloading)
```bash
npm run dev
```

---

## 📁 Repository Structure

```text
├── entrypoints/
│   ├── background.ts                 # MV3 Background Service Worker
│   ├── content.ts                    # Content script injected on click
│   ├── popup/                        # Minimalist Extension Popup UI
│   └── options/                      # Full Profile Management Dashboard
│       └── components/               # 10 Dedicated Profile Form Sections
├── src/
│   ├── engine/                       # Autofill Core Engine
│   │   ├── fillEngine.ts             # Main orchestrator & report generator
│   │   ├── matcher.ts                # Section-scoped fuzzy & heuristic matcher
│   │   ├── sectionScoper.ts          # DOM upward/sideways hierarchy detector
│   │   ├── dropdownMatcher.ts        # Bilingual fuzzy dropdown resolver
│   │   ├── dependentSelects.ts       # District -> Upazila cascading handler
│   │   ├── repeatableSections.ts     # Multi-row job experience expander
│   │   ├── safety.ts                 # R1-R6 strict non-interference filters
│   │   ├── siteResolver.ts           # URL regex mapper for known portals
│   │   └── dictionaries/             # Bilingual lookup dictionaries (Districts, Upazilas, Universities, etc.)
│   ├── mappings/
│   │   └── teletalk.json             # Per-site selector bundle for Teletalk portals
│   ├── storage/                      # chrome.storage.local wrapper & debouncer
│   └── types/                        # Profile & Mapping TypeScript types
└── tests/
    ├── engine/                       # Comprehensive Unit & Regression Test Suites
    └── fixtures/                     # Full-page reference portal HTML & JSON profile
```

---

## 📜 License & Privacy

Distributed under the **MIT License**.

ApplyKit is committed to privacy by design. See [PRIVACY.md](https://github.com/MURTAYES/ApplyKit/blob/main/PRIVACY.md) for full architecture and zero-transmission guarantees.
