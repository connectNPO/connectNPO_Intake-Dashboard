# connectNPO MVP Report Workflow

This document describes the current human-reviewed MVP workflow for creating and delivering a connectNPO Growth Advisor Report.

## Goal

Give a nonprofit a practical, client-ready Growth Advisor Report without fully automating AI generation yet.

The MVP keeps Jay in the approval loop:

```text
Client submits request
→ Client completes intake
→ Hermes/Claude Code drafts report
→ Hermes reviews draft
→ Jay approves
→ Client-ready secure link is created
→ Gmail draft is prepared
→ Jay sends final email
```

## Public request form

Customer-facing request form:

```text
https://connectnpo-web-6we2.vercel.app/request-review
```

Dashboard shortcut:

```text
Admin → left navigation → Public request form
```

The request form collects basic contact information and sends the nonprofit a private intake form link.

## Intake review

Dashboard:

```text
https://connectnpo-web-6we2.vercel.app/admin
```

Operator flow:

```text
Admin → Organizations → View
```

Review:

- organization name
- website URL
- contact name/email/role
- intake completion status
- intake responses
- missing required answers
- admin notes
- agent packet preview

## Asking Hermes to draft the report

Use this kind of request:

```text
이 단체 Growth Advisor Report 작성해줘.
```

Or, with a specific organization:

```text
Women’s Education Project 리포트 작성해줘.
```

Hermes should:

1. Open/review the organization in the dashboard.
2. Use the agent packet JSON.
3. Ask Claude Code to research and draft the report.
4. Review the draft for accuracy, tone, evidence, structure, and safety.
5. Provide Jay with a browser preview link for human review.

## Human review rules

Jay reviews before anything is sent to the client.

Check for:

- no legal, tax, accounting, or financial advice
- no unsupported claims
- no fabricated facts
- no sensitive/private data exposure
- recommendations are practical and nonprofit-friendly
- tone is helpful and professional
- report follows the Growth Advisor structure
- client-facing page does not show internal JSON, prompts, or admin links

Useful approval language:

```text
이 리포트 승인. 고객용 링크 만들어줘.
```

Or:

```text
이 리포트 승인. 고객용 링크 만들고 내 이메일에 고객에게 보낼 이메일 드래프트 만들어줘.
```

## Client-ready report links

Client-ready reports use Supabase, not static files.

Route:

```text
/reports/{secure_token}
```

Example:

```text
https://connectnpo-web-6we2.vercel.app/reports/rpt_xxxxxxxxxx
```

Table:

```text
client_reports
```

Report links should be created only after Jay approves the report.

Create a client report link from an approved HTML or Markdown report:

```bash
node scripts/create-client-report.mjs \
  --title "Organization Name — Growth Advisor Report" \
  --html path/to/approved-report.html
```

Optional Markdown source:

```bash
node scripts/create-client-report.mjs \
  --title "Organization Name — Growth Advisor Report" \
  --markdown path/to/approved-report.md
```

If both `--html` and `--markdown` are provided, HTML is used for display and Markdown is stored as source text.

Expected output:

```json
{
  "id": "...",
  "title": "Organization Name — Growth Advisor Report",
  "status": "client_ready",
  "token": "rpt_...",
  "url": "https://connectnpo-web-6we2.vercel.app/reports/rpt_..."
}
```

Verify the client link before sending it.

## Gmail draft workflow

After Jay asks for a draft email, Hermes can create a Gmail draft.

Example request:

```text
이 리포트 승인. 고객용 링크 만들고 내 이메일에 고객에게 보낼 이메일 드래프트 만들어줘.
```

Draft should usually include:

- recipient from organization contact email, if available
- clear subject
- short thank-you
- secure report link
- reminder that the report is for planning and is not legal/tax/accounting advice
- invitation to schedule a follow-up conversation

Example subject:

```text
Your connectNPO Growth Advisor Report is ready
```

Hermes should create a draft only. Do not send automatically unless Jay explicitly approves sending.

## Customer email draft template

```text
Hi [Contact Name],

Thank you for completing the Growth Readiness intake for [Organization Name].

Your connectNPO Growth Advisor Report is ready here:
[Client Report Link]

The report is designed to help you review your current digital presence, identify practical growth opportunities, and prioritize next steps. It is not legal, tax, accounting, or financial advice.

After you have a chance to review it, I’d be happy to discuss the recommendations and help you decide which next steps are most useful for your organization.

Best,
Jay
connectNPO
```

## What is intentionally not automated yet

For MVP, these are intentionally manual or semi-manual:

- AI report generation button in the dashboard
- automatic AI API job queue
- automatic final approval
- automatic email sending
- PDF export
- client login portal
- payment flow

Add these later only when real usage shows they are needed.

## Current MVP status

The MVP workflow is usable:

```text
request form → intake → dashboard review → Hermes/Claude Code report draft → Jay approval → /reports/{secure_token} client link → Gmail draft
```

The next best step is to run one real rehearsal from request form to final email draft and improve only the parts that feel slow or confusing.
