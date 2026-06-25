# Report Agent Output Schema — Inter-Agent Contracts

The shapes each agent in the Growth Readiness Report team produces and
consumes. This is the contract between stages described in
[docs/REPORT_AGENT_TEAM_PLAN.md](./REPORT_AGENT_TEAM_PLAN.md).

These are JSON shapes for inter-agent handoff. The **final** report is
Markdown (see
[docs/GROWTH_READINESS_REPORT_TEMPLATE.md](./GROWTH_READINESS_REPORT_TEMPLATE.md))
and is produced by `report-writer` from the JSON artifacts below.

No database table is created from these shapes. They live in a local
`working/<organization_id>/` directory during a run.

---

## Shared Field Conventions

Across every artifact:

- `evidence_status` is one of:
  `"found_in_intake"`, `"found_on_website"`, `"found_in_public_research"`,
  `"missing"`, `"needs_confirmation"`.
  The final report renders these as: `Found in intake`, `Found on
  website`, `Found in public research`, `Missing`, `Needs confirmation`.
- `category` is one of: `"website_clarity"`, `"donor_trust"`,
  `"volunteer_readiness"`, `"transparency"`, `"content_messaging"`,
  `"seo"`, `"geo_ai_search"`, `"grant_readiness"`,
  `"operations_automation"`, `"other"`.
- `priority` is one of: `"high"`, `"medium"`, `"low"`.
- `source` on a finding is either:
  - `{ "type": "intake", "question_key": "<key>", "question_label":
    "<label>" }`, or
  - `{ "type": "website", "url": "<https://…>" }`, or
  - `{ "type": "public_research", "url": "<https://…>" }`, or
  - `{ "type": "not_found", "where_checked": "<text>" }`.
- Timestamps are ISO 8601 (`YYYY-MM-DDTHH:MM:SSZ`).
- Every artifact carries `organization_id` (UUID string) and `run_id`
  (any string the orchestrator chooses; reused across the whole run).

---

## 1. `intake_summary.json` — produced by `intake-analyst`

A compressed read of the agent packet. No outside claims.

```json
{
  "schema": "intake_summary.v1",
  "run_id": "string",
  "organization_id": "uuid",
  "organization_name": "string",
  "website_urls": ["https://…"],
  "public_urls": ["https://…"],
  "answered_question_count": 0,
  "missing_question_keys": ["string"],
  "goals": ["string"],
  "pain_points": ["string"],
  "missing_context": ["string"],
  "risks": ["string"],
  "report_angles": ["string"],
  "sensitive_data_flags": ["string"]
}
```

Field notes:

- `report_angles` are short phrases the writer can use as a starting
  point (e.g., `"donor trust is the limiting factor"`). Each angle must
  be defensible from intake alone.
- `sensitive_data_flags` lists any field the analyst chose to drop (e.g.,
  `"contact_email present — will not restate in report"`).

---

## 2. `findings_list` shape — produced by `website-researcher` and
       `seo-geo-analyst`

Both researcher agents produce the same shape, just with different
sources. The artifacts are:

- `website_findings.json` (from `website-researcher`)
- `seo_geo_findings.json` (from `seo-geo-analyst`)

```json
{
  "schema": "findings_list.v1",
  "run_id": "string",
  "organization_id": "uuid",
  "agent": "website-researcher | seo-geo-analyst",
  "sources_checked": [
    {
      "url": "https://…",
      "what_was_checked": "string",
      "checked_at": "2026-06-23T00:00:00Z"
    }
  ],
  "findings": [
    {
      "id": "string",
      "category": "website_clarity | donor_trust | …",
      "evidence_status": "found_in_intake | found_on_website | found_in_public_research | missing | needs_confirmation",
      "source": { "type": "…", "url": "…", "question_key": "…" },
      "finding": "one-sentence factual observation",
      "recommendation": "one concrete next step or null",
      "priority": "high | medium | low",
      "notes": "optional short note"
    }
  ],
  "research_limitations": ["string"]
}
```

Rules:

- One claim per finding. No bundling.
- `source.url` is required when `evidence_status` is `found_on_website`
  or `found_in_public_research`.
- `evidence_status: missing` requires `source.type: not_found` with a
  `where_checked` string.
- `evidence_status: needs_confirmation` requires either a `source.url`
  the agent could not verify, or a `where_checked` string.
- `research_limitations` notes anything the agent could not check (e.g.,
  `"claude-seo plugin not installed; fell back to manual review"`).

---

## 3. `fact_check_log.json` — produced by `fact-checker`

Every upstream finding gets exactly one row.

```json
{
  "schema": "fact_check_log.v1",
  "run_id": "string",
  "organization_id": "uuid",
  "rows": [
    {
      "finding_id": "string",
      "category": "string",
      "workflow_status": "verified | rejected | needs_review",
      "evidence_status": "found_in_intake | found_on_website | found_in_public_research | missing | needs_confirmation",
      "source": { "type": "…", "url": "…", "question_key": "…" },
      "finding": "string (kept verbatim from upstream)",
      "recommendation": "string or null",
      "priority": "high | medium | low",
      "reason": "short note explaining workflow_status decision",
      "checked_at": "2026-06-23T00:00:00Z"
    }
  ],
  "notes": "optional run-level notes"
}
```

Decision rules:

- `verified` — the upstream source still supports the claim.
- `rejected` — the source no longer supports the claim, or the URL is
  gone. Do not search for a replacement source.
- `needs_review` — the source is reachable but the claim is ambiguous
  from it alone. Route to the human reviewer via the QA note.
- The fact-checker never invents new findings. Its only outputs are
  rows that mirror upstream finding IDs.

---

## 4. `readiness_assessment.json` — produced by
       `nonprofit-readiness-analyst`

