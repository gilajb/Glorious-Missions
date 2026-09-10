import Icon from "../../components/Icon";

/**
 * Office location is confirmed real (Buruburu, Nairobi). Phone, public
 * email, and office hours are still TBC as of this writing -- rather than
 * inventing plausible-looking placeholders for those (the reference design
 * did, right down to named regional contacts), this shows what's real and
 * an honest "coming soon" for what isn't. Fill in `PHONE`/`EMAIL`/`HOURS`
 * below once the org has them.
 */
const OFFICE = {
  name: "Glorious Photography Pictures",
  lines: ["Buruburu, Nairobi, Kenya"],
};
const PHONE = null; // e.g. "+254 7XX XXX XXX"
const EMAIL = null; // e.g. "hello@example.org"
const HOURS = null; // e.g. ["Monday – Friday: 8:00 AM – 5:00 PM"]

const UPCOMING_STATION = {
  name: "Samburu Station",
  note: "Opening soon",
};

export default function RegionalInfo() {
  const hasPendingDetails = !PHONE || !EMAIL || !HOURS;

  return (
    <div className="flex flex-col gap-space-md">
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Get in Touch</h2>

        <div className="flex items-start gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
            <Icon name="location_on" className="text-[20px]" />
          </div>
          <div className="flex-1">
            <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">
              {OFFICE.name}
            </h3>
            {OFFICE.lines.map((line) => (
              <p key={line} className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs">
                {line}
              </p>
            ))}
          </div>
        </div>

        {PHONE && (
          <div className="flex items-start gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
              <Icon name="call" className="text-[20px]" />
            </div>
            <div className="flex-1">
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">Phone</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs">{PHONE}</p>
            </div>
          </div>
        )}

        {EMAIL && (
          <div className="flex items-start gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-tertiary shrink-0">
              <Icon name="mail" className="text-[20px]" />
            </div>
            <div className="flex-1">
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">Email</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs">{EMAIL}</p>
            </div>
          </div>
        )}

        {HOURS && (
          <div className="flex items-start gap-space-sm">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
              <Icon name="schedule" className="text-[20px]" />
            </div>
            <div className="flex-1">
              <h3 className="font-label-lg text-label-lg text-on-surface font-semibold">Hours</h3>
              {HOURS.map((line) => (
                <p key={line} className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {hasPendingDetails && (
          <div className="flex items-start gap-space-sm pt-space-xs border-t border-surface-container-highest">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
              <Icon name="more_horiz" className="text-[20px]" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">
              A phone line and public email are on the way — for now, the form below is the
              fastest way to reach us.
            </p>
          </div>
        )}
      </div>

      <div className="bg-surface-container p-space-md rounded-xl">
        <div className="flex items-center gap-space-xs text-tertiary font-semibold font-label-md text-label-md">
          <Icon name="pin_drop" className="text-[18px]" />
          <span>{UPCOMING_STATION.name}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
          {UPCOMING_STATION.note}
        </p>
      </div>
    </div>
  );
}
