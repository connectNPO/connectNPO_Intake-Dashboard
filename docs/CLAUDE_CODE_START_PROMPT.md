# Claude Code Start Prompt

Use this prompt after creating or opening the project in Claude Code.

```text
We are building the connectNPO Nonprofit Growth Readiness Intake Dashboard MVP.

First, read these planning documents carefully:

- docs/PRODUCT_BRIEF.md
- docs/DESIGN_BRIEF.md
- docs/DATABASE_SCHEMA.md
- docs/MVP_IMPLEMENTATION_PLAN.md
- CLAUDE.md

Important rules:

1. Do not build AI report generation yet.
2. Do not build file uploads yet.
3. Do not collect sensitive data such as EIN, bank info, passwords, donor lists, private financial statements, employee records, Form 990 uploads, or confidential documents.
4. Use Next.js App Router, TypeScript, Tailwind CSS, and Supabase.
5. Use a warm, clean, nonprofit-friendly design.
6. Keep the MVP simple and production-minded.
7. Protect admin routes with Supabase Auth.
8. Public intake should use private token links.
9. Store flexible intake answers in Supabase using section_key, question_key, question_label, and answer jsonb.
10. Add an admin-only JSON export endpoint for a future AI report agent.

Please follow docs/MVP_IMPLEMENTATION_PLAN.md task by task.

Before changing code, summarize your understanding of the MVP boundary and list the first 3 implementation tasks you will do.
Then start implementing.
```

## If Claude Code Starts Building Too Much

Use this correction:

```text
Stop. This is too much for the MVP.
Do not build AI reports, PDF generation, customer accounts, website crawling, payments, or file uploads.
Return to docs/MVP_IMPLEMENTATION_PLAN.md and continue only the next MVP task.
```

## If Claude Code Ignores Design

Use this correction:

```text
Please re-read docs/DESIGN_BRIEF.md.
The interface should feel warm, clean, trustworthy, and nonprofit-friendly.
Use the connectNPO palette:
- #faf9f5 background
- #ffffff cards
- #7182FF primary accent
- #ECECFF soft accent
- #6F6A63 muted text
- #111111 main text
Avoid a cold enterprise SaaS look.
```

## If Claude Code Mixes Future AI Agent Into MVP

Use this correction:

```text
The AI report agent is a future phase.
For this MVP, only build the admin-only JSON export endpoint that a future agent can read.
Do not generate reports yet.
```
