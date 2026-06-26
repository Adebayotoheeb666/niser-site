import Link from "next/link";
import NewsletterForm from "../ui/NewsletterForm";
import "./footer.css";

const socialLinks = [
  {
    label: "Facebook",
    href: "http://www.facebook.com/niserofficial1950",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://www.twitter.com/NISEROfficial",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.957zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/NISEROfficial",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/channel/UCVYyH7_oX1TR_hRMhFD2S3Q",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          fill="#0d1a0d"
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo">
      {/* ── Main footer body ─────────────────────────────────────────────── */}
      <div className="footer-top">
        <div className="footer-grid">
          {/* Column 1 — Brand + social */}
          <div className="footer-brand">
            <div className="footer-logo-text">NISER</div>
            <p className="footer-tagline">
              Promoting sustainable national development through high-quality
              research and policy intelligence.
            </p>

            {/* Social links */}
            <div className="footer-social" aria-label="NISER on social media">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`NISER on ${s.label}`}
                  className="footer-social__link"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Contact */}
          <div className="footer-col">
            <h3 className="footer-col-title">CONTACT</h3>
            <ul className="footer-contact-list">
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Ibadan, Nigeria</span>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:info@niser.gov.ng">info@niser.gov.ng</a>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <a href="mailto:dg@niser.gov.ng">dg@niser.gov.ng</a>
              </li>
              <li>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.22Z" />
                </svg>
                <span>
                  <a href="tel:+2347033545404">+234 703 354 5404</a>
                  <br />
                  <a href="tel:+23422912230">+234 229 12230</a>
                </span>
              </li>
              <li className="footer-contact-support">
                <Link href="/contact">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Explore */}
          <div className="footer-col">
            <h3 className="footer-col-title">EXPLORE</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/data">Data Portal</Link>
              </li>
              <li>
                <Link href="/news">News &amp; Events</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/webinars">Webinars</Link>
              </li>
            </ul>
          </div>

          {/* Column 3b — Quick Links */}
          <div className="footer-col">
            <h3 className="footer-col-title">QUICK LINKS</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/partnerships">Academic Partners</Link>
              </li>
              <li>
                <Link href="/publications">Library &amp; Repository</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/about/accessibility">Accessibility</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div className="footer-col">
            <h3 className="footer-col-title">NEWSLETTER</h3>
            <p className="footer-newsletter-text">
              Subscribe to receive the latest policy briefs and insights.
            </p>
            <NewsletterForm
              className="footer-subscribe"
              placeholder="Email address"
              id="footer-email"
            />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Nigerian Institute of Social and Economic
          Research (NISER). All rights reserved.
        </p>
        <div className="footer-bottom__social">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`NISER on ${s.label}`}
              className="footer-bottom__social-link"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
