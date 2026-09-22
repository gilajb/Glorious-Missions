import { getInvolvedLinks, submitGetInvolved } from "../api/endpoints";
import ContactForm from "../components/ContactForm";
import Icon from "../components/Icon";
import { useFetch } from "../hooks/useFetch";

/**
 * Destination for both the Footer's "Discipleship & Prayer" initiative link
 * and the Get Involved page's "Prayer & Intercession Guild" card. Where that
 * card used to dead-end on "Prayer network signup is coming soon," it now
 * links here, and this page has a real working form (posts to the same
 * GetInvolvedSubmission endpoint as the rest of the Get Involved page)
 * rather than another placeholder.
 */
export default function Prayer() {
  const { data, error, loading } = useFetch(() => getInvolvedLinks());
  const emailLinks = (data || []).filter((link) => link.link_type === "email");
  const showLinks = !loading && !error && emailLinks.length > 0;

  return (
    <div className="flex flex-col w-full">
      <section className="w-full bg-surface-container-low py-space-3xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex flex-col gap-space-sm">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider w-fit">
            <Icon name="church" className="text-[16px]" />
            <span>Spiritual Shield</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Discipleship &amp; Prayer
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            We believe prayer and discipleship walk hand in hand. Share what's on your heart
            below, and our team will hold it before the Lord.
          </p>
        </div>
      </section>

      <section className="w-full py-space-3xl">
        <div className="max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-xl flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xxs">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Submit a Prayer Request
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Every request is received with care and held in confidence by our team.
                </p>
              </div>
              <ContactForm
                onSubmit={submitGetInvolved}
                submitLabel="Submit Request"
                nameLabel="Full Name"
                emailLabel="Email Address"
                messageLabel="Your Prayer Request"
                messagePlaceholder="Share what's on your heart..."
                successMessage="Thank you. Your request has been received, and our team will be praying."
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                What We Mean by Discipleship
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Walking alongside local churches and believers as they grow in faith, supported
                by prayer and relationship, not a fixed program.
              </p>
            </div>

            {showLinks && (
              <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  More Ways to Join
                </h3>
                <div className="flex flex-col gap-space-xs">
                  {emailLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="inline-flex items-center gap-space-xs font-label-md text-label-md text-tertiary hover:underline font-bold"
                    >
                      <span>{link.title}</span>
                      <Icon name="arrow_forward" className="text-[16px]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
