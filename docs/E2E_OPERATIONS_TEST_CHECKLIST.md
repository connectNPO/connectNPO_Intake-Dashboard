# connectNPO Intake Dashboard — E2E Operations Test Checklist

Use this checklist before relying on the intake dashboard for a real nonprofit workflow.

This is a manual operations test. It should be run by a connectNPO admin in the browser because it includes login, public form submission, admin review, and production behavior.

## Safety Rules

- Use a clearly fake test organization.
- Do not enter EINs, donor names, passwords, bank details, private financials, Form 990 uploads, or confidential documents.
- Do not paste private intake links into public channels.
- If a screenshot includes `.env`, API keys, tokens, private intake links, or emails, treat it as sensitive.
- Delete or archive the test organization after the test if it should not remain in the active list.

## Test Data

Use values like these:

```text
Organization name: connectNPO Test Nonprofit
Website: https://example.org
Contact name: Test Admin
Contact email: a test inbox you control
Contact role: Executive Director
City: Los Angeles
State: CA
Service area: Southern California
Category: Youth services
Budget range: Under $250K
```

For intake answers, use short fake but realistic nonprofit descriptions. Do not include real client data.

## 1. Public Review Request Flow

- [ ] Open the public homepage.
- [ ] Click the Growth Readiness Review request CTA.
- [ ] Submit the review request form with test organization data.
- [ ] Confirm the success page loads.
- [ ] Confirm the notification email, if configured, is received by connectNPO.
- [ ] Confirm the intake email, if configured, is received by the test contact.

Expected result:

```text
A new organization is created and the user sees a clear success message.
```

## 2. Admin Organization Review

- [ ] Log in as an admin.
- [ ] Open the admin dashboard.
- [ ] Find the test organization.
- [ ] Open the organization detail page.
- [ ] Confirm organization summary fields are correct.
- [ ] Confirm the private intake link is visible only in admin.
- [ ] Confirm the status is reasonable for the current workflow.

Expected result:

```text
The test organization appears in admin with the expected metadata.
```

## 3. Private Intake Link Flow

- [ ] Open the private intake link in a browser.
- [ ] Confirm the correct organization name appears.
- [ ] Fill out the intake form with fake, non-sensitive answers.
- [ ] Submit the form.
- [ ] Confirm the completion page loads.

Expected result:

```text
The public intake form submits successfully and does not ask for sensitive data.
```

## 4. Admin Intake Response Review

- [ ] Return to the admin organization detail page.
- [ ] Confirm submitted intake answers appear under Intake responses.
- [ ] Confirm answers are grouped under the expected sections.
- [ ] Add one internal note.
- [ ] Confirm the internal note appears.
- [ ] Change the organization status to `Ready for report` when appropriate.

Expected result:

```text
Admin can review responses, add notes, and update workflow status.
```

## 5. Agent Packet Preview

- [ ] Click `Preview packet`.
- [ ] Confirm the agent packet preview page opens.
- [ ] Confirm Answered questions count looks correct.
- [ ] Confirm Missing required count looks correct.
- [ ] Confirm Admin notes count looks correct.
- [ ] Confirm Packet summary includes packet version, workflow status, website, and template reference.
- [ ] Review the raw JSON preview.

Expected result:

```text
The preview page gives a quick human-readable check before using the JSON packet.
```

## 6. Sensitive Data Exclusion Check

On the packet preview page and downloaded JSON, confirm these values are not included:

- [ ] `contact_email`
- [ ] `contact_name`
- [ ] `intake_token`
- [ ] private intake URL
- [ ] API keys
- [ ] Supabase service role key
- [ ] passwords or secrets

Expected result:

```text
The agent packet excludes private contact details and private intake tokens.
```

## 7. JSON Download

- [ ] Click `Download JSON` from the detail page or preview page.
- [ ] Confirm the JSON downloads or opens.
- [ ] Confirm the filename is based on the organization name.
- [ ] Confirm the JSON contains:
  - [ ] `packet_version`
  - [ ] `safety_rules`
  - [ ] `evidence_framework`
  - [ ] `report_scope`
  - [ ] `organization`
  - [ ] `research_targets`
  - [ ] `intake.sections`
  - [ ] `internal_admin_notes`
  - [ ] `agent_handoff`

Expected result:

```text
The downloaded packet is ready for a future research or report-writing workflow.
```

## 8. Report Template Link

- [ ] Click `Open report template`.
- [ ] Confirm the Growth Readiness Report template opens.
- [ ] Confirm the template includes the required finding fields:
  - [ ] Status
  - [ ] Evidence / Source URL
  - [ ] Finding
  - [ ] Recommendation
  - [ ] Priority

Expected result:

```text
Admin can quickly open the writing standard that matches the packet.
```

## 9. Auth / Access Checks

Run these checks in a logged-out browser or private window:

- [ ] Admin dashboard should not be visible while logged out.
- [ ] Organization detail page should not be visible while logged out.
- [ ] Agent packet preview page should not be visible while logged out.
- [ ] Agent packet download endpoint should not return packet data while logged out.

Expected result:

```text
Admin-only pages and JSON exports are protected by login.
```

## 10. Cleanup

- [ ] Archive the test organization if it should not remain active.
- [ ] Remove test emails if not needed.
- [ ] Do not delete production data unless intentionally cleaning up.

## Pass / Fail Summary

```text
Date tested:
Tester:
Environment: Production / Preview / Local

Public review request: PASS / FAIL
Admin review: PASS / FAIL
Private intake: PASS / FAIL
Response review: PASS / FAIL
Agent packet preview: PASS / FAIL
Sensitive data exclusion: PASS / FAIL
JSON download: PASS / FAIL
Template link: PASS / FAIL
Auth protection: PASS / FAIL
Cleanup: PASS / FAIL

Notes:
```

## If Something Fails

Record:

- the page URL path, not private tokens,
- what you clicked,
- what you expected,
- what happened instead,
- whether the issue blocks real client use.

Then ask Hermes or Claude Code to fix that specific failure.
