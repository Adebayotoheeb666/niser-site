import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 86400; // Static site generation / 24h ISR

export const metadata: Metadata = {
  title: 'Accessibility Statement — NISER',
  description: 'NISER is committed to ensuring digital accessibility for people with disabilities. Learn about our WCAG 2.1 AA implementation, keyboard navigation, and focus indicators.',
};

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: 'var(--shadow-sm)' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--niser-green-dark)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
              Accessibility Statement
            </h1>
            
            <p style={{ fontSize: '1.125rem', color: 'var(--gray-700)', marginBottom: '2rem' }}>
              The National Institute of Social and Economic Research (NISER) is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to our website.
            </p>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              Conformance Status
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. The NISER Digital Platform website is designed and optimized to be fully conformant with <strong>WCAG 2.1 Level AA</strong> standards.
            </p>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              Accessibility Features Implemented
            </h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Semantic HTML Markup:</strong> We use proper landmark tags (<code>main</code>, <code>nav</code>, <code>header</code>, <code>footer</code>) and maintain a logical heading hierarchy (h1 to h6) to support screen readers.
              </li>
              <li>
                <strong>Keyboard Navigation:</strong> All interactive elements (links, buttons, form controls) are fully accessible via keyboard. Users can navigate the entire site using the <code>Tab</code> and <code>Enter</code> keys.
              </li>
              <li>
                <strong>Visible Focus Indicators:</strong> A clear, high-contrast gold outline (<code>focus-visible:ring-2</code>) is displayed on any element when focused via keyboard navigation.
              </li>
              <li>
                <strong>Bypass Block:</strong> A &ldquo;Skip to main content&rdquo; link is active as the very first focusable element on every page, allowing keyboard users to bypass header navigation menus.
              </li>
              <li>
                <strong>Alternative Text:</strong> All content images have descriptive <code>alt</code> attributes. Decorative images have empty <code>alt=&quot;&quot;</code> attributes so they are ignored by assistive technologies.
              </li>
              <li>
                <strong>Accessible Forms:</strong> All forms, including the Newsletter Subscription and AI Chatbot input, use explicit labels, aria-labels, validation constraints, and autocomplete attributes.
              </li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              Feedback
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We welcome your feedback on the accessibility of the NISER website. Please let us know if you encounter accessibility barriers:
            </p>
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Email:</strong> <a href="mailto:accessibility@niser.gov.ng" style={{ color: 'var(--niser-green)', textDecoration: 'underline' }}>accessibility@niser.gov.ng</a></li>
              <li><strong>Phone:</strong> +234 (0)82 241 682</li>
              <li><strong>Postal Address:</strong> Km 17, Idiroko Road, PMB 5, UI Post Office, Ibadan, Oyo State, Nigeria</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
