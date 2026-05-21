import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Testimonial } from "@/lib/supabase/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section id="feedback" className="border-y border-line bg-bg-soft py-14 md:py-20">
      <Container>
        <SectionHeader
          eyebrow="Phản hồi FC thật"
          title="Đội nào đặt rồi cũng quay lại mùa sau."
          subtitle="Tổng hợp từ tin nhắn Zalo / inbox / live chat — không có nội dung dàn dựng."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <article key={t.id} className="flex flex-col rounded-2xl border border-line bg-bg-card p-5">
              <header className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-fg">{t.fc_name ?? t.customer_name}</p>
                  <p className="text-xs text-fg-muted">
                    {t.customer_name}
                    {t.location ? ` · ${t.location}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-0.5" aria-label={`${t.rating} sao`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-brand text-brand" aria-hidden />
                  ))}
                </div>
              </header>

              <p className="mt-3 flex-1 text-sm text-fg-muted">{t.content}</p>

              <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3 text-[11px] text-fg-faint">
                {t.qty ? (
                  <span className="rounded-full bg-bg-soft px-2 py-0.5 font-semibold text-fg-muted">
                    {t.qty} áo
                  </span>
                ) : null}
                {t.brand_name ? (
                  <span className="rounded-full bg-bg-soft px-2 py-0.5 font-semibold text-fg-muted">
                    {t.brand_name}
                  </span>
                ) : null}
              </footer>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
