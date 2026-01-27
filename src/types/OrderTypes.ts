export interface GuestOrder {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  meeting_date: string;
  meeting_time: string | null;
  meeting_topic: string | null;
  custom_passcode: string | null;
  participant_count: number;
  price: number;
  payment_status: 'pending' | 'paid' | 'expired';
  payment_method: string | null;
  xendit_invoice_id: string | null;
  xendit_invoice_url: string | null;
  zoom_link: string | null;
  zoom_passcode: string | null;
  meeting_id: string | null;
  rapatin_order_id: string | null;
  is_meeting_registration: boolean | null;
  is_meeting_qna: boolean | null;
  is_language_interpretation: boolean | null;
  is_mute_upon_entry: boolean | null;
  is_req_unmute_permission: boolean | null;
  created_at: string;
  paid_at: string | null;
  expired_at: string | null;
  updated_at: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  paid: number;
  expired: number;
}

export type PaymentStatus = 'pending' | 'paid' | 'expired' | 'all';
