"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useFiltersStore } from "@/store/filters";
import { buildZaloLink } from "@/lib/zalo";
import { findTierOrDefault, formatQtyRange } from "@/lib/pricing";
import type { PricingTier, SiteConfig } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  customer_name: z.string().min(2, "Anh điền tên hoặc nick").max(80),
  phone: z
    .string()
    .min(9, "Số điện thoại chưa đúng")
    .max(15)
    .regex(/^[0-9+()\-\s]+$/, "Số chứa ký tự lạ"),
  fc_name: z.string().max(80).optional().or(z.literal("")),
  message: z.string().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

/**
 * Lead form — placed AFTER product grid so customer can submit "tôi
 * thích nhưng chưa quyết định mẫu" while still capturing context.
 *
 * Submitting POSTs to /api/leads which inserts into Supabase (or just
 * logs server-side if Supabase isn't configured). On success we also
 * deep-link to Zalo so the conversation can continue immediately.
 */
export function LeadForm({
  siteConfig,
  pricingTiers,
}: {
  siteConfig: SiteConfig;
  pricingTiers: PricingTier[];
}) {
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedTierKey = useFiltersStore((s) => s.selectedTierKey);
  const colorBucket = useFiltersStore((s) => s.colorBucket);
  const brandSlug = useFiltersStore((s) => s.brandSlug);
  const tier = findTierOrDefault(pricingTiers, selectedTierKey);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitState("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          qty_tier: tier.tier_key,
          metadata: {
            tier_label: tier.label,
            tier_range: formatQtyRange(tier),
            color_bucket: colorBucket,
            brand_slug: brandSlug,
          },
          source: "landing-lead-form",
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Có lỗi xảy ra");
      }
      setSubmitState("ok");
      reset();
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  if (submitState === "ok") {
    const zalo = buildZaloLink(siteConfig.zalo.number, {
      qtyTier: formatQtyRange(tier),
    });
    return (
      <section id="lien-he" className="bg-bg-soft py-14 md:py-20">
        <Container size="narrow">
          <div className="rounded-3xl border border-success/30 bg-bg-card p-8 text-center shadow-sm">
            <div className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
              ✓
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-fg">
              Đã nhận thông tin của anh.
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              Mình sẽ gọi/Zalo lại trong 15 phút (giờ hành chính). Để nhanh hơn, anh nhắn Zalo cho
              mình luôn.
            </p>
            <a
              href={zalo}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-fg-inverse hover:bg-brand-hover"
            >
              <MessageCircle className="size-4" aria-hidden />
              Nhắn Zalo {siteConfig.zalo.number}
            </a>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="lien-he" className="bg-bg-soft py-14 md:py-20">
      <Container size="narrow">
        <div className="grid items-start gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <SectionHeader
              eyebrow="Liên hệ"
              title="Chưa quyết được mẫu? Để mình tư vấn."
              subtitle="Anh để lại tên + số, mình gọi lại trong 15 phút (giờ hành chính). Hoặc nhắn Zalo cho nhanh."
            />
            <div className="mt-5 flex flex-col gap-2 text-sm text-fg-muted">
              <a
                href={`tel:${siteConfig.hotline.tel}`}
                className="inline-flex items-center gap-2 font-semibold text-fg hover:text-brand"
              >
                ☎ {siteConfig.hotline.number}
              </a>
              <a
                href={siteConfig.zalo.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-semibold text-fg hover:text-brand"
              >
                💬 Zalo {siteConfig.zalo.number}
              </a>
              <span>🕒 {siteConfig.hours}</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 rounded-2xl border border-line bg-bg-card p-6 md:col-span-3"
            noValidate
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Tên anh / nick FC
              </label>
              <input
                {...register("customer_name")}
                placeholder="VD: Anh Hoàng / FC Phú Vang"
                className={cn(
                  "mt-1 w-full rounded-xl border bg-bg-card px-3 py-2.5 text-sm",
                  errors.customer_name ? "border-danger" : "border-line",
                )}
              />
              {errors.customer_name ? (
                <p className="mt-1 text-xs text-danger">{errors.customer_name.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Số điện thoại
                </label>
                <input
                  {...register("phone")}
                  inputMode="tel"
                  placeholder="VD: 0905 123 456"
                  className={cn(
                    "mt-1 w-full rounded-xl border bg-bg-card px-3 py-2.5 text-sm",
                    errors.phone ? "border-danger" : "border-line",
                  )}
                />
                {errors.phone ? (
                  <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
                ) : null}
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  Tên FC / công ty (tùy chọn)
                </label>
                <input
                  {...register("fc_name")}
                  placeholder="VD: FC Đập Đá United"
                  className="mt-1 w-full rounded-xl border border-line bg-bg-card px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Ghi chú (mẫu quan tâm, ngày cần áo…)
              </label>
              <textarea
                {...register("message")}
                rows={3}
                placeholder={`VD: Đội em ${formatQtyRange(tier)}, thích mẫu CV Steel màu xám, cần trước 30/6.`}
                className="mt-1 w-full resize-none rounded-xl border border-line bg-bg-card px-3 py-2.5 text-sm"
              />
            </div>

            <div className="rounded-xl bg-bg-soft px-3 py-2 text-xs text-fg-muted">
              <p>
                Đang chọn mức:{" "}
                <strong className="text-fg">{tier.label} · {formatQtyRange(tier)}</strong>
              </p>
            </div>

            {errorMsg ? (
              <p className="rounded-xl bg-danger-soft px-3 py-2 text-xs text-danger">
                {errorMsg}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting || submitState === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-fg-inverse hover:bg-brand-hover disabled:opacity-60"
            >
              {isSubmitting || submitState === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Đang gửi…
                </>
              ) : (
                <>
                  <Send className="size-4" aria-hidden /> Gửi yêu cầu tư vấn
                </>
              )}
            </button>
            <p className="text-[11px] text-fg-faint">
              Thông tin chỉ dùng để liên hệ tư vấn — không spam, không chia sẻ cho bên thứ 3.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
