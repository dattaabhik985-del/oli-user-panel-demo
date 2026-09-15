# OLI Customer User Panel — PRD

## Original Problem Statement
Build a fully functional OLI (Online Legal India) Customer User Panel demo that visually matches the provided reference PDF exactly, with all customer-facing functionality working: login (email+OTP and OLI ID), dashboard (My Services, My Documents, My Certificates, OLI Other Services, Live Work showing ONLY currently-live OLI IDs), service pages with 3-stage milestones, document upload/preview/download (real browser-stored files), required-documents Welcome Back popup (<4s), certificates, OLI Invoices, Govt Receipts, callback requests with revision (no duplicates), complaints (ticket ID + sad face), suggestions, feedback (star rating), profile + contact person with confirmations, real interactive How-to-Use walkthrough, dashboard-only chatbot, ExploreServices with demo Apply & Pay purchase flow, per-OLI data isolation, and localStorage persistence across refresh. Responsive on desktop/tablet/mobile. No redesign allowed.

## Architecture
- Pure frontend React demo (user explicitly specified React + localStorage); FastAPI/MongoDB backend intentionally unused.
- State: single localStorage key `oli_panel_state_v1`, seeded on first load (25 services, 25 invoices, 5 govt receipts, 2 callbacks, profile), debounced persistence in `src/oli/store.jsx`.
- Seed data: `src/oli/data.js`. Shared UI: `src/oli/ui.jsx`. Modals: `src/oli/modals.jsx`. Layout/sidebar/topbar: `src/oli/Layout.jsx`. Chatbot: `src/oli/Chatbot.jsx`. Interactive tour: `src/oli/Tour.jsx`. PDF generation (invoices/receipts/certificates/seed docs): `src/oli/pdf.js` (jsPDF).
- Pages in `src/pages/`: Login, Dashboard, MyServices, ServiceDetail, MyDocuments, Certificates, Invoices (OLI Invoices + Govt Receipt), Callbacks, Explore (OLI Other Services / ExploreServices), Recommended, Profile, HowToUse.
- Reference assets (logo, login photo) extracted from the reference PDF into `public/assets/`.

## User Personas
- Demo customer: Vamsee Krishna, ABC Foods Private Limited (25 services / multiple OLI IDs).

