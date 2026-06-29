# Growth Readiness Report — Internal Template

Internal template used by connectNPO operators and the report-writer
agent to draft a Growth Readiness Report for one nonprofit
organization.

This file is a **template**, not a finished report. It defines the
sections, the per-item format, the allowed evidence labels, and the
writing rules. No specific organization facts are encoded here.
Anywhere a real report would name an organization, this template uses
`{{organization_name}}` or a short placeholder in square brackets.

The report follows the same fourteen categories as the intake form, in
the same order the nonprofit answered them. The intent is that a
reader of the report can scan it next to their own intake responses
without translating between two different layouts.

Tone is public-facing English: warm, plain, practical, and grounded in
evidence. The report is read by nonprofit leaders, not by engineers.
It is supportive but honest, and avoids generic praise.

---

## How to Use This Template

1. Copy this file into a working draft. Do not edit the template
   itself.
2. Fill each section using only:
   - the organization's own intake answers, or
   - public, citable sources the operator can re-open in a browser.
3. For every analysis item, use the repeatable item format below.
4. Leave the **Status** field blank only if you have not yet looked.
   Never guess a status.
5. Keep the fourteen intake-category sections in order, even when a
   section has no findings yet — note "no material items" rather than
   deleting the heading.
6. Treat the draft as internal until a connectNPO human reviewer signs
   off. See [Writing Rules](#writing-rules).

---

## Repeatable Item Format

Every finding inside an analysis section uses this five-field block.
One claim per block. Do not bundle multiple claims into one item.

```
### [Short, specific item title]

- **Status:** <one of the allowed statuses>
- **Evidence / Source URL:** <intake question id, or a full public URL, or "N/A — not found">
- **Finding:** <plain-language statement of what was observed. One sentence
  preferred, two at most. No interpretation here.>
- **Recommendation:** <one concrete next step the nonprofit could take.
  Optional. Leave blank if no useful next step exists yet.>
- **Priority:** <High | Medium | Low>
```

### Allowed Statuses

Use exactly one of these values in the **Status** field. Do not invent
new ones.

- `Found in intake` — the claim restates something the nonprofit told
  us in their intake form.
- `Found on website` — the claim is visible on a page on the
  nonprofit's own website that the nonprofit listed in intake.
- `Found in public source` — the claim is visible on a public page
  outside the nonprofit's own site (e.g., a public program directory
  the nonprofit themselves linked us to).
- `Not found` — the operator looked for this signal in the expected
  place and it was not there. Record where you looked in **Evidence /
  Source URL**.
- `Needs confirmation` — the signal might exist but the operator could
  not verify it from the sources available. The finding does not go
  into a final report until a human confirms.

### Priority Guidance

- **High** — affects donor trust, legal-adjacent claims, or blocks a
  near-term grant or funder ask.
- **Medium** — meaningful improvement but not blocking.
- **Low** — polish, nice-to-have, or future phase.

---

## Writing Rules

These rules apply to every section. They override stylistic preference.

1. **No invented claims.** If there is no intake answer and no public
   source URL backing the statement, do not write it.
2. **No legal, tax, accounting, grant-eligibility, HR, or compliance
   advice.** This applies most strongly to Sections 12 (Accounting &
   Financial Operations) and 13 (Grant Readiness). Restate what the
   intake or public source says, and route any open question to
   **Human Review Flags & Missing Information** with a one-sentence
   note recommending a qualified professional.
3. **Cite source URLs for any public claim.** If the finding describes
   something visible on the open web, the **Evidence / Source URL**
   field must contain a real, openable URL.
4. **Draft only until human review.** Every report produced from this
   template is a draft. A connectNPO human reviewer must sign off
   before it is shared with the nonprofit. Mark the working file as
   `DRAFT` until sign-off. Test / sample reports must additionally
   carry an explicit "test/sample — human review draft" notice at the
   top.
5. **Plain language.** Prefer short sentences. Avoid jargon. If a
   technical term is unavoidable, define it in one short clause.
6. **Supportive, not flattering.** Praise is only useful when it is
   specific and tied to evidence. Avoid generic openers like "You are
   doing amazing work."
7. **No sensitive data.** Do not restate or repeat EIN, bank details,
   donor names, employee names, private financials, or anything from a
   document the nonprofit did not publish themselves.
8. **One claim per item.** If you find two things, write two items.
9. **Show your work.** Every section's items should be reproducible
   from the Evidence Log appendix.
10. **Keep the intake-category order.** The fourteen analysis sections
    appear in the order the nonprofit answered them in intake — do not
    re-sort by importance.

---

## 1. Overall Overview

A short, plain-language overview written **after** the analysis
sections are filled in, not before. Three to seven sentences. Names
the organization, restates what they said they do, and explains the
headline diagnosis the report will support. End with one sentence
stating what the rest of the report will walk through (the fourteen
intake categories, then an overall result and plan).

