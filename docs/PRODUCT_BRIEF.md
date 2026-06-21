# connectNPO Nonprofit Growth Readiness Intake Dashboard — Product Brief

## Product Name

Working name: **Nonprofit Growth Readiness Intake**

## One-Sentence Summary

A private-link intake dashboard that helps connectNPO collect structured, non-sensitive information from nonprofit organizations so the team can review their digital readiness, website clarity, donor trust signals, and operational needs.

## Core Product Decision

Build the **information intake dashboard first**. Do **not** build the AI report generator in the first MVP.

The MVP should collect clean, structured information. A future AI agent can later read that data and draft a readiness report.

## Target Users

### Primary Admin User

- connectNPO internal team
- Jay / connectNPO operator
- Future team members who review nonprofit intake submissions

### Primary Customer User

- U.S.-based nonprofit founders
- Executive directors
- Operations or communications staff
- Small to mid-sized nonprofits, especially around $250K–$1M annual budget
- Non-technical users who need plain language

## Problem

Nonprofits often need help with website clarity, donor trust, communication, digital tools, and operational systems. Before connectNPO can recommend useful support, it needs a structured way to collect organization information without asking for sensitive documents too early.

## MVP Goal

The MVP should let connectNPO:

1. Create a nonprofit organization record.
2. Generate a private intake link.
3. Send that link to the nonprofit contact.
4. Let the nonprofit complete a friendly intake form.
5. Store answers in Supabase.
6. Review answers in an admin dashboard.
7. Add internal notes.
8. Update organization status.
9. Export structured JSON for a future AI report agent.

## MVP Workflow

1. Admin logs in.
2. Admin creates an organization.
3. System generates a private intake token/link.
4. Admin sends link manually by email.
5. Nonprofit opens `/intake/[token]`.
6. Nonprofit reads a privacy reminder.
7. Nonprofit completes the intake form.
8. Answers are saved as structured responses.
9. Organization status becomes `submitted`.
10. Admin reviews the submission.
11. Admin adds internal notes.
12. Admin marks the organization `ready_for_report` when complete.
13. Future AI agent can use the JSON export endpoint.

## MVP Features

### Admin

- Supabase Auth login
- Organization list
- Create organization form
- Organization status badge
- Organization detail/review page
- Intake link copy button
- Review all intake responses
- Add internal notes
- Update status
- JSON export endpoint for future AI agent

### Public Intake

- Private token-based page: `/intake/[token]`
- Friendly intro and privacy reminder
- Multi-section intake form
- Save answers to Supabase
- Completion page

## Intake Sections

1. Organization Basics
2. Mission & Community
3. Programs & Services
4. Current Goals
5. Challenges
6. Website & Digital Presence
7. Donor & Supporter Readiness
8. Volunteer Readiness
9. Trust & Transparency Signals
10. Content & Messaging
11. Operations & Automation Opportunities
12. Final Context

## Data to Collect

Collect non-sensitive, service-planning information:

- Organization name
- Website URL
- Public location and service area
- Organization category
- Mission
- Audience/community served
- Programs/services
- Current goals
- Challenges/pain points
- Website and digital presence
- Donation/donor readiness signals
- Volunteer readiness signals
- Public trust/transparency signals
- Content and messaging needs
- Operations and automation opportunities

## Data to Avoid in MVP

Do not request or store:

- EIN
- Bank information
- Passwords or platform credentials
- Donor lists
- Private financial statements
- Employee records
- Board member private details
- Form 990 uploads
- Annual report uploads unless clearly public and intentionally added in a later version
- Confidential strategy documents
- Private client/member data

## Status Values

Use these organization status values:

- `draft_created`
- `intake_sent`
- `in_progress`
- `submitted`
- `under_review`
- `needs_clarification`
- `ready_for_report`
- `report_created`

## Future Phases — Not MVP

Do not build these yet:

- AI-generated report
- SEO crawler
- Website scraper
- PDF report generator
- Payment system
- Customer login accounts
- File uploads
- Email automation
- CRM integration
- Sensitive document handling

## Success Criteria for MVP

The MVP is successful if:

1. Admin can create a nonprofit record.
2. Admin can copy a private intake link.
3. Nonprofit can submit the intake form without logging in.
4. Answers are stored correctly in Supabase.
5. Admin can review answers.
6. Admin can add notes.
7. Admin can update status.
8. JSON export returns a clean structured packet.
9. No sensitive information is requested.
10. The interface feels trustworthy, warm, and easy for a nonprofit user.
