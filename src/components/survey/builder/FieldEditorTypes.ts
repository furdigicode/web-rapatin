
import type { SurveyField, FieldType } from '@/types/SurveyTypes';

export interface LocalField {
  tempId: string;
  field_type: FieldType;
  label: string;
  description: string;
  options: string[];
  validation_rules: Record<string, any>;
  is_required: boolean;
  field_order: number;
}

export type EditableField = SurveyField | LocalField;
