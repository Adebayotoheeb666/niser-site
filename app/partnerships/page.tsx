import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { getPartners } from "@/lib/cms/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Partnerships | NISER",
  description:
    "Discover NISER&apos;s strategic partnerships with international institutions and development organizations.",
};

export default async function PartnershipsPage() {
  const partners = await getPartners({ limit: 100 });

  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">
              Strategic Partnerships
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              NISER collaborates with leading universities, research
              institutions, and development organizations globally to advance
              policy research excellence.
            </p>
          </div>
        </section>

        {/* Partnership Stats & Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            {/* Total count banner */}
            <div className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg text-center mb-16 inline-block">
              <span className="text-4xl font-display-md text-nigeria-green-vibrant mb-2 block">
                {partners.length}
              </span>
              <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">
                Total Partners
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Active institutional collaborations worldwide
              </p>
            </div>

            {/* Partner Logos/List */}
            <div className="border-t border-surface-gray pt-16">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-8">
                Key Partners
              </h2>

              {partners.length === 0 ? (
                <p className="text-body-md text-on-surface-variant py-8">
                  Partnership information coming soon.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {partners.map((partner) => (
                    <a
                      key={partner.id}
                      href={partner.websiteUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface-container-lowest border border-surface-gray p-6 rounded-lg flex flex-col items-center justify-center h-32 hover:shadow-lg hover:border-nigeria-green-vibrant transition-all gap-2"
                    >
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={120}
                          height={64}
                          className="max-h-16 object-contain"
                        />
                      ) : (
                        <span className="text-label-md text-on-surface-variant text-center">
                          {partner.name}
                        </span>
                      )}
                      {partner.partnerType && (
                        <span className="text-label-sm text-on-surface-variant text-center">
                          {partner.partnerType}
                        </span>
                      )}
                      {partner.country && (
                        <span className="text-label-sm text-on-surface-variant text-center">
                          {partner.country}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
