import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Our Calling" },
  { to: "/mission-mondays", label: "Mission Mondays" },
  { to: "/gallery", label: "Visual Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Field Inquiries" },
];

// Kept to the org's real, confirmed focus (church planting, discipleship,
// prayer, documentary storytelling) -- not the invented NGO-service items
// ("Maasai Clean Water", "Emergency Medical Aid") from the reference design.
// Each links somewhere real rather than all pointing at /missions:
// Church Planting has no content yet (ComingSoon); Discipleship & Prayer has
// its own page with a working prayer-request form; Documentary Storytelling
// goes to the Gallery; Community Fellowship jumps to the Get Involved page's
// Community Channels section.
const INITIATIVES = [
  { label: "Church Planting", to: "/church-planting" },
  { label: "Discipleship & Prayer", to: "/prayer" },
  { label: "Documentary Storytelling", to: "/gallery" },
  { label: "Community Fellowship", to: "/get-involved#community-channels" },
];

// Real platform icons (react-icons/fa6) -- hrefs stay inert placeholders
// until real GetInvolvedLink `social` URLs exist; see the Known gaps note
// in the frontend README about wiring these to that data.
const SOCIAL_ICONS = [
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaXTwitter, label: "X" },
  { Icon: FaTiktok, label: "TikTok" },
  { Icon: FaFacebookF, label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#18181b] text-[#f4ece8] pt-space-3xl pb-space-2xl">
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl pb-space-2xl">
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="h-8 w-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-headline-sm font-bold">
                M
              </div>
              <span className="font-headline-sm text-headline-sm text-white tracking-tight">
                Mission Monday
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-[#d0c4be] leading-relaxed max-w-sm">
              A dedicated outreach initiative by Glorious Photography Pictures, documenting
              transformation, empowering indigenous communities, and serving vulnerable
              populations through visual ministry and practical love.
            </p>
            <div className="pt-space-xs">
              <p className="font-display text-[15px] italic text-[#f4ece8]/90 leading-relaxed">
                &ldquo;Go into all the world and proclaim the gospel to the whole creation.&rdquo;
              </p>
              <span className="font-label-sm text-label-sm text-[#ffdad6] tracking-wider uppercase mt-space-xxs block">
                Mark 16:15
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-[#ffdad6]">
              Navigation
            </h3>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-[#d0c4be]">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-[#ffdad6]">
              Initiatives
            </h3>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-[#d0c4be]">
              {INITIATIVES.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-space-md">
            <h3 className="font-label-md text-label-md uppercase tracking-widest text-[#ffdad6]">
              Connect
            </h3>
            <p className="font-body-sm text-body-sm text-[#d0c4be]">
              Follow field dispatches and behind-the-scenes moments across our channels.
            </p>
            {/*
              Placeholder targets -- real URLs come from the GetInvolvedLink
              API data, wired up in the Get Involved page's own follow-up task.
            */}
            <div className="flex items-center gap-space-sm">
              {SOCIAL_ICONS.map(({ Icon, label }) => (
                <a
                  key={label}
                  aria-label={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-[#27272a] text-[#f4ece8] flex items-center justify-center hover:bg-primary-container transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[#27272a] mb-space-lg" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-[#a1a1aa]">
          <p>
            &copy; {new Date().getFullYear()} Mission Monday, a Glorious Photography Pictures
            initiative.
          </p>
          <div className="flex items-center gap-space-md font-label-sm text-label-sm">
            <span>Faith, Hope &amp; Compassion</span>
            <span>&bull;</span>
            <span>Sent to the Nations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