No new claims appear here — every point must already exist in a later
section.

**Example wording (placeholder org):**

> {{organization_name}} is a small community-focused nonprofit serving
> [population] in [region], based on what the team shared in intake.
> Their website states the mission clearly and offers a working
> donation path. The headline diagnosis is that the organization is
> not held back by a missing mission story — it is held back by
> uneven donor and volunteer pathways around that story. The rest of
> this report walks the fourteen intake categories and ends with a
> practical 30-day and 90-day plan.

Do not write this section until the rest of the report is filled in.

---

## 2. Organization Profile

Fed by intake section `organization_basics`. Restate the
organization's name, public website, geographic base, primary service
area, and primary focus category exactly as the team answered. Do not
reclassify their category. If a field is blank in intake, note it.

Use the repeatable item format for any finding that needs evidence
beyond a simple restatement (for example, if the website URL in
intake does not match what is publicly resolvable).

---

## 3. Mission & Community

Fed by intake section `mission_community` plus any verified website
findings that confirm mission language or community served. Restate
the mission, the primary community served, and the team's
self-identified priority audience.

Use the repeatable item format for each verified observation.

---

## 4. Programs & Services

Fed by intake section `programs_services` plus verified findings that
describe how programs run, who they serve, or how participants engage.

Use the repeatable item format. Keep the description grounded in what
the nonprofit told us about delivery method and rough scale — do not
infer program design from the website alone.

---

## 5. Goals & Growth Priorities

Fed by intake section `current_goals`. Restate the team's stated
priorities for the next 6–12 months, their definition of meaningful
growth, and their success indicators.

Do not introduce growth goals the team did not name.

---

## 6. Current Challenges

Fed by intake section `challenges`. Restate the biggest constraints
the team named, the recurring tasks that consume time, and where
outside help would matter most.

Note any verified findings that line up with — or quietly contradict
— what the team said. Quiet contradictions belong in **Human Review
Flags & Missing Information**, not here, unless they are well
supported.

---

## 7. Website & Digital Presence

Fed by intake section `website_digital_presence` plus verified
findings in categories `website_clarity`, `seo`, and `geo_ai_search`.

SEO and AI-search readiness live here in the new structure. Use the
repeatable item format. Keep SEO recommendations small and concrete —
generic SEO advice scales badly.

Suggested signals to consider when findings support them:

- The homepage clearly states who the organization is and what they do
  above the fold.
- A clear primary call to action exists (donate, volunteer, contact).
- Navigation labels are obvious to a non-staff reader.
- The homepage `<title>` and meta description read like sentences a
  human would write.
- Key facts are in plain text, not only in images or PDFs (so AI
  summarizers can lift them).
- Any public profile the nonprofit linked us to matches the language
  on their own site.

---

## 8. Donor & Supporter Readiness

Fed by intake section `donor_supporter_readiness` plus verified
findings in category `donor_trust`. Restate whether online donations
are accepted, the experience of the donation page, monthly giving
posture, and supporter communication cadence.

Use the repeatable item format. Where intake describes a process (for
example, manual thank-yous) and findings confirm or contradict it,
write both as separate items.

---

## 9. Volunteer Readiness

Fed by intake section `volunteer_readiness` plus verified findings in
category `volunteer_readiness`. Restate whether volunteers are used,
how they sign up, and what volunteer help would matter most.

Use the repeatable item format.

---

## 10. Trust & Transparency Signals

Fed by intake section `trust_transparency` plus verified findings in
category `transparency`.

