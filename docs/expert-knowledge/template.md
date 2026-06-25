# Expert Knowledge Template — Growth Readiness Consulting Area

**Owner:** connectNPO operations  
**Status:** Template v1  
**Use:** Copy this file for each consulting area under `docs/expert-knowledge/` and complete the fields before connecting it to report-agent prompts.

This template helps the report system move beyond intake summaries. Each expert knowledge file should tell the agent what to evaluate, what evidence to trust, what recommendations are safe, and what language to avoid.

---

## 1. Area Metadata

```text
Area name:
Report section name:
Primary user concern this area answers:
Related consulting areas:
Last reviewed:
Owner/reviewer:
```

Example:

```text
Area name: Donor Conversion
Report section name: Donor Readiness & Giving Path
Primary user concern this area answers: “People visit our website but do not donate or understand how to help.”
Related consulting areas: Messaging & Positioning, Website Clarity, Trust & Transparency
Last reviewed: YYYY-MM-DD
Owner/reviewer: connectNPO operations
```

---

## 2. What This Area Evaluates

Describe the practical nonprofit readiness question this area answers.

Use plain language:

```text
This area evaluates whether a visitor can quickly understand the organization, trust it, and take the intended next step.
```

Include:

- What a strong nonprofit should make clear.
- What the visitor, donor, volunteer, funder, or partner should be able to do.
- What problems this area commonly reveals.

---

## 3. Intake Signals to Use

List the intake answers that should influence this area.

```text
Relevant intake fields:
- Field/key:
  Why it matters:
  Strong signal:
  Weak or missing signal:
```

Examples:

```text
- Field/key: primary_goal
  Why it matters: Shows what outcome the nonprofit cares about most.
  Strong signal: Clear priority such as donor action, grant readiness, or volunteer signup.
  Weak or missing signal: Broad answer like “improve everything” with no priority.
```

Rules:

- Do not treat intake answers as proven facts.
- Use intake to understand goals and pain points.
- Confirm outward-facing claims with public evidence when possible.
- If an answer is missing, say what should be confirmed later.

---

## 4. Public Evidence to Collect

List the public sources the research agent should check.

```text
Primary evidence:
- Homepage
- About/Mission page
- Programs/Services pages
- Donation or support page
- Volunteer page
- Impact/annual report page
- Public social/profile links
- Public funder/partner pages if clearly relevant
```

For this area, collect:

```text
Evidence item:
Where to look:
What counts as strong evidence:
What counts as weak/missing evidence:
Suggested citation format:
```

Evidence rules:

- Prefer the nonprofit's own public website first.
- Use public third-party sources only when clearly relevant.
- Do not use private or sensitive documents in v1.
- Do not infer internal performance metrics unless provided.
- If evidence is not found, label it as `Not found`, not as a failure.

---

## 5. Strong Signals

List the signs that this area is healthy.

```text
Strong signals:
- The main audience can understand the organization within a few seconds.
- The next action is clear and repeated in the right places.
- Impact is explained with concrete examples or outcomes.
- Trust signals are easy to find.
- The recommendation path matches the nonprofit's stated capacity.
```

Customize this list for the specific consulting area.

---

## 6. Warning Signs

List the issues that may reduce readiness.

```text
Warning signs:
- The page names programs but does not explain who they help or why they matter.
- The visitor has to search for the next step.
- Donation, volunteer, or contact paths are unclear.
- Claims are broad but not supported by examples or public evidence.
- The recommendation would require more staff capacity than the nonprofit appears to have.
```

Rules:

- Use supportive language.
- Avoid blame.
- Avoid saying the organization is noncompliant or doing something wrong unless a human expert has verified it.
- Phrase issues as improvement opportunities.

---

## 7. Recommended Analysis Pattern

Use this structure when the report writer analyzes the area:

```text
1. Start with the nonprofit's stated goal or concern.
2. Compare it with public evidence.
3. Identify the main readiness gap.
4. Explain why it matters for donors, volunteers, funders, partners, or AI/search visibility.
5. Recommend one practical 30-day action.
6. Recommend one deeper 90-day action if appropriate.
7. Mark anything uncertain as “needs confirmation.”
```

Avoid generic advice. Every recommendation should connect to at least one of these:

- intake signal,
- public evidence,
- expert standard from this file,
- missing evidence that should be confirmed.

---

## 8. Common Recommendations

Create a reusable recommendation bank for this area.

```text
Recommendation:
When to use:
Evidence required:
30-day version:
90-day version:
Effort level: Low / Medium / High
Expected benefit:
Risk if ignored:
```

Example:

```text
Recommendation: Add a clearer donor action path from the homepage.
When to use: The organization wants more donor support, but the homepage does not clearly guide visitors to give.
Evidence required: Homepage review + donation/support page review.
30-day version: Add a visible “Give” or “Support Our Work” action near the top of the homepage and explain what donations help accomplish.
90-day version: Build a donor pathway with impact examples, recurring giving option, and follow-up email sequence.
Effort level: Medium
Expected benefit: Reduces confusion and helps motivated visitors take action.
Risk if ignored: Visitors may support the mission but leave without knowing what to do next.
```

