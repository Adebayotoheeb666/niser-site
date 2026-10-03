import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Privacy Policy — NISER',
  description: 'Learn about how the National Institute of Social and Economic Research handles data collection, processing, and NDPR compliance on our digital platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full bg-[#f5f7f3] text-slate-900">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3d2f] via-[#184f42] to-[#1d7d69] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(117,204,129,0.15),transparent_35%)]" />
          <div className="container relative py-16 md:py-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Privacy
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Privacy policy</h1>
              <p className="mt-5 max-w-2xl text-base text-emerald-50 md:text-lg">
                How NISER collects, uses, protects, and manages personal data in accordance with the Nigeria Data Protection Regulation.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">NDPR</p>
                <p className="mt-1 text-sm text-emerald-100">Compliance</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Data</p>
                <p className="mt-1 text-sm text-emerald-100">Protection</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">Rights</p>
                <p className="mt-1 text-sm text-emerald-100">Access & controls</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-4xl">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Last updated: June 2026</p>
              <p className="mt-6 text-base leading-7 text-slate-600">
                The National Institute of Social and Economic Research (NISER) values your privacy. This privacy policy explains how we collect, process, share, and protect your personal data when you use the NISER Digital Platform website in accordance with the <span className="font-semibold text-slate-900">Nigeria Data Protection Regulation (NDPR)</span>.
              </p>

              <div className="mt-10 space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900">1. Lawful basis for processing</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">NISER relies on legitimate interest (our statutory mandate as a federal public policy research institute) for processing anonymous analytics data. For interactive features like newsletter subscriptions and contact forms, we obtain your explicit consent at the point of data entry.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900">2. Data we collect and how we use it</h2>
                  <ul className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                    <li><span className="font-semibold text-slate-900">Newsletter subscription:</span> When you subscribe, we collect your email address and research interests. This data is used solely to distribute relevant publications and event announcements.</li>
                    <li><span className="font-semibold text-slate-900">AI chatbot queries:</span> Queries sent to the Ask NISER chatbot are processed ephemerally to search publication indexes. We do not store queries in any persistent database, ensuring user interactions remain private.</li>
                    <li><span className="font-semibold text-slate-900">Website analytics:</span> We use privacy-friendly analytics to track page views and download requests to monitor platform performance and report on public research engagement. No personally identifiable information (PII) is captured. On your first visit we ask for your preference: <strong>Accept</strong> allows measurement with cookies; <strong>Decline</strong> switches to fully cookieless measurement. You can change your choice at any time by clearing this site&apos;s data in your browser.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900">3. Data subject rights</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">Under the NDPR, you possess rights regarding your personal data:</p>
                  <ul className="mt-4 space-y-2 text-base leading-7 text-slate-600">
                    <li>• Right to request access to and rectification of your email preferences.</li>
                    <li>• Right to request erasure of your data (&ldquo;right to be forgotten&rdquo;). Each newsletter contains a one-click unsubscribe option.</li>
                    <li>• Right to object to or restrict processing of your details.</li>
                  </ul>
                  <p className="mt-4 text-base leading-7 text-slate-600">To exercise these rights, please contact our Data Protection Officer at <a href="mailto:dpo@niser.gov.ng" className="font-semibold text-emerald-700 underline">dpo@niser.gov.ng</a>.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900">4. Data retention and security</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">We implement industry-standard administrative, physical, and technical safeguards (including HTTPS SSL encryption and role-based permissions) to prevent unauthorized access, alteration, or disclosure of collected user data. Newsletter contact records are retained only as long as you choose to remain subscribed.</p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900">5. Contact us</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">If you have questions or concerns about this policy or our data handling practices, contact our administration:</p>
                  <p className="mt-4 text-base leading-7 text-slate-700">
                    National Institute of Social and Economic Research (NISER)<br />
                    KM 17, Idiroko Road, Ibadan, Oyo State, Nigeria<br />
                    Email: <a href="mailto:info@niser.gov.ng" className="font-semibold text-emerald-700 underline">info@niser.gov.ng</a>
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
