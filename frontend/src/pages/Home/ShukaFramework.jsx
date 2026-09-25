import Icon from "../../components/Icon";

// Five steps trace the Mission Monday DNA (Gospel -> Prayer -> Discipleship
// -> Service -> Story) rather than the old Maasai-cultural, color-coded
// pillars -- reusable across any future mission field, not just Kenya.
const FRAMEWORK = [
  {
    key: "gospel",
    label: "Step One",
    title: "Gospel",
    description:
      "Christ crucified and risen is the foundation of everything we do. Every visit, photograph, and gift flows from the proclamation of His kingdom.",
    footerLabel: "Foundation of the Mission",
    icon: "auto_stories",
    topBorder: "bg-primary-container",
    iconBg: "bg-primary-fixed",
    iconText: "text-primary",
    labelText: "text-primary",
    footerText: "text-primary",
  },
  {
    key: "prayer",
    label: "Step Two",
    title: "Prayer",
    description:
      "We enter every community bathed in intercession, trusting God's provision in every season, in blessing and in hardship.",
    footerLabel: "Covering the Field",
    icon: "volunteer_activism",
    topBorder: "bg-secondary",
    iconBg: "bg-secondary-fixed",
    iconText: "text-secondary",
    labelText: "text-secondary",
    footerText: "text-secondary",
  },
  {
    key: "discipleship",
    label: "Step Three",
    title: "Discipleship",
    description:
      "We walk alongside local churches and believers as they grow in faith, handing leadership to those who know their own people best.",
    footerLabel: "Growing Local Leaders",
    icon: "diversity_3",
    topBorder: "bg-tertiary",
    iconBg: "bg-tertiary-fixed",
    iconText: "text-tertiary",
    labelText: "text-tertiary",
    footerText: "text-tertiary",
  },
  {
    key: "service",
    label: "Step Four",
    title: "Service",
    description:
      "We meet practical needs as an expression of Christ's love, not the whole of our calling, serving alongside communities in every season.",
    footerLabel: "Love in Action",
    icon: "favorite",
    topBorder: "bg-[#d97706]",
    iconBg: "bg-surface-container-high",
    iconText: "text-[#d97706]",
    labelText: "text-[#d97706]",
    footerText: "text-[#d97706]",
  },
  {
    key: "story",
    label: "Step Five",
    title: "Story",
    description:
      "Through documentary photography, we invite the global church to witness what God is doing and to sit at this open table.",
    footerLabel: "Visual Storytelling",
    icon: "photo_camera",
    topBorder: "bg-on-surface-variant",
    iconBg: "bg-surface-container-highest",
    iconText: "text-on-surface-variant",
    labelText: "text-on-surface-variant",
    footerText: "text-on-surface-variant",
  },
];

export default function ShukaFramework() {
  return (
    <section className="w-full py-space-3xl md:py-space-4xl bg-surface">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
          <div className="max-w-2xl">
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase block mb-space-xxs">
              How We Are Sent
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Mission Monday Framework
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Five convictions carry every Mission Monday, wherever God sends us next.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
            <span>Sent • Matthew 28:19&ndash;20</span>
            <Icon name="church" className="text-tertiary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-lg">
          {FRAMEWORK.map((step) => (
            <div
              key={step.key}
              className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${step.topBorder}`} />
              <div>
                <div
                  className={`w-12 h-12 rounded-lg ${step.iconBg} flex items-center justify-center ${step.iconText} mb-space-md group-hover:scale-110 transition-transform`}
                >
                  <Icon name={step.icon} className="text-[24px]" />
                </div>
                <span
                  className={`font-label-sm text-label-sm ${step.labelText} uppercase tracking-wider font-bold`}
                >
                  {step.label}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-space-xxs mb-space-xs">
                  {step.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div
                className={`mt-space-lg pt-space-xs flex items-center gap-space-xs ${step.footerText} font-label-sm text-label-sm uppercase`}
              >
                <span>{step.footerLabel}</span>
                <Icon name="arrow_forward" className="text-[14px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
