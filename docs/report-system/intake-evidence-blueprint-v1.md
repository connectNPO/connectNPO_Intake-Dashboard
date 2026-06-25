# Intake & Evidence Blueprint v1 — Growth Readiness Report System

**Owner:** connectNPO operations  
**Status:** Draft v1 for implementation planning  
**Primary use:** Guide the intake form, agent packet, research evidence collection, expert knowledge files, and client-facing Growth Readiness Report v2.

This blueprint exists to fix the main report-quality problem: the report must not simply repeat intake answers. It must understand the nonprofit's stated concern, compare it against public evidence and connectNPO expert standards, then produce practical next steps.

---

## 1. Core Principle

The Growth Readiness Report should answer the nonprofit's real question:

> “What is blocking us, why does it matter, and what should we do next?”

Every section should connect four things:

1. **What the nonprofit told us** — intake answers, goals, pain points, constraints.
2. **What we observed publicly** — website pages, public documents, listed public links.
3. **What expert standards suggest** — connectNPO rulebooks and trusted references.
4. **What to do next** — prioritized, realistic 30-day and 90-day recommendations.

---

## 2. Safety and Data Boundary

### Allowed in v1

- Public website URLs the nonprofit provides.
- Public social/profile links the nonprofit provides.
- Public annual report, impact report, program page, or funder-facing page if linked or clearly published by the nonprofit.
- Non-sensitive intake answers about goals, programs, audiences, challenges, readiness, and capacity.

### Do not request or store in v1

- EIN numbers.
- Bank information.
- Passwords or platform credentials.
- Donor lists or donor names.
- Private financial statements.
- Employee records.
- Client/member private information.
- Confidential strategy documents.
- Private grant applications unless a later secure document workflow is explicitly built.

### Required financial disclaimer

Any report section titled **Financial & Compliance Readiness** must include this exact sentence:

> This section is an operational readiness review, not accounting, tax, or legal advice.

The report must not provide accounting advice, tax advice, legal advice, Form 990 filing instructions, or compliance determinations.

---

## 3. Consulting Areas v1

The report system uses these 10 consulting areas:

1. Messaging & Positioning
2. Website Clarity
3. Donor Conversion
4. Volunteer Readiness
5. SEO / GEO
6. Trust & Transparency
7. Grant Readiness
8. Program & Impact Readiness
9. Financial & Compliance Readiness
10. Operations & Automation Readiness

Each area needs:

- intake signals,
- public evidence checks,
- expert knowledge mapping,
- report section mapping,
- priority guidance.

---

## 4. Intake UX Rules

The form must be easy for a busy nonprofit leader to complete.

### Required UX rules

- Prefer checkboxes and multiple choice over long text.
- Include realistic answer examples.
- Use “Select all that apply” when several answers may be true.
- Make long text fields optional unless truly required.
- Use short optional prompts such as “Tell us more in 1–2 sentences.”
- Let the user skip questions that do not apply.
- Avoid language that feels like an audit.
- Use reassuring copy: rough estimates are okay.

### Recommended question pattern

```text
Question
Short help text or example.

□ Choice 1
□ Choice 2
□ Choice 3
□ Other: ______

Optional: Tell us more in 1–2 sentences.
Example: “We are getting website visits, but not many people donate or contact us.”
```

---

## 5. Global Intake Questions

These questions apply across all consulting areas and should appear near the beginning of the private intake.

### Q1. What would make this review most useful?

**Type:** Checkbox group, select all that apply  
**Purpose:** Identify the user's real desired outcome.

Choices:

- Clear next steps for improving our website.
- Help explaining our work to donors.
- Help preparing for grants or funder conversations.
- Help improving volunteer signups.
- Help building trust with new visitors.
- Help prioritizing what to fix first.
- Help making our programs and impact easier to understand.
- Help finding operations or automation opportunities.
- Other: ______

Optional short answer:

> If there is one thing you hope this review helps solve, tell us here.

Example:

> “We know our work matters, but we are not sure our website explains it clearly enough for donors or funders.”

Maps to:

- Executive Summary
- Priority Recommendations
- 30-Day Action Plan
- All consulting areas

---

### Q2. What feels most stuck right now?

**Type:** Checkbox group, select all that apply  
**Purpose:** Identify practical pain points rather than generic goals.

Choices:

- People visit our website but do not take action.
- We want more donors but our giving message is unclear.
- We want grants but are not sure what funders need to see.
- Volunteers are interested but the next step is unclear.
- Our impact is real, but not clearly shown online.
- Our team is overwhelmed and needs priorities.
- We are not sure what is working or not working.
- We have many programs but struggle to explain them simply.
- Our internal work is too manual or repetitive.
- Other: ______

Optional short answer example:

> “We have a donation page, but people do not seem to understand what their gift helps accomplish.”

Maps to:

- Stated Concern
- Priority Recommendations
- Donor Conversion
- Grant Readiness
- Program & Impact Readiness
- Operations & Automation Readiness

---

### Q3. What has your team already tried?

**Type:** Checkbox group + optional short answer  
**Purpose:** Avoid giving obvious advice they already attempted.

Choices:

- Updated website copy.
- Posted more on social media.
- Created or updated a donation page.
- Sent donor emails or newsletters.
- Applied for grants.
- Recruited volunteers online.
- Created an annual report or impact report.
- Added public program/impact information.
- Tried automation or AI tools.
- We have not tried much yet.
- Other: ______

Optional short answer:

> What worked, what did not, or what felt hard?

Maps to:

- Recommendation relevance
- Priority calibration
- 30-Day Action Plan

---

### Q4. Which audience matters most in the next 90 days?

**Type:** Single choice or rank top 2  
**Purpose:** Prevent the report from recommending everything at once.

Choices:

- Individual donors.
- Grant funders or foundations.
- Volunteers.
- Program participants or clients.
- Community partners.
- Board members or internal leadership.
- General public / awareness.
- Other: ______

Maps to:

- Executive Summary
- Priority Recommendations
- Messaging & Positioning
- Donor Conversion
- Grant Readiness
- Volunteer Readiness

---

### Q5. What can your team realistically implement in the next 30 days?

**Type:** Single choice  
**Purpose:** Keep recommendations realistic.

Choices:

- Small copy edits only.
- A few website/page updates.
- One focused campaign or landing page.
- New content plus some workflow changes.
- We have staff or consultant capacity for a larger update.
- Not sure.

Optional short answer:

> Tell us about any time, budget, or staffing constraints.

Maps to:

- 30-Day Action Plan
- 90-Day Action Plan
- Priority Guidance
- Operations & Automation Readiness

---

## 6. Consulting Area Intake, Evidence, and Report Mapping

### 6.1 Messaging & Positioning

**Expert knowledge file:** `docs/expert-knowledge/messaging-positioning.md`

#### Intake questions

**Question:** Which statement best describes your current message?

Choices:

- Most people understand what we do quickly.
- People understand our mission but not our programs.
- People understand our programs but not why they matter.
- We struggle to explain our work simply.
- Different team members explain us in different ways.
- Not sure.

Optional short answer example:

> “We serve youth and families, but our program names are hard for new visitors to understand.”

#### Evidence to research

- Homepage hero message.
- About/mission page.
- Program page headings.
- Navigation labels.
- Whether the site explains who is served, what problem is addressed, and what action the visitor can take.

#### Report use

- Stated Concern
- Executive Summary
- Website Clarity
- Priority Recommendations

#### Strong signals

- A first-time visitor can understand who the nonprofit serves and what it does within a few seconds.
- Program language is plain and audience-focused.
- The main message connects mission to action.

#### Weak signals

- Mission language is broad but not specific.
- Program names are internal or unclear.
- The homepage does not say who is served.

---

### 6.2 Website Clarity

**Expert knowledge file:** `docs/expert-knowledge/website-clarity.md`

#### Intake questions

**Question:** What is hardest about your current website?

Choices:

- It is outdated.
- It does not clearly explain what we do.
- Important actions are hard to find.
- It does not work well on mobile.
- It is hard for our team to update.
- It does not reflect our current programs.
- We do not know what visitors need most.
- Other: ______

#### Evidence to research

- Homepage.
- Main navigation.
- Mobile responsiveness if observable.
- About/mission page.
- Contact path.
- Primary call to action.

#### Report use

- Website Clarity section
- Top Priorities
- 30-Day Action Plan

#### Strong signals

- Clear headline.
- Simple navigation.
- Primary CTA visible.
- Contact path is easy to find.

#### Weak signals

- Multiple competing CTAs.
- Vague homepage headline.
- Critical pages buried or missing.
- No obvious next step.

---

### 6.3 Donor Conversion