Do **not** comment on filings, audits, or compliance status that
require a tax-advisor judgment. Point at the relevant public resource
and recommend the nonprofit confirm with a qualified professional. See
[Writing Rules](#writing-rules) item 2.

---

## 11. Content & Messaging

Fed by intake section `content_messaging` plus verified findings in
category `content_messaging`. Restate message clarity, who owns
content creation, target audiences for content, the content types the
team wants to improve, and the cadence they would like.

---

## 12. Accounting & Financial Operations

Fed by intake section `accounting_operations`.

**Do not give legal, tax, or accounting advice in this section.**
Restate who manages bookkeeping, whether books are monthly, and the
team's self-rated confidence around financial transparency for
grants. If the team named a specific topic (catching up books,
restricted funds, Form 990 timing, etc.), restate the topic and add a
human-review flag recommending a qualified bookkeeper, CPA, or
accountant. The flag also belongs in **Human Review Flags & Missing
Information**.

---

## 13. Grant Readiness

Fed by intake section `grant_readiness` plus verified intake-sourced
findings only.

**Do not assess eligibility, deadlines, or specific funder fit.**
Restate whether the organization currently receives grants, the
team's stated timeline for applying, what would make them feel more
ready, and what feels hardest about grants right now.

If a question arises that requires eligibility or funder-specific
judgment, restate the question and add a one-sentence flag
recommending a qualified grants advisor or the funder directly.

---

## 14. Operations & Automation Opportunities

Fed by intake section `operations_automation` plus verified findings
in category `operations_automation`. Restate the tools the team
already uses, the manual tasks they want to simplify, the automation
ideas they marked as useful, their willingness, and team size.

Each recommendation should name the specific manual step it would
replace. Avoid recommending a tool the org did not ask about unless
the benefit is obvious and the cost is low.

---

## 15. Final Context

Fed by intake section `final_context`. Restate, in the team's own
words where possible, anything else they wanted us to understand and
what they are most hoping connectNPO can help them improve.

This is not a place to add new claims — it is the section where the
team's framing closes the analysis.

---

## 16. Overall Result & Practical Plan

The closing section of the report. Four sub-blocks, in this order.

### Overall result

One short paragraph (three to five sentences) restating the diagnosis
as a practical takeaway for the operator. No new claims; this is the
plain-language version of the Executive Overview, written for the
person who is about to act on the report.

### Where to focus first / what can wait

A short bulleted list with two parts:

- **Focus first** — the one to three areas the report recommends
  treating as the primary work, drawn from
  `strategic_diagnosis.primary_focus` (or equivalent).
- **What can wait** — the items the report explicitly recommends
  delaying, drawn from `strategic_diagnosis.what_can_wait` (or
  equivalent).

Each bullet should name the intake category it ties back to.

### 30-day direction

Three to five concrete actions drawn from `priority_for_30_day` in the
readiness assessment. Each action should:

- Reference the intake category section it comes from (by name).
- Be small enough that a non-technical staff member can do it or
  commission it.
- Have a clear "done when" condition.

### 90-day direction

Three to five actions for the next quarter, drawn from
`priority_for_90_day`. Same format as the 30-day block. These can be
larger than the 30-day items but should still be specific and tied to
intake categories.

Do not pad either list. Fewer real actions beats a long generic list.

---

## 17. Recommended connectNPO Next Services

Exactly mirrors `recommended_connectnpo_services` in the readiness
assessment. If that array is empty, omit this section. Do not invent
a reason to recommend a service.

---

## 18. Human Review Flags & Missing Information

A bulleted list of things the operator could not verify from intake or
public sources, plus every legal / tax / accounting /
grant-eligibility / HR / compliance topic that came up in any
section. Each bullet should name:

- the question we still have,
- where we looked,
- what the nonprofit could share (or confirm) to resolve it,
- which qualified professional should weigh in if the topic is
  regulated.

This is the polite handoff back to the nonprofit. It is the only
place in the report where it is appropriate to ask the nonprofit a
direct question.

**Example wording (placeholder):**

> - We could not confirm whether the volunteer signup form sends a
>   confirmation email. Looked at [https://example.org/volunteer].
>   Could you confirm what happens after a signup is submitted?
> - The Accounting & Financial Operations section mentioned Form 990
>   preparation timing. We did not give an answer here — please
>   confirm timing with your bookkeeper or CPA.

---

## 19. Appendix: Evidence Log

A full list of every source consulted while writing the report. This
is the reproducibility backbone of the report — anyone re-reading it
should be able to re-open the same sources.

Suggested columns / fields:

- **Source URL or intake reference** — full URL, or
  `intake:<section_key>.<question_key>`.
- **Date reviewed** — `YYYY-MM-DD`.
- **What it supported** — the section + item title(s) that cite this
  source.
- **Notes** — short note if the page was unstable, partially loaded,
  or later moved.

Every public-claim item in sections 2–14 must point at a row in this
log. If a source is not in the log, the claim cannot stay in the
report.

---

## Status Legend (quick reference)

| Status | Use when |
| --- | --- |
| Found in intake | The nonprofit told us this in their intake form. |
| Found on website | Visible on a page the nonprofit listed in intake. |
| Found in public source | Visible on a public page the nonprofit linked us to. |
| Not found | We looked in the expected place and it was not there. |
| Needs confirmation | Might exist; could not verify without asking the nonprofit. |

---

## Intake Category Order (Quick Reference)

The fourteen analysis sections follow the intake form exactly:

1. Organization Profile
2. Mission & Community
3. Programs & Services
4. Goals & Growth Priorities
5. Current Challenges
6. Website & Digital Presence
7. Donor & Supporter Readiness
8. Volunteer Readiness
9. Trust & Transparency Signals
10. Content & Messaging
11. Accounting & Financial Operations
12. Grant Readiness
13. Operations & Automation Opportunities
14. Final Context

Keep this order even when a category has no material findings. Write
a single short sentence in that case rather than removing the
heading.

---

## Template Version

- Template version: 0.2 (intake-category order)
- Owner: connectNPO operations
- Related planning doc: [docs/REPORT_AGENT_WORKFLOW.md](./REPORT_AGENT_WORKFLOW.md)
