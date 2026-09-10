import { Link } from "react-router-dom";

import Icon from "../../components/Icon";

export default function TransparencyBar() {
  return (
    <section className="w-full py-space-2xl bg-surface-container-lowest">
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-md py-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <Icon name="verified_user" className="text-[24px]" />
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                Financial &amp; Field Transparency
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Annual documentary audit reports and community receipts published quarterly.
              </p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-space-xs text-primary font-label-md text-label-md hover:underline"
          >
            <span>Request Audited Field Dispatches</span>
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
