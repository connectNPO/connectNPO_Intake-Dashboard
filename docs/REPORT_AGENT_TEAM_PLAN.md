# Report Agent Team Plan — Growth Readiness Report

Planning document for the multi-agent workflow that turns a completed intake
packet into a Growth Readiness Report draft.

This is a **design and orchestration spec**. No code, schema, or external
integration is implied. Nothing in this file is wired up.

Related background:

- [docs/REPORT_AGENT_WORKFLOW.md](./REPORT_AGENT_WORKFLOW.md) — workflow
  shape and the proposed `research_findings` table.
- [docs/REPORT_WRITER_AGENT_PROMPT.md](./REPORT_WRITER_AGENT_PROMPT.md) —
  earlier single-agent writer prompt; the team below replaces and extends
  it.
- [docs/RESEARCH_AGENT_PROMPT.md](./RESEARCH_AGENT_PROMPT.md) — earlier
  single-agent research prompt; the team below replaces and extends it.
- [docs/GROWTH_READINESS_REPORT_TEMPLATE.md](./GROWTH_READINESS_REPORT_TEMPLATE.md)
  — final report shape the writer must fill.

## Team Goal

Produce a Growth Readiness Report that is:

- **Evidence-first.** Every claim ties back to intake, the nonprofit's own
  website, or a public source the nonprofit linked us to.
- **Useful to a real nonprofit operator.** Recommendations are concrete,
  small enough to act on, and ordered by priority.
- **Safe.** No invented facts. No legal, tax, accounting, or grant
  compliance advice. No sensitive data restated.
- **Warm and plain.** Public-facing English. Short sentences. No SaaS
  jargon.

## Input Boundary

The only input the team ingests is the **Growth Readiness Agent Packet**
JSON exported from `/api/admin/organizations/{id}/export` for one
organization in status `ready_for_report`. See
[docs/REPORT_AGENT_OUTPUT_SCHEMA.md](./REPORT_AGENT_OUTPUT_SCHEMA.md) for
the structured artifacts each agent emits.

No agent reads the database directly. No agent visits a URL the nonprofit
did not list. No agent calls external paid APIs.

## Roles

| # | Agent | Reads | Writes | Hand-off to |
| - | ----- | ----- | ------ | ----------- |
| 1 | `intake-analyst` | Agent packet JSON | `intake_summary.json` | website-researcher, nonprofit-readiness-analyst |
| 2 | `website-researcher` | Packet + intake summary | `website_findings.json` | seo-geo-analyst, fact-checker |
| 3 | `seo-geo-analyst` | Packet + website findings | `seo_geo_findings.json` | fact-checker |
| 4 | `fact-checker` | All findings from 2 + 3 | `fact_check_log.json` | nonprofit-readiness-analyst |
| 5 | `nonprofit-readiness-analyst` | Intake summary + verified findings | `readiness_assessment.json` | report-writer |
| 6 | `report-writer` | Everything above | `draft_report.md` | qa-reviewer |
| 7 | `qa-reviewer` | Draft + every upstream artifact | `qa_review.md` + revision notes | human operator |

A human at connectNPO opens the QA note before anything leaves the team.
No agent has send rights. No agent flips `reviewed_by_human` on a finding.

## Workflow

```
agent packet JSON
        │
        ▼
[1] intake-analyst        ──► intake_summary.json
        │
        ├──────────────────────────────────────────┐
        ▼                                          ▼
[2] website-researcher    ──► website_findings.json
        │
        ▼
[3] seo-geo-analyst       ──► seo_geo_findings.json
        │
        ▼
[4] fact-checker          ──► fact_check_log.json   (rejects unsupported)
        │
        ▼
[5] nonprofit-readiness-analyst ──► readiness_assessment.json
        │
        ▼
[6] report-writer         ──► draft_report.md       (DRAFT, not sent)
        │
        ▼
[7] qa-reviewer           ──► qa_review.md + revision notes
        │
        ▼
human operator at connectNPO (sign-off, edits, send)
```

Each arrow is a gated handoff. Stage N may not begin until stage N-1 has
produced its artifact in the shape defined in
[docs/REPORT_AGENT_OUTPUT_SCHEMA.md](./REPORT_AGENT_OUTPUT_SCHEMA.md).

