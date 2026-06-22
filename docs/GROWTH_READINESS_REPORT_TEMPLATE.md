# Growth Readiness Report — Internal Template

Internal template used by connectNPO operators and the future report writer
agent to draft a Growth Readiness Report for one nonprofit organization.

This file is a **template**, not a finished report. It defines the sections,
the per-item format, the allowed evidence labels, and the writing rules. No
specific organization facts are encoded here. Anywhere a real report would
name an organization, this template uses `{{organization_name}}` or a short
placeholder in square brackets.

Tone is public-facing English: warm, plain, practical, and grounded in
evidence. The report is read by nonprofit leaders, not by engineers. It is
supportive but honest, and avoids generic praise.

---

## How to Use This Template

1. Copy this file into a working draft. Do not edit the template itself.
2. Fill each section using only:
   - the organization's own intake answers, or
   - public, citable sources the operator can re-open in a browser.
3. For every analysis item, use the repeatable item format below.
4. Leave the **Status** field blank only if you have not yet looked. Never
   guess a status.
5. Treat the draft as internal until a connectNPO human reviewer signs off.
   See [Writing Rules](#writing-rules).

---

## Repeatable Item Format

Every finding inside an analysis section uses this five-field block. One
claim per block. Do not bundle multiple claims into one item.

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

Use exactly one of these values in the **Status** field. Do not invent new
ones.

- `Found in intake` — the claim restates something the nonprofit told us in
  their intake form.
- `Found on website` — the claim is visible on a page on the nonprofit's own
  website that the nonprofit listed in intake.
- `Found in public source` — the claim is visible on a public page outside
  the nonprofit's own site (e.g., a public program directory the nonprofit
  themselves linked us to).
- `Not found` — the operator looked for this signal in the expected place
  and it was not there. Record where you looked in **Evidence / Source URL**.
- `Needs confirmation` — the signal might exist but the operator could not
  verify it from the sources available. The finding does not go into a
  final report until a human confirms.

### Priority Guidance

- **High** — affects donor trust, legal-adjacent claims, or blocks a
  near-term grant or funder ask.
- **Medium** — meaningful improvement but not blocking.
- **Low** — polish, nice-to-have, or future phase.

---

## Writing Rules

These rules apply to every section. They override stylistic preference.

1. **No invented claims.** If there is no intake answer and no public source
   URL backing the statement, do not write it.
2. **No legal, tax, or accounting advice.** Do not tell a nonprofit whether
   they qualify for a status, deduction, or filing. Point at the relevant
   public resource and recommend they confirm with a qualified professional.
3. **Cite source URLs for any public claim.** If the finding describes
   something visible on the open web, the **Evidence / Source URL** field
   must contain a real, openable URL.
4. **Draft only until human review.** Every report produced from this
   template is a draft. A connectNPO human reviewer must sign off before it
   is shared with the nonprofit. Mark the working file as `DRAFT` until
   sign-off.
5. **Plain language.** Prefer short sentences. Avoid jargon. If a technical
   term is unavoidable, define it in one short clause.
6. **Supportive, not flattering.** Praise is only useful when it is specific
   and tied to evidence. Avoid generic openers like "You are doing amazing
   work."
7. **No sensitive data.** Do not restate or repeat EIN, bank details, donor
   names, employee names, private financials, or anything from a document
   the nonprofit did not publish themselves.
8. **One claim per item.** If you find two things, write two items.
9. **Show your work.** Every section's items should be reproducible from the
   Evidence Log appendix.

---

## 1. Executive Summary

A short, plain-language overview written **after** the analysis sections are
filled in, not before. Three to six sentences. Names the organization, what
they told us they do, and the two or three highest-impact opportunities the
report will recommend. No new claims appear here — every point must already
exist in a later section.

**Example wording (placeholder org):**

> {{organization_name}} is a small community-focused nonprofit serving
> [population] in [region], based on what the team shared in intake. Their
> website clearly states their mission and offers a working donation path.
> The biggest near-term opportunities are clarifying how donations are used,
> adding a board / leadership page for donor trust, and tightening the
> homepage so first-time visitors can find the "how to help" path in one
> click. A detailed 30-day and 90-day action plan follows.

Do not write the executive summary until the rest of the report is filled
in.

---

## 2. Evidence Snapshot

