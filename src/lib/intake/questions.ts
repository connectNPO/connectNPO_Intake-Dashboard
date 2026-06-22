import type { IntakeSection } from '@/lib/types';

/**
 * Intake question configuration — the single source of truth for both the
 * public intake form and the admin review labels.
 *
 * IMPORTANT: Only collect non-sensitive, service-planning information. Never add
 * questions asking for EIN, bank info, passwords/credentials, donor lists,
 * private financial statements, employee records, board member private details,
 * or any confidential documents.
 */
export const INTAKE_SECTIONS: IntakeSection[] = [
  {
    key: 'organization_basics',
    title: 'Organization Profile',
    description: 'Start with a few basic details so we can understand your organization at a high level.',
    questions: [
      {
        key: 'organization_name',
        label: 'What is your organization’s legal or public name?',
        type: 'text',
        placeholder: 'Example: Hope Community Food Center',
        required: true,
      },
      {
        key: 'website_url',
        label: 'What is your current website address?',
        type: 'url',
        helper: 'If you do not have a website yet, you may leave this blank.',
        placeholder: 'https://',
      },
      {
        key: 'location',
        label: 'Where is your organization primarily based?',
        type: 'text',
        helper: 'City and state is enough — please do not include a street address.',
        placeholder: 'Example: Los Angeles, CA',
      },
      {
        key: 'service_area',
        label: 'What geographic area or community do you primarily serve?',
        type: 'text',
        helper: 'For example: a neighborhood, city, county, region, state, or national audience.',
        placeholder: 'Example: Families in South Los Angeles and nearby communities',
      },
      {
        key: 'organization_category',
        label: 'Which category best describes your primary focus area?',
        type: 'select',
        options: [
          'Arts & Culture',
          'Education',
          'Environment',
          'Health',
          'Human Services',
          'Youth Services',
          'Community Development',
          'Animal Welfare',
          'Faith-based',
          'Other',
        ],
        allowOther: true,
      },
    ],
  },
  {
    key: 'mission_community',
    title: 'Mission & Community',
    description: 'Help us understand your purpose, your audience, and the change you are working toward.',
    questions: [
      {
        key: 'mission_statement',
        label: 'How would you describe your mission in one or two sentences?',
        type: 'textarea',
        helper: 'A concise summary is perfect. You can use your existing mission statement if you have one.',
        placeholder: 'Example: We provide after-school tutoring and mentorship so local students can build confidence and stay on track academically.',
        required: true,
      },
      {
        key: 'community_served',
        label: 'Who do you primarily serve?',
        type: 'textarea',
        helper: 'Describe the people, groups, or communities your programs are designed to support.',
        placeholder: 'Example: Low-income families, first-generation students, seniors, recent immigrants, or youth ages 12–18.',
        required: true,
      },
      {
        key: 'priority_audience',
        label: 'Who is your most important target audience right now?',
        type: 'select',
        helper: 'Choose the audience you most want your website, content, and outreach to reach first.',
        options: [
          'Program participants / clients',
          'Donors and individual supporters',
          'Grantmakers / foundations',
          'Volunteers',
          'Community partners',
          'Board members or advisors',
          'Local community members',
          'Other',
        ],
        allowOther: true,
        required: true,
      },
      {
        key: 'impact_story',
        label: 'What is one recent result, story, or example that shows your impact?',
        type: 'textarea',
        helper: 'Please keep it general and avoid names or private client details.',
        placeholder: 'Example: Last year, 85 students completed our tutoring program, and several improved by at least one grade level.',
      },
    ],
  },
  {
    key: 'programs_services',
    title: 'Programs & Services',
    description: 'Tell us what you provide and how people engage with your work.',
    questions: [
      {
        key: 'main_programs',
        label: 'What are your main programs, services, or initiatives?',
        type: 'textarea',
        placeholder: 'Example: Weekly food distribution, youth mentoring, parent workshops, and emergency resource referrals.',
        required: true,
      },
      {
        key: 'who_benefits',
        label: 'About how many people or households do you serve in a typical year?',
        type: 'text',
        helper: 'A rough estimate or range is fine.',
        placeholder: 'Example: About 300 people per year, or 40–50 families per month',
      },
      {
        key: 'delivery_method',
        label: 'How do people access or participate in your programs?',
        type: 'textarea',
        helper: 'For example: in person, online, by referral, by appointment, through schools, or through partner organizations.',
        placeholder: 'Example: Families sign up through our website, partner schools refer students, and services are delivered in person twice a week.',
      },
    ],
  },
  {
    key: 'current_goals',
    title: 'Goals & Growth Priorities',
    description: 'Share what you are trying to improve, expand, or clarify over the next year.',
    questions: [
      {
        key: 'top_goals',
        label: 'What are your top priorities for the next 6–12 months?',
        type: 'textarea',
        placeholder: 'Example: Increase monthly donors, improve our website, recruit more volunteers, and make program reporting easier.',
        required: true,
      },
      {
        key: 'growth_priority',
        label: 'What would meaningful growth look like for your organization?',
        type: 'textarea',
        helper: 'For example: stronger donor engagement, more volunteers, clearer messaging, better systems, or increased program reach.',
        placeholder: 'Example: We would like more people to understand our work, donate online, and sign up to volunteer without staff follow-up.',
      },
      {
        key: 'success_definition',
        label: 'How will you know these efforts are successful?',
        type: 'textarea',
        helper: 'You can mention simple indicators such as more inquiries, more donations, smoother operations, or stronger community engagement.',
        placeholder: 'Example: More website inquiries, 20 new recurring donors, fewer manual spreadsheets, or faster follow-up with supporters.',
      },
    ],
  },
  {
    key: 'challenges',
    title: 'Current Challenges',
    description: 'Identify where your team feels stretched, delayed, or under-supported.',
    questions: [
      {
        key: 'biggest_challenges',
        label: 'What are the biggest challenges limiting your organization right now?',
        type: 'textarea',
        placeholder: 'Example: We have limited staff time, outdated website content, inconsistent donor follow-up, and too many manual processes.',
        required: true,
      },
      {
        key: 'time_consuming_tasks',
        label: 'What recurring tasks take the most time for your team?',
        type: 'textarea',
        placeholder: 'Example: Updating spreadsheets, sending reminder emails, creating reports, posting updates, or following up with donors.',
      },
      {
        key: 'support_needed',
        label: 'Where would outside support make the biggest practical difference?',
        type: 'textarea',
        helper: 'Think about strategy, website, content, operations, fundraising systems, reporting, or automation.',
        placeholder: 'Example: A clearer website, better donation flow, automated intake forms, monthly reporting dashboard, or content plan.',
      },
    ],
  },
  {
    key: 'website_digital_presence',
    title: 'Website & Digital Presence',
    description: 'Help us understand how people currently discover, trust, and engage with you online.',
    questions: [
      {
        key: 'has_website',
        label: 'Do you currently have an active website?',
        type: 'select',
        options: ['Yes', 'No', 'In progress'],
        required: true,
      },
      {
        key: 'website_feelings',
        label: 'How well does your current website support your organization’s goals?',
        type: 'textarea',
        helper: 'You can mention what works, what feels outdated, and what visitors often need but cannot easily find.',
        placeholder: 'Example: Our website explains our mission, but donation and volunteer pages are hard to update and not mobile-friendly.',
      },
      {
        key: 'social_channels',
        label: 'Which public communication channels do you actively use?',
        type: 'textarea',
        helper: 'For example: email newsletter, Instagram, Facebook, LinkedIn, YouTube, events, or partner networks.',
        placeholder: 'Example: Facebook weekly, Instagram occasionally, Mailchimp newsletter monthly, and community partner referrals.',
      },
      {
        key: 'seo_geo_presence',
        label: 'Do you currently work on SEO or GEO visibility?',
        type: 'select',
        helper: 'SEO means showing up in Google/search. GEO means being discoverable in AI answer tools such as ChatGPT, Gemini, or Perplexity.',
        options: ['Yes', 'No', 'Not sure', 'We want help with this'],
        required: true,
      },
      {
        key: 'website_updates',
        label: 'How easy is it for your team to update your website or online content?',
        type: 'select',
        options: ['Very easy', 'Somewhat easy', 'Difficult', 'We can’t update it', 'Not sure'],
      },
    ],
  },
  {
    key: 'donor_supporter_readiness',
    title: 'Donor & Supporter Readiness',
    description: 'Share general information about how supporters give, volunteer, and stay connected. Please do not include donor lists or private supporter details.',
    questions: [
      {
        key: 'accepts_online_donations',
        label: 'Can supporters make donations online today?',
        type: 'select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        key: 'donation_experience',
        label: 'How clear and trustworthy is the online donation experience for a first-time donor?',
        type: 'textarea',
        helper: 'Describe the experience generally — no payment details or private donor information.',
        placeholder: 'Example: Donors can give online, but the page does not clearly explain impact levels or recurring giving options.',
      },
      {
        key: 'recurring_giving',
        label: 'Do you currently offer recurring or monthly giving?',
        type: 'select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        key: 'donor_communication',
        label: 'How do you generally thank, update, or re-engage supporters?',
        type: 'textarea',
        placeholder: 'Example: We send thank-you emails manually, post impact updates on Facebook, and send a year-end newsletter.',
      },
    ],
  },
  {
    key: 'volunteer_readiness',
    title: 'Volunteer Readiness',
    description: 'Tell us how people get involved beyond financial support.',
    questions: [
      {
        key: 'uses_volunteers',
        label: 'Do volunteers currently support your work?',
        type: 'select',
        options: ['Yes', 'No', 'Sometimes'],
      },
      {
        key: 'volunteer_signup',
        label: 'How do volunteers currently learn about opportunities or sign up?',
        type: 'textarea',
        placeholder: 'Example: People email us, fill out a Google Form, or hear about opportunities through partner organizations.',
      },
      {
        key: 'volunteer_needs',
        label: 'What types of volunteer help would be most useful right now?',
        type: 'textarea',
        placeholder: 'Example: Event support, tutoring, food distribution, admin help, social media, or professional skills.',
      },
    ],
  },
  {
    key: 'trust_transparency',
    title: 'Trust & Transparency Signals',
    description: 'Share public-facing signals that help donors, partners, and community members trust your work.',
    questions: [
      {
        key: 'shows_impact_publicly',
        label: 'Do you publicly share impact, results, or progress updates?',
        type: 'select',
        options: ['Yes', 'Somewhat', 'No', 'Not sure'],
      },
      {
        key: 'public_proof',
        label: 'What public proof or credibility signals do you currently have?',
        type: 'textarea',
        helper: 'For example: testimonials, program photos, press mentions, partner endorsements, annual reports, or public impact summaries.',
        placeholder: 'Example: Program photos, partner logos, a few testimonials, annual impact numbers, and local news coverage.',
      },
      {
        key: 'transparency_practices',
        label: 'How do you help supporters understand how their support is used?',
        type: 'textarea',
        placeholder: 'Example: We share short impact updates, annual numbers, program photos, and stories from our team.',
      },
    ],
  },
  {
    key: 'content_messaging',
    title: 'Content & Messaging',
    description: 'Help us understand how clearly and consistently you communicate your story.',
    questions: [
      {
        key: 'message_clarity',
        label: 'How clear and consistent does your organization’s message feel today?',
        type: 'select',
        options: ['Very clear', 'Somewhat clear', 'Unclear', 'Not sure'],
      },
      {
        key: 'content_creation',
        label: 'Who is responsible for creating updates, emails, posts, or other public content?',
        type: 'textarea',
        placeholder: 'Example: The Executive Director writes most updates, with occasional help from a volunteer or board member.',
      },
      {
        key: 'content_audience',
        label: 'Who is your content and messaging mainly written for?',
        type: 'checkbox',
        helper: 'Select all that apply.',
        options: [
          'Donors',
          'Grantmakers / foundations',
          'Program participants / clients',
          'Volunteers',
          'Community partners',
          'Board members',
          'General public',
          'Other stakeholders',
        ],
        required: true,
      },
      {
        key: 'public_content_types',
        label: 'What public content would you like to publish or improve?',
        type: 'checkbox',
        helper: 'Select the content types that would help your organization communicate more consistently.',
        options: [
          'Website updates',
          'Email newsletters',
          'Social media posts',
          'Blog posts / articles',
          'Impact stories',
          'Program updates',
          'Grant or donor reports',
          'Other public content',
        ],
      },
      {
        key: 'content_frequency_goal',
        label: 'How often would you like to publish updates, emails, posts, or other public content?',
        type: 'select',
        options: ['Weekly', 'Twice per month', 'Monthly', 'Quarterly', 'Only when needed', 'Not sure yet'],
      },
      {
        key: 'content_challenges',
        label: 'What is hardest about communicating your work consistently?',
        type: 'textarea',
        placeholder: 'Example: We have many good stories but limited time, no clear content calendar, and inconsistent photos.',
      },
    ],
  },
  {
    key: 'accounting_operations',
    title: 'Accounting & Financial Operations',
    description: 'General, non-sensitive accounting context only. Please do not share private financial statements, bank details, payroll records, or confidential documents.',
    questions: [
      {
        key: 'accounting_owner',
        label: 'Who currently manages your accounting or bookkeeping process?',
        type: 'select',
        options: [
          'Internal staff member',
          'Executive Director or founder',
          'Volunteer',
          'Outside bookkeeper',
          'CPA or accounting firm',
          'Not sure / not clearly assigned',
          'Other',
        ],
        allowOther: true,
      },
      {
        key: 'books_updated_monthly',
        label: 'Are your books generally updated on a monthly basis?',
        type: 'select',
        options: ['Yes', 'Usually', 'Sometimes', 'No', 'Not sure'],
        required: true,
      },
      {
        key: 'financial_transparency_confidence',
        label: 'Do you feel your organization manages accounting and financial transparency well enough to support grant applications?',
        type: 'select',
        helper: 'Grant funders often look for clear budgets, reliable bookkeeping, and simple reporting. Please answer generally — no private financial details needed.',
        options: ['Yes', 'Mostly', 'Somewhat', 'No', 'Not sure'],
        required: true,
      },
      {
        key: 'accounting_challenges',
        label: 'What accounting or bookkeeping topics would you like help clarifying?',
        type: 'textarea',
        helper: 'Keep this general — for example: catching up books, monthly reports, restricted funds, budgeting, or preparing for Form 990.',
        placeholder: 'Example: Monthly reporting, restricted fund tracking, budget vs. actual reports, or Form 990 preparation timelines.',
      },
    ],
  },
  {
    key: 'grant_readiness',
    title: 'Grant Readiness',
    description: 'General grant planning context only. Please do not upload or paste confidential grant documents.',
    questions: [
      {
        key: 'currently_receives_grants',
        label: 'Does your organization currently receive grant funding?',
        type: 'select',
        options: ['Yes', 'No', 'Previously, but not currently', 'Not sure'],
        required: true,
      },
      {
        key: 'grant_plan_timeline',
        label: 'Are you planning to apply for grants, and when?',
        type: 'select',
        options: [
          'Already applying now',
          'Within 3 months',
          'Within 6 months',
          'Within 12 months',
          'Someday, but no timeline yet',
          'No current grant plans',
          'Not sure',
        ],
        required: true,
      },
      {
        key: 'grant_readiness_needs',
        label: 'What would help you feel more ready for grants?',
        type: 'checkbox',
        helper: 'Select all that apply.',
        options: [
          'Clearer program descriptions',
          'Better impact numbers or outcomes',
          'Stronger budget or financial reports',
          'Website credibility and transparency updates',
          'Grant calendar / deadline tracking',
          'Reusable organization narrative',
          'Board or partner information organized',
          'Not sure yet',
        ],
      },
      {
        key: 'grant_challenges',
        label: 'What feels hardest about grants right now?',
        type: 'textarea',
        placeholder: 'Example: Finding the right grants, writing strong narratives, preparing budgets, tracking deadlines, or reporting impact.',
      },
    ],
  },
  {
    key: 'operations_automation',
    title: 'Operations & Automation Opportunities',
    description: 'Share where everyday tools, workflows, or repetitive tasks may be slowing your team down.',
    questions: [
      {
        key: 'tools_used',
        label: 'What tools or software does your team rely on most?',
        type: 'textarea',
        helper: 'For example: email, spreadsheets, CRM, donation platform, scheduling tools, forms, or project management tools.',
        placeholder: 'Example: Google Workspace, Excel, QuickBooks, Donorbox, Mailchimp, Calendly, and shared Google Forms.',
      },
      {
        key: 'manual_tasks',
        label: 'What repetitive or manual tasks would you like to simplify or automate?',
        type: 'textarea',
        placeholder: 'Example: Copying form responses into spreadsheets, sending follow-up emails, creating reports, or tracking volunteer signups.',
      },
      {
        key: 'automation_opportunities',
        label: 'Which automation ideas would be useful for your team?',
        type: 'checkbox',
        helper: 'Select any that sound helpful. You do not need to know how they would work yet.',
        options: [
          'Website contact or service request forms',
          'Automatic thank-you or follow-up emails',
          'Volunteer signup and reminder workflow',
          'Donation receipt / supporter update workflow',
          'Monthly impact or board report dashboard',
          'Grant deadline tracker and reminder system',
          'Content calendar and draft post workflow',
          'Meeting notes / action item summaries',
          'CRM or spreadsheet cleanup workflow',
          'Not sure — I would like recommendations',
        ],
        required: true,
      },
      {
        key: 'automation_willingness',
        label: 'Would your team be open to using simple automation if it saved time and stayed easy to manage?',
        type: 'select',
        options: ['Yes', 'Maybe', 'Only if very simple', 'No', 'Not sure'],
        required: true,
      },
      {
        key: 'team_size',
        label: 'Which option best describes your current team size?',
        type: 'select',
        options: [
          'Just me',
          '2–5 people',
          '6–10 people',
          '11–25 people',
          'More than 25',
          'Mostly volunteers',
        ],
      },
    ],
  },
  {
    key: 'final_context',
    title: 'Final Context',
    description: 'Add anything that would help us prepare a more useful review and next-step recommendation.',
    questions: [
      {
        key: 'anything_else',
        label: 'Is there anything else you would like us to understand before we review your intake?',
        type: 'textarea',
        placeholder: 'Example: We are preparing for a campaign, rebuilding our website, or trying to organize our internal systems.',
      },
      {
        key: 'biggest_hope',
        label: 'What are you most hoping connectNPO can help you improve or accomplish?',
        type: 'textarea',
        placeholder: 'Example: A clearer growth plan, a better website experience, stronger donor engagement, or less manual admin work.',
      },
    ],
  },
];

/** Look up a section by its key. */
export function getSection(sectionKey: string): IntakeSection | undefined {
  return INTAKE_SECTIONS.find((s) => s.key === sectionKey);
}

/** Look up a question's label, used when storing/displaying answers. */
export function getQuestionLabel(
  sectionKey: string,
  questionKey: string,
): string | undefined {
  return getSection(sectionKey)?.questions.find((q) => q.key === questionKey)
    ?.label;
}
