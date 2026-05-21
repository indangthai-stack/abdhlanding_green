/**
 * Database types — mirrors the SQL schema in
 * `supabase/migrations/0001_init.sql`.
 *
 * Maintained by hand so the LP renders without the Supabase CLI in CI.
 * Once linked, you can regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/database.types.ts
 */

export type GroupKey = "A" | "B" | "C" | "D";
export type Fit = "om" | "tieu_chuan" | "dai_tay";
export type LeadStatus = "new" | "contacted" | "won" | "lost";

export interface Brand {
  id: number;
  slug: string;
  name: string;
  group_key: GroupKey;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface PricingGroup {
  group_key: GroupKey;
  label: string;
  description: string | null;
  cost_base_vnd: number;
  sort_order: number;
}

export interface PricingTier {
  id: number;
  tier_key: string;
  qty_min: number;
  qty_max: number | null;
  margin_vnd: number;
  label: string;
  description: string | null;
  perks: string[];
  is_popular: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand_id: number | null;
  group_key: GroupKey | null;
  primary_color: string | null;
  color_hex: string | null;
  fit: Fit | null;
  retail_price_vnd: number | null;
  image_url: string | null;
  /** Multi-image gallery. First entry is the cover. */
  image_urls: string[] | null;
  image_alt: string | null;
  badge: string | null;
  is_bestseller: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  /** Joined brand from `selectWithRelations()`. */
  brand?: Pick<Brand, "id" | "slug" | "name"> | null;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  fc_name: string | null;
  location: string | null;
  content: string;
  rating: number;
  qty: number | null;
  brand_name: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Lead {
  id: number;
  customer_name: string;
  phone: string;
  fc_name: string | null;
  qty_tier: string | null;
  selected_product_slug: string | null;
  message: string | null;
  source: string | null;
  metadata: Record<string, unknown>;
  status: LeadStatus;
  created_at: string;
}

export interface LeadInsert {
  customer_name: string;
  phone: string;
  fc_name?: string | null;
  qty_tier?: string | null;
  selected_product_slug?: string | null;
  message?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown>;
}

/** Flat config used everywhere — single source of truth for site copy. */
export interface SiteConfig {
  site_name: string;
  site_tagline: string;
  hotline: { label: string; number: string; tel: string };
  zalo: { label: string; number: string; url: string };
  address: {
    line: string;
    city: string;
    region: string;
    country: string;
    map_url?: string;
  };
  hours: string;
  email: string;
  facebook_url: string;
  shopee_url: string;
  founded_year: number;
  total_fcs: number;
  shopee_rating: number;
  domain: string;
  promo_top_bar: string;
}
