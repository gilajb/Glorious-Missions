/**
 * Wraps a Material Symbols Outlined glyph. `name` is the icon's ligature
 * name, e.g. "volunteer_activism" -- see fonts.google.com/icons.
 */
export default function Icon({ name, className = "", ...rest }) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`} {...rest}>
      {name}
    </span>
  );
}
