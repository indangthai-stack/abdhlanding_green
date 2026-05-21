"use client";

import Image from "next/image";
import { useMemo } from "react";
import { MessageCircle, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  findTierOrDefault,
  formatQtyRange,
  formatVnd,
  priceForGroupTier,
} from "@/lib/pricing";
import { buildZaloLink } from "@/lib/zalo";
import { useFiltersStore } from "@/store/filters";
import type {
  Brand,
  GroupKey,
  PricingGroup,
  PricingTier,
  Product,
  SiteConfig,
} from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Segment & color mapping                                              */
/* ------------------------------------------------------------------ */

interface Segment {
  key: "all" | GroupKey;
  label: string;
  hint: string;
}

const SEGMENTS: Segment[] = [
  { key: "all", label: "Tất cả",  hint: "Xem mọi mẫu, mọi giá" },
  { key: "A",   label: "Cơ bản",   hint: "Giá tốt nhất · vải mát" },
  { key: "B",   label: "Phổ biến", hint: "Best-seller 120-140K" },
  { key: "C",   label: "Cao cấp",  hint: "Vải dày · in sắc nét" },
  { key: "D",   label: "Premium",  hint: "Form chuẩn pro" },
];

interface ColorBucket {
  key: string;
  label: string;
  hex: string;
  aliases: string[];
}

/** Single source of truth for grouping VN color names into chips. */
const COLOR_BUCKETS: ColorBucket[] = [
  { key: "red",    label: "Đỏ",        hex: "#dc2626", aliases: ["đỏ", "do", "red"] },
  { key: "orange", label: "Cam",       hex: "#f97316", aliases: ["cam", "orange"] },
  { key: "yellow", label: "Vàng",      hex: "#facc15", aliases: ["vàng", "vang", "yellow", "gold"] },
  { key: "green",  label: "Xanh lá",   hex: "#16a34a", aliases: ["xanh lá", "xanh la", "green", "lá", "la"] },
  { key: "teal",   label: "Cổ vịt",    hex: "#0d7177", aliases: ["cổ vịt", "co vit", "teal", "xanh ngọc"] },
  { key: "blue",   label: "Xanh dương", hex: "#2563eb", aliases: ["xanh dương", "xanh duong", "blue", "navy", "xanh nước biển"] },
  { key: "purple", label: "Tím",       hex: "#7c3aed", aliases: ["tím", "tim", "purple", "violet"] },
  { key: "pink",   label: "Hồng",      hex: "#ec4899", aliases: ["hồng", "hong", "pink"] },
  { key: "white",  label: "Trắng",     hex: "#f8fafc", aliases: ["trắng", "trang", "white"] },
  { key: "gray",   label: "Xám",       hex: "#94a3b8", aliases: ["xám", "xam", "gray", "grey", "kem", "rêu", "reu"] },
  { key: "black",  label: "Đen",       hex: "#111827", aliases: ["đen", "den", "black"] },
];

