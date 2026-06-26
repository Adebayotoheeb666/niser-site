import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import { getDivisions } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact NISER | Get in Touch",
  description:
    "Contact the Nigerian Institute of Social and Economic Research for research collaborations, consultations, media inquiries, and general information.",
};

export default async function ContactPage() {
  const divisions = await getDivisions();

  const contactInfo = [
    {
      icon: "location_on",
      title: "Headquarters",
      content:
        "Km 17, Idiroko Road, PMB 5, UI Post Office, Ibadan, Oyo State, Nigeria",
    },
    {
      icon: "phone",
      title: "Phone",
      content: "+234 (0)82 241682 Ext. 4000",
      secondaryContent: "+234-703-460-2690",
    },
    {
      icon: "email",
      title: "Email",
      content: "info@niser.gov.ng",
      links: [
        { label: "Research Inquiries", email: "research@niser.gov.ng" },
        { label: "Media Relations", email: "communications@niser.gov.ng" },
        { label: "Training Programs", email: "training@niser.gov.ng" },
        { label: "Data Access", email: "data@niser.gov.ng" },
      ],
    },
    {
      icon: "schedule",
      title: "Office Hours",
      content: "Monday - Friday: 8:00 AM - 5:00 PM (WAT)",
      secondaryContent: "Saturday & Sunday: Closed",
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen mt-12">
        {/* Hero Section */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-max-width mx-auto">
            <h1 className="font-display-lg text-display-lg text-nigeria-green-deep mb-4">
              Get in Touch with NISER
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Have questions about our research, services, or programs?
              We&apos;re here to help. Reach out to us through any of the
              channels below.
            </p>
          </div>
        </section>

        {/* Contact Information Grid */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {contactInfo.map((info, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-outline-variant rounded-lg p-8 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-research-blue">
                        {info.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                        {info.title}
                      </h3>
                      {info.links ? (
                        <ul className="space-y-2">
                          <li className="font-body-md text-on-surface-variant">
                            {info.content}
                          </li>
                          {info.links.map((link, linkIdx) => (
                            <li
                              key={linkIdx}
                              className="font-label-md text-label-md"
                            >
                              <span className="text-on-surface-variant">
                                {link.label}:
                              </span>{" "}
                              <a
                                href={`mailto:${link.email}`}
                                className="text-research-blue hover:underline"
                              >
                                {link.email}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <p className="font-body-md text-on-surface-variant">
                            {info.content}
                          </p>
                          {info.secondaryContent && (
                            <p className="font-body-md text-on-surface-variant mt-2">
                              {info.secondaryContent}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 px-margin-mobile md:px-margin-desktop bg-surface-container-high">
          <div className="max-w-max-width mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
              {/* Form */}
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                  Send us a Message
                </h2>
                <p className="font-body-md text-on-surface-variant mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon
                  as possible.
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none font-body-md"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none font-body-md"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none font-body-md"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none font-body-md"
                      placeholder="Your organization"
                    />
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none font-body-md"
                    >
                      <option value="">Select a subject</option>
                      <option value="research">Research Collaboration</option>
                      <option value="consulting">Consulting Services</option>
                      <option value="training">Training Program</option>
                      <option value="data">Data Access</option>
                      <option value="media">Media Inquiry</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none font-body-md resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      required
                      className="w-4 h-4 accent-research-blue rounded"
                    />
                    <label
                      htmlFor="privacy"
                      className="font-label-md text-label-md text-on-surface-variant"
                    >
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        className="text-research-blue hover:underline"
                      >
                        privacy policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-nigeria-green-deep text-on-primary py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">send</span> Send
                    Message
                  </button>
                </form>
              </div>

              {/* Contact Sidebar */}
              <div className="space-y-6">
                {/* Quick Response Times */}
                <div className="bg-white border border-outline-variant rounded-lg p-8">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                    Response Times
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        type: "General Inquiries",
                        time: "Within 2-3 business days",
                      },
                      {
                        type: "Research Requests",
                        time: "Within 5 business days",
                      },
                      {
                        type: "Media Relations",
                        time: "Within 1 business day",
                      },
                      {
                        type: "Training Programs",
                        time: "Within 2 business days",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-3 border-b border-outline-variant last:border-0"
                      >
                        <span className="font-label-md text-label-md text-on-surface">
                          {item.type}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white border border-outline-variant rounded-lg p-8">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-4">
                    {[
                      { icon: "X.com", label: "Twitter" },
                      { icon: "linkedin", label: "LinkedIn" },
                      { icon: "facebook", label: "Facebook" },
                      { icon: "youtube", label: "YouTube" },
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center text-research-blue hover:bg-research-blue hover:text-white transition-all"
                        title={social.label}
                      >
                        <span className="material-symbols-outlined">
                          {social.icon}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Location Map Placeholder */}
                <div className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant h-64 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl block mb-2">📍</span>
                    <p className="font-label-md text-label-md text-on-surface-variant">
                      Ibadan, Oyo State, Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Divisions Section */}
        {divisions.length > 0 && (
          <section className="py-20 px-margin-mobile md:px-margin-desktop">
            <div className="max-w-max-width mx-auto">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">
                Research Divisions
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl">
                Contact individual divisions directly for specific research
                inquiries or collaborations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {divisions.map((div) => {
                  const head = div.headOfDivision
                    ? `${div.headOfDivision.titlePrefix} ${div.headOfDivision.fullName}`
                    : "Vacant";
                  const email = div.email ?? "contact@niser.gov.ng";
                  const focus = div.description?.slice(0, 80) ?? "";

                  return (
                    <div
                      key={div.id}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 hover:border-research-blue transition-all"
                    >
                      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                        {div.name}
                      </h3>
                      <p className="font-label-md text-label-md text-research-blue mb-4">
                        {head}
                      </p>
                      {focus && (
                        <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">
                          {focus}
                        </p>
                      )}

                      <div className="space-y-2 pt-4 border-t border-outline-variant">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-research-blue text-[18px]">
                            email
                          </span>
                          <a
                            href={`mailto:${email}`}
                            className="font-label-md text-label-md text-research-blue hover:underline"
                          >
                            {email}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* FAQ CTA */}
        <section className="py-20 bg-surface-container-high px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">
              Have Questions?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto">
              Check out our frequently asked questions for quick answers, or get
              in touch with our team directly.
            </p>
            <button className="bg-nigeria-green-deep text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all inline-flex items-center gap-2">
              <span className="material-symbols-outlined">help</span> Visit FAQ
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
