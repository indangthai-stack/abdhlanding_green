import { MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { SiteConfig } from "@/lib/supabase/types";

export function FinalCTA({ config }: { config: SiteConfig }) {
  return (
    <section className="bg-fg text-fg-inverse">
      <Container className="grid items-center gap-6 py-14 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Chốt nhanh trong 5 phút
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Cuộn lên xem mẫu, hoặc nhắn Zalo cho anh chủ luôn.
          </h2>
          <p className="mt-3 text-sm text-fg-inverse/75 sm:text-base">
            Mình tư vấn 1-1, gửi mockup trước khi anh cọc. Không ép, không spam. Anh thấy hợp thì
            tiếp — không hợp thì để dịp sau.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
          <a
            href={config.zalo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-fg-inverse hover:bg-brand-hover sm:text-base"
          >
            <MessageCircle className="size-4" aria-hidden />
            Nhắn Zalo {config.zalo.number}
          </a>
          <a
            href={`tel:${config.hotline.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-fg-inverse/30 bg-transparent px-6 py-3 text-sm font-semibold text-fg-inverse hover:border-fg-inverse/60 sm:text-base"
          >
            <Phone className="size-4" aria-hidden />
            Gọi {config.hotline.number}
          </a>
        </div>
      </Container>
    </section>
  );
}
