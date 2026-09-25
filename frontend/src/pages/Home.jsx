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

export default function Home() {
  const { data } = useFetch(() => getSiteContent("home"));

  return (
    <div className="flex flex-col w-full">
      <HeroSection
        eyebrow="Matthew 28:19–20 · NIV"
        title={data?.title || FALLBACK_HERO.title}
        subtitle={data?.body || FALLBACK_HERO.body}
        background={data?.image ?? null}
        backgroundAlt="Community fellowship gathering during golden hour"
        primaryCta={{ label: "Support Our Mission", to: "/get-involved#giving", icon: "volunteer_activism" }}
        secondaryCta={{ label: "Explore Stories", to: "/gallery", icon: "collections" }}
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
