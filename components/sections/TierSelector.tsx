"use client";

import { useEffect, useMemo } from "react";
import { Check, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  anchorPriceForTier,
  ceilingPriceForTier,
  formatQtyRange,
  formatVnd,
} from "@/lib/pricing";
import { useFiltersStore } from "@/store/filters";
import type { PricingGroup, PricingTier } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/**
 * Tier picker — drives the price shown on every product card below.
 *
 * Deliberately NOT a hard gate: the page renders normally even if the
 * customer never touches it. Default selection = the `is_popular` tier
 * (or first), set via an effect after hydration.
 */
export function TierSelector({
  groups,
  tiers,
}: {
  groups: PricingGroup[];
  tiers: PricingTier[];
}) {
  const selectedTierKey = useFiltersStore((s) => s.selectedTierKey);
  const setTier = useFiltersStore((s) => s.setTier);

  // Seed once on mount so the grid has a tier to render against.
  useEffect(() => {
    if (selectedTierKey) return;
    const popular = tiers.find((t) => t.is_popular) ?? tiers[0];
    if (popular) setTier(popular.tier_key);
  }, [selectedTierKey, tiers, setTier]);

  const orderedTiers = useMemo(
    () => [...tiers].sort((a, b) => a.sort_order - b.sort_order),
    [tiers],
  );

  return (
    <section id="bang-gia" className="py-14 md:py-20">
      <Container>
        <SectionHeader
          eyebrow="Bước 1 · Chọn quy mô đội"
          title="Càng đông, càng tiết kiệm — kèm quà tặng thiệt."
          subtitle="Chọn 1 mức để trang tự tính giá team cho mọi mẫu bên dưới. Anh có thể đổi mức bất cứ lúc nào."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {orderedTiers.map((tier) => {
            const minPrice = anchorPriceForTier(groups, tier);
            const maxPrice = ceilingPriceForTier(groups, tier);
            const isActive = selectedTierKey === tier.tier_key;
            return (
              <TierCard
                key={tier.tier_key}
                tier={tier}
                minPrice={minPrice}
                maxPrice={maxPrice}
                isActive={isActive}
                onSelect={() => setTier(tier.tier_key)}
              />
            );
          })}
        </div>

        <p className="mt-4 text-xs text-fg-faint">
          * Giá đã bao gồm in tên + số sau lưng cơ bản. Add-on (logo công ty, in bụng, số ngực…) +5K/mục — báo trước
          khi chốt cọc.
        </p>
      </Container>
    </section>
  );
}

function TierCard({
  tier,
  minPrice,
  maxPrice,
  isActive,
  onSelect,
}: {
  tier: PricingTier;
  minPrice: number;
  maxPrice: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const range =
    minPrice === maxPrice
      ? formatVnd(minPrice)
      : `${formatVnd(minPrice)}–${formatVnd(maxPrice)}`;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-bg-card p-5 text-left transition-all",
        isActive
          ? "border-brand shadow-lg ring-2 ring-brand"
          : "border-line hover:border-line-strong hover:shadow",
      )}
    >
      {tier.is_popular ? (
        <span className="absolute -top-3 right-4 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-inverse">
          <Star className="size-3" aria-hidden />
          Phổ biến
        </span>
      ) : null}

      <p className="text-xs font-semibold uppercase tracking-wider text-fg-faint">
        {formatQtyRange(tier)}
      </p>
      <p className="mt-1 font-display text-xl font-bold text-fg">{tier.label}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl font-extrabold text-fg">{range}</span>
        <span className="text-xs text-fg-muted">/bộ · đã in</span>
      </div>

      {tier.description ? (
        <p className="mt-1 text-xs text-fg-muted">{tier.description}</p>
      ) : null}

      <ul className="mt-4 space-y-1.5 text-sm text-fg-muted">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
          isActive ? "bg-brand text-fg-inverse" : "bg-bg-soft text-fg-muted group-hover:bg-line/40",
        )}
      >
        {isActive ? "Đang dùng mức này" : "Chọn mức này"}
      </div>
    </button>
  );
}
