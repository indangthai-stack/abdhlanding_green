"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import type { Faq } from "@/lib/supabase/types";

export function FAQ({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(items[0]?.id ?? null);
  if (items.length === 0) return null;

  return (
    <section id="cau-hoi" className="py-14 md:py-20">
      <Container size="narrow">
        <SectionHeader
          eyebrow="Câu hỏi thường gặp"
          title="Mình tổng hợp các câu khách hay nhắn trước khi cọc."
        />

        <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-bg-card">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <article key={item.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="flex-1 text-sm font-semibold text-fg sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-fg-muted transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
                {isOpen ? (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
