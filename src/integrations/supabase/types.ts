export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about_page: {
        Row: {
          content: string
          id: string
          image_url: string | null
          order_position: number
          section_name: string
          title: string
        }
        Insert: {
          content: string
          id?: string
          image_url?: string | null
          order_position?: number
          section_name: string
          title: string
        }
        Update: {
          content?: string
          id?: string
          image_url?: string | null
          order_position?: number
          section_name?: string
          title?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          id: string
          image_url: string | null
          is_published: boolean
          published_at: string | null
          slug: string
          summary: string
          title: string
          view_count: number
        }
        Insert: {
          author?: string
          content: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug: string
          summary: string
          title: string
          view_count?: number
        }
        Update: {
          author?: string
          content?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          slug?: string
          summary?: string
          title?: string
          view_count?: number
        }
        Relationships: []
      }
      brand_logos: {
        Row: {
          active: boolean
          height: number
          id: string
          name: string
          order_position: number
          svg_content: string
          url: string | null
          width: number
        }
        Insert: {
          active?: boolean
          height?: number
          id?: string
          name: string
          order_position?: number
          svg_content: string
          url?: string | null
          width?: number
        }
        Update: {
          active?: boolean
          height?: number
          id?: string
          name?: string
          order_position?: number
          svg_content?: string
          url?: string | null
          width?: number
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          icon: string | null
          id: string
          type: string
          value: string
        }
        Insert: {
          icon?: string | null
          id?: string
          type: string
          value: string
        }
        Update: {
          icon?: string | null
          id?: string
          type?: string
          value?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          active: boolean
          answer: string
          category: string
          id: string
          order_position: number
          question: string
        }
        Insert: {
          active?: boolean
          answer: string
          category?: string
          id?: string
          order_position?: number
          question: string
        }
        Update: {
          active?: boolean
          answer?: string
          category?: string
          id?: string
          order_position?: number
          question?: string
        }
        Relationships: []
      }
      privacy_content: {
        Row: {
          content: string
          id: string
          updated_at: string | null
          version: string
        }
        Insert: {
          content: string
          id?: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          content?: string
          id?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      terms_content: {
        Row: {
          content: string
          id: string
          updated_at: string | null
          version: string
        }
        Insert: {
          content: string
          id?: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          content?: string
          id?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean
          avatar_url: string | null
          company: string
          content: string
          id: string
          name: string
          order_position: number
          position: string
          rating: number
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          company: string
          content: string
          id?: string
          name: string
          order_position?: number
          position: string
          rating?: number
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          company?: string
          content?: string
          id?: string
          name?: string
          order_position?: number
          position?: string
          rating?: number
        }
        Relationships: []
      }
      urls: {
        Row: {
          id: string
          items: Json
          title: string
        }
        Insert: {
          id: string
          items?: Json
          title: string
        }
        Update: {
          id?: string
          items?: Json
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