A compact, scannable table or list summarizing what evidence the report is
built on. This is not analysis — it is a receipt.

Include:

- Intake submission date (from the intake record).
- Website URL(s) the nonprofit listed in intake.
- Public social profiles the nonprofit listed in intake.
- Any other public URLs the nonprofit listed (program directories, public
  partner pages, etc.).
- A count of intake questions answered vs. left blank.

**Example wording (placeholder org):**

> - Intake submitted: [YYYY-MM-DD]
> - Website reviewed: [https://example.org]
> - Public socials reviewed: [list any the nonprofit shared]
> - Other public sources reviewed: [list any the nonprofit linked]
> - Intake completeness: [X of Y core questions answered]

Do not include any source the nonprofit did not point us to.

---

## 3. Website Clarity

Is the website readable, focused, and oriented to a first-time visitor? Use
the repeatable item format for each finding.

Suggested items to check (each becomes its own item block if relevant):

- Mission statement is visible above the fold on the homepage.
- "What we do" is described in plain language without jargon.
- A clear primary call to action exists (donate, volunteer, contact).
- Navigation labels are obvious to a non-staff reader.
- Mobile layout is usable.
- Contact information is present and reachable.

**Example item (placeholder, illustrative):**

```
### Homepage mission statement is visible without scrolling

- **Status:** Found on website
- **Evidence / Source URL:** [https://example.org]
- **Finding:** The homepage opens with a one-line mission statement and a
  short supporting sentence above the fold.
- **Recommendation:** Keep the mission line; consider moving the donate
  button to the same band so visitors see purpose and action together.
- **Priority:** Low
```

---

## 4. Donor Trust

Signals that help a prospective donor decide whether to give. Use the
repeatable item format.

Suggested signals to check:

- Public statement of how donations are used.
- Named leadership or board page (no private details — only what the org
  has chosen to publish).
- Visible nonprofit / tax-status statement on the site (note: do **not**
  advise on tax law; just record whether the statement is present).
- Secure-looking donation flow (HTTPS, recognizable processor).
- Annual impact summary or recent program update.

**Example item (placeholder, illustrative):**

```
### Public "where your gift goes" explanation

- **Status:** Not found
- **Evidence / Source URL:** Looked on [https://example.org/donate] and
  [https://example.org/about] on [YYYY-MM-DD]; no breakdown found.
- **Finding:** The donation page accepts gifts but does not describe how
  funds are used.
- **Recommendation:** Add a short three-bullet "how your gift is used"
  block near the donate button.
- **Priority:** High
```

---

## 5. Volunteer Readiness

Is it easy for a willing stranger to volunteer? Use the repeatable item
format.

Suggested signals to check:

- A volunteer page exists and is linked from the main navigation.
- The page names real opportunities, not only a generic "get involved" form.
- A way to contact the volunteer coordinator (form, email, or scheduled
  signup).
- Expectations of volunteers (time, skills, location) are stated.

---

## 6. Transparency Signals

Public-facing signals that the organization operates in the open. Use the
repeatable item format.

Suggested signals to check:

- Named leadership on the website (names + roles only — do not pull personal
  info from elsewhere).
- A published annual or impact report, if the nonprofit has chosen to
  publish one.
- A clear privacy statement on forms that collect personal data.
- A working contact path (form, email, or phone).

Do **not** comment on filings, financials, or compliance status that
require a tax-advisor judgment. If the nonprofit asks, point them to the
relevant public resource and recommend they confirm with a qualified
professional. See [Writing Rules](#writing-rules) item 2.

---

## 7. SEO Readiness

Search-engine readability for a small nonprofit site. This is a practical,
non-exhaustive check, not a full SEO audit. Use the repeatable item format.

Suggested signals to check:

- The homepage has a descriptive `<title>` (e.g., "{{org_name}} — short
  description of what they do") rather than a default like "Home".
- The homepage has a meta description that reads like a sentence a human
  would write.
- Headings on key pages use real, descriptive text (not "Welcome").
- Image alt text is present on important images, where reasonable.
- Page URLs are readable (`/donate`, `/programs/tutoring`) rather than
  numeric IDs.

Keep recommendations small and concrete. SEO advice scales badly when it is
generic.

---

## 8. GEO / AI Search Readiness

How likely is this nonprofit to be represented accurately when a person
asks an AI assistant about them or about their cause? Use the repeatable
item format.

Suggested signals to check:

- The homepage clearly states who the organization is and what they do in a
  single readable paragraph (this is what AI summarizers tend to lift).
- Key facts (location served, population served, programs offered) are
  written in plain text on the site, not only in images or PDFs.
- The organization has a stable, canonical name used consistently across
  their own site and the public profiles they shared with us.
- Any public profile the nonprofit linked us to (e.g., a program directory
  they themselves listed) matches the language on their own site.

Do **not** speculate about how a specific AI model will rank or summarize
the org. Stick to whether the on-page facts are clear, consistent, and in
plain text.

---

## 9. Grant Readiness

Practical signals that the org is in a position to apply for grants. This
section gives orientation, not legal or compliance advice. Use the
repeatable item format.

Suggested signals to check:

- Mission and programs are described in plain language a grant reviewer
  could quote.
- The organization has a public way to demonstrate impact (a short story,
  a number, a recent update — whatever the org has chosen to publish).
- Contact information is current.
- The website does not contradict what the nonprofit said in intake.

If the nonprofit asks about specific grants, eligibility, or filings, do
**not** answer in the report. Recommend they consult a qualified grants
advisor or the funder directly. See [Writing Rules](#writing-rules) item 2.

---

## 10. Operations & Automation Opportunities

Where could light tooling save the team real hours? Use the repeatable item
format. Keep this grounded in what the nonprofit told us about their
day-to-day work in intake — not in generic SaaS recommendations.

Suggested signals to check:

- Intake mentions repetitive manual tasks (e.g., copy-pasting volunteer
  signups into a spreadsheet).
- Intake mentions tools that already exist but are underused.
- Intake mentions a communication bottleneck (e.g., one person answers all
  email).

Each recommendation should name the specific manual step it would replace.
Avoid recommending a tool the org did not ask about unless the benefit is
obvious and the cost is low.

---

## 11. Missing / Needs Confirmation

A bulleted list of things the operator could not verify from intake or
public sources. Each bullet should name:

- the question we still have,
- where we looked,
- what the nonprofit could share (or confirm) to resolve it.

This is the polite handoff back to the nonprofit. It is the only place in
the report where it is appropriate to ask the nonprofit a direct question.

**Example wording (placeholder):**

> - We could not confirm whether the volunteer signup form sends a
>   confirmation email. Looked at [https://example.org/volunteer]. Could
>   you confirm what happens after a signup is submitted?

---

## 12. 30-Day Action Plan

Three to five concrete actions the nonprofit can take in the next 30 days,
drawn directly from the High and Medium priority items above. Each action
should:

- Reference the item it comes from (by section + title).
- Be small enough that a non-technical staff member can do it or commission
  it.
- Have a clear "done when" condition.

**Example wording (placeholder):**

> 1. Add a three-bullet "how your gift is used" block to the donate page.
>    *(From: Donor Trust → Public "where your gift goes" explanation.)*
>    Done when: the block is visible on the live donate page.

Do not pad this list. Fewer real actions beats a long generic list.

---

## 13. 90-Day Action Plan

Three to five actions for the next quarter. These can be larger than the
30-day items (e.g., publish a short annual update, add a board page,
rewrite the homepage hero) but should still be specific and tied to items
from the analysis sections.

Format matches the 30-day plan: reference the source item, describe the
action, and define "done when."

---

## 14. Appendix: Evidence Log

A full list of every source consulted while writing the report. This is
the reproducibility backbone of the report — anyone re-reading it should be
able to re-open the same sources.

Suggested columns / fields:

- **Source URL or intake reference** — full URL, or `intake:<question_id>`.
- **Date reviewed** — `YYYY-MM-DD`.
- **What it supported** — the section + item title(s) that cite this
  source.
- **Notes** — short note if the page was unstable, partially loaded, or
  later moved.

Every public-claim item in sections 3–10 must point at a row in this log.
If a source is not in the log, the claim cannot stay in the report.

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

## Template Version

- Template version: 0.1 (internal draft)
- Owner: connectNPO operations
- Related planning doc: [docs/REPORT_AGENT_WORKFLOW.md](./REPORT_AGENT_WORKFLOW.md)
