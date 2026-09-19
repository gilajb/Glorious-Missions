/** Shared labeled input for admin forms; `as="textarea"` for a multi-line field. */
export default function TextField({ id, label, value, onChange, error, as = "input", ...rest }) {
  const Tag = as;
  return (
    <div className="flex flex-col gap-space-xxs">
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
        {label}
      </label>
      <Tag
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-space-md py-space-sm rounded-lg bg-surface border font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-error" : "border-outline-variant"
        }`}
        {...rest}
      />
      {error && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
