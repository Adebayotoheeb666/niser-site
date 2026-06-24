import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Subscribe to NISER Updates | NISER',
  description: 'Stay informed with NISER&apos;s newsletters and research updates delivered to your inbox.',
};

export default function SubscribePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Stay Connected</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Subscribe to receive NISER&apos;s latest research findings, policy briefs, event invitations, and news updates.
            </p>
          </div>
        </section>

        {/* Subscription Options */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto max-w-2xl mx-auto">
            <div className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">Choose Your Newsletter</h2>
              
              <form className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block font-label-md text-label-md text-on-surface mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest"
                  />
                </div>

                {/* Newsletter Options */}
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface mb-4">Select Newsletters:</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'research-digest', label: 'Research Digest', desc: 'Weekly summary of latest publications' },
                      { name: 'policy-updates', label: 'Policy Updates', desc: 'Monthly policy briefs and recommendations' },
                      { name: 'event-invitations', label: 'Event Invitations', desc: 'Webinars, seminars, and conferences' },
                      { name: 'careers-news', label: 'Careers & Opportunities', desc: 'Job openings and fellowship programs' },
                    ].map((newsletter) => (
                      <label key={newsletter.name} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors cursor-pointer">
                        <input type="checkbox" className="mt-1" defaultChecked />
                        <div>
                          <p className="font-label-md text-on-surface">{newsletter.label}</p>
                          <p className="text-label-sm text-on-surface-variant">{newsletter.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label htmlFor="frequency" className="block font-label-md text-label-md text-on-surface mb-2">
                    Delivery Frequency
                  </label>
                  <select id="frequency" className="w-full px-4 py-3 border border-outline rounded-lg font-body-md text-body-md bg-surface-container-lowest">
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                    <option>As it happens</option>
                  </select>
                </div>

                {/* Subscribe Button */}
                <button
                  type="submit"
                  className="w-full bg-nigeria-green-deep text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>

                <p className="text-label-sm text-on-surface-variant text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
