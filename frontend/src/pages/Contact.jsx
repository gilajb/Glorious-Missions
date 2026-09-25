import { Link } from "react-router-dom";

import ContactForm from "../components/ContactForm";
import Icon from "../components/Icon";
import SafeImage from "../components/SafeImage";
import { submitContact } from "../api/endpoints";
import MapSection from "./Contact/MapSection";
import RegionalInfo from "./Contact/RegionalInfo";
import ScriptureGreeting from "./Contact/ScriptureGreeting";

const INVOLVEMENT_OPTIONS = [
  { value: "prayer", label: "Prayer" },
  { value: "field", label: "Field" },
  { value: "media", label: "Media" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

const PATHWAYS = [
  { label: "Field Inquiries", to: "/get-involved", icon: "hiking" },
  { label: "Prayer", to: "/prayer", icon: "church" },
  { label: "Partnerships", to: "/get-involved#giving", icon: "handshake" },
  { label: "General Contact", hash: "#send-a-message", icon: "mail" },
];

export default function Contact() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto pt-space-xl pb-space-lg">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-fixed text-on-secondary-fixed mb-space-sm">
            <Icon name="volunteer_activism" className="text-[16px]" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider">
              Reach Our Field Team
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Come With Us. The Field Is Open.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
            Whether it's ministry partnership, field coverage, or prayer, our doors and hearts
            are open.
          </p>
          <div className="flex flex-wrap gap-space-xs pt-space-md">
            {PATHWAYS.map((pathway) => {
              const pillClassName =
                "inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm";
              return pathway.hash ? (
                <a key={pathway.label} href={pathway.hash} className={pillClassName}>
                  <Icon name={pathway.icon} className="text-[16px]" />
                  <span>{pathway.label}</span>
                </a>
              ) : (
                <Link key={pathway.label} to={pathway.to} className={pillClassName}>
                  <Icon name={pathway.icon} className="text-[16px]" />
                  <span>{pathway.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto pb-space-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <ScriptureGreeting />
            <RegionalInfo />

            <div className="relative rounded-xl overflow-hidden shadow-sm h-48 bg-surface-container-high">
              <SafeImage
                src={null}
                alt="Documentary photograph of a Mission Monday field gathering"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/30 to-transparent flex flex-col justify-end p-space-md">
                <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase tracking-wider">
                  Glorious Photography Pictures Outreach
                </span>
                <p className="font-headline-sm text-headline-sm text-surface leading-tight">
                  Every image tells of God&rsquo;s redemptive work.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-xl shadow-lg relative">
              <div className="h-1 w-full bg-[repeating-linear-gradient(90deg,#c92a2a_0px,#c92a2a_40px,#3858b6_40px,#3858b6_60px,#187a31_60px,#187a31_80px)] rounded-t-xl mb-space-lg" />

              <div id="send-a-message" className="mb-space-md scroll-mt-24">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Send a Message
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xxs">
                  Please complete the form below. Your message is received with prayerful care,
                  and we'll follow up as soon as we can.
                </p>
              </div>

              <ContactForm
                onSubmit={submitContact}
                submitLabel="Submit Inquiry"
                successMessage="Asante sana! Your message has been received. We review inquiries regularly and will follow up soon."
                involvementLabel="How would you like to be involved?"
                involvementOptions={INVOLVEMENT_OPTIONS}
              />

              <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm pt-space-md mt-space-md border-t border-surface-container-highest">
                <Icon name="lock" className="text-[18px] text-tertiary" />
                <span>Sent securely</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MapSection />
    </div>
  );
}
