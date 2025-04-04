
// Custom Supabase type definitions
// These complement the auto-generated types from src/integrations/supabase/types.ts

import { Database } from "@/integrations/supabase/types";

// URLs table types
export type Urls = {
  id: string;
  title: string;
  items: UrlItem[];
};

export type UrlItem = {
  label: string;
  description: string;
  url: string;
};

// Brand logos types
export type BrandLogo = {
  id: string;
  name: string;
  svgContent: string;
  width: number;
  height: number;
  active: boolean;
  order: number;
};

// Extend the Database type if needed in the future
export type ExtendedDatabase = Database & {
  // Add additional custom types here if needed
};