function normaliseVi(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Map a product's primary_color to a color bucket key, or null. */
function colorBucketFor(color: string | null | undefined): string | null {
  if (!color) return null;
  const normalised = normaliseVi(color);
  for (const bucket of COLOR_BUCKETS) {
    if (bucket.aliases.map(normaliseVi).includes(normalised)) return bucket.key;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

export function ProductGrid({
  products,
  brands,
  pricingGroups,
  pricingTiers,
  siteConfig,
}: {
  products: Product[];
  brands: Brand[];
  pricingGroups: PricingGroup[];
  pricingTiers: PricingTier[];
  siteConfig: SiteConfig;
}) {
  const segment = useFiltersStore((s) => s.segment);
  const colorBucket = useFiltersStore((s) => s.colorBucket);
  const brandSlug = useFiltersStore((s) => s.brandSlug);
  const setSegment = useFiltersStore((s) => s.setSegment);
  const setColorBucket = useFiltersStore((s) => s.setColorBucket);
  const setBrandSlug = useFiltersStore((s) => s.setBrandSlug);
  const clearFilters = useFiltersStore((s) => s.clearFilters);
  const selectedTierKey = useFiltersStore((s) => s.selectedTierKey);
  const tier = useMemo(
    () => findTierOrDefault(pricingTiers, selectedTierKey),
    [pricingTiers, selectedTierKey],
  );

  // Brand chips: only brands that have at least one active product on this page.
  const visibleBrands = useMemo(() => {
    const brandIdsInUse = new Set(products.map((p) => p.brand_id));
    return brands
      .filter((b) => brandIdsInUse.has(b.id))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [brands, products]);

  // Color chips: only buckets that have at least one product.
  const visibleColors = useMemo(() => {
    const inUse = new Set<string>();
    for (const p of products) {
      const key = colorBucketFor(p.primary_color);
      if (key) inUse.add(key);
    }
    return COLOR_BUCKETS.filter((c) => inUse.has(c.key));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.is_active) return false;
        if (segment !== "all" && p.group_key !== segment) return false;
        if (colorBucket && colorBucketFor(p.primary_color) !== colorBucket) return false;
        if (brandSlug && p.brand?.slug !== brandSlug) return false;
        return true;
      })
      .sort((a, b) => {
        const bestSort = Number(b.is_bestseller) - Number(a.is_bestseller);
        if (bestSort !== 0) return bestSort;
        return a.sort_order - b.sort_order;
      });
  }, [products, segment, colorBucket, brandSlug]);

  const groupByKey = useMemo(() => {
    const map = new Map<GroupKey, PricingGroup>();
    for (const g of pricingGroups) map.set(g.group_key, g);
    return map;
  }, [pricingGroups]);

  const hasAnyFilter = segment !== "all" || colorBucket != null || brandSlug != null;

  return (
    <section id="mau-ao" className="border-y border-line bg-bg-card py-14 md:py-20">
      <Container>
        <SectionHeader
          eyebrow="Bước 2 · Lướt mẫu &amp; xem giá"
          title="Lọc nhanh theo hãng · màu · phân khúc — không cần hỏi shop."
          subtitle={`Đang hiển thị giá team cho ${formatQtyRange(tier)} (${tier.label}). Đổi mức ở trên để xem giá mới.`}
        />

        {/* Filter bar */}
        <div className="mt-6 space-y-3 rounded-2xl border border-line bg-bg p-4">
          {/* Segment */}
          <FilterRow label="Phân khúc">
            {SEGMENTS.map((s) => (
              <Chip key={s.key} active={segment === s.key} onClick={() => setSegment(s.key)}>
                {s.label}
              </Chip>
            ))}
          </FilterRow>

          {/* Brand */}
          {visibleBrands.length > 0 ? (
            <FilterRow label="Hãng">
              {visibleBrands.map((b) => (
                <Chip
                  key={b.slug}
                  active={brandSlug === b.slug}
                  onClick={() => setBrandSlug(brandSlug === b.slug ? null : b.slug)}
                >
                  {b.name}
                </Chip>
              ))}
            </FilterRow>
          ) : null}

          {/* Color */}
          {visibleColors.length > 0 ? (
            <FilterRow label="Màu">
              {visibleColors.map((c) => (
                <Chip
                  key={c.key}
                  active={colorBucket === c.key}
                  onClick={() => setColorBucket(colorBucket === c.key ? null : c.key)}
                >
                  <span
                    className="size-3 rounded-full ring-1 ring-line"
                    style={{ background: c.hex }}
                    aria-hidden
                  />
                  {c.label}
                </Chip>
              ))}
            </FilterRow>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <p className="text-xs text-fg-muted">
              {filteredProducts.length} mẫu phù hợp
              {hasAnyFilter ? " (đã lọc)" : ""}
            </p>
            {hasAnyFilter ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full bg-bg-soft px-3 py-1 text-xs font-semibold text-fg-muted hover:text-fg"
              >
                <X className="size-3" aria-hidden />
                Xoá bộ lọc
              </button>
            ) : null}
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-bg-soft p-10 text-center">
            <p className="text-sm font-semibold text-fg">Chưa có mẫu nào khớp bộ lọc</p>
            <p className="mt-1 text-sm text-fg-muted">
              Hãy thử bỏ bớt 1 bộ lọc — hoặc nhắn Zalo, anh tư vấn mẫu tương tự.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full bg-fg px-4 py-2 text-xs font-semibold text-fg-inverse"
              >
                Xem tất cả mẫu
              </button>
              <a
                href={buildZaloLink(siteConfig.zalo.number)}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-fg-inverse"
              >
                <MessageCircle className="size-3.5" aria-hidden />
                Nhắn Zalo
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                tier={tier}
                group={product.group_key ? groupByKey.get(product.group_key) : undefined}
                siteConfig={siteConfig}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-fg-faint">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
        active
          ? "border-fg bg-fg text-fg-inverse"
          : "border-line bg-bg-card text-fg-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function ProductCard({
  product,
  tier,
  group,
  siteConfig,
}: {
  product: Product;
  tier: PricingTier;
  group: PricingGroup | undefined;
  siteConfig: SiteConfig;
}) {
  const teamPrice = group ? priceForGroupTier(group, tier) : product.retail_price_vnd ?? 0;
  const retailPrice = product.retail_price_vnd ?? null;
  const showRetailAnchor = retailPrice != null && retailPrice > teamPrice;
  const savingPct =
    showRetailAnchor && retailPrice ? Math.round((1 - teamPrice / retailPrice) * 100) : 0;

  const zaloHref = buildZaloLink(siteConfig.zalo.number, {
    productName: product.name,
    brandName: product.brand?.name,
    color: product.primary_color ?? undefined,
    qtyTier: formatQtyRange(tier),
  });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-bg-soft">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.image_alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-fg-faint">
            Chưa có ảnh
          </div>
        )}
        {savingPct > 0 ? (
          <span className="absolute right-2 top-2 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-fg-inverse shadow">
            -{savingPct}%
          </span>
        ) : null}
        {product.badge ? (
          <span className="absolute left-2 top-2 rounded-full bg-fg/90 px-2 py-0.5 text-[10px] font-semibold text-fg-inverse">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-2 text-[11px] text-fg-muted">
          {product.brand?.name ? (
            <span className="font-semibold uppercase tracking-wide text-fg-faint">
              {product.brand.name}
            </span>
          ) : null}
          {product.primary_color ? (
            <span className="inline-flex items-center gap-1">
              <span
                className="size-2.5 rounded-full ring-1 ring-line"
                style={{ background: product.color_hex ?? "#cbd5e1" }}
                aria-hidden
              />
              {product.primary_color}
            </span>
          ) : null}
        </div>

        <h3 className="mt-1 text-sm font-semibold text-fg sm:text-base">{product.name}</h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-xl font-extrabold text-brand">
            {formatVnd(teamPrice)}
          </span>
          {showRetailAnchor ? (
            <span className="text-xs text-fg-faint line-through">
              {formatVnd(retailPrice!)}
            </span>
          ) : null}
        </div>
        <p className="text-[11px] text-fg-muted">
          Giá team · {formatQtyRange(tier)}
        </p>

        <a
          href={zaloHref}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2 text-xs font-semibold text-fg-inverse hover:bg-brand-hover"
        >
          <MessageCircle className="size-3.5" aria-hidden />
          Inbox báo giá mẫu này
        </a>
      </div>
    </article>
  );
}

