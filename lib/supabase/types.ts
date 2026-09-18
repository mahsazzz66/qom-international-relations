export type ContentType = "news" | "statement" | "event" | "photo" | "video" | "document" | "investment";

export type ContentItem = {
  id: string;
  type: ContentType;
  category: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string;
  body_ar: string;
  image_url: string | null;
  media_url: string | null;
  event_date: string | null;
  location: string | null;
  status: string | null;
  published: boolean;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  role: "admin" | "editor";
  created_at: string;
  email?: string;
};
