/**
 * No real logo file exists yet -- the reference design links to the design
 * tool's own temporary preview CDN, which isn't safe to hotlink from a real
 * app (it can disappear or change at any time). Renders a text badge until
 * the client provides brand assets; drop a file at src/assets/logo.svg and
 * swap the markup below for an <img> once it exists.
 */
export default function Logo({ size = "md" }) {
  const isSmall = size === "sm";
  return (
    <div className="flex items-center gap-space-sm">
      <div
        className={`${isSmall ? "h-7 w-7" : "h-8 w-8"} shrink-0 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-headline-sm font-bold`}
      >
        M
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-headline-sm text-headline-sm text-on-surface leading-none tracking-tight">
          Mission Monday
        </span>
      </div>
    </div>
  );
}