## Core Requirements (static)
- Visual match to reference PDF (colors: orange #EA6D27, navy sidebar #2F346E, blue #2E6BEA, cream login bg #FEF7E7; Poppins font).
- Dashboard Live Work = only currently-live OLI IDs; My Services = all services.
- 3 customer-facing stages: Documentation → Application and Filing → Completion.
- Per-OLI data isolation; real file upload (data URLs) with confirmation; popup <4s.

## Implemented (2026-09-12)
- Login page (exact reference look, extracted logo + photo): email/password (demo@email.com / Demo123@) → OTP 123456; OLI ID login without OTP (any seeded OLI ID); Google demo login.
- Dashboard: one-click access cards + MY LIVE SERVICES (live-only, blinking red LIVE badge); Welcome Back required-docs popup (~0.7s) with per-doc Upload + confirmation.
- My Services (25 services, search), Service Detail (stepper, progress, remarks, assigned expert + DID, last-call pill, required docs with (i) instructions, uploaded docs preview/download/delete, payments & receipts, demo controls: Advance Stage / Mark Work Done / Start-Stop LIVE).
- Trademark (12 OLIs with class/type/desc), ISO (5 OLIs with codes), GST, Company Registration, IEC, FSSAI, Bookkeeping, AFC, TM Objection Reply, GST Return Filing.
- My Documents (service-wise groups, upload w/ confirm, real preview/download, delete); My Certificates (view/download/email demo); OLI Invoices & Govt Receipt tables (real jsPDF view/download).
- Callbacks: search by OLI ID/service/expert, auto expert fetch, one active request per service (revision updates + history), All Callback Request table with expandable history.
- Complaint (confirm → sad face + 5-digit ticket), Suggestion (confirm → stored), Feedback (stars + review, per service).
- Profile: alt number/person, calling priority, "contact person button" toggle (name/designation/phone/email), Save → Are-you-sure → OTP 123456 → persisted; Reset Demo Data.
- How to Use: 12-slide Panel Demo + Start Tour (real interactive walkthrough, orange highlight ring, dimmed overlay, Next/Previous/Skip/Finish, desktop + mobile drawer aware).
- Chatbot (dashboard only): "How may I help?" greeting, 7 quick chips, OLI ID/service status lookup, navigation and callback/complaint actions.
- ExploreServices (exact name) → Apply & Pay → demo checkout → simulated payment → new OLI ID created → appears in My Services + invoice added.
- Persistence across refresh (localStorage); responsive desktop/tablet/mobile.
- Testing: iteration_1 — 28+ scenarios, 100% pass. Fixed: option/span hydration warning in selects.

## Revision Pass (2026-09-14)
- Welcome Back popup: service-wise bordered groups (service + OLI ID header, REQUIRED DOCUMENTS label) + visible 5 MB note.
- OLI invoice upgraded to proper tax-invoice format (header, BILL TO, navy item table, PAID, footer) in both View modal and jsPDF download.
- Service page: "Documents Submitted" renamed "Uploaded Documents"; added "Expected Completion" per service (Trademark 7 Days, GST 3-7 Days, ISO 10-15 Days, etc. via SERVICE_ETA); 5 MB note in Required Documents + Instructions popup.
- Upload limit enforced at 5 MB with clear error toast and reselect.
- Raise Callback: after selection only a summary box (Selected Service/OLI ID/Assigned Expert/DID) remains, with Change button to re-search.
- Feedback: post-submit response screen — 4-5 stars "Your feedback is valuable for us 🙏"; 1-3 stars 😔 + apology; completed-service feedback then offers View Recommended Services → /recommended.
- Forgot Password on login page (same design): registered email → OTP 123789 (incorrect blocked) → new+confirm password → saved to state.auth.password, usable for later logins.
- Complaint success adds Track Ticket ID → /ticket/:id tracking page (Ticket ID, complaint, created, status, 5-stage escalation stepper, Work Completed, Pending Work, Latest Update, Escalation Team Remark); data persisted per ticket.
- Testing: iteration_2 — all 11 revisions verified, 100% pass after agent fixed missing useNavigate in ComplaintModal. >5MB rejection path reviewed by inspection (dynamic file input not automatable).

## Final Revision (2026-09-15)
- Completed/Work Done service pages now auto-open the Feedback popup (ServiceDetail useEffect, ~600ms) when the service has no feedback yet; never for non-completed services; no re-open after feedback submitted.
- After feedback submit: rating-based response (1-3 stars → 😔 + apology; 4-5 stars → "Your feedback is valuable for us 🙏"), then Recommended Services ALWAYS opens (auto-redirect ~2.5s + View Recommended Services button) for every rating — redirect is not conditioned on stars.
- Dashboard: new highlighted banner "See what your Business Analysis identifies that may be missing. Visit Recommended Services to explore" with clickable orange Recommended Services link → /recommended.
- Testing: iteration_3 — flows A-F all pass, 100%, no console errors, desktop + mobile verified.

## Backlog / Next Tasks
- P1: None outstanding from testing.
- P2 (only if user requests): richer PDF invoice templates, more recommended-services demo clients in the preview dropdown, drag-and-drop upload zone (currently file picker), OTP per-box inputs.

## Notes
- Spec conflicts resolved: PDF OLI IDs used (GST OLI12345678914797 etc.; spec's §5 example IDs also overlap with §12 trademark IDs); sidebar item named "ExploreServices" per explicit instruction (page title "OLI Other Services" per PDF); Profile stays in the left sidebar per PDF (spec's "right-hand sidebar" conflicts with PDF layout); "contact person button" exposed as data-testid + visible toggle label per PDF.
