import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck, Truck, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { Product, SiteConfig } from "@/lib/supabase/types";

const trustItems = [
  { Icon: ShieldCheck, label: "Free design + mockup duyệt trước in" },
  { Icon: Truck,       label: "Ship MT 1–2 ngày · COD đơn ≥10 áo" },
  { Icon: Zap,         label: "In 4–7 ngày · giao đúng hẹn" },
];

/**
 * Hero block — purposefully short.
 *
 * Goal: customer sees positioning + 2 CTAs, then immediately hits the
 * product grid below. No form / no qualifier yet — those gatekeep
 * conversion.
 */
export function Hero({
  config,
  featuredProducts,
}: {
  config: SiteConfig;
  featuredProducts: Product[];
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-cream opacity-60" aria-hidden />
      <div className="absolute -top-32 -right-24 -z-10 h-72 w-72 rounded-full bg-brand/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden />

      <Container className="grid items-center gap-10 py-10 sm:py-14 md:grid-cols-12 md:gap-12 md:py-20">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink">
            <Sparkles className="size-3.5" aria-hidden />
            Tháng này: tặng 1 áo cho FC trưởng từ đơn 20 áo
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-fg sm:text-4xl md:text-5xl lg:text-6xl">
            Đặt áo FC <span className="text-brand">không cần hỏi giá</span> —
            <br className="hidden sm:block" />
            cuộn xuống xem mẫu &amp; chốt trong 5 phút.
          </h1>

          <p className="mt-5 max-w-xl text-base text-fg-muted sm:text-lg">
            Lọc theo <strong className="text-fg">giá · màu · hãng</strong>, mỗi mẫu hiện sẵn{" "}
            <strong className="text-fg">giá lẻ &amp; giá team</strong> (đã in tên + số). Khi anh nhắn Zalo,
            mọi thứ đã có sẵn — chỉ cần xác nhận cọc.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="#mau-ao"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-fg-inverse shadow-sm hover:bg-brand-hover sm:text-base"
            >
              Xem mẫu &amp; giá ngay
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href={config.zalo.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-fg/15 bg-bg-card px-6 py-3 text-sm font-semibold text-fg hover:bg-bg-soft sm:text-base"
            >
              <MessageCircle className="size-4 text-brand" aria-hidden />
              Nhắn Zalo {config.zalo.number}
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-4 text-center sm:grid-cols-3 sm:text-left">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-faint">FC đã phục vụ</dt>
              <dd className="font-display text-xl font-bold text-fg sm:text-2xl">
                {config.total_fcs.toLocaleString("vi-VN")}+
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-faint">Năm hoạt động</dt>
              <dd className="font-display text-xl font-bold text-fg sm:text-2xl">
                {new Date().getFullYear() - config.founded_year}+
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-fg-faint">Đánh giá Shopee</dt>
              <dd className="font-display text-xl font-bold text-fg sm:text-2xl">
                {config.shopee_rating}/5
              </dd>
            </div>
          </dl>

          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-muted sm:text-sm">
            {trustItems.map((t) => (
              <li key={t.label} className="inline-flex items-center gap-1.5">
                <t.Icon className="size-3.5 text-brand" aria-hidden />
                {t.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative md:col-span-5">
          <HeroCollage products={featuredProducts.slice(0, 4)} />
        </div>
      </Container>
    </section>
  );
}

function HeroCollage({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const [a, b, c, d] = products;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {a ? (
        <HeroCard
          product={a}
          className="absolute inset-y-2 left-0 w-[58%] rotate-[-4deg] shadow-lg"
          priority
        />
      ) : null}
      {b ? (
        <HeroCard
          product={b}
          className="absolute right-0 top-0 w-[52%] rotate-[5deg] shadow-lg"
        />
      ) : null}
      {c ? (
        <HeroCard
          product={c}
          className="absolute bottom-0 right-2 w-[46%] rotate-[-2deg] shadow"
        />
      ) : null}
      {d ? (
        <HeroCard
          product={d}
          className="absolute bottom-6 left-10 hidden w-[40%] rotate-[8deg] shadow sm:block"
        />
      ) : null}
    </div>
  );
}

function HeroCard({
  product,
  className,
  priority,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  if (!product.image_url) return null;
  return (
    <figure className={`overflow-hidden rounded-2xl bg-bg-card ring-1 ring-line ${className ?? ""}`}>
      <Image
        src={product.image_url}
        alt={product.image_alt ?? product.name}
        width={480}
        height={480}
        priority={priority}
        sizes="(max-width: 768px) 50vw, 25vw"
        className="aspect-square object-cover"
      />
      <figcaption className="flex items-center justify-between gap-2 border-t border-line bg-bg-card/95 px-3 py-2 text-[11px]">
        <span className="truncate font-semibold text-fg">{product.name}</span>
        {product.primary_color ? (
          <span className="inline-flex items-center gap-1 text-fg-muted">
            <span
              className="size-2.5 rounded-full ring-1 ring-line"
              style={{ background: product.color_hex ?? "#cbd5e1" }}
              aria-hidden
            />
            {product.primary_color}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
