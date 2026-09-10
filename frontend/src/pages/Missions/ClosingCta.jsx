import { Link } from "react-router-dom";

import Icon from "../../components/Icon";

export default function ClosingCta() {
  return (
    <section className="w-full bg-surface-container py-space-3xl relative overflow-hidden">
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl p-space-xl md:p-space-2xl shadow-md flex flex-col lg:flex-row items-center justify-between gap-space-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-fixed-dim/30 pointer-events-none blur-3xl" />
          <div className="flex flex-col gap-space-sm max-w-xl z-10">
            <div className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm uppercase tracking-widest font-bold">
              <Icon name="favorite" className="text-[18px]" />
              Partner in the Harvest
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface tracking-tight leading-tight">
              Help us reach more of Kenya's counties with the Gospel.
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Every mission is paired with local church partnership, intentional discipleship,
              and documentary storytelling that shares these stories with the world.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-space-md z-10 shrink-0 w-full lg:w-auto">
            <Link
              to="/get-involved"
              className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-space-md bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all transform active:scale-95"
            >
              <Icon name="volunteer_activism" className="text-[20px] mr-space-xs" />
              <span>Support Our Missions</span>
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-space-lg py-space-md bg-surface-container text-on-surface hover:bg-surface-container-high font-label-lg text-label-lg rounded-lg transition-all"
            >
              <Icon name="groups" className="text-[20px] mr-space-xs" />
              <span>Meet Our Team</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
