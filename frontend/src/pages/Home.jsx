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
  title: "Witnessing Hope Across Kenya",
  body: "We honor indigenous communities through dignifying documentary photography, relational discipleship, and faithful presence in prayer. From Nairobi's neighborhoods to the pastoral plains of Marsabit and Samburu, we walk alongside local churches, plant new fellowships, and carry these stories of faith to the world.",
};

export default function Home() {
  const { data } = useFetch(() => getSiteContent("home"));

  return (
    <div className="flex flex-col w-full">
      <HeroSection
        title={data?.title || FALLBACK_HERO.title}
        subtitle={data?.body || FALLBACK_HERO.body}
        background={data?.image ?? null}
        backgroundAlt="Maasai community fellowship gathering in the Rift Valley during golden hour"
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
