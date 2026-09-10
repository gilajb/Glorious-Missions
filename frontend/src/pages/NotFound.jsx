import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-4xl flex flex-col items-center text-center gap-space-md">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Page not found</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-space-xl py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
