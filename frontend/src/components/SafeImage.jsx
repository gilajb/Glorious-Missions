import Icon from "./Icon";

/**
 * Renders an API-supplied image, or a layout-preserving placeholder when
 * `src` is null -- which it will be for every image until Cloudinary
 * credentials are configured on the backend (see backend/README.md).
 *
 * `className` should carry sizing/aspect-ratio utilities (e.g.
 * "w-full h-full object-cover" or "aspect-[4/3]"); it's applied to whichever
 * of the two branches renders, so the layout doesn't shift once real images
 * arrive.
 */
export default function SafeImage({
  src,
  alt = "",
  className = "",
  fallbackIcon = "image",
  priority = false,
  ...rest
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt || "Image unavailable"}
        className={`flex items-center justify-center bg-surface-container-high text-outline ${className}`}
      >
        <Icon name={fallbackIcon} className="text-[32px]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      {...rest}
    />
  );
}
