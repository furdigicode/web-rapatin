export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string
          expires_at: string
          id: string
          last_used: string | null
          token_hash: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          expires_at: string
          id?: string
          last_used?: string | null
          token_hash: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          last_used?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_login: string | null
          password_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_login?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      article_notifications: {
        Row: {
          blog_post_id: string | null
          button_text: string | null
          button_url: string | null
          category: string | null
          created_at: string | null
          display_frequency: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          notification_type: string | null
          popup_click_count: number | null
          popup_view_count: number | null
          priority: number | null
          read: boolean | null
          show_close_button: boolean | null
          target_url: string | null
          title: string
        }
        Insert: {
          blog_post_id?: string | null
          button_text?: string | null
          button_url?: string | null
          category?: string | null
          created_at?: string | null
          display_frequency?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          notification_type?: string | null
          popup_click_count?: number | null
          popup_view_count?: number | null
          priority?: number | null
          read?: boolean | null
          show_close_button?: boolean | null
          target_url?: string | null
          title: string
        }
        Update: {
          blog_post_id?: string | null
          button_text?: string | null
          button_url?: string | null
          category?: string | null
          created_at?: string | null
          display_frequency?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          notification_type?: string | null
          popup_click_count?: number | null
          popup_view_count?: number | null
          priority?: number | null
          read?: boolean | null
          show_close_button?: boolean | null
          target_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_notifications_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          social_links: Json | null
          specialization: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          social_links?: Json | null
          specialization?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          social_links?: Json | null
          specialization?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          author_id: string
          category: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          focus_keyword: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          send_notification: boolean
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          word_count: number | null
        }
        Insert: {
          author?: string
          author_id: string
          category: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          send_notification?: boolean
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          word_count?: number | null
        }
        Update: {
          author?: string
          author_id?: string
          category?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          send_notification?: boolean
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_orders: {
        Row: {
          access_slug: string | null
          created_at: string
          custom_passcode: string | null
          email: string
          end_type: string | null
          expired_at: string | null
          id: string
          is_language_interpretation: boolean | null
          is_meeting_qna: boolean | null
          is_meeting_registration: boolean | null
          is_mute_upon_entry: boolean | null
          is_recurring: boolean | null
          is_req_unmute_permission: boolean | null
          kledo_invoice_id: string | null
          kledo_sync_error: string | null
          kledo_synced_at: string | null
          meeting_date: string
          meeting_id: string | null
          meeting_time: string | null
          meeting_topic: string | null
          monthly_day: number | null
          monthly_week: number | null
          name: string
          order_number: string | null
          paid_at: string | null
          participant_count: number
          payment_method: string | null
          payment_status: string
          price: number
          rapatin_order_id: string | null
          recurrence_count: number | null
          recurrence_end_date: string | null
          recurrence_type: number | null
          repeat_interval: number | null
          total_days: number | null
          updated_at: string
          weekly_days: number[] | null
          whatsapp: string
          xendit_invoice_id: string | null
          xendit_invoice_url: string | null
          xendit_reference_id: string | null
          zoom_link: string | null
          zoom_passcode: string | null
        }
        Insert: {
          access_slug?: string | null
          created_at?: string
          custom_passcode?: string | null
          email: string
          end_type?: string | null
          expired_at?: string | null
          id?: string
          is_language_interpretation?: boolean | null
          is_meeting_qna?: boolean | null
          is_meeting_registration?: boolean | null
          is_mute_upon_entry?: boolean | null
          is_recurring?: boolean | null
          is_req_unmute_permission?: boolean | null
          kledo_invoice_id?: string | null
          kledo_sync_error?: string | null
          kledo_synced_at?: string | null
          meeting_date: string
          meeting_id?: string | null
          meeting_time?: string | null
          meeting_topic?: string | null
          monthly_day?: number | null
          monthly_week?: number | null
          name: string
          order_number?: string | null
          paid_at?: string | null
          participant_count: number
          payment_method?: string | null
          payment_status?: string
          price: number
          rapatin_order_id?: string | null
          recurrence_count?: number | null
          recurrence_end_date?: string | null
          recurrence_type?: number | null
          repeat_interval?: number | null
          total_days?: number | null
          updated_at?: string
          weekly_days?: number[] | null
          whatsapp: string
          xendit_invoice_id?: string | null
          xendit_invoice_url?: string | null
          xendit_reference_id?: string | null
          zoom_link?: string | null
          zoom_passcode?: string | null
        }
        Update: {
          access_slug?: string | null
          created_at?: string
          custom_passcode?: string | null
          email?: string
          end_type?: string | null
          expired_at?: string | null
          id?: string
          is_language_interpretation?: boolean | null
          is_meeting_qna?: boolean | null
          is_meeting_registration?: boolean | null
          is_mute_upon_entry?: boolean | null
          is_recurring?: boolean | null
          is_req_unmute_permission?: boolean | null
          kledo_invoice_id?: string | null
          kledo_sync_error?: string | null
          kledo_synced_at?: string | null
          meeting_date?: string
          meeting_id?: string | null
          meeting_time?: string | null
          meeting_topic?: string | null
          monthly_day?: number | null
          monthly_week?: number | null
          name?: string
          order_number?: string | null
          paid_at?: string | null
          participant_count?: number
          payment_method?: string | null
          payment_status?: string
          price?: number
          rapatin_order_id?: string | null
          recurrence_count?: number | null
          recurrence_end_date?: string | null
          recurrence_type?: number | null
          repeat_interval?: number | null
          total_days?: number | null
          updated_at?: string
          weekly_days?: number[] | null
          whatsapp?: string
          xendit_invoice_id?: string | null
          xendit_invoice_url?: string | null
          xendit_reference_id?: string | null
          zoom_link?: string | null
          zoom_passcode?: string | null
        }
        Relationships: []
      }
      kledo_auth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          last_updated: string
          published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          last_updated?: string
          published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          last_updated?: string
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      meta_pixel_settings: {
        Row: {
          enabled: boolean
          id: string
          pixel_id: string
          track_page_view: boolean
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          id?: string
          pixel_id: string
          track_page_view?: boolean
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          id?: string
          pixel_id?: string
          track_page_view?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      rapatin_auth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      user_feedbacks: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          metadata: Json | null
          name: string
          page_url: string | null
          phone: string | null
          priority: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string
          type: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          metadata?: Json | null
          name: string
          page_url?: string | null
          phone?: string | null
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject: string
          type: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          metadata?: Json | null
          name?: string
          page_url?: string | null
          phone?: string | null
          priority?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string
          type?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_feedbacks_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_read_status: {
        Row: {
          created_at: string
          id: string
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_read_status_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "article_notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      voting_options: {
        Row: {
          created_at: string
          id: string
          option_image: string | null
          option_order: number
          option_text: string
          updated_at: string
          vote_count: number | null
          voting_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_image?: string | null
          option_order?: number
          option_text: string
          updated_at?: string
          vote_count?: number | null
          voting_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_image?: string | null
          option_order?: number
          option_text?: string
          updated_at?: string
          vote_count?: number | null
          voting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voting_options_voting_id_fkey"
            columns: ["voting_id"]
            isOneToOne: false
            referencedRelation: "votings"
            referencedColumns: ["id"]
          },
        ]
      }
      voting_responses: {
        Row: {
          id: string
          metadata: Json | null
          option_id: string
          user_email: string | null
          user_id: string | null
          user_identifier: string
          user_name: string | null
          voted_at: string
          voting_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          option_id: string
          user_email?: string | null
          user_id?: string | null
          user_identifier: string
          user_name?: string | null
          voted_at?: string
          voting_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          option_id?: string
          user_email?: string | null
          user_id?: string | null
          user_identifier?: string
          user_name?: string | null
          voted_at?: string
          voting_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voting_responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "voting_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voting_responses_voting_id_fkey"
            columns: ["voting_id"]
            isOneToOne: false
            referencedRelation: "votings"
            referencedColumns: ["id"]
          },
        ]
      }
      votings: {
        Row: {
          allow_anonymous: boolean | null
          category: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          max_selections: number | null
          published_at: string | null
          require_login: boolean | null
          show_results: boolean | null
          slug: string
          start_date: string | null
          status: string
          title: string
          total_votes: number | null
          updated_at: string
          voting_type: string
        }
        Insert: {
          allow_anonymous?: boolean | null
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          max_selections?: number | null
          published_at?: string | null
          require_login?: boolean | null
          show_results?: boolean | null
          slug: string
          start_date?: string | null
          status?: string
          title: string
          total_votes?: number | null
          updated_at?: string
          voting_type?: string
        }
        Update: {
          allow_anonymous?: boolean | null
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          max_selections?: number | null
          published_at?: string | null
          require_login?: boolean | null
          show_results?: boolean | null
          slug?: string
          start_date?: string | null
          status?: string
          title?: string
          total_votes?: number | null
          updated_at?: string
          voting_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_voting_status: {
        Args: { voting_id_param: string }
        Returns: boolean
      }
      generate_order_number: { Args: never; Returns: string }
      get_voting_results: {
        Args: { voting_id_param: string }
        Returns: {
          option_id: string
          option_image: string
          option_text: string
          percentage: number
          vote_count: number
        }[]
      }
      is_admin_user: { Args: never; Returns: boolean }
      is_custom_admin_user: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
