/** Workflow status for an organization's intake. */
export type OrganizationStatus =
  | 'draft_created'
  | 'intake_sent'
  | 'email_failed'
  | 'in_progress'
  | 'submitted'
  | 'under_review'
  | 'needs_clarification'
  | 'ready_for_report'
  | 'report_created';

/** A single stored answer value. Flexible to support future field types. */
export type IntakeAnswer = string | string[] | number | boolean | null;

/** Supported input types for intake questions. */
export type IntakeQuestionType = 'text' | 'textarea' | 'url' | 'select';

/** One question within an intake section. */
export type IntakeQuestion = {
  key: string;
  label: string;
  type: IntakeQuestionType;
  /** Short, friendly helper text shown under the label. */
  helper?: string;
  /** Options for `select` questions. */
  options?: string[];
  placeholder?: string;
  required?: boolean;
  /** When true, selecting "Other" reveals a companion free-text field. */
  allowOther?: boolean;
};

/** A group of related intake questions. */
export type IntakeSection = {
  key: string;
  title: string;
  /** Short intro shown at the top of the section. */
  description?: string;
  questions: IntakeQuestion[];
};

/** Shape used when saving an answer to `intake_responses`. */
export type IntakeResponseInput = {
  section_key: string;
  question_key: string;
  question_label: string;
  answer: IntakeAnswer;
};

/** Row shape of the `organizations` table. */
export type Organization = {
  id: string;
  name: string;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_role: string | null;
  city: string | null;
  state: string | null;
  service_area: string | null;
  organization_category: string | null;
  nonprofit_status: string | null;
  annual_budget_range: string | null;
  status: OrganizationStatus;
  intake_token: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Row shape of the `intake_responses` table. */
export type IntakeResponse = {
  id: string;
  organization_id: string;
  section_key: string;
  question_key: string;
  question_label: string;
  answer: IntakeAnswer;
  created_at: string;
  updated_at: string;
};

/** Row shape of the `admin_notes` table. */
export type AdminNote = {
  id: string;
  organization_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
};
