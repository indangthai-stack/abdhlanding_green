/**
 * Pure pricing helpers — used in both Server (page render) and Client
 * (filter/tier picker) components so both sides agree on numbers.
 *
 * Pricing model: final = group.cost_base_vnd + tier.margin_vnd.
 *   • group reflects fabric / brand tier (A=basic … D=premium)
 *   • tier reflects order size (more qty → smaller margin)
 */
import type { PricingGroup, PricingTier } from "@/lib/supabase/types";

/** Final price (VND) for one set in a given group at a given tier. */
export function priceForGroupTier(
  group: PricingGroup,
  tier: PricingTier,
): number {
  return group.cost_base_vnd + tier.margin_vnd;
}

/** Round to a "nice" VND price ending in K. */
export function roundToK(vnd: number): number {
  return Math.round(vnd / 1000) * 1000;
}

/** Format a VND price as "129K" or "129.000đ". */
export function formatVnd(
  vnd: number,
  style: "k" | "full" = "k",
): string {
  if (style === "k") return `${Math.round(vnd / 1000)}K`;
  return `${new Intl.NumberFormat("vi-VN").format(vnd)}đ`;
}

/** Lowest-priced group anchor at a tier ("từ XK"). */
export function anchorPriceForTier(
  groups: PricingGroup[],
  tier: PricingTier,
): number {
  if (groups.length === 0) return tier.margin_vnd;
  const min = groups.reduce((acc, g) =>
    priceForGroupTier(g, tier) < priceForGroupTier(acc, tier) ? g : acc,
  );
  return priceForGroupTier(min, tier);
}

/** Highest-priced group at a tier ("đến XK"). */
export function ceilingPriceForTier(
  groups: PricingGroup[],
  tier: PricingTier,
): number {
  if (groups.length === 0) return tier.margin_vnd;
  const max = groups.reduce((acc, g) =>
    priceForGroupTier(g, tier) > priceForGroupTier(acc, tier) ? g : acc,
  );
  return priceForGroupTier(max, tier);
}

/** Format the qty range of a tier as "10-19 áo" / "30+ áo". */
export function formatQtyRange(tier: PricingTier): string {
  if (tier.qty_max == null) return `${tier.qty_min}+ áo`;
  return `${tier.qty_min}-${tier.qty_max} áo`;
}

/** Find a tier by `tier_key`, fall back to the popular one. */
export function findTierOrDefault(
  tiers: PricingTier[],
  key: string | undefined | null,
): PricingTier {
  if (key) {
    const found = tiers.find((t) => t.tier_key === key);
    if (found) return found;
  }
  return tiers.find((t) => t.is_popular) ?? tiers[0];
}