## Tool Use Per Agent

The agents only use tools they need. Defaults:

- `intake-analyst` — `Read`, `Write`. No web access. No shell.
- `website-researcher` — `Read`, `Write`, `WebFetch`. Public web only,
  scoped to URLs the nonprofit listed.
- `seo-geo-analyst` — `Read`, `Write`, `WebFetch`, and the
  `claude-seo` plugin / skills if installed. If `claude-seo` is **not**
  installed, the agent falls back to a manual public-page review and says
  so in its output.
- `fact-checker` — `Read`, `Write`, `WebFetch`. Re-fetches only URLs that
  already appear in upstream findings.
- `nonprofit-readiness-analyst` — `Read`, `Write`. No web access.
- `report-writer` — `Read`, `Write`. No web access. No new sources may
  enter the draft at this stage.
- `qa-reviewer` — `Read`, `Write`, optional `WebFetch` for spot-checks
  against the Evidence Log.

No agent has `Bash`, `Edit`, or DB tools. No agent has send/post rights.

## Hard Rules (apply to every agent)

1. **No invented claims.** If there is no intake answer and no source URL,
   the agent does not make the statement.
2. **No auto-send.** Drafts stay internal until a human at connectNPO
   explicitly sends them.
3. **Avoid sensitive data.** Agents must not request, store, or restate
   EIN, bank info, donor PII, employee records, private financials, or
   uploaded documents. If such data appears, drop it and flag.
4. **Source URLs required for public claims.** Any finding describing
   something on the open web must carry an `evidence_url`. Findings
   without a URL are treated as restatements of intake answers only.
5. **Stay inside the nonprofit's stated surface.** Do not crawl beyond
   URLs the nonprofit listed. No guessing at adjacent domains. Search
   engines may only be used to discover an official public page the
   nonprofit named in intake.
6. **Evidence labels are fixed.** Use only:
   `Found in intake`, `Found on website`, `Found in public research`,
   `Missing`, `Needs confirmation`.
7. **No advice that requires a licensed professional.** No legal, tax,
   accounting, grant-eligibility, or compliance determinations.
8. **One claim per finding.** Do not bundle.
9. **Cite the source you used.** Public claims cite a URL. Intake claims
   cite the intake `question_key` (or label).
10. **Human review is load-bearing.** The QA reviewer surfaces every
    `Needs confirmation` item for the human operator.

## Required Output Principles for the Final Report

The final `draft_report.md` must:

- Separate findings into: **Found in intake / Found on website / Found in
  public research / Missing / Needs confirmation**.
- Carry a source URL or explicit source type on every important claim.
- Never invent nonprofit facts. Never give legal or tax advice.
- Include a **30-day action plan** and a **90-day action plan** drawn
  only from High and Medium priority items.
- Recommend connectNPO next services **only when** the evidence in this
  report supports it (e.g., suggest "website clarity engagement" only if
  the website clarity section has High-priority gaps).
- Be written in English. Warm, plain, practical. Aimed at small/mid-sized
  nonprofit operators with limited time.
- Be marked `DRAFT — internal review required` at the top.

## Running the Team (manual orchestration, until automated)

A connectNPO operator runs the team by hand, one agent at a time, in the
order above. For each agent:

1. Open Claude Code in this repo.
2. Run the agent with the exported agent packet JSON path as input.
3. Save the agent's artifact under
   `working/<organization_id>/<artifact-name>` (working tree only; not
   committed).
4. Pass that artifact path to the next agent.

When automation arrives, the same artifact shapes from
[docs/REPORT_AGENT_OUTPUT_SCHEMA.md](./REPORT_AGENT_OUTPUT_SCHEMA.md) are
the contract between stages, so no rewrite is needed.

## Out of Scope (still)

- Any change to database schema. The proposed `research_findings` table
  in [docs/REPORT_AGENT_WORKFLOW.md](./REPORT_AGENT_WORKFLOW.md) is still
  proposed only.
- Any new dashboard pages.
- Any automatic generation of reports.
- Any outbound delivery (email, Slack, webhooks).
- Any data ingestion outside the agent packet JSON.

## Version

- Plan version: 0.1
- Owner: connectNPO operations
