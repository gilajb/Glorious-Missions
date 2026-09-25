import { Link } from "react-router-dom";

import { getTeamMembers } from "../../api/endpoints";
import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";
import { useFetch } from "../../hooks/useFetch";

const PATHWAYS = [
  { label: "Prayer Partner", to: "/prayer", icon: "church" },
  { label: "Field Partner", to: "/get-involved", icon: "hiking" },
  { label: "Media & Documentary Partner", to: "/get-involved#volunteer-form", icon: "camera" },
  { label: "Community Partner", to: "/get-involved#community-channels", icon: "diversity_3" },
];

function MemberCard({ member }) {
  return (
    <div className="flex flex-col bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      {/*
        Fixed aspect ratio (rather than a fixed pixel height) so every
        portrait crops the same way regardless of the source photo's own
        dimensions or the grid column's current width -- 4:5 matches
        DESIGN.md's card photography ratio guidance.
      */}
      <div className="aspect-[4/5] w-full overflow-hidden bg-surface-container-highest">
        <SafeImage
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-space-lg flex flex-col flex-1">
        <div className="font-label-sm text-label-sm uppercase tracking-wider font-semibold mb-space-xxs text-primary">
          {member.role}
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
          {member.name}
        </h3>
        {member.bio && (
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed flex-1">
            {member.bio}
          </p>
        )}
        {member.location && (
          <div className="flex items-center gap-space-xs pt-space-md text-on-surface-variant">
            <Icon name="location_on" className="text-[18px]" />
            <span className="font-label-sm text-label-sm">{member.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCardSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-surface-container-highest" />
      <div className="p-space-lg flex flex-col gap-space-xs">
        <div className="h-3 w-1/2 bg-surface-container-highest rounded" />
        <div className="h-5 w-3/4 bg-surface-container-highest rounded" />
        <div className="h-4 w-full bg-surface-container-highest rounded" />
        <div className="h-4 w-2/3 bg-surface-container-highest rounded" />
      </div>
    </div>
  );
}

export default function Leadership() {
  const { data, error, loading } = useFetch(() => getTeamMembers());
  const members = data || [];
  const showEmptyState = !loading && (error || members.length === 0);

  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface">
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
        <div className="max-w-2xl mb-space-2xl">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold block mb-space-xs">
            The Servant Community
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
            Leadership &amp; Field Partners
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Meet the photographers, indigenous evangelists, and logistics stewards who guide
            Mission Monday across East Africa.
          </p>
          <div className="flex flex-wrap gap-space-xs pt-space-md">
            {PATHWAYS.map((pathway) => (
              <Link
                key={pathway.label}
                to={pathway.to}
                className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm"
              >
                <Icon name={pathway.icon} className="text-[16px]" />
                <span>{pathway.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {showEmptyState ? (
          <div className="flex flex-col items-center text-center gap-space-xs py-space-2xl bg-surface-container-low rounded-xl">
            <Icon name="groups" className="text-[32px] text-outline" />
            <p className="font-body-md text-body-md text-on-surface-variant">
              Team profiles are being prepared. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <MemberCardSkeleton key={i} />)
              : members.map((member) => <MemberCard key={member.id} member={member} />)}
          </div>
        )}
      </div>
    </section>
  );
}
