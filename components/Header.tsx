import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/supabase/types";

/**
 * Site header — logo + nav + hotline.
 * Sticky on scroll so the Zalo number is always reachable.
 */
export function Header({ config }: { config: SiteConfig }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`Trang chủ ${config.site_name}`}>
          <Image
            src="/brand/logo.jpg"
            alt={`${config.site_name} logo`}
            width={40}
            height={40}
            className="size-10 rounded-md ring-1 ring-line"
            priority
          />
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-fg sm:text-lg">
              {config.site_name}
            </p>
            <p className="text-[11px] text-fg-muted">
              Xưởng in áo team · {config.address.city}
            </p>
          </div>
        </Link>

        <nav aria-label="primary" className="hidden items-center gap-6 text-sm font-medium text-fg-muted md:flex">
          <a href="#mau-ao"      className="hover:text-fg">Mẫu &amp; Giá</a>
          <a href="#bang-gia"    className="hover:text-fg">Bảng giá team</a>
          <a href="#cach-dat"    className="hover:text-fg">Cách đặt</a>
          <a href="#feedback"    className="hover:text-fg">Phản hồi FC</a>
          <a href="#cau-hoi"     className="hover:text-fg">Hỏi đáp</a>
        </nav>

        <a
          href={`tel:${config.hotline.tel}`}
          className="hidden items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-fg-inverse hover:bg-accent md:inline-flex"
        >
          <Phone className="size-4" aria-hidden />
          {config.hotline.number}
        </a>
      </div>
    </header>
  );
}
