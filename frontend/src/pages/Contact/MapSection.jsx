import Icon from "../../components/Icon";

// Pinned directly to the Glorious Photography Pictures listing on Google
// Maps (place ID embedded in the URL), rather than a generic area query --
// this is the exact embed src Google generates for that business listing.
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8075178416!2d36.879745073500565!3d-1.2897436356268408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f13eec56e4b69%3A0xf83534104bb5d0f2!2sGlorious%20Photography%20Pictures!5e0!3m2!1sen!2ske!4v1789048499931!5m2!1sen!2ske";

export default function MapSection() {
  return (
    <section id="find-us" className="w-full bg-surface-container-low py-space-2xl scroll-mt-20">
      <div className="px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto flex flex-col gap-space-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
              Find Us
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mt-space-xxs">
              Visit Our Office
            </h3>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            Find us at Glorious Photography Pictures in Buruburu, Nairobi.
          </p>
        </div>

        <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-md">
          <iframe
            title="Map showing Glorious Photography Pictures, Buruburu, Nairobi"
            src={MAP_EMBED_SRC}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-surface/95 backdrop-blur-md p-space-md rounded-xl shadow-lg flex items-center gap-space-sm pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0">
              <Icon name="church" className="text-[20px]" />
            </div>
            <div className="flex-1">
              <span className="font-label-md text-label-md text-on-surface font-semibold block">
                Glorious Photography Pictures
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Buruburu, Nairobi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
