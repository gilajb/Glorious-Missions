import { submitGetInvolved } from "../../api/endpoints";
import ContactForm from "../../components/ContactForm";

/**
 * The reference design's form had extra fields (a "craft" dropdown, an
 * availability radio group) that GetInvolvedSubmission has no columns for
 * -- same three fields as Contact's form (name/email/message), reusing the
 * shared component per the brief, with copy nudging people to mention their
 * skills/availability in the free-text message instead.
 */
export default function VolunteerForm() {
  return (
    <div id="volunteer-form" className="w-full lg:sticky lg:top-28">
      <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-xl flex flex-col gap-space-md">
        <div className="flex flex-col gap-space-xxs">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-tertiary font-bold">
            Servant Leadership
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">Volunteer &amp; Partner</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Let us know how your gifts and calling align with Glorious Missions.
          </p>
        </div>

        <ContactForm
          onSubmit={submitGetInvolved}
          submitLabel="Submit Expression of Interest"
          nameLabel="Full Name"
          namePlaceholder="Jane Chepkemoi or John Doe"
          emailLabel="Email Address"
          emailPlaceholder="jane@example.org"
          messageLabel="Tell Us About Your Interest"
          messagePlaceholder="Share your background, faith walk, the skills or availability you bring, and what stirs your heart to serve..."
          successMessage="Blessings on you! We've received your expression of interest and will follow up soon."
        />
      </div>
    </div>
  );
}
