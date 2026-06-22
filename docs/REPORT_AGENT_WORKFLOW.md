# Growth Readiness Report — Agent Workflow (Planning)

Internal planning document for the next phase after MVP intake. This is a
design proposal. No schema changes, app code, or env updates are implied by
this file. Nothing here is wired up yet.

## Purpose

Define how connectNPO will turn a completed intake packet into a Growth
Readiness Report using a small set of cooperating agents, with humans on the
critical path. The workflow is **evidence-first**: nothing enters a draft
report unless it is grounded in either (a) the nonprofit's own intake
answers or (b) a public, citable source that a human can re-open.

## Non-Goals (still)

- No AI report generation shipped to customers in MVP.
- No file uploads or sensitive document ingestion.
- No automatic outbound delivery of drafts.
- No collection of EIN, bank info, donor lists, 990 uploads, employee
  records, or other restricted data.

## Workflow Overview

```
intake packet  →  research pass  →  fact-check log  →  human review  →  draft report
   (admin)         (research        (fact-check         (connectNPO       (writer
                    agent)           agent)             operator)         agent)
```

Each arrow is a gated handoff. A stage cannot advance until the prior stage
has produced a structured artifact the next stage can read.

### 1. Intake Packet

- Source of truth: existing `organizations` + `intake_responses` rows for
  the org, status `ready_for_report`.
