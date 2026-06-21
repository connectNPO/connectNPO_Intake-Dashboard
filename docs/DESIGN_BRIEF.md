# connectNPO Nonprofit Growth Readiness Intake Dashboard — Design Brief

## Design Goal

Create a warm, clean, trustworthy dashboard that feels helpful to nonprofit leaders and easy for connectNPO admins to review.

The design should not feel like a cold audit, government form, or technical SaaS product. It should feel like a guided discovery process.

## Brand Personality

- Warm
- Practical
- Clear
- Trustworthy
- Nonprofit-friendly
- Calm
- Supportive
- Not overly corporate
- Not hype-driven
- Not too technical

## Visual Direction

Use a soft editorial dashboard style with card blocks, generous spacing, readable typography, and calm colors.

Preferred style:

- Rounded cards
- Soft shadows or subtle borders
- Warm off-white background
- Clear section headers
- Progress indicators
- Friendly helper text
- Simple forms
- Obvious primary action buttons

Avoid:

- Dark enterprise dashboard look
- Dense tables everywhere
- Harsh colors
- Overly playful startup look
- Complicated navigation
- Too many animations

## Color Palette

Use these colors:

```css
--background: #faf9f5;
--surface: #ffffff;
--primary: #7182FF;
--primary-soft: #ECECFF;
--muted-text: #6F6A63;
--main-text: #111111;
--border: #E8E4DC;
--success: #2F9E6D;
--warning: #C88719;
--danger: #C24141;
```

## Typography

Use a clean sans-serif font. Default Next.js font setup is fine.

Guidelines:

- Large page titles should be clear and confident.
- Body text should be easy for non-technical users.
- Helper text should be short and friendly.
- Avoid jargon.

## Layout Principles

### Public Intake Page

The intake form should feel like a guided journey.

Suggested layout:

```text
Header
- connectNPO logo/name
- Intake title

Main card
- Welcome text
- Privacy reminder
- Progress indicator
- Current section
- Form fields
- Back / Next buttons

Footer
- Short reassurance text
```

### Admin Dashboard

The admin dashboard should prioritize review speed.

Suggested layout:

```text
Sidebar or top nav
- Organizations
- New Organization

Main content
- Page title
- Status filters or simple status badges
- Organization cards/table
- Quick actions
```

### Organization Detail Page

Use sections/cards:

```text
Organization Summary Card
Intake Link Card
Status Card
Responses by Section
Admin Notes
JSON Export Button
```

## UI Components Needed

Create reusable components where helpful:

- `Button`
- `Card`
- `Input`
- `Textarea`
- `Select`
- `Badge`
- `SectionHeader`
- `ProgressIndicator`
- `EmptyState`
- `StatusBadge`
- `CopyButton`

Do not overbuild a full design system. Keep components simple and practical.

## Public Intake Copy

### Welcome Copy

```text
Welcome to your connectNPO readiness intake.

This form helps us understand your organization, your goals, your website, and the areas where you may need support. Your answers will help us prepare a more useful review and recommendation.
```

### Privacy Reminder

```text
Please do not enter passwords, donor lists, private financial records, private client information, or confidential internal documents. This intake is only for general organization and digital readiness information.
```

### Completion Copy

```text
Thank you. Your intake has been submitted.

The connectNPO team will review your responses and follow up with next steps.
```

## Form UX Rules

- Keep questions grouped by section.
- Use helper text for questions that may be confusing.
- Avoid long paragraphs inside form labels.
- Use textareas for reflective answers.
- Use select fields for simple categories.
- Save on final submit for MVP. Auto-save can come later.
- Show a clear completion page after submit.

## Admin UX Rules

- Admin should always know the organization status.
- Intake link should be easy to copy.
- Responses should be grouped by section.
- Admin notes should be clearly internal.
- JSON export should be admin-only.

## Suggested Screens

### `/`

Simple landing/redirect page.

If user is logged in, link to `/admin`.
If not, show login CTA.

### `/login`

Supabase Auth login page.

### `/admin`

Organization list.

Fields to show:

- Name
- Website
- Contact email
- Status
- Created date
- Submitted date
- View button

### `/admin/organizations/new`

Create organization form.

Fields:

- Organization name
- Website URL
- Contact name
- Contact email
- Contact role
- City
- State
- Service area
- Organization category
- Annual budget range

### `/admin/organizations/[id]`

Review page.

Sections:

- Organization metadata
- Intake link
- Status update
- Submitted responses
- Admin notes
- JSON export

### `/intake/[token]`

Public intake form.

### `/intake/[token]/complete`

Completion page.

## Accessibility Requirements

- Use semantic HTML.
- Every input must have a label.
- Buttons must have clear text.
- Color should not be the only status indicator.
- Use sufficient contrast.
- Form errors should be readable.
- Keyboard navigation should work.

## Responsive Design

The app must work well on:

- Desktop
- Tablet
- Mobile

Public intake especially should be mobile-friendly because nonprofit users may open the link from email.

## Design Acceptance Criteria

The design is acceptable when:

1. The intake page feels warm and trustworthy.
2. The form is not overwhelming.
3. Admin can quickly find each organization's status.
4. Responses are easy to review by section.
5. The design uses the connectNPO color palette.
6. The app is usable on mobile.
7. The interface avoids technical jargon.
