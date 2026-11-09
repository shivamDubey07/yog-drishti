export interface InstructorProfile {
  name: string;
  role: string;
  bio: string;
  image_url?: string;
}

export interface SiteSettings {
  id: number;
  business_name: string;
  tagline: string;
  phone_number: string;
  email: string;
  address: string;
  google_maps_embed_url: string;
  google_maps_directions_url: string;
  opening_hours: string;
  hero_title: string;
  hero_subtitle: string;
  about_summary: string;
  about_full: string;
  philosophy_text: string;
  mission_vision: string;
  instructors_json: InstructorProfile[];
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  seo_default_title: string;
  seo_default_description: string;
  updated_at: string;
}

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface YogaClass {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  benefits: string[];
  experience_level: ExperienceLevel;
  schedule_text: string;
  instructor_name: string;
  image_url: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category_id: string | null;
  blog_categories?: BlogCategory | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  storage_path: string | null;
  caption: string;
  alt_text: string;
  category: string;
  display_order: number;
  created_at: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Resolved';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  interested_class?: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}
