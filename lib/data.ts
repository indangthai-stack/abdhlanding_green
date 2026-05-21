/**
 * Server-only data loader for the landing page.
 *
 * Strategy: if Supabase env vars are present, fetch from Supabase. If
 * anything fails (network, RLS, missing tables) or env vars are not
 * configured, fall back to the in-repo seed data so the LP always
 * renders.
 *
 * Call from a Server Component (e.g. `app/page.tsx`).
 */
import "server-only";

import {
  FALLBACK_BRANDS,
  FALLBACK_FAQS,
  FALLBACK_PRICING_GROUPS,
  FALLBACK_PRICING_TIERS,
  FALLBACK_PRODUCTS,
  FALLBACK_SITE_CONFIG,
  FALLBACK_TESTIMONIALS,
} from "@/config/fallback";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  Brand,
  Faq,
  PricingGroup,
  PricingTier,
  Product,
  SiteConfig,
  Testimonial,
} from "@/lib/supabase/types";

export interface LandingPageData {
  brands: Brand[];
  pricingGroups: PricingGroup[];
  pricingTiers: PricingTier[];
  products: Product[];
  testimonials: Testimonial[];
  faqs: Faq[];
  siteConfig: SiteConfig;
  /** True when the data came from Supabase. False = fallback (dev or first deploy). */
  isLive: boolean;
}

export async function loadLandingPageData(): Promise<LandingPageData> {
  if (!isSupabaseConfigured()) {
    return {
      brands: FALLBACK_BRANDS,
      pricingGroups: FALLBACK_PRICING_GROUPS,
      pricingTiers: FALLBACK_PRICING_TIERS,
      products: FALLBACK_PRODUCTS,
      testimonials: FALLBACK_TESTIMONIALS,
      faqs: FALLBACK_FAQS,
      siteConfig: FALLBACK_SITE_CONFIG,
      isLive: false,
    };
  }

  try {
    const client = await createSupabaseServerClient();
    const [
      brandsRes,
      groupsRes,
      tiersRes,
      productsRes,
      testimonialsRes,
      faqsRes,
      configRes,
    ] = await Promise.all([
      client.from("brands").select("*").eq("is_active", true).order("sort_order"),
      client.from("pricing_groups").select("*").order("sort_order"),
      client.from("pricing_tiers").select("*").order("sort_order"),
      client
        .from("products")
        .select("*, brand:brands ( id, slug, name )")
        .eq("is_active", true)
        .order("sort_order"),
      client.from("testimonials").select("*").eq("is_active", true).order("sort_order"),
      client.from("faqs").select("*").eq("is_active", true).order("sort_order"),
      client.from("site_config").select("value").eq("key", "main").maybeSingle(),
    ]);

    const allOk =
      !brandsRes.error &&
      !groupsRes.error &&
      !tiersRes.error &&
      !productsRes.error &&
      !testimonialsRes.error &&
      !faqsRes.error;

    if (!allOk) {
      // Surface what failed in server logs but don't break the LP.
      console.warn("[loadLandingPageData] one or more queries failed, using fallback", {
        brands: brandsRes.error?.message,
        groups: groupsRes.error?.message,
        tiers: tiersRes.error?.message,
        products: productsRes.error?.message,
        testimonials: testimonialsRes.error?.message,
        faqs: faqsRes.error?.message,
      });
      return loadFallback();
    }

    const brands = (brandsRes.data as Brand[] | null) ?? FALLBACK_BRANDS;
    const groups = (groupsRes.data as PricingGroup[] | null) ?? FALLBACK_PRICING_GROUPS;
    const tiers = (tiersRes.data as PricingTier[] | null) ?? FALLBACK_PRICING_TIERS;
    const products = (productsRes.data as Product[] | null) ?? FALLBACK_PRODUCTS;
    const testimonials =
      (testimonialsRes.data as Testimonial[] | null) ?? FALLBACK_TESTIMONIALS;
    const faqs = (faqsRes.data as Faq[] | null) ?? FALLBACK_FAQS;
    const config =
      (configRes.data?.value as SiteConfig | undefined) ?? FALLBACK_SITE_CONFIG;

    const hasContent =
      brands.length > 0 &&
      groups.length > 0 &&
      tiers.length > 0 &&
      products.length > 0;

    return {
      brands,
      pricingGroups: groups,
      pricingTiers: tiers,
      products,
      testimonials,
      faqs,
      siteConfig: config,
      isLive: hasContent,
    };
  } catch (err) {
    console.warn("[loadLandingPageData] threw, using fallback", err);
    return loadFallback();
  }
}

function loadFallback(): LandingPageData {
  return {
    brands: FALLBACK_BRANDS,
    pricingGroups: FALLBACK_PRICING_GROUPS,
    pricingTiers: FALLBACK_PRICING_TIERS,
    products: FALLBACK_PRODUCTS,
    testimonials: FALLBACK_TESTIMONIALS,
    faqs: FALLBACK_FAQS,
    siteConfig: FALLBACK_SITE_CONFIG,
    isLive: false,
  };
}
