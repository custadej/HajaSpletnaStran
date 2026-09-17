import Image from "next/image";

/**
 * The company's own wordmark (from the previous site), with the hairline
 * outline slightly thickened so it stays legible at header size.
 * `variant="light"` is the white version for dark backgrounds.
 */
export function Logo({
  className = "",
  variant = "dark",
  priority = false,
}: {
  className?: string;
  variant?: "dark" | "light";
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "light" ? "/haja-logo-white.png" : "/haja-logo.png"}
      alt="HAJA d.o.o."
      width={1000}
      height={272}
      priority={priority}
      className={className}
    />
  );
}
