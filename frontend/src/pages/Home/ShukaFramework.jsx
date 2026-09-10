import Icon from "../../components/Icon";

// Three pillars map onto the theme's primary/secondary/tertiary tokens
// (see src/theme/tokens.js) so a future palette change propagates here
// automatically. The fourth (ochre) is a deliberate one-off accent per
// DESIGN.md's "Hospitality Ochre" callout, not part of the core token set --
// the reference design itself uses the same raw hex rather than a token.
const PILLARS = [
  {
    key: "strength",
    swahili: "Enkanyit • Red",
    title: "Strength & Unity",
    description:
      "Symbolizing bravery, blood shed for redemption, and community solidarity. We come alongside local elders to fortify indigenous pastoral ministries.",
    footerLabel: "Pastoral Solidarity",
    icon: "favorite",
    topBorder: "bg-primary-container",
    iconBg: "bg-primary-fixed",
    iconText: "text-primary",
    labelText: "text-primary",
    footerText: "text-primary",
  },
  {
    key: "sustenance",
    swahili: "Enkai • Blue",
    title: "Sky & Sustenance",
    description:
      "Representing heavenly providence, we trust God's provision as we walk alongside communities through every season, in blessing and in hardship.",
    footerLabel: "Providence & Prayer",
    icon: "water",
    topBorder: "bg-secondary",
    iconBg: "bg-secondary-fixed",
    iconText: "text-secondary",
    labelText: "text-secondary",
    footerText: "text-secondary",
  },
  {
    key: "community",
    swahili: "Enkop • Green",
    title: "Land & Community",
    description:
      "Embodying lush pastures and growing generations, we walk alongside local churches to nurture discipleship from elder to child.",
    footerLabel: "Community Discipleship",
    icon: "yard",
    topBorder: "bg-tertiary",
    iconBg: "bg-tertiary-fixed",
    iconText: "text-tertiary",
    labelText: "text-tertiary",
    footerText: "text-tertiary",
  },
  {
    key: "hospitality",
    swahili: "Olosho • Ochre",
    title: "Hospitality & Grace",
    description:
      "The warm earth under the acacia tree where fellowship happens. Through documentary storytelling, we invite the global church to sit at this open table.",
    footerLabel: "Visual Storytelling",
    icon: "sunny",
    topBorder: "bg-[#d97706]",
    iconBg: "bg-surface-container-high",
    iconText: "text-[#d97706]",
    labelText: "text-[#d97706]",
    footerText: "text-[#d97706]",
  },
];

export default function ShukaFramework() {
  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
          <div className="max-w-2xl">
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase block mb-space-xxs">
              The Woven Tapestry
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Shuka Framework of Service
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Inspired by the vibrant checkered cloths of pastoralist communities, each mission
              thread embodies theological conviction and cultural respect.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <span>Cultural Dignity in Focus</span>
            <Icon name="spa" className="text-tertiary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.key}
              className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${pillar.topBorder}`} />
              <div>
                <div
                  className={`w-12 h-12 rounded-lg ${pillar.iconBg} flex items-center justify-center ${pillar.iconText} mb-space-md group-hover:scale-110 transition-transform`}
                >
                  <Icon name={pillar.icon} className="text-[24px]" />
                </div>
                <span
                  className={`font-label-sm text-label-sm ${pillar.labelText} uppercase tracking-wider font-bold`}
                >
                  {pillar.swahili}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-space-xxs mb-space-xs">
                  {pillar.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div
                className={`mt-space-lg pt-space-xs flex items-center gap-space-xs ${pillar.footerText} font-label-sm text-label-sm uppercase`}
              >
                <span>{pillar.footerLabel}</span>
                <Icon name="arrow_forward" className="text-[14px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
