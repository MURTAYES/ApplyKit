# Privacy Policy for ApplyKit

**Last Updated:** October 2026  
**Extension Version:** 1.0.0

ApplyKit is committed to protecting applicant privacy. ApplyKit operates entirely on-device and does not collect, track, transmit, or monetize your personal information.

---

## 1. Local-First Data Storage
- All applicant profile information (including names, contact details, educational records, and job experience) is stored exclusively on your device using the browser's local sandbox storage (`chrome.storage.local`).
- Your profile data is never uploaded to any remote server, cloud service, third-party API, or analytics provider.

---

## 2. No External Network Requests
- ApplyKit makes **zero** outbound HTTP/HTTPS requests containing your profile data.
- ApplyKit operates fully offline without requiring an internet connection to manage or autofill your applicant profile.

---

## 3. Chrome MV3 Permissions Rationale
ApplyKit requests the minimal set of permissions strictly necessary for its autofill functionality:
- **`storage`**: Used to save and retrieve your applicant profile locally on your computer.
- **`activeTab`**: Used only when you explicitly click the "Fill Form" button to interact with the currently active job application tab. ApplyKit never runs automatically in the background or scans pages without user initiation.
- **`scripting`**: Used to inject the form-filling engine into the active job portal page when you request a fill.

---

## 4. Non-Interference Safety Guarantees
ApplyKit is designed as an applicant aid, not an autonomous agent:
- ApplyKit **never** clicks submit, payment, or next-step buttons.
- ApplyKit **never** solves or interacts with CAPTCHA challenges.
- ApplyKit **never** checks declaration, terms, or certification agreement checkboxes.
- ApplyKit **never** uploads documents or resumes automatically.

---

## 5. User Control & Data Deletion
- **Export & Backup:** You can export your full profile data at any time as a clean JSON file for your own records.
- **Import:** You can restore your profile data from a previously exported backup file.
- **Immediate Data Deletion:** You can permanently delete all stored profile information with a single click via the "Reset Profile" / "Delete All Stored Data" action in the extension's Profile Manager page. Uninstalling the extension also immediately removes all locally stored data.

---

## 6. Open Source
For inquiries, bug reports, or code inspection, visit the project repository:
[https://github.com/MURTAYES/ApplyKit.git](https://github.com/MURTAYES/ApplyKit.git)
