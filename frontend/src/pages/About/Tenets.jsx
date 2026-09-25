import Icon from "../../components/Icon";

const TENETS = [
  {
    key: "faith",
    iconBg: "bg-primary-fixed",
    iconText: "text-primary",
    labelText: "text-primary",
    icon: "auto_stories",
    label: "Tenet One",
    title: "Faith",
    description:
      "The Gospel is the foundation of everything we do. We go because we were sent, trusting God to work through prayer, presence, and proclamation before anything else.",
    verseRef: "Romans 10:14-15",
    verseText:
      "“How can they hear without someone preaching to them? And how can anyone preach unless they are sent?”",
  },
  {
    key: "love",
    iconBg: "bg-secondary-fixed",
    iconText: "text-secondary",
    labelText: "text-secondary",
    icon: "volunteer_activism",
    label: "Tenet Two",
    title: "Love",
    description:
      "Faith without works is dead, as James teaches. We don't arrive with words alone. We show up, walk alongside local churches through hardship and joy, and give practically as needs arise.",
    verseRef: "James 2:16",
    verseText:
      "“If one of you says, 'Go in peace; keep warm and well fed,' but does nothing about their physical needs, what good is it?”",
  },
  {
    key: "dignity",
    iconBg: "bg-tertiary-fixed",
    iconText: "text-tertiary",
    labelText: "text-tertiary",
    icon: "photo_library",
    label: "Tenet Three",
    title: "Dignity",
    description:
      "We reject paternalistic intervention and staged grief or pity-exploiting tropes. We support the indigenous pastors and elders who know their people best, and our images show joy, beauty, and honest hardship with transparency, always preserving the dignity of every subject.",
    verseRef: "Ephesians 4:25",
    verseText:
      "“Therefore each of you must put off falsehood and speak truthfully to your neighbor, for we are all members of one body.”",
  },
];

export default function Tenets() {
  return (
    <section
      id="core-tenets"
      className="w-full py-space-3xl md:py-space-4xl bg-surface-container-low scroll-mt-20"
    >
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-2xl">
          <div className="max-w-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary-container font-semibold block mb-space-xs">
              Our Unwavering Pillars
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              The Three Tenets of Dignity
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            How we conduct operations, hold accountability before God, and serve alongside
            communities wherever God sends us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {TENETS.map((tenet) => (
            <div
              key={tenet.key}
              className="flex flex-col bg-surface-container-lowest p-space-xl rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-lg ${tenet.iconBg} ${tenet.iconText} flex items-center justify-center mb-space-md`}
              >
                <Icon name={tenet.icon} className="text-[28px]" />
              </div>
              <span
                className={`font-label-sm text-label-sm ${tenet.labelText} uppercase tracking-widest mb-space-xxs`}
              >
                {tenet.label}
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm">
                {tenet.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
                {tenet.description}
              </p>
              <div className="pt-space-md mt-space-md bg-surface-container-low p-space-sm rounded-lg">
                <span className="font-label-sm text-label-sm font-semibold text-on-surface block">
                  {tenet.verseRef}
                </span>
                <span className="font-body-sm text-body-sm italic text-on-surface-variant">
                  {tenet.verseText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
