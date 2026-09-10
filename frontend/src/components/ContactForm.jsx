import { useState } from "react";

import { ApiError } from "../api/client";
import Icon from "./Icon";

const EMPTY_VALUES = { name: "", email: "", message: "" };

function formatRetryAfter(seconds) {
  if (!seconds || seconds < 60) return "in a little while";
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `in about ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `in about ${hours} hour${hours === 1 ? "" : "s"}`;
}

/**
 * Shared name/email/message form used by both the Contact page (posting to
 * submitContact) and the Get Involved page (posting to submitGetInvolved) --
 * the caller decides the destination by which function it passes as
 * `onSubmit`, so this component has no API knowledge of its own.
 *
 * Handles all three documented failure modes from the shared API client:
 * field-level validation (400), rate limiting (429), and everything else
 * (network/server), plus a success state.
 *
 * @param {object} props
 * @param {(values: {name: string, email: string, message: string}) => Promise<any>} props.onSubmit
 * @param {string} [props.submitLabel]
 * @param {string} [props.successMessage]
 * @param {string} [props.nameLabel]
 * @param {string} [props.emailLabel]
 * @param {string} [props.messageLabel]
 * @param {string} [props.namePlaceholder]
 * @param {string} [props.emailPlaceholder]
 * @param {string} [props.messagePlaceholder]
 */
export default function ContactForm({
  onSubmit,
  submitLabel = "Send Message",
  successMessage = "Thank you — we've received your message and will be in touch soon.",
  nameLabel = "Name",
  emailLabel = "Email",
  messageLabel = "Message",
  namePlaceholder,
  emailPlaceholder,
  messagePlaceholder,
}) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setFieldErrors({});
    setFormError(null);

    try {
      await onSubmit(values);
      setStatus("success");
      setValues(EMPTY_VALUES);
    } catch (error) {
      setStatus("idle");

      if (!(error instanceof ApiError)) {
        setFormError("Something went wrong. Please try again.");
        return;
      }

      if (error.kind === "validation") {
        setFieldErrors(error.fieldErrors || {});
        setFormError("Please fix the highlighted fields below.");
      } else if (error.kind === "rate_limited") {
        setFormError(
          `You've reached the limit for this form. Please try again ${formatRetryAfter(error.retryAfter)}.`
        );
      } else {
        setFormError(error.message);
      }
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-space-sm p-space-xl bg-surface-container-lowest rounded-xl border border-outline-variant">
        <Icon name="check_circle" className="text-[40px] text-tertiary" />
        <p className="font-body-md text-body-md text-on-surface">{successMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-space-xs font-label-md text-label-md text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-md w-full">
      <Field
        id="contact-name"
        label={nameLabel}
        placeholder={namePlaceholder}
        value={values.name}
        onChange={handleChange("name")}
        error={fieldErrors.name}
        autoComplete="name"
        required
      />
      <Field
        id="contact-email"
        label={emailLabel}
        placeholder={emailPlaceholder}
        type="email"
        value={values.email}
        onChange={handleChange("email")}
        error={fieldErrors.email}
        autoComplete="email"
        required
      />
      <Field
        id="contact-message"
        label={messageLabel}
        placeholder={messagePlaceholder}
        as="textarea"
        rows={5}
        value={values.message}
        onChange={handleChange("message")}
        error={fieldErrors.message}
        required
      />

      {formError && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center px-space-xl py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}

function Field({ id, label, error, as = "input", ...rest }) {
  const Tag = as;
  return (
    <div className="flex flex-col gap-space-xxs">
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
        {label}
      </label>
      <Tag
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`px-space-md py-space-sm rounded-lg bg-surface-container-lowest border font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
          error ? "border-error" : "border-outline-variant"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="font-body-sm text-body-sm text-error">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
