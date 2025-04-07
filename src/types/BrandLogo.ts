
export interface BrandLogo {
  id: string;
  name: string;
  svg_content: string;
  width: number;
  height: number;
  url?: string;
  active: boolean;
  order_position: number;
}

export interface UrlItem {
  id: string;
  name: string;
  url: string;
}

export interface Urls {
  id: string;
  title: string;
  items: UrlItem[];
}
