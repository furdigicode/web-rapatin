
export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'closed';
  created_by: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SurveySettings {
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  welcome_message?: string;
  thank_you_message?: string;
  collect_email?: boolean;
  collect_name?: boolean;
  allow_anonymous?: boolean;
  response_limit?: number;
  expires_at?: string;
}

export interface SurveyField {
  id: string;
  survey_id: string;
  field_type: FieldType;
  label: string;
  description?: string;
  options: string[];
  validation_rules: Record<string, any>;
  field_order: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'radio' 
  | 'checkbox' 
  | 'select' 
  | 'number' 
  | 'date' 
  | 'email' 
  | 'phone' 
  | 'file' 
  | 'rating' 
  | 'scale' 
  | 'section' 
  | 'page_break';

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  fileTypes?: string[];
  maxFileSize?: number;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  respondent_email?: string;
  respondent_name?: string;
  ip_address?: string;
  user_agent?: string;
  submitted_at: string;
  is_complete: boolean;
  completion_time_seconds?: number;
}

export interface SurveyFieldResponse {
  id: string;
  response_id: string;
  field_id: string;
  value?: string;
  file_url?: string;
  created_at: string;
}

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface DraggedField {
  type: FieldType;
  label: string;
  icon: React.ComponentType;
}
