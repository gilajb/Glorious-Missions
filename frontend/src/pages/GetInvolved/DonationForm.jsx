import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ApiError } from "../../api/client";
import { createDonation, verifyDonation } from "../../api/endpoints";
import Icon from "../../components/Icon";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const INPUT_CLASS =
  "px-space-md py-space-sm rounded-lg bg-surface-container-lowest border font-body-md text-body-md text-on-surface placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary transition-colors";

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function fieldError(error) {
  return Array.isArray(error) ? error[0] : error;
}

/**
 * Giving form for the Financial Partnership card. Payment itself happens on
 * Paystack's hosted checkout, not here: submitting creates the donation on
 * our backend, which hands back a checkout URL to redirect to. Paystack then
 * returns the donor to this page with `?reference=...`, and that reference
 * is confirmed against the backend before any thank-you is shown -- the
 * redirect alone proves nothing about whether the payment went through.
 *
 * @param {object} props
 * @param {string} props.currency - ISO code from getDonationConfig, e.g. "KES"
 */
export default function DonationForm({ currency }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // Captured once: the params are cleared from the address bar below, and
  // that must not wipe out the result being shown.
  const [returnReference] = useState(
    () => searchParams.get("reference") || searchParams.get("trxref")
  );
  // null (form) | "verifying" | "unconfirmed" | a verifyDonation result
  const [result, setResult] = useState(returnReference ? "verifying" : null);

  const [values, setValues] = useState({ amount: "", name: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!returnReference) return undefined;
    let cancelled = false;

    document.getElementById("giving")?.scrollIntoView({ block: "center" });
    // Drop the reference from the URL so a refresh or shared link doesn't
    // replay the thank-you.
    setSearchParams({}, { replace: true });

    verifyDonation(returnReference)
      .then((donation) => {
        if (!cancelled) setResult(donation);
      })
      .catch(() => {
        if (!cancelled) setResult("unconfirmed");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnReference]);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const { authorization_url } = await createDonation({
        ...values,
        callback_url: `${window.location.origin}${window.location.pathname}`,
      });
      // Leaves `submitting` true: the page is navigating away.
      window.location.assign(authorization_url);
    } catch (error) {
      setSubmitting(false);

      if (!(error instanceof ApiError)) {
        setFormError("Something went wrong. Please try again.");
      } else if (error.kind === "validation") {
        setFieldErrors(error.fieldErrors || {});
        setFormError("Please fix the highlighted fields below.");
      } else if (error.kind === "rate_limited") {
        setFormError("Too many attempts. Please try again in a little while.");
      } else {
        setFormError(error.message);
      }
    }
  };

  if (result === "verifying") {
    return (
      <p role="status" className="font-body-sm text-body-sm text-on-surface-variant">
        Confirming your gift...
      </p>
    );
  }

  if (result) {
    const paid = result.status === "success";
    const failed = result.status === "failed";
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-space-xs p-space-md rounded-lg border border-outline-variant"
      >
        <Icon
          name={paid ? "check_circle" : failed ? "error" : "schedule"}
          className={`text-[32px] ${paid ? "text-tertiary" : failed ? "text-error" : "text-on-surface-variant"}`}
        />
        <p className="font-body-md text-body-md text-on-surface">
          {paid
            ? `Thank you! Your gift of ${formatAmount(Number(result.amount), result.currency)} has been received.`
            : failed
              ? "Your payment did not go through, and you have not been charged."
              : "We could not confirm your gift yet. If you completed the payment, Paystack will email your receipt and there is no need to pay again."}
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="font-label-md text-label-md text-primary hover:underline"
        >
          {paid ? "Give again" : failed ? "Try again" : "Back to the giving form"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-space-sm w-full">
      <div className="flex flex-col gap-space-xxs">
        <label htmlFor="donation-amount" className="font-label-md text-label-md text-on-surface">
          Amount ({currency})
        </label>
        <div className="flex flex-wrap gap-space-xs">
          {PRESET_AMOUNTS.map((preset) => {
            const selected = values.amount === String(preset);
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={selected}
                onClick={() => setValues((prev) => ({ ...prev, amount: String(preset) }))}
                className={`px-space-sm py-space-xxs rounded-full border font-label-md text-label-md transition-colors ${
                  selected
                    ? "bg-primary-container text-on-primary border-transparent"
                    : "border-outline-variant text-on-surface hover:bg-surface-container"
                }`}
              >
                {formatAmount(preset, currency)}
              </button>
            );
          })}
        </div>
        <input
          id="donation-amount"
          type="number"
          inputMode="decimal"
          min="1"
          step="any"
          placeholder="Or enter another amount"
          value={values.amount}
          onChange={handleChange("amount")}
          aria-invalid={Boolean(fieldErrors.amount)}
          aria-describedby={fieldErrors.amount ? "donation-amount-error" : undefined}
          className={`${INPUT_CLASS} ${fieldErrors.amount ? "border-error" : "border-outline-variant"}`}
          required
        />
        {fieldErrors.amount && (
          <p id="donation-amount-error" className="font-body-sm text-body-sm text-error">
            {fieldError(fieldErrors.amount)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
        <div className="flex flex-col gap-space-xxs">
          <label htmlFor="donation-name" className="font-label-md text-label-md text-on-surface">
            Name (optional)
          </label>
          <input
            id="donation-name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange("name")}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "donation-name-error" : undefined}
            className={`${INPUT_CLASS} ${fieldErrors.name ? "border-error" : "border-outline-variant"}`}
          />
          {fieldErrors.name && (
            <p id="donation-name-error" className="font-body-sm text-body-sm text-error">
              {fieldError(fieldErrors.name)}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-space-xxs">
          <label htmlFor="donation-email" className="font-label-md text-label-md text-on-surface">
            Email (for your receipt)
          </label>
          <input
            id="donation-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "donation-email-error" : undefined}
            className={`${INPUT_CLASS} ${fieldErrors.email ? "border-error" : "border-outline-variant"}`}
            required
          />
          {fieldErrors.email && (
            <p id="donation-email-error" className="font-body-sm text-body-sm text-error">
              {fieldError(fieldErrors.email)}
            </p>
          )}
        </div>
      </div>

      {formError && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-space-xs px-space-xl py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Icon name="lock" className="text-[18px]" />
        <span>{submitting ? "Taking you to secure checkout..." : "Give Securely"}</span>
      </button>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Payments are processed securely by Paystack. We never see or store your card or mobile
        money details.
      </p>
    </form>
  );
}
