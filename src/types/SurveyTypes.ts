export type SurveyStatus = 'draft' | 'active' | 'closed';

export type SurveyQuestionType = 'text' | 'textarea' | 'radio' | 'checkbox' | 'scale';

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: SurveyStatus;
  start_date: string | null;
  end_date: string | null;
  total_responses: number;
  has_reward: boolean;
  reward_title: string | null;
  reward_code: string | null;
  reward_terms: string | null;
  created_at: string;
  updated_at: string;
}


export interface SurveyQuestion {
  id: string;
  survey_id: string;
  section: string | null;
  question_text: string;
  question_type: SurveyQuestionType;
  is_required: boolean;
  options: string[];
  scale_min: number;
  scale_max: number;
  question_order: number;
  created_at: string;
  updated_at: string;
}

/** Question shape used inside the admin builder (not yet persisted). */
export interface DraftQuestion {
  /** Local-only key for React lists. */
  key: string;
  id?: string;
  section: string | null;
  question_text: string;
  question_type: SurveyQuestionType;
  is_required: boolean;
  options: string[];
  scale_min: number;
  scale_max: number;
}

export interface SurveyFormData {
  title: string;
  description: string;
  slug: string;
  status: SurveyStatus;
  start_date: string | null;
  end_date: string | null;
  has_reward: boolean;
  reward_title: string;
  reward_code: string;
  reward_terms: string;
}


export interface SurveyResponse {
  id: string;
  survey_id: string;
  respondent_name: string;
  respondent_email: string;
  user_identifier: string;
  submitted_at: string;
  metadata: any;
}

export interface SurveyAnswer {
  id: string;
  response_id: string;
  question_id: string;
  answer_text: string | null;
  answer_options: string[];
  answer_number: number | null;
}

export const questionTypeLabels: Record<SurveyQuestionType, string> = {
  text: 'Teks singkat',
  textarea: 'Teks panjang',
  radio: 'Pilihan tunggal',
  checkbox: 'Pilihan ganda',
  scale: 'Skala',
};

export const defaultSurveyFormData: SurveyFormData = {
  title: '',
  description: '',
  slug: '',
  status: 'draft',
  start_date: null,
  end_date: null,
  has_reward: false,
  reward_title: '',
  reward_code: '',
  reward_terms: '',
};

