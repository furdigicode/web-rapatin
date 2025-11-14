export type FeedbackType = 'complaint' | 'feature_request' | 'bug_report' | 'general' | 'question';
export type FeedbackStatus = 'new' | 'in_progress' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface UserFeedback {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  type: FeedbackType;
  subject: string;
  message: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  admin_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  user_agent: string | null;
  page_url: string | null;
  metadata: any;
}

export interface FeedbackFormData {
  name: string;
  email: string;
  phone?: string;
  type: FeedbackType;
  subject: string;
  message: string;
}

export interface FeedbackStats {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  closed: number;
}
