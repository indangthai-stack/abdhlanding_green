"use client";

import { MessageCircle, Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/supabase/types";

/** Mobile-only sticky bar with hotline + Zalo. Hidden on md+. */
export function StickyMobileBar({ config }: { config: SiteConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${config.hotline.tel}`}
          className="flex items-center justify-center gap-2 rounded-full bg-fg px-4 py-3 text-sm font-semibold text-fg-inverse"
        >
          <Phone className="size-4" aria-hidden />
          Gọi {config.hotline.number}
        </a>
        <a
          href={config.zalo.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-fg-inverse hover:bg-brand-hover"
        >
          <MessageCircle className="size-4" aria-hidden />
          Nhắn Zalo
        </a>
      </div>
    </div>
  );
}
