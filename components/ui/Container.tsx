import { cn } from "@/lib/utils";

/**
 * Constrains content to a sensible max-width with consistent gutters.
 * Default = "default" (max-w-6xl). Use "narrow" for prose sections.
 */
export function Container({
  size = "default",
  className,
  children,
}: {
  size?: "narrow" | "default" | "wide";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "narrow" && "max-w-4xl",
        size === "default" && "max-w-6xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