---

## 9. What NOT to Say

List unsafe, unsupported, or overly strong claims the report writer must avoid.

```text
Do not say:
- “Your nonprofit is not compliant.”
- “This will increase donations by X%.”
- “Funders will reject this.”
- “You should file/change tax documents.”
- “Your accounting is incorrect.”
- “Your board is failing.”
```

Safer alternatives:

```text
Instead say:
- “This item may need confirmation from your legal, tax, or accounting advisor.”
- “This could make the giving path easier for interested donors.”
- “Funders often look for this information, so making it easier to find may strengthen readiness.”
- “This is an operational readiness observation, not a compliance determination.”
```

---

## 10. Safety, Privacy, and Disclaimer Rules

Use these rules in every expert knowledge file:

- Do not request or expose EIN numbers, bank information, passwords, donor lists, employee records, private client/member data, or confidential internal documents.
- Do not provide legal, tax, accounting, or compliance advice.
- Distinguish public evidence from intake answers and assumptions.
- Label uncertain items as `Needs confirmation`.
- Draft for human review before customer delivery.

If this area is **Financial & Compliance Readiness**, include this exact sentence in the client-facing section:

> This section is an operational readiness review, not accounting, tax, or legal advice.

---

## 11. Evidence Labels

Use these labels consistently:

```text
Found in intake
Found on website
Found in public source
Not found
Needs confirmation
Not applicable
```

Each major claim should include:

```text
Claim:
Evidence label:
Source URL or intake field:
Confidence: High / Medium / Low
Human review needed: Yes / No
```

---

## 12. Report Output Guidance

Recommended client-facing section format:

```text
### [Area Name]

What we saw:
- Evidence-based observation.

Why it matters:
- Plain-language explanation tied to donors, volunteers, funders, partners, operations, or search visibility.

Recommended next step:
- One practical action.

30-day action:
- Specific, realistic improvement.

90-day opportunity:
- Larger improvement if the team has capacity.

Evidence used:
- Source or intake field.

Needs confirmation:
- Any uncertain item.
```

Tone rules:

- Warm, practical, and respectful.
- Avoid sounding like an audit.
- Be specific enough for the nonprofit to act.
- Do not overstate certainty.
- Prefer “may help,” “can make clearer,” and “is worth confirming” when evidence is limited.

---

## 13. Example Output Snippets

Add 2–3 examples for this area.

### Strong Example

```text
What we saw: Your homepage explains the mission clearly and links to both the donation page and the volunteer page near the top of the site.

Why it matters: This helps interested visitors quickly understand how they can support the work without searching through multiple pages.

Recommended next step: Add one short impact example near the call-to-action so visitors can connect their support to a concrete outcome.
```

### Missing Evidence Example

```text
What we saw: We could not find a public page that explains volunteer roles or the next step to get involved.

Why it matters: If volunteer recruitment is a priority, interested visitors may leave without knowing whether there is a role that fits them.

Recommended next step: Create a simple volunteer interest section with 3–5 role examples and a clear contact or signup path.
```

### Needs Confirmation Example

```text
What we saw: The intake notes mention a monthly donor program, but we could not confirm a public recurring giving option on the website.

Why it matters: If recurring giving is available, making it more visible could help donors choose a sustainable support option.

Recommended next step: Confirm whether recurring giving is currently available, then add or clarify the option on the giving page.
```

---

## 14. Agent Packet Mapping

Document how this expert file connects to the agent packet.

```text
Agent packet fields used:
- organization.name
- organization.website_url
- intake.goals
- intake.challenges
- evidence.website_findings
- evidence.public_sources
- admin_notes

Report sections influenced:
- Executive Summary
- Priority Recommendations
- 30-Day Action Plan
- 90-Day Action Plan
- [Area-specific section]
```

Rules:

- If required packet data is missing, the agent should still draft a useful section but mark missing items clearly.
- The report writer should not invent missing facts.
- Admin notes may guide emphasis, but public/client-facing claims still need evidence.

---

## 15. QA Checklist for This Area

Before using this expert file in a client-facing report, check:

```text
- [ ] The section connects intake + public evidence + expert standard + next step.
- [ ] Claims are supported by source URL, intake field, or clearly marked missing evidence.
- [ ] Recommendations are realistic for a small or mid-sized nonprofit.
- [ ] The tone is supportive, not judgmental.
- [ ] No legal, tax, accounting, or compliance advice is included.
- [ ] Any financial/compliance section includes the required disclaimer.
- [ ] Sensitive information is not requested or exposed.
- [ ] Uncertain items are labeled “Needs confirmation.”
- [ ] The section gives at least one practical 30-day action.
```

---

## 16. Completion Criteria

This expert knowledge file is ready when:

```text
- The area metadata is complete.
- Intake signals are mapped.
- Public evidence checks are listed.
- Strong signals and warning signs are customized.
- Recommendation bank includes at least 5 practical recommendations.
- Unsafe claims and safer alternatives are included.
- Output snippets are customized for the area.
- Agent packet mapping is complete.
- QA checklist passes.
```