Synthesizes the intake summary, verified findings, expert knowledge,
and the strategy diagnosis framework into a prioritized readiness
picture.

```json
{
  "schema": "readiness_assessment.v1",
  "run_id": "string",
  "organization_id": "uuid",
  "strategic_diagnosis": {
    "stated_goal": "string or null",
    "public_facing_strengths": ["string"],
    "main_growth_blocker": "string or null",
    "main_readiness_gap": "string or null",
    "recommended_primary_focus": "website_clarity | messaging_positioning | donor_readiness | volunteer_readiness | trust_transparency | seo_geo | content_strategy | grant_readiness | program_impact | financial_compliance_readiness | operations_automation | needs_confirmation",
    "why_this_focus_first": "one or two sentences tied to supporting findings",
    "what_can_wait": ["string"],
    "capacity_assumption": "string or null",
    "confidence": "high | medium | low",
    "supporting_finding_ids": ["string"],
    "human_review_flags": ["string"]
  },
  "themes": [
    {
      "theme": "website_clarity | messaging_positioning | donor_readiness | volunteer_readiness | trust_transparency | seo_geo | content_strategy | grant_readiness | program_impact | financial_compliance_readiness | operations_automation",
      "current_state": "strength | developing | gap | risk_needs_review | needs_confirmation",
      "priority": "high | medium | low | needs_confirmation",
      "summary": "two-to-three sentence plain-language summary",
      "strengths": ["string"],
      "gaps": ["string"],
      "supporting_finding_ids": ["string"],
      "priority_for_30_day": ["string"],
      "priority_for_90_day": ["string"]
    }
  ],
  "recommended_connectnpo_services": [
    {
      "service": "string (e.g., 'website clarity engagement')",
      "why": "one sentence tied to supporting findings",
      "supporting_finding_ids": ["string"]
    }
  ],
  "open_questions": ["string"]
}
```

Rules:

- `strategic_diagnosis` names the main focus first; it is the source for
  the final report's Executive Summary and top priorities.
- Every entry in `strategic_diagnosis.supporting_finding_ids`,
  `strengths`, `gaps`, `priority_for_30_day`, and
  `priority_for_90_day` must trace back to at least one
  `supporting_finding_ids` row whose `workflow_status` is `verified` —
  or to an explicit intake-source finding.
- `recommended_connectnpo_services` is empty by default. Only fill it
  when the supporting findings clearly point at the service.
- `open_questions` are short prompts the human reviewer can ask the
  nonprofit. They become the report's "Missing / Needs Confirmation"
  section.

---

## 5. `draft_report.md` — produced by `report-writer`

Markdown only. Shape and section order follow
[docs/GROWTH_READINESS_REPORT_TEMPLATE.md](./GROWTH_READINESS_REPORT_TEMPLATE.md).
Required at the top:

```md
# Growth Readiness Report — DRAFT

Organization: <organization_name>
Prepared by: connectNPO
Human review status: Required before sharing externally
```

Required sections in the draft (in this order):

1. Executive Summary (write last; no new claims)
2. Evidence Snapshot
3. Website Clarity
4. Donor Trust
5. Volunteer Readiness
6. Transparency Signals
7. SEO Readiness
8. GEO / AI Search Readiness
9. Grant Readiness
10. Operations & Automation Opportunities
11. Missing / Needs Confirmation
12. 30-Day Action Plan
13. 90-Day Action Plan
14. Recommended connectNPO Next Services (only if supported)
15. Appendix: Evidence Log

Per-item format inside analysis sections is the five-field block from
the template:

```md
### <Short item title>

- **Status:** <Found in intake | Found on website | Found in public research | Missing | Needs confirmation>
- **Evidence / Source URL:** <openable URL, or intake:<question_key>, or "Looked at <URL> on <YYYY-MM-DD>">
- **Finding:** <one factual observation>
- **Recommendation:** <one concrete next step, or N/A>
- **Priority:** <High | Medium | Low>
```

---

## 6. `qa_review.md` and optional `revision_notes.json` — produced by
       `qa-reviewer`

`qa_review.md` is a short Markdown note for the human operator:

```md
# QA Review — Growth Readiness Report DRAFT

Organization: <organization_name>
Reviewer: qa-reviewer agent
Reviewed at: <YYYY-MM-DD>

## Verdict

<ready_for_human_review | needs_revisions>

## Evidence Checks

- Every public claim cites a URL: yes | no — examples
- Every intake claim cites a question_key: yes | no — examples
- No legal/tax/compliance advice present: yes | no — examples
- No sensitive data restated: yes | no — examples
- Recommendations are concrete and small: yes | no — examples

## Tone Checks

- Warm, plain, supportive: yes | no — examples
- Avoids generic praise: yes | no — examples
- Avoids generic SaaS recommendations: yes | no — examples

## Action Plans

- 30-day actions tie to High/Medium items: yes | no
- 90-day actions tie to High/Medium items: yes | no

## Notes for the human operator

- <short bullets, including any Needs confirmation items that must be
  resolved with the nonprofit before sending>
```

If the verdict is `needs_revisions`, the QA agent also writes
`revision_notes.json`:

```json
{
  "schema": "revision_notes.v1",
  "run_id": "string",
  "organization_id": "uuid",
  "revisions": [
    {
      "section": "string (e.g., 'Donor Trust')",
      "item_title": "string",
      "issue": "string",
      "suggested_fix": "string"
    }
  ]
}
```

`report-writer` re-runs against `revision_notes.json` plus the upstream
artifacts. It does **not** introduce new sources at the revision step.

---

## Versioning

Each schema name carries a version suffix (e.g., `findings_list.v1`).
Bump the suffix when a field is renamed or removed. Adding optional
fields does not require a bump.

- Schema doc version: 0.1
- Owner: connectNPO operations
