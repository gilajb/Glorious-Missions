import Icon from "../../components/Icon";
import SafeImage from "../../components/SafeImage";

export default function Genesis() {
  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface">
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center gap-space-xs mb-space-xs text-primary">
              <Icon name="wb_twilight" className="text-[20px]" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest font-semibold">
                Genesis of the Ministry
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-lg leading-tight">
              Our Genesis: Through the Lens of Faith
            </h2>
            <div className="flex flex-col gap-space-md font-body-md text-body-md text-on-surface-variant leading-relaxed">
              <p>
                In mid-2014, a documentary team from Glorious Photography Pictures journeyed
                through Samburu and Marsabit to document rural life. Instead of helplessness, they
                encountered communities of profound resilience, radiant hospitality, and vibrant
                local fellowships worshipping together under the open sky.
              </p>
              <p>
                Yet western mission media too often relied on grim caricatures—images
                intentionally desaturated, focused solely on deprivation to trigger impulsive
                donations. We resolved that this was not merely unethical journalism; it was a
                theological failure that ignored the <strong>Imago Dei</strong> (the Image of
                God) within our brothers and sisters.
              </p>
              <p>
                Out of this spiritual friction, Glorious Missions was born. We unified
                documentary-grade photography with long-term, relational ministry: walking
                alongside indigenous evangelists, discipling local church leaders, and supplying
                vernacular Bibles—while honoring every local elder, mother, and child through
                photographic truth.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-surface-container-high">
              <SafeImage
                src={null}
                alt="Community fellowship gathering under an acacia tree near Mount Ololokwe during golden hour"
                className="w-full h-[520px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent flex flex-col justify-end p-space-lg text-surface">
                <div className="flex items-center gap-space-xs text-primary-fixed mb-space-xxs">
                  <Icon name="place" className="text-[18px]" />
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                    Mount Ololokwe &bull; Samburu
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-surface mb-space-xxs">
                  Sacred Light Over Fellowship
                </h3>
                <p className="font-body-sm text-body-sm text-surface-variant opacity-90 max-w-lg">
                  Malcom David gathers the village elders and children beneath the canopy to
                  preach the gospel and ask for entry to the community. Captured during our
                  second annual expedition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
