import ContactForm from "../components/ContactForm";
import Icon from "../components/Icon";
import SafeImage from "../components/SafeImage";
import { submitContact } from "../api/endpoints";
import MapSection from "./Contact/MapSection";
import RegionalInfo from "./Contact/RegionalInfo";
import ScriptureGreeting from "./Contact/ScriptureGreeting";

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
            Karibu Sana. Reach Out in Fellowship.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs">
            Whether it's ministry partnership, field coverage, or prayer, our doors and hearts
            are open.
          </p>
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
                alt="Documentary photograph of a Glorious Missions field gathering"
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

              <div className="mb-space-md">
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