- Exported as the JSON packet already produced by the MVP (the "Growth
  Readiness Agent Packet").
- Contains only what the nonprofit told us. No outside claims yet.

### 2. Website / Public Research Pass

- A research agent reads the packet and visits only URLs the nonprofit
  itself provided (website, public socials, public program pages).
- Output is a list of **findings** written to the proposed
  `research_findings` table (see below), each one tied to a source URL.
- The agent does not guess. If a fact is not visible on a public page, it
  is recorded with `needs_confirmation = true` and no claim is made.

### 3. Fact-Check Log

- A second agent re-reads every finding and confirms the source URL still
  supports the claim verbatim or near-verbatim.
- Findings that pass fact-check get `workflow_status = 'verified'`.
- Findings that fail get `workflow_status = 'rejected'` with a short reason; they
  do not propagate into the draft.
- Findings that are plausible but unconfirmed stay `evidence_status = 'needs_confirmation'`
  and route to the human reviewer.

### 4. Human Review

- A connectNPO operator opens the research log for the org.
- They confirm, reject, or rewrite each `needs_confirmation` finding,
  setting `reviewed_by_human = true` and stamping their user id.
- Only `workflow_status = 'verified'` + `reviewed_by_human` findings are eligible for the
  draft.

### 5. Draft Report

- The writer agent composes a draft using **only** eligible findings plus
  the nonprofit's own intake answers.
- Output is a draft, not a sent report. A QA agent does a final pass for
  tone, accuracy against the log, and safety rules.
- A human always presses "send." There is no auto-delivery.

## Proposed Table: `research_findings` (NOT APPLIED)

Proposed only. Do not run this SQL. No migration exists yet. Listed here so
the team can react to the shape before we commit to it.

```sql
-- PROPOSED — not applied. Do not run.
create table if not exists public.research_findings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  category text not null,
  workflow_status text not null default 'draft',
  evidence_status text not null default 'needs_confirmation',
  evidence_url text,
  finding text not null,
  recommendation text,
  priority text,
  needs_confirmation boolean not null default true,
  reviewed_by_human boolean not null default false,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_by_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Field Definitions

| Field | Purpose |
| --- | --- |
| `category` | Bucket the finding belongs to: `website_clarity`, `donor_trust`, `seo_geo`, `grant_readiness`, `automation_opportunities`, `transparency`, `other`. |
| `workflow_status` | Internal lifecycle: `draft`, `needs_review`, `verified`, `rejected`. |
| `evidence_status` | Evidence label used in reports: `found_in_intake`, `found_on_website`, `found_in_public_source`, `not_found`, `needs_confirmation`. |
| `evidence_url` | Public source URL backing the finding. Required when `evidence_status` is `found_on_website` or `found_in_public_source`. Empty allowed only when the finding restates an intake answer or records something not found. |
| `finding` | Plain-language statement of what was observed. One claim per row. |
| `recommendation` | Optional suggested next step connectNPO might offer. |
| `priority` | `high`, `medium`, `low`. Operator may override. |
| `needs_confirmation` | True until a human or the fact-check agent verifies the claim. |
| `reviewed_by_human` | True once a connectNPO operator signs off. Drafts may only cite rows where this is true. |

### Suggested Status Transitions

```
draft → needs_review → verified
draft → needs_review → rejected
verified → needs_review   (re-opened by human)
```

### Suggested Indexes (proposed)

```sql
-- PROPOSED — not applied.
create index if not exists research_findings_org_idx
  on public.research_findings (organization_id);
create index if not exists research_findings_workflow_status_idx
  on public.research_findings (workflow_status);
create index if not exists research_findings_evidence_status_idx
  on public.research_findings (evidence_status);
create index if not exists research_findings_category_idx
  on public.research_findings (category);
```

## Future Agent Roles

These are role definitions, not deployed agents. Each one has a narrow job
and a single output type. No agent writes directly to customer-facing
surfaces.

### `connectnpo-research-agent`

- Input: intake packet JSON for one organization.
- Allowed sources: URLs the nonprofit listed in their own intake.
- Output: rows in `research_findings` with `workflow_status = 'draft'` and
  `needs_confirmation = true`.
- Hard rules: never invent a fact; never visit a URL the nonprofit did
  not provide; never store personal data found incidentally.

### `connectnpo-fact-check-agent`

- Input: `draft` findings for one organization.
- Job: re-open each `evidence_url` and confirm the source still supports
  the claim.
- Output: updates `workflow_status` to `verified`, `rejected`, or `needs_review`,
  with a short reason note.
- Hard rules: if the source page is gone, set `rejected` — do not search
  for a replacement source on the writer's behalf.

### `connectnpo-report-writer-agent`

- Input: only findings where `workflow_status = 'verified'` and
  `reviewed_by_human = true`, plus the org's intake answers.
- Output: a draft Growth Readiness Report, stored as a draft artifact,
  never sent.
- Hard rules: every claim in the draft must trace back to either an
  intake answer or a verified finding. No filler. No invented stats.

### `connectnpo-qa-review-agent`

- Input: the draft report plus the eligible findings.
- Job: check tone, check that every claim has a backing row, flag
  anything that looks like a sensitive-data leak or an unsupported
  recommendation.
- Output: a QA note attached to the draft. A human signs off before
  anything leaves connectNPO.

## Safety Rules (apply to every agent)

1. **No invented claims.** If there is no intake answer and no source
   URL, the agent does not make the statement.
2. **No auto-send.** Drafts stay internal until a human explicitly sends
   them. No agent has email, Slack, or webhook send rights.
3. **Avoid sensitive data.** Agents must not request, store, or restate
   EIN, bank info, donor PII, employee records, private financials, or
   uploaded documents. If such data appears, drop it and flag.
4. **Source URLs required for public claims.** Any finding describing
   something on the open web must carry an `evidence_url`. Findings
   without a URL are treated as restatements of intake answers only.
5. **Stay inside the nonprofit's stated surface.** Do not crawl beyond
   URLs the nonprofit listed. No guessing at adjacent domains.
6. **Human review is load-bearing.** `reviewed_by_human` is the only gate
   that lets a finding reach the writer. Agents may not flip this field.
7. **Cite once, cite plainly.** One claim per finding row, one URL per
   claim. Do not bundle.

## Implementation Order (when we are ready)

1. Land the `research_findings` table as a real migration (separate PR,
   reviewed against this doc).
2. Build an admin view to read/edit findings per org.
3. Wire the research agent in a sandbox, writing only `draft` rows.
4. Add the fact-check agent.
5. Add the human review UI gate.
6. Add the writer agent producing internal draft artifacts.
7. Add the QA agent and the human send step.

Each step ships behind admin-only routes. None of this is exposed to the
public intake flow.

## Open Questions

- Where do draft reports live — a new `reports` table, or object storage?
- Do we want per-finding comment threads for the human reviewer, or is a
  single `recommendation` field enough at first?
- Should `priority` be agent-assigned or operator-only?
- How do we represent "the nonprofit told us X but their website says Y"
  conflicts — two rows, or one row with both sides?

These are intentionally left open. Decide before the migration PR.
