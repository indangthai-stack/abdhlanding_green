import { cn } from "@/lib/utils";

/** Standard section heading — eyebrow + title + optional subtitle. */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <div className="inline-flex items-center gap-2">
          <span className="h-px w-6 bg-brand" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </span>
        </div>
      ) : null}
      <h2 className="font-display text-2xl font-bold leading-tight text-fg sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-sm text-fg-muted sm:text-base">{subtitle}</p>
      ) : null}
    </header>
  );
}
