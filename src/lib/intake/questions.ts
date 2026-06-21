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
    title: 'Organization Basics',
    description: 'A few quick details about your organization.',
    questions: [
      {
        key: 'organization_name',
        label: 'What is your organization’s name?',
        type: 'text',
        required: true,
      },
      {
        key: 'website_url',
        label: 'What is your website address?',
        type: 'url',
        helper: 'If you don’t have a website yet, you can leave this blank.',
        placeholder: 'https://',
      },
      {
        key: 'location',
        label: 'Where is your organization based?',
        type: 'text',
        helper: 'City and state is plenty — no street address needed.',
      },
      {
        key: 'service_area',
        label: 'What area or community do you serve?',
        type: 'text',
        helper: 'For example: a neighborhood, a city, a region, or nationwide.',
      },
      {
        key: 'organization_category',
        label: 'Which best describes your focus area?',
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
    description: 'Help us understand your purpose and who you serve.',
    questions: [
      {
        key: 'mission_statement',
        label: 'What is your organization’s mission?',
        type: 'textarea',
        helper: 'A sentence or two is perfect.',
        required: true,
      },
      {
        key: 'community_served',
        label: 'Who do you serve, and who is your community?',
        type: 'textarea',
      },
      {
        key: 'impact_story',
        label: 'Can you share a short example of the impact you’ve made?',
        type: 'textarea',
        helper: 'A brief story or result helps us understand your work.',
      },
    ],
  },
  {
    key: 'programs_services',
    title: 'Programs & Services',
    description: 'Tell us about the work you do day to day.',
    questions: [
      {
        key: 'main_programs',
        label: 'What are your main programs or services?',
        type: 'textarea',
        required: true,
      },
      {
        key: 'who_benefits',
        label: 'Roughly how many people do you serve in a typical year?',
        type: 'text',
        helper: 'A rough estimate is fine.',
      },
      {
        key: 'delivery_method',
        label: 'How do people access your programs?',
        type: 'textarea',
        helper: 'For example: in person, online, by referral, or by appointment.',
      },
    ],
  },
  {
    key: 'current_goals',
    title: 'Current Goals',
    description: 'What you’re hoping to achieve right now.',
    questions: [
      {
        key: 'top_goals',
        label: 'What are your top goals for the next 6–12 months?',
        type: 'textarea',
        required: true,
      },
      {
        key: 'growth_priority',
        label: 'What would growth look like for your organization?',
        type: 'textarea',
        helper: 'For example: more donors, more volunteers, more visibility.',
      },
      {
        key: 'success_definition',
        label: 'How will you know you’ve succeeded?',
        type: 'textarea',
      },
    ],
  },
  {
    key: 'challenges',
    title: 'Challenges',
    description: 'Where you feel stuck or could use support.',
    questions: [
      {
        key: 'biggest_challenges',
        label: 'What are your biggest challenges right now?',
        type: 'textarea',
        required: true,
      },
      {
        key: 'time_consuming_tasks',
        label: 'What tasks take up the most of your team’s time?',
        type: 'textarea',
      },
      {
        key: 'support_needed',
        label: 'Where would outside help make the biggest difference?',
        type: 'textarea',
      },
    ],
  },
  {
    key: 'website_digital_presence',
    title: 'Website & Digital Presence',
    description: 'How your organization shows up online.',
    questions: [
      {
        key: 'has_website',
        label: 'Do you currently have a website?',
        type: 'select',
        options: ['Yes', 'No', 'In progress'],
      },
      {
        key: 'website_feelings',
        label: 'How do you feel about your current website?',
        type: 'textarea',
        helper: 'What works well, and what frustrates you?',
      },
      {
        key: 'social_channels',
        label: 'Which social or online channels do you actively use?',
        type: 'textarea',
        helper: 'For example: Instagram, Facebook, newsletter, YouTube.',
      },
      {
        key: 'website_updates',
        label: 'How easy is it for your team to update your website?',
        type: 'select',
        options: ['Very easy', 'Somewhat easy', 'Difficult', 'We can’t update it', 'Not sure'],
      },
    ],
  },
  {
    key: 'donor_supporter_readiness',
    title: 'Donor & Supporter Readiness',
    description: 'How supporters give and stay connected. (No donor lists — just general signals.)',
    questions: [
      {
        key: 'accepts_online_donations',
        label: 'Can people donate to you online today?',
        type: 'select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        key: 'donation_experience',
        label: 'How would you describe your online giving experience?',
        type: 'textarea',
        helper: 'Is it simple, clear, and trustworthy for a first-time donor?',
      },
      {
        key: 'recurring_giving',
        label: 'Do you offer recurring (monthly) giving?',
        type: 'select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        key: 'donor_communication',
        label: 'How do you currently thank and stay in touch with supporters?',
        type: 'textarea',
      },
    ],
  },
  {
    key: 'volunteer_readiness',
    title: 'Volunteer Readiness',
    description: 'How people get involved beyond giving.',
    questions: [
      {
        key: 'uses_volunteers',
        label: 'Do you work with volunteers?',
        type: 'select',
        options: ['Yes', 'No', 'Sometimes'],
      },
      {
        key: 'volunteer_signup',
        label: 'How do volunteers currently sign up or get involved?',
        type: 'textarea',
      },
      {
        key: 'volunteer_needs',
        label: 'What kind of volunteer help do you need most?',
        type: 'textarea',
      },
    ],
  },
  {
    key: 'trust_transparency',
    title: 'Trust & Transparency Signals',
    description: 'How you build public trust. (Only general, public-facing signals.)',
    questions: [
      {
        key: 'shows_impact_publicly',
        label: 'Do you share your impact or results publicly?',
        type: 'select',
        options: ['Yes', 'Somewhat', 'No', 'Not sure'],
      },
      {
        key: 'public_proof',
        label: 'What public proof of your work do you have?',
        type: 'textarea',
        helper: 'For example: testimonials, photos, press, partner endorsements.',
      },
      {
        key: 'transparency_practices',
        label: 'How do you show supporters their support is used well?',
        type: 'textarea',
      },
    ],
  },
  {
    key: 'content_messaging',
    title: 'Content & Messaging',
    description: 'How you tell your story.',
    questions: [
      {
        key: 'message_clarity',
        label: 'How clear do you feel your story and message are today?',
        type: 'select',
        options: ['Very clear', 'Somewhat clear', 'Unclear', 'Not sure'],
      },
      {
        key: 'content_creation',
        label: 'Who creates your content (posts, emails, updates)?',
        type: 'textarea',
      },
      {
        key: 'content_challenges',
        label: 'What’s hardest about creating content or communicating?',
        type: 'textarea',
      },
    ],
  },
  {
    key: 'accounting_operations',
    title: 'Accounting & Financial Operations',
    description: 'General, non-sensitive accounting context. Please do not share private financial statements, bank details, or confidential records.',
    questions: [
      {
        key: 'accounting_owner',
        label: 'Who currently handles your accounting or bookkeeping?',
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
        label: 'Are your books usually updated each month?',
        type: 'select',
        options: ['Yes', 'Usually', 'Sometimes', 'No', 'Not sure'],
      },
      {
        key: 'accounting_challenges',
        label: 'What accounting or bookkeeping challenges would you like help understanding?',
        type: 'textarea',
        helper: 'Keep this general — for example: catching up books, monthly reports, tracking restricted funds, or preparing for Form 990.',
      },
    ],
  },
  {
    key: 'operations_automation',
    title: 'Operations & Automation Opportunities',
    description: 'Everyday tools and routines that keep you running.',
    questions: [
      {
        key: 'tools_used',
        label: 'What tools or software does your team rely on most?',
        type: 'textarea',
        helper: 'For example: email, spreadsheets, a CRM, scheduling tools.',
      },
      {
        key: 'manual_tasks',
        label: 'What repetitive tasks do you wish could be automated?',
        type: 'textarea',
      },
      {
        key: 'team_size',
        label: 'How big is your team?',
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
    description: 'Anything else you’d like us to know.',
    questions: [
      {
        key: 'anything_else',
        label: 'Is there anything else you’d like to share?',
        type: 'textarea',
      },
      {
        key: 'biggest_hope',
        label: 'What are you most hoping connectNPO can help with?',
        type: 'textarea',
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
