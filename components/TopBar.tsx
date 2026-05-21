import { Phone } from "lucide-react";
import type { SiteConfig } from "@/lib/supabase/types";

/**
 * Slim promo strip pinned to the top of every page.
 *
 * Mobile: hotline link only (saves vertical space).
 * Desktop: month promo on the left, hotline + Zalo on the right.
 */
export function TopBar({ config }: { config: SiteConfig }) {
  return (
    <div className="hidden bg-brand text-fg-inverse md:block">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-2 text-xs font-medium">
        <p className="truncate">{config.promo_top_bar}</p>
        <div className="flex shrink-0 items-center gap-4">
          <a
            href={`tel:${config.hotline.tel}`}
            className="inline-flex items-center gap-1.5 hover:underline"
          >
            <Phone className="size-3.5" aria-hidden />
            {config.hotline.number}
          </a>
          <span className="opacity-40">·</span>
          <a href={config.zalo.url} target="_blank" rel="noreferrer noopener" className="hover:underline">
            Zalo {config.zalo.number}
          </a>
        </div>
      </div>
    </div>
  );
}
