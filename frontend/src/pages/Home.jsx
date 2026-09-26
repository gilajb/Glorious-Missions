import { getSiteContent } from "../api/endpoints";
import HeroSection from "../components/HeroSection";
import { useFetch } from "../hooks/useFetch";
import FeaturedMission from "./Home/FeaturedMission";
import InvolvementTeaser from "./Home/InvolvementTeaser";
import PhotoPreview from "./Home/PhotoPreview";
import ScriptureBridge from "./Home/ScriptureBridge";
import ShukaFramework from "./Home/ShukaFramework";
import Testimonial from "./Home/Testimonial";

// Shown whenever GET /api/site-content/home/ 404s (nothing published yet) or
// otherwise fails to load -- the hero must never be blank while the client
// hasn't filled in the admin yet.
const FALLBACK_HERO = {
  title: "SENT",
  body: "Go. Make disciples. Serve. Tell the story.",
};

function CommissionCard() {
  return (
    <figure className="max-w-sm rounded-xl bg-surface-container-lowest/10 backdrop-blur-md border border-surface-container-lowest/20 p-space-lg shadow-lg">
      <blockquote className="font-display italic text-[17px] leading-[1.55] text-surface-container-lowest/95">
        &ldquo;Therefore go and make disciples of all nations, baptizing them in the name of the
        Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have
        commanded you. And surely I am with you always, to the very end of the age.&rdquo;
      </blockquote>
      <figcaption className="mt-space-md flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-widest text-surface-container-lowest/80">
        <span className="w-6 h-0.5 rounded-full bg-primary-container" />
        Matthew 28:19&ndash;20 &middot; NIV
      </figcaption>
    </figure>
  );
}

export default function Home() {
  const { data } = useFetch(() => getSiteContent("home"));

  return (
    <div className="flex flex-col w-full">
      <HeroSection
        title={data?.title || FALLBACK_HERO.title}
        subtitle={data?.body || FALLBACK_HERO.body}
        background={data?.image ?? null}
        backgroundAlt="Community fellowship gathering during golden hour"
        primaryCta={{ label: "Support Our Mission", to: "/get-involved#giving", icon: "volunteer_activism" }}
        secondaryCta={{ label: "Explore Stories", to: "/gallery", icon: "collections" }}
        aside={<CommissionCard />}
      />

      <ScriptureBridge />
      <ShukaFramework />
      <FeaturedMission />
      <PhotoPreview />
      <InvolvementTeaser />
      <Testimonial />
    </div>
  );
}
