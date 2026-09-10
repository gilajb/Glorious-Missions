/**
 * Stand-in for a page's real content, which lands in that page's own
 * per-page follow-up task. Exists so routing/layout can be verified now
 * without pretending to be finished content.
 */
export default function PagePlaceholder({ title }) {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-4xl flex flex-col items-center text-center gap-space-sm">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
        Content for this page is built in its own follow-up task.
      </p>
    </div>
  );
}