**Expert knowledge file:** `docs/expert-knowledge/donor-conversion.md`

#### Intake questions

**Question:** What is your biggest donor-related challenge right now?

Choices:

- We need more individual donors.
- People care about our mission but do not donate.
- Our donation page is too generic.
- We do not clearly explain what donations make possible.
- We do not have enough donor follow-up or updates.
- We mostly rely on a small number of donors.
- Donor growth is not a current priority.
- Other: ______

Optional short answer example:

> “We ask people to donate, but we do not have clear examples like what $25, $50, or $100 supports.”

#### Evidence to research

- Donate CTA visibility.
- Donate page.
- Gift impact language.
- Suggested giving amounts.
- Donor trust signals near the ask.
- Whether donor journey is clear from homepage to donation action.

#### Report use

- Donor Conversion section
- Priority Recommendations
- 30-Day Action Plan

#### Strong signals

- Donation action is visible.
- Donation page connects gifts to outcomes.
- Trust/impact proof appears near the ask.

#### Weak signals

- Generic “support us” language.
- No examples of gift impact.
- Donate action is hidden.
- No clear donor follow-up or impact update path.

---

### 6.4 Volunteer Readiness

**Expert knowledge file:** `docs/expert-knowledge/volunteer-readiness.md`

#### Intake questions

**Question:** What is your current volunteer situation?

Choices:

- We need more volunteers.
- People are interested but do not know the next step.
- We have roles, but they are not clearly explained online.
- We need better onboarding.
- We do not currently use volunteers.
- Volunteer recruitment is not a current priority.
- Other: ______

Optional short answer example:

> “People ask about helping, but we do not have a clear list of roles or time commitments.”

#### Evidence to research

- Volunteer page or section.
- Role descriptions.
- Time commitment information.
- Signup form or contact path.
- Expectations, training, or onboarding language.

#### Report use

- Volunteer Readiness section
- 30-Day Action Plan
- Operations & Automation Readiness

#### Strong signals

- Clear volunteer roles.
- Simple signup/contact path.
- Expectations and time commitment are explained.

#### Weak signals

- Volunteer CTA exists but roles are vague.
- Interested people must email without knowing next steps.
- No onboarding expectations.

---

### 6.5 SEO / GEO

**Expert knowledge file:** `docs/expert-knowledge/seo-geo.md`

#### Intake questions

**Question:** How important is being found online right now?

Choices:

- Very important — we need more people to find us through search.
- Important, but not our top priority.
- We mostly rely on referrals or partners.
- We are not sure whether search is helping us.
- Search visibility is not a current priority.

**Question:** What search/AI discovery concern fits best?

Choices:

- People may not find us when searching for services we provide.
- Our page titles or descriptions may be unclear.
- Our content does not answer common questions.
- We want to show up better in Google and AI answer tools.
- We do not know.

#### Evidence to research

- Homepage title and description if available.
- Headings and page structure.
- Whether core services are described in plain searchable language.
- FAQ or question-answer content.
- Local/service-area clarity.
- Basic schema/structured data only if easily observable.

#### Report use

- SEO / GEO section
- Content recommendations
- 90-Day Action Plan

#### Strong signals

- Pages describe services using words the public would search.
- Titles/headings are specific.
- Site answers common audience questions.
- Location/service area is clear where relevant.

#### Weak signals

- Generic page titles.
- Internal program names without plain-language explanation.
- No FAQ or explanatory content.
- Service area unclear.

---

### 6.6 Trust & Transparency

**Expert knowledge file:** `docs/expert-knowledge/trust-transparency.md`

#### Intake questions

**Question:** Which trust-building materials do you currently have public? Select all that apply.

Choices:

- Board or leadership page.
- Annual report.
- Impact report or outcomes summary.
- Financial summary.
- Public Form 990 link or nonprofit profile link.
- Partner/testimonial/community proof.
- Recent news or updates.
- We are not sure.
- None of these are public yet.

Optional short answer:

> If some materials exist but are not public, briefly describe them without sharing private details.

#### Evidence to research

- About page.
- Leadership/board page.
- Annual/impact report links.
- Public nonprofit profile links.
- Recent updates/news.
- Partner or community proof.

#### Report use

- Trust & Transparency section
- Donor Conversion
- Grant Readiness
- Financial & Compliance Readiness

#### Strong signals

- Leadership is visible.
- Impact information is current.
- Basic transparency materials are easy to find.

