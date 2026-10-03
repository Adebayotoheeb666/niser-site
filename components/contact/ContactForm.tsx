"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
    agreed: false,
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const value =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      setStatus("error");
      setErrorMessage("Please agree to the privacy policy before sending.");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          organization: form.organization,
          subject: form.subject,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          organization: "",
          subject: "",
          message: "",
          agreed: false,
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not reach the server. Please email info@niser.gov.ng directly.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="contact-form__success" role="status">
        <span className="contact-form__success-icon" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
        </span>
        <h3 className="contact-form__success-title">Message sent</h3>
        <p className="contact-form__success-text">
          Thank you for reaching out. A member of our team will get back to you
          as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__grid">
        <div className="contact-form__field">
          <label htmlFor="cf-first" className="contact-form__label">
            First Name <span aria-hidden="true" className="contact-form__req">*</span>
          </label>
          <input
            id="cf-first"
            type="text"
            className="contact-form__input"
            value={form.firstName}
            onChange={update("firstName")}
            placeholder="John"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-last" className="contact-form__label">
            Last Name <span aria-hidden="true" className="contact-form__req">*</span>
          </label>
          <input
            id="cf-last"
            type="text"
            className="contact-form__input"
            value={form.lastName}
            onChange={update("lastName")}
            placeholder="Doe"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-email" className="contact-form__label">
            Email <span aria-hidden="true" className="contact-form__req">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            className="contact-form__input"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="contact-form__field">
          <label htmlFor="cf-org" className="contact-form__label">
            Organization
          </label>
          <input
            id="cf-org"
            type="text"
            className="contact-form__input"
            value={form.organization}
            onChange={update("organization")}
            placeholder="Your organization"
            disabled={status === "loading"}
          />
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-subject" className="contact-form__label">
          Subject <span aria-hidden="true" className="contact-form__req">*</span>
        </label>
        <select
          id="cf-subject"
          className="contact-form__select"
          value={form.subject}
          onChange={update("subject")}
          required
          disabled={status === "loading"}
        >
          <option value="">Select a subject</option>
          <option value="Research Collaboration">Research Collaboration</option>
          <option value="Consulting Services">Consulting Services</option>
          <option value="Training Program">Training Program</option>
          <option value="Data Access">Data Access</option>
          <option value="Media Inquiry">Media Inquiry</option>
          <option value="General Inquiry">General Inquiry</option>
        </select>
      </div>

      <div className="contact-form__field">
        <label htmlFor="cf-message" className="contact-form__label">
          Message <span aria-hidden="true" className="contact-form__req">*</span>
        </label>
        <textarea
          id="cf-message"
          className="contact-form__textarea"
          rows={6}
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us about your enquiry..."
          required
          disabled={status === "loading"}
        />
      </div>

      <label className="contact-form__consent">
        <input
          type="checkbox"
          aria-label="Consent to data processing"
          checked={form.agreed}
          onChange={update("agreed")}
          disabled={status === "loading"}
        />
        <span>
          I agree to the{" "}
          <a href="/privacy-policy" className="contact-form__link">
            privacy policy
          </a>{" "}
          and consent to NISER processing this information.
        </span>
      </label>

      {status === "error" && errorMessage && (
        <p className="contact-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--primary contact-form__submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <span className="contact-form__spinner" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>Send message</>
        )}
      </button>
    </form>
  );
}