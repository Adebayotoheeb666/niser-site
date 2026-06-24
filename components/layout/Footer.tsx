import Link from 'next/link';
import NewsletterForm from '../ui/NewsletterForm';

const footerLinks = {
  Research: [
    { href: '/publications', label: 'Publications' },
    { href: '/people', label: 'Researchers' },
    { href: '/insights', label: 'Policy Insights' },
    { href: '/events', label: 'Events & Seminars' },
  ],
  'Open Data': [
    { href: '/data', label: 'Data Catalogue' },
    { href: '/search', label: 'Search' },
  ],
  'About NISER': [
    { href: '/about', label: 'About Us' },
    { href: '/about/tenders', label: 'Procurement' },
    { href: '/about/accessibility', label: 'Accessibility' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="niser-footer" role="contentinfo">
      <div className="niser-footer__top">
        <div className="container niser-footer__grid">
          {/* Brand column */}
          <div className="niser-footer__brand">
            <div className="niser-footer__logo">
              <div className="footer-logo-emblem" aria-hidden="true">N</div>
              <div>
                <div className="footer-logo-name">NISER</div>
                <div className="footer-logo-tagline">National Institute of Social &amp; Economic Research</div>
              </div>
            </div>
            <p className="niser-footer__address">
              Km 17, Idiroko Road<br />
              PMB 5, UI Post Office<br />
              Ibadan, Oyo State, Nigeria
            </p>
            <div className="niser-footer__contact">
              <a href="mailto:info@niser.gov.ng">info@niser.gov.ng</a>
              <a href="tel:+23482241682">+234 (0)82 241 682</a>
            </div>
            {/* Social links */}
            <div className="niser-footer__social" aria-label="Social media links">
              <a href="https://twitter.com/NISERNigeria" target="_blank" rel="noopener noreferrer" aria-label="NISER on Twitter/X">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.957zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/niser-nigeria" target="_blank" rel="noopener noreferrer" aria-label="NISER on LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="niser-footer__col">
              <h3 className="niser-footer__col-title">{group}</h3>
              <ul role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="niser-footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="niser-footer__newsletter">
            <h3 className="niser-footer__col-title">Research Digest</h3>
            <p>Receive NISER&apos;s latest publications, policy briefs and event updates.</p>
            <NewsletterForm className="footer-subscribe" placeholder="you@example.com" id="footer-email" />
          </div>
        </div>
      </div>

      <div className="niser-footer__bottom">
        <div className="container niser-footer__bottom-inner">
          <p>
            &copy; {currentYear} Nigeria Institute of Social and Economic Research. All rights reserved.
          </p>
          <p className="niser-footer__govt">
            A Research Institute of the Federal Republic of Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
