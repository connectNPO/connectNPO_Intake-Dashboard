# Claude Code Dashboard Review Prompt

Use this prompt when asking Claude Code to review the connectNPO Intake Dashboard through the browser using a temporary reviewer account.

Do not paste real passwords, service role keys, `.env.local`, API keys, or private intake links into chat. If credentials are needed, the human operator should type them directly into the browser or terminal session.

```text
You are reviewing the connectNPO Intake Dashboard as a temporary dashboard reviewer.

Context:
- This is still a development-stage app.
- There should be no real customer data in the dashboard yet.
- Use only the provided temporary reviewer account.
- Do not search for, open, copy, or print `.env`, `.env.local`, API keys, Supabase service role keys, private credentials, or secrets.
- Do not expose private intake links or tokens in your final report.
- Do not create, edit, archive, delete, or status-change records unless the human operator explicitly asks you to do that during this review.
- Prefer read-only review.
- If you need to test a write action, ask first and use only clearly fake test data.

Primary goal:
Review whether the dashboard workflow is understandable, safe, and ready for manual operator testing.

Pages / flows to inspect:
1. Public homepage and Growth Readiness Review request CTA.
2. Login page.
3. Admin dashboard.
4. One test organization detail page.
5. Intake responses section.
6. Private intake link panel — confirm it is admin-only, but do not print the link.
7. Status panel — review UI only; do not change status unless asked.
8. Agent packet card.
9. Agent packet preview page.
10. Raw JSON preview.
11. Download JSON button.
12. Copy JSON button.
13. Report template link.
14. Logged-out access behavior for admin-only pages if possible.

Specific checks:
- Does the admin dashboard load without visible errors?
- Is the organization detail page clear and easy to understand?
- Are intake responses readable and grouped clearly?
- Does the Agent packet card show both Download JSON and Preview packet actions?
- Does the Preview packet page show:
  - Answered questions count
  - Missing required count
  - Admin notes count
  - Packet summary
  - Raw JSON preview
  - Download JSON button
  - Copy JSON button
- Does Copy JSON change to Copied! after click?
- Does the raw JSON exclude these fields/values:
  - contact_email
  - contact_name
  - intake_token
  - private intake URL
  - API keys
  - Supabase service role key
  - passwords or secrets
- Does the downloaded JSON match the visible packet preview conceptually?
- Does the report template link open the Growth Readiness Report template?
- Are there confusing labels, unclear warnings, or UX issues?
- Are there any browser console errors?
- Are there any obvious mobile/responsive layout issues if easy to check?

Security and privacy rules:
- Do not include secrets, private URLs, tokens, emails, or passwords in the final report.
- If you see a secret, report only: "Potential secret exposure found in [general area]" and tell the operator to rotate it if needed.
- Do not paste raw JSON into the final report if it contains organization data. Summarize PASS/FAIL instead.
- Do not modify database records unless instructed.

Final report format:

## Summary
- Overall status: PASS / PASS WITH ISSUES / FAIL
- Main finding in one sentence.

## Checks
- Admin dashboard: PASS / FAIL — short note
- Organization detail: PASS / FAIL — short note
- Intake responses: PASS / FAIL — short note
- Agent packet preview: PASS / FAIL — short note
- Copy JSON: PASS / FAIL — short note
- Download JSON: PASS / FAIL — short note
- Sensitive data exclusion: PASS / FAIL — short note
- Report template link: PASS / FAIL — short note
- Auth protection: PASS / FAIL / NOT TESTED — short note
- Console errors: PASS / FAIL — short note

## Issues Found
List issues by severity:
- High:
- Medium:
- Low:

## Recommended Next Fixes
Give the next 3 practical fixes, in priority order.

## Do Not Include
- passwords
- tokens
- private intake links
- API keys
- raw private JSON
- real contact emails
```

## Human Operator Notes

Before starting:

- Confirm the account is temporary.
- Confirm there is no real customer data.
- Keep the temporary password out of chat logs.

After finishing:

- Save Claude Code's review result.
- Change the temporary account password or delete the temporary account.
- If Claude Code found any secret exposure, rotate the exposed secret before continuing.