#### Weak signals

- No leadership or governance information.
- Impact proof missing or outdated.
- Public transparency materials hard to find.

---

### 6.7 Grant Readiness

**Expert knowledge file:** `docs/expert-knowledge/grant-readiness.md`

#### Intake questions

**Question:** What best describes your grant readiness right now?

Choices:

- We actively apply for grants.
- We want to apply for grants but are not sure what funders need.
- We have program information but not strong outcomes/evaluation language.
- We need help explaining our need, activities, and impact.
- Grants are not a current priority.
- Other: ______

**Question:** Which grant-related materials do you have? Select all that apply.

Choices:

- Program descriptions.
- Basic budget information.
- Outcome or impact data.
- Evaluation plan or measurement approach.
- Letters of support or partner information.
- Organizational history/background.
- Public annual or impact report.
- We are not sure.

Optional short answer example:

> “We know what our program does, but we struggle to describe measurable outcomes.”

#### Evidence to research

- Program pages.
- Outcomes/impact language.
- Annual or impact report if public.
- Funder-facing language if public.
- Evidence of who is served, what need exists, and what results are tracked.

#### Report use

- Grant Readiness section
- Program & Impact Readiness
- Trust & Transparency
- 90-Day Action Plan

#### Strong signals

- Program need, activities, audience, and outcomes are clearly described.
- Public materials show impact or evaluation readiness.
- Organization can explain why funding is needed and what it supports.

#### Weak signals

- Programs listed without outcomes.
- Impact claims are broad or unsupported.
- No funder-facing summary language.

---

### 6.8 Program & Impact Readiness

**Expert knowledge file:** `docs/expert-knowledge/program-impact-readiness.md`

#### Intake questions

**Question:** How do you currently describe program impact?

Choices:

- We have clear outcome data.
- We have stories/examples but limited data.
- We track outputs, such as number of people served.
- We know our impact but have not written it clearly.
- We do not yet track impact consistently.
- Not sure.

**Question:** What type of proof is easiest for your team to provide right now?

Choices:

- Short stories or examples.
- Basic numbers served.
- Survey or feedback results.
- Program completion/participation data.
- Partner quotes or testimonials.
- We do not know yet.

#### Evidence to research

- Program pages.
- Impact page.
- Annual report.
- Stories/testimonials.
- Metrics or outcomes language.

#### Report use

- Program & Impact Readiness
- Donor Conversion
- Grant Readiness
- Executive Summary

#### Strong signals

- Program descriptions connect activities to outcomes.
- Impact proof is concrete.
- Stories and numbers support the same message.

#### Weak signals

- Only activities are described.
- Outcomes are vague.
- Impact information is missing or hard to find.

---

### 6.9 Financial & Compliance Readiness

**Expert knowledge file:** `docs/expert-knowledge/financial-compliance-readiness.md`

#### Intake questions

**Required intro copy before this section:**

> This section is only about operational readiness and public-facing preparedness. Please do not enter private financial records, bank information, donor lists, payroll details, or confidential documents.

**Question:** Which public-facing financial or compliance materials are ready or partly ready? Select all that apply.

Choices:

- Public Form 990 or nonprofit profile link.
- Annual report.
- Basic public financial summary.
- Board-approved budget process.
- Grant budget/reporting process.
- Program expense tracking.
- Restricted/unrestricted fund tracking.
- We are not sure.
- None are ready yet.

**Question:** What feels hardest in this area?

Choices:

- Explaining finances to funders or donors.
- Preparing materials for grants.
- Tracking program costs or outcomes.
- Knowing what should be public.
- Coordinating board/funder reporting.
- We need a qualified accounting/tax professional.
- Not sure.

#### Evidence to research

- Public annual report.
- Public financial summary.
- Public Form 990/profile link if the organization lists one.
- Grant/reporting language if public.
- Impact/financial connection in public materials.

#### Report use

- Financial & Compliance Readiness
- Grant Readiness
- Trust & Transparency
- Risk/Needs Confirmation

#### Required report disclaimer

This exact sentence must appear at the beginning of the report section:

> This section is an operational readiness review, not accounting, tax, or legal advice.

#### Strong signals

- Public-facing financial or accountability materials are easy to find.
- Organization can explain how funding supports programs.
- Grant reporting readiness is described operationally.

#### Weak signals

