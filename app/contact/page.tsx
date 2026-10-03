import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { getDivisions } from "@/lib/cms/client";
import "./contact.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact NISER | Get in Touch",
  description:
    "Contact the Nigerian Institute of Social and Economic Research for research collaborations, consultations, media inquiries, and general information.",
};

const socialLinks = [
  { label: "Facebook", href: "http://www.facebook.com/niserofficial1950", icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: "Twitter / X", href: "https://www.twitter.com/NISEROfficial", icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.957zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/NISEROfficial", icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' },
  { label: "YouTube", href: "https://youtube.com/channel/UCVYyH7_oX1TR_hRMhFD2S3Q", icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z' },
];

const responseTimes = [
  { type: "General inquiries", value: "Within 2–3 business days" },
  { type: "Research requests", value: "Within 5 business days" },
  { type: "Media relations", value: "Within 1 business day" },
  { type: "Training programs", value: "Within 2 business days" },
];

export default async function ContactPage() {
  const divisions = await getDivisions();

  return (
    <>
      <Header />
      <main id="main-content">
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="contact-hero">
          <div className="container contact-hero__inner">
            <span className="contact-hero__eyebrow">Get in touch</span>
            <h1 className="contact-hero__title">Contact NISER</h1>
            <p className="contact-hero__lead">
              We welcome enquiries about our research, services, and programs.
              Reach us directly through any of the channels below or send a
              message and a member of our team will respond promptly.
            </p>
            <div className="contact-hero__actions">
              <a href="mailto:info@niser.gov.ng" className="contact-hero__action">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                info@niser.gov.ng
              </a>
              <a href="tel:+2347033545404" className="contact-hero__action">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.22Z" />
                </svg>
                +234 703 354 5404
              </a>
            </div>
          </div>
        </section>

        {/* ── Channels ────────────────────────────────────────────────────── */}
        <section className="contact-channels">
          <div className="container">
            <div className="contact-channels__grid">
              <div className="contact-channel">
                <span className="contact-channel__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <h2 className="contact-channel__title">Headquarters</h2>
                <p className="contact-channel__item">
                  Km 17, Idiroko Road, PMB 5, UI Post Office, Ibadan, Oyo
                  State, Nigeria
                </p>
              </div>

              <div className="contact-channel">
                <span className="contact-channel__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.22Z" />
                  </svg>
                </span>
                <h2 className="contact-channel__title">Phone</h2>
                <ul className="contact-channel__list">
                  <li className="contact-channel__item">
                    <a className="contact-channel__link" href="tel:+2347033545404">
                      +234 703 354 5404
                    </a>
                  </li>
                  <li className="contact-channel__item">
                    <a className="contact-channel__link" href="tel:+23422912230">
                      +234 229 12230
                    </a>
                  </li>
                </ul>
              </div>

              <div className="contact-channel">
                <span className="contact-channel__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <h2 className="contact-channel__title">Email</h2>
                <ul className="contact-channel__list">
                  <li className="contact-channel__item">
                    <a className="contact-channel__link" href="mailto:info@niser.gov.ng">
                      info@niser.gov.ng
                    </a>
                  </li>
                  <li className="contact-channel__item">
                    <a className="contact-channel__link" href="mailto:dg@niser.gov.ng">
                      dg@niser.gov.ng
                    </a>
                  </li>
                </ul>
              </div>

              <div className="contact-channel">
                <span className="contact-channel__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </span>
                <h2 className="contact-channel__title">Office Hours</h2>
                <ul className="contact-channel__list">
                  <li className="contact-channel__item">
                    <span className="contact-channel__label">Weekdays</span>
                    Monday – Friday, 8:00 AM – 5:00 PM (WAT)
                  </li>
                  <li className="contact-channel__item">
                    <span className="contact-channel__label">Weekends</span>
                    Closed
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Form + sidebar ──────────────────────────────────────────────── */}
        <section className="contact-form-section">
          <div className="container contact-layout">
            {/* Form */}
            <div>
              <span className="home-eyebrow">Send us a message</span>
              <h2 className="contact-form-heading">How can we help?</h2>
              <p className="contact-form-sub">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>
              <div className="contact-form-card">
                <ContactForm />
              </div>
            </div>

            {/* Sidebar */}
            <div className="contact-side">
              <div className="contact-side__card">
                <h3 className="contact-side__title">Response times</h3>
                <ul className="contact-times">
                  {responseTimes.map((item) => (
                    <li key={item.type}>
                      <span className="contact-times__type">{item.type}</span>
                      <span className="contact-times__value">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-side__card">
                <h3 className="contact-side__title">Follow NISER</h3>
                <div className="contact-socials">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`NISER on ${social.label}`}
                      className="contact-socials__link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="contact-map">
                <iframe
                  title="NISER Headquarters, Ibadan — Google Maps"
                  src="https://maps.google.com/maps?q=Nigerian%20Institute%20Of%20Social%20And%20Economic%20Research%20(NISER)%2C%20Ibadan%2C%20Oyo%20State%2C%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Divisions ───────────────────────────────────────────────────── */}
        {divisions.length > 0 && (
          <section className="contact-divisions">
            <div className="container">
              <span className="home-eyebrow">Research divisions</span>
              <h2 className="section-header__title">Contact a division</h2>
              <p className="contact-form-sub" style={{ maxWidth: '60ch' }}>
                Reach the appropriate research division directly for specific
                collaborations or enquiries.
              </p>

              <div className="contact-divisions__grid">
                {divisions.map((div) => {
                  const head = div.headOfDivision
                    ? `${div.headOfDivision.titlePrefix} ${div.headOfDivision.fullName}`
                    : "Head currently vacant";
                  const email = div.email ?? "contact@niser.gov.ng";

                  return (
                    <article key={div.id} className="contact-division">
                      <h3 className="contact-division__name">{div.name}</h3>
                      <p className="contact-division__head">{head}</p>
                      {div.description && (
                        <p className="contact-division__desc">
                          {div.description.slice(0, 90)}
                        </p>
                      )}
                      <p className="contact-division__email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <a href={`mailto:${email}`}>{email}</a>
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ CTA ─────────────────────────────────────────────────────── */}
        <section className="contact-faq">
          <div className="container contact-faq__inner">
            <span className="contact-faq__eyebrow">Still have questions?</span>
            <h2 className="contact-faq__title">We&apos;re here to help</h2>
            <p className="contact-faq__text">
              For quick answers, explore our resources or reach our team directly
              through the details above.
            </p>
            <div className="contact-faq__actions">
              <a href="/services" className="btn btn--accent">
                Explore our services
              </a>
              <a
                href="mailto:research@niser.gov.ng"
                className="btn btn--outline"
                style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
              >
                Research enquiries
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}