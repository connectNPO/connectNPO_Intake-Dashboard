# connectNPO Intake Dashboard

Build a nonprofit growth readiness intake dashboard for connectNPO.

Read these files before implementing:

- docs/PRODUCT_BRIEF.md
- docs/DESIGN_BRIEF.md
- docs/DATABASE_SCHEMA.md
- docs/MVP_IMPLEMENTATION_PLAN.md
- docs/CLAUDE_CODE_START_PROMPT.md

## Rules

- Do not build AI report generation in the MVP.
- Do not build file uploads in the MVP.
- Do not collect EIN, bank info, passwords, donor lists, private financial statements, employee records, Form 990 uploads, or confidential documents.
- Use Next.js App Router, TypeScript, Tailwind CSS, and Supabase.
- Keep the design warm, clear, nonprofit-friendly, and simple.
- Protect admin routes.
- Public intake should use private token links.
- Do not expose service role keys to browser code.