- Public accountability materials are missing or hard to find.
- Program cost/impact connection is unclear.
- The organization indicates it needs professional accounting/tax support.

#### Hard boundary

Do not provide:

- accounting advice,
- tax advice,
- legal advice,
- Form 990 filing instructions,
- compliance determinations.

---

### 6.10 Operations & Automation Readiness

**Expert knowledge file:** `docs/expert-knowledge/operations-automation-readiness.md`

#### Intake questions

**Question:** Which tasks take too much manual time? Select all that apply.

Choices:

- Donor emails or thank-you messages.
- Volunteer follow-up.
- Newsletter or social content.
- Grant research or application prep.
- Program reporting.
- Meeting notes or summaries.
- Board reports.
- Website updates.
- Intake/forms/data entry.
- We are not sure.
- Other: ______

**Question:** What tools does your team already use? Select all that apply.

Choices:

- Google Workspace.
- Microsoft 365.
- CRM or donor database.
- Email marketing tool.
- Website CMS.
- Spreadsheets.
- Project management tool.
- Accounting system.
- Not sure.
- Other: ______

Optional short answer example:

> “We spend a lot of time turning meeting notes and program updates into reports.”

#### Evidence to research

- Public signs of repeated content needs: blog/news/events/updates.
- Intake answers about manual processes.
- Public reporting cadence if visible.
- Gaps that connect to connectNPO service opportunities.

#### Report use

- Operations & Automation Readiness
- Recommended connectNPO Services
- 90-Day Action Plan

#### Strong signals

- Team can identify repeatable workflows.
- Public communication/reporting needs are clear.
- There are safe, non-sensitive automation opportunities.

#### Weak signals

- Team is overwhelmed but cannot identify priority workflows.
- Repetitive tasks are blocking communication or reporting.
- Data/process ownership is unclear.

---

## 7. Evidence Research Checklist v1

For every report run, the researcher should create an evidence artifact under:

```text
working/<organization_id>/research/evidence-log.md
```

or, if the runner uses JSON:

```text
working/<organization_id>/research/evidence-log.json
```

### Minimum public pages to check

Only check URLs the nonprofit provides or public pages clearly linked from those URLs.

1. Homepage.
2. About / Mission page.
3. Programs / Services page.
4. Donate page.
5. Volunteer page.
6. Impact / Annual report / News page.
7. Contact page.
8. Public social/profile links if provided.

### Evidence entry format

```text
Area: Donor Conversion
Evidence status: Found on website | Found in intake | Missing | Needs confirmation
Source: https://example.org/donate
Observed: The donation page asks visitors to “Support our mission” but does not explain what specific gift amounts make possible.
Expert standard: Donor pages should connect the gift to a concrete mission outcome.
Interpretation: The donation action exists, but the donor value proposition is underdeveloped.
Recommended next step: Add 3 gift examples that connect common amounts to practical outcomes.
Priority: High
Confidence: High
```

### Evidence rules

- One observation per entry.
- Include a URL for any public web claim.
- If a signal is missing, record where it was checked.
- If uncertain, mark `Needs confirmation` instead of guessing.
- Do not infer private facts from public silence.

---

## 8. Expert Knowledge File Map

The v1 report system should later create these files:

```text
docs/expert-knowledge/README.md
docs/expert-knowledge/template.md
docs/expert-knowledge/messaging-positioning.md
docs/expert-knowledge/website-clarity.md
docs/expert-knowledge/donor-conversion.md
docs/expert-knowledge/volunteer-readiness.md
docs/expert-knowledge/seo-geo.md
docs/expert-knowledge/trust-transparency.md
docs/expert-knowledge/grant-readiness.md
docs/expert-knowledge/program-impact-readiness.md
docs/expert-knowledge/financial-compliance-readiness.md
docs/expert-knowledge/operations-automation-readiness.md
```

Each expert knowledge file should include:

1. Purpose.
2. Scope.
3. Expert principles.
4. Evidence to collect.
5. Intake signals to use.
6. Strong signals.
7. Weak or missing signals.
8. Diagnosis rules.
9. Recommendation library.
10. Example report language.
11. Priority guidance.
12. Safety / boundaries.
13. Sources / reference standards.

---

## 9. Source Map Categories

A later `docs/report-system/source-map-v1.md` should map trusted sources to the expert knowledge files.

Recommended source categories:

### SEO / GEO

