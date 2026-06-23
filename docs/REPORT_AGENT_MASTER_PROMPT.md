# Report Agent Master Prompt — Growth Readiness Report Team

The master orchestration prompt. Paste this prompt into Claude Code (or a
future automation runner) to drive the multi-agent workflow defined in
[docs/REPORT_AGENT_TEAM_PLAN.md](./REPORT_AGENT_TEAM_PLAN.md) for one
organization at a time.

This prompt names a single input boundary (the agent packet JSON) and a
single output (a draft Markdown report plus QA notes). It does not write
to the database. It does not send anything.

---

## How to Use

1. Confirm the organization is in status `ready_for_report` in the admin
   dashboard.
2. Download the Growth Readiness Agent Packet JSON from
   `/api/admin/organizations/{id}/export`.
3. Save the JSON locally at `working/<organization_id>/agent_packet.json`.
4. Open Claude Code in this repo and paste the prompt below, replacing
   `<organization_id>` with the org's UUID.
5. Save each agent's artifact in the same working directory.
6. Stop at the QA reviewer's output. A human operator at connectNPO opens
   the QA note and decides whether to share the draft.

Do not commit the working directory. Do not paste sensitive details into
the prompt itself.

---

## Master Prompt (paste verbatim)

```text
You are orchestrating the connectNPO Growth Readiness Report agent team
for one nonprofit organization.

Inputs:
- Agent packet JSON: working/<organization_id>/agent_packet.json
- Plan: docs/REPORT_AGENT_TEAM_PLAN.md
- Output contract: docs/REPORT_AGENT_OUTPUT_SCHEMA.md
- Final report shape: docs/GROWTH_READINESS_REPORT_TEMPLATE.md

Hard rules (apply to every stage):
1. Never invent nonprofit facts.
2. Never give legal, tax, accounting, grant-eligibility, or compliance
   advice. Recommend the nonprofit consult a qualified professional.
3. Use only these evidence labels:
   Found in intake, Found on website, Found in public research,
   Missing, Needs confirmation.
4. Every public-source claim must carry an openable URL.
5. Every intake-based claim must carry the intake question_key (or
   label).
6. Only visit URLs the nonprofit listed in their intake packet. Search
   engines may only be used to confirm a public page the nonprofit
   itself named.
7. Do not request, store, or restate sensitive data (EIN, bank info,
   donor PII, employee records, private financials, uploaded
   documents). If such data appears in the packet, drop it and flag.
8. The final report is a DRAFT. Mark it DRAFT and route it to a human
   reviewer at connectNPO.

Run the agents in this order. Each stage must read the prior stage's
artifact before producing its own. Do not skip stages.

Stage 1 — Use the `intake-analyst` agent.
  Input: agent_packet.json
  Produce: working/<organization_id>/intake_summary.json
  (Shape: see "intake_summary" in REPORT_AGENT_OUTPUT_SCHEMA.md.)

Stage 2 — Use the `website-researcher` agent.
  Input: agent_packet.json + intake_summary.json
  Produce: working/<organization_id>/website_findings.json
  (Shape: see "findings_list" in REPORT_AGENT_OUTPUT_SCHEMA.md.)

Stage 3 — Use the `seo-geo-analyst` agent.
  Input: agent_packet.json + website_findings.json
  Produce: working/<organization_id>/seo_geo_findings.json
  (Shape: "findings_list". Prefer the claude-seo plugin if installed;
  otherwise note "claude-seo not available" in the artifact's
  research_limitations field.)

Stage 4 — Use the `fact-checker` agent.
  Input: website_findings.json + seo_geo_findings.json
  Produce: working/<organization_id>/fact_check_log.json
  (Shape: see "fact_check_log" in REPORT_AGENT_OUTPUT_SCHEMA.md. Every
  finding becomes one row with workflow_status verified, rejected, or
  needs_review.)

Stage 5 — Use the `nonprofit-readiness-analyst` agent.
  Input: intake_summary.json + fact_check_log.json
  Produce: working/<organization_id>/readiness_assessment.json
  (Shape: see "readiness_assessment" in REPORT_AGENT_OUTPUT_SCHEMA.md.)

Stage 6 — Use the `report-writer` agent.
  Input: intake_summary.json + fact_check_log.json +
         readiness_assessment.json
  Produce: working/<organization_id>/draft_report.md
  (Shape: docs/GROWTH_READINESS_REPORT_TEMPLATE.md. Include a 30-day
  and 90-day action plan from High and Medium priority items only.
  Mark the report DRAFT — internal review required.)

Stage 7 — Use the `qa-reviewer` agent.
  Input: draft_report.md + every upstream artifact
  Produce: working/<organization_id>/qa_review.md +
           working/<organization_id>/revision_notes.json (if revisions
           are required)
  (Shape: see "qa_review" in REPORT_AGENT_OUTPUT_SCHEMA.md.)

After stage 7, stop. Do not send the draft. Surface the QA note to the
human operator at connectNPO. The operator decides whether to revise,
re-run the report-writer, or share with the nonprofit.

If at any stage the required input artifact is missing or malformed, do
not proceed. Print the missing-input name and stop.

If any agent produces a claim without a backing source (intake key or
public URL), the next agent must drop it and record the drop in
research_limitations or fact_check_log.notes.
```

---

## Notes for Operators

- **Working directory hygiene.** The `working/` directory is local-only.
  It often contains contact emails and URLs from intake. Do not commit it
  and do not paste its contents into external chat tools.
- **Re-running stages.** If a stage misbehaves, re-run only that stage.
  Downstream artifacts must be regenerated from the corrected upstream
  one — do not keep stale downstream artifacts.
- **claude-seo availability.** The SEO/GEO stage is the only one that
  optionally calls into the `claude-seo` plugin. If the plugin is not
  installed, the stage still runs in fallback mode and notes the
  limitation. Reports still ship; they simply rely on manual inspection
  of the nonprofit's listed URLs.
- **Human review is the load-bearing step.** This master prompt
  intentionally stops at QA. A human at connectNPO is always on the
  critical path before anything is shared with the nonprofit.

## Version

- Master prompt version: 0.1
- Owner: connectNPO operations
