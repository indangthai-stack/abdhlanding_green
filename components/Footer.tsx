import Link from "next/link";
import { Facebook, MapPin, Phone, Clock, Mail } from "lucide-react";
import type { SiteConfig } from "@/lib/supabase/types";

export function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-lg font-bold text-fg">{config.site_name}</p>
          <p className="mt-2 text-sm text-fg-muted">{config.site_tagline}</p>
          <p className="mt-3 text-xs text-fg-faint">
            Hoạt động từ {config.founded_year} · {config.total_fcs.toLocaleString("vi-VN")}+ FC đã phục vụ
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-fg">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li className="flex items-start gap-2">
              <Phone className="size-4 shrink-0 text-brand" aria-hidden />
              <a href={`tel:${config.hotline.tel}`} className="hover:text-fg">
                {config.hotline.number}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="size-4 shrink-0 text-brand" aria-hidden />
              <a href={`mailto:${config.email}`} className="hover:text-fg">
                {config.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="size-4 shrink-0 text-brand" aria-hidden />
              {config.hours}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-fg">Địa chỉ</p>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li className="flex items-start gap-2">
              <MapPin className="size-4 shrink-0 text-brand" aria-hidden />
              <span>
                {config.address.line}
                <br />
                {config.address.city}, {config.address.region}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-fg">Theo dõi</p>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>
              <a
                href={config.facebook_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 hover:text-fg"
              >
                <Facebook className="size-4 text-brand" aria-hidden />
                Facebook
              </a>
            </li>
            <li>
              <a href={config.zalo.url} target="_blank" rel="noreferrer noopener" className="hover:text-fg">
                Zalo {config.zalo.number}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line bg-bg-soft">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-fg-faint sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {config.site_name}. Tất cả quyền được bảo lưu.</p>
          <Link href="/admin" className="hover:text-fg-muted">
            Quản lý
          </Link>
        </div>
      </div>
    </footer>
  );
}