- Google Search Central.
- Google helpful content guidance.
- Schema.org.
- Bing Webmaster guidance where useful.

### Website / UX / Accessibility

- Nielsen Norman Group usability principles.
- W3C / WCAG accessibility guidance.
- Plain language guidance.

### Trust / Transparency

- Candid / GuideStar public nonprofit profile concepts.
- Charity Navigator trust and accountability concepts.
- IRS public disclosure basics for exempt organizations.

### Grant Readiness

- Grants.gov learning materials.
- Candid learning resources.
- Common funder application patterns.
- Logic model / theory of change / outcomes and evaluation guidance.

### Financial & Compliance Readiness

- IRS public disclosure basics.
- Board financial oversight principles from reputable nonprofit governance resources.
- Grant reporting readiness concepts.

Important: source map materials are background standards. The final report should not dump citations unless they support a concrete recommendation.

---

## 10. Agent Packet Requirements v1

The future agent packet should make the user's concern easy to find.

Add or preserve these normalized fields when possible:

```json
{
  "stated_concerns": ["string"],
  "desired_outcomes": ["string"],
  "already_tried": ["string"],
  "priority_audience_90_days": ["string"],
  "implementation_capacity_30_days": "string",
  "consulting_area_signals": {
    "messaging_positioning": {},
    "website_clarity": {},
    "donor_conversion": {},
    "volunteer_readiness": {},
    "seo_geo": {},
    "trust_transparency": {},
    "grant_readiness": {},
    "program_impact_readiness": {},
    "financial_compliance_readiness": {},
    "operations_automation_readiness": {}
  }
}
```

Do not include private intake tokens, contact emails in the client-facing report, passwords, EINs, donor data, or private documents.

---

## 11. Report Writer Rules v1

The report writer must follow these rules:

1. Do not simply summarize intake answers.
2. Start from the nonprofit's stated concern and desired outcome.
3. Explain why the concern may be happening based on evidence.
4. Use expert knowledge files to interpret the situation.
5. Give prioritized recommendations, not a list of generic possibilities.
6. Every recommendation must include a concrete next step.
7. Separate evidence from interpretation.
8. Mark missing information clearly.
9. Include a 30-day plan based on high-priority, low-to-medium effort actions.
10. Include a 90-day plan for deeper improvements.
11. Include the required financial disclaimer in Financial & Compliance Readiness.
12. Keep tone warm, practical, and direct.

### Preferred section pattern

For each consulting area:

```text
What we observed
Why it matters
Expert interpretation
Recommended next step
Priority
Evidence / needs confirmation
```

### Strong recommendation format

```text
Because [evidence], the organization may be experiencing [practical problem]. The first useful step is [specific action]. This matters because [audience/outcome].
```

---

## 12. QA Rules v1

The QA reviewer must answer:

1. Does the report address the nonprofit's stated concern?
2. Is the report more than an intake summary?
3. Does every recommendation explain what to do next?
4. Are findings grounded in intake, website evidence, or approved expert standards?
5. Are public claims backed by openable URLs?
6. Are missing or uncertain facts marked as missing/needs confirmation?
7. Does the Financial & Compliance Readiness section include the required disclaimer?
8. Does the report avoid accounting, tax, legal, grant-eligibility, and compliance advice?
9. Are recommendations realistic for the nonprofit's stated 30-day capacity?
10. Does the report avoid generic praise and unsupported claims?

If the answer to questions 1, 2, 3, 5, 7, or 8 is “No,” the report should not be marked ready for human review.

---

## 13. Implementation Sequence After This Blueprint

Recommended next steps:

1. Create `docs/expert-knowledge/template.md`.
2. Create the 10 expert knowledge files as v0 drafts.
3. Create `docs/report-system/source-map-v1.md`.
4. Update the private intake form questions to match this blueprint.
5. Update the agent packet export to normalize stated concerns, desired outcomes, and consulting area signals.
6. Update report agent prompts to use this blueprint and the expert knowledge files.
7. Run a demo organization report v2.
8. Generate `growth-readiness-report-v2.html` for visual review.
9. Human-review the output before any dashboard automation or client sharing.

---

## 14. Success Criteria

The v2 report is successful when a nonprofit leader can read it and feel:

- “They understood what we are struggling with.”
- “They explained why this is happening.”
- “They showed me what to fix first.”
- “The recommendations are realistic for our team.”
- “This feels like a practical consulting review, not a restatement of our form answers.”
