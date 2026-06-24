import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 86400; // Static site generation / 24h ISR

export const metadata: Metadata = {
  title: 'Privacy Policy — NISER',
  description: 'Learn about how the National Institute of Social and Economic Research handles data collection, processing, and NDPR compliance on our digital platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content" style={{ minHeight: '80vh', backgroundColor: 'var(--gray-50)', padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '3rem', boxShadow: 'var(--shadow-sm)' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--niser-green-dark)', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
              Privacy Policy
            </h1>
            
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginBottom: '2rem' }}>
              Last updated: June 2026
            </p>

            <p style={{ fontSize: '1.125rem', color: 'var(--gray-700)', marginBottom: '2rem' }}>
              The National Institute of Social and Economic Research (NISER) values your privacy. This privacy policy explains how we collect, process, share, and protect your personal data when you use the NISER Digital Platform website in accordance with the <strong>Nigeria Data Protection Regulation (NDPR)</strong>.
            </p>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              1. Lawful Basis for Processing
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              NISER relies on legitimate interest (our statutory mandate as a federal public policy research institute) for processing anonymous analytics data. For interactive features like the newsletter subscription and contact forms, we obtain your explicit consent at the point of data entry.
            </p>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              2. Data We Collect and How We Use It
            </h2>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <strong>Newsletter Subscription:</strong> When you subscribe, we collect your email address and research interests. This data is used solely to distribute relevant publications and event announcements.
              </li>
              <li>
                <strong>AI Chatbot Queries:</strong> Queries sent to the Ask NISER chatbot are processed ephemerally to search publication indexes. We do not store queries in any persistent database, ensuring user interactions remain completely private.
              </li>
              <li>
                <strong>Website Analytics:</strong> We use cookie-less analytics to track page views and download requests to monitor platform performance and report on public research engagement. No personally identifiable information (PII) is captured.
              </li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              3. Data Subject Rights
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Under the NDPR, you possess rights regarding your personal data:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Right to request access to and rectification of your email preferences.</li>
              <li>Right to request erasure of your data (&ldquo;right to be forgotten&rdquo;). Each newsletter contains a one-click unsubscribe option.</li>
              <li>Right to object to or restrict processing of your details.</li>
            </ul>
            <p style={{ marginBottom: '1.5rem' }}>
              To exercise these rights, please contact our Data Protection Officer at <a href="mailto:dpo@niser.gov.ng" style={{ color: 'var(--niser-green)', textDecoration: 'underline' }}>dpo@niser.gov.ng</a>.
            </p>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              4. Data Retention and Security
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              We implement industry-standard administrative, physical, and technical safeguards (including HTTPS SSL encryption and role-based permissions) to prevent unauthorized access, alteration, or disclosure of collected user data. Newsletter contact records are retained only as long as you choose to remain subscribed.
            </p>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-900)', marginTop: '2rem', marginBottom: '1rem' }}>
              5. Contact Us
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              If you have any questions or concerns about this policy or our data handling practices, contact our administration:
            </p>
            <p style={{ fontWeight: 500, color: 'var(--gray-800)', margin: 0 }}>
              National Institute of Social and Economic Research (NISER)<br />
              KM 17, Idiroko Road, Ibadan, Oyo State, Nigeria<br />
              Email: <a href="mailto:info@niser.gov.ng" style={{ color: 'var(--niser-green)', textDecoration: 'underline' }}>info@niser.gov.ng</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
