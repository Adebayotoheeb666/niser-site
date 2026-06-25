import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Services & Offerings | NISER',
  description: 'NISER\'s comprehensive range of research, policy advisory, training, and data services tailored for government, development partners, and the private sector.',
};

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: 'Policy Research & Advisory',
      icon: '📊',
      description: 'Evidence-based policy research and strategic advisory to government agencies, development partners, and stakeholders.',
      features: [
        'Fiscal Policy Analysis',
        'Sectoral Economic Studies',
        'Institutional Reform Assessments',
        'Strategic Planning Support',
      ],
      cta: 'Request Research Brief',
      href: '/contact',
      highlighted: true,
    },
    {
      id: 2,
      title: 'Institutional Surveys & Data Collection',
      icon: '📋',
      description: 'Large-scale primary data collection, household surveys, and institutional assessments for evidence generation.',
      features: [
        'Household Surveys',
        'Administrative Data',
        'Rapid Assessments',
        'Impact Evaluations',
      ],
      cta: 'Schedule Consultation',
      href: '/contact',
    },
    {
      id: 3,
      title: 'Capacity Building & Training',
      icon: '🎓',
      description: 'Professional development programs, workshops, and training in research methodology and policy analysis.',
      features: [
        'Research Methods Workshops',
        'Data Analysis Training',
        'Policy Writing Seminars',
        'Leadership Programs',
      ],
      cta: 'Explore Programs',
      href: '/training',
    },
    {
      id: 4,
      title: 'Data Services & Analytics',
      icon: '💾',
      description: 'Access to curated research datasets, data visualization, and custom analytical services.',
      features: [
        'Open Data Catalogue',
        'Custom Datasets',
        'Data Visualization',
        'Analytics Dashboard',
      ],
      cta: 'Browse Datasets',
      href: '/data',
    },
    {
      id: 5,
      title: 'Consultancy Services',
      icon: '🤝',
      description: 'Specialized consulting on economic development, governance, and sectoral transformation strategies.',
      features: [
        'Development Strategy',
        'Sector Analysis',
        'Institutional Design',
        'Change Management',
      ],
      cta: 'Get Consulting Proposal',
      href: '/contact',
    },
    {
      id: 6,
      title: 'Publication & Dissemination',
      icon: '📚',
      description: 'Research dissemination through journals, policy briefs, books, and multimedia platforms.',
      features: [
        'Policy Briefs',
        'Working Papers',
        'Books & Reports',
        'Media Commentary',
      ],
      cta: 'View Publications',
      href: '/publications',
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-nigeria-green-deep py-20 text-on-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent-mint -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-research-blue -ml-40 -mb-40"></div>
          </div>
          <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
            <span className="text-accent-mint font-label-md text-label-md uppercase tracking-widest block mb-4">Our Offerings</span>
            <h1 className="font-display-lg text-display-lg mb-6 leading-tight">Research & Advisory Services</h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl leading-relaxed">
              NISER provides comprehensive research, policy advisory, capacity building, and data services to support evidence-based development across Nigeria and the African continent.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">Our Core Services</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Tailored solutions designed to meet the diverse needs of government, civil society, development partners, and the private sector.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`relative group p-8 rounded-xl transition-all duration-300 ${
                    service.highlighted
                      ? 'bg-nigeria-green-deep text-on-primary shadow-xl shadow-nigeria-green-deep/20 md:col-span-2 lg:col-span-1 lg:row-span-2'
                      : 'bg-white border border-surface-gray text-on-surface hover:shadow-lg'
                  }`}
                >
                  {/* Decorative element */}
                  {service.highlighted && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-mint/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
                  )}

                  <div className="relative z-10">
                    <span className="text-4xl block mb-4">{service.icon}</span>
                    <h3 className={`font-headline-md text-headline-md mb-3 ${service.highlighted ? 'text-primary-fixed' : 'text-on-surface'}`}>
                      {service.title}
                    </h3>
                    <p className={`font-body-md text-body-md mb-6 leading-relaxed ${service.highlighted ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className={`text-lg mt-0.5 ${service.highlighted ? 'text-accent-mint' : 'text-research-blue'}`}>
                            ✓
                          </span>
                          <span className={`font-label-md text-label-md ${service.highlighted ? 'text-on-primary' : 'text-on-surface'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={service.href}
                      className={`w-full py-3 px-4 rounded-lg font-label-md text-label-md transition-all flex items-center justify-center gap-2 ${
                        service.highlighted
                          ? 'bg-accent-mint text-nigeria-green-deep hover:bg-white'
                          : 'border border-research-blue text-research-blue hover:bg-research-blue hover:text-white'
                      }`}
                    >
                      {service.cta}
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies / Success Stories */}
        <section className="py-24 bg-surface-container-high px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4">Service Success Stories</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl">
              {`Real-world examples of how NISER's services have influenced policy and driven development outcomes.`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {[
                {
                  title: 'Fiscal Policy Transformation Initiative',
                  client: 'Federal Ministry of Finance',
                  outcome: 'Policy reform recommendations adopted in national budget',
                  metric: '₦2.3T revenue optimization',
                },
                {
                  title: 'Agricultural Productivity Benchmarking',
                  client: 'Ministry of Agriculture',
                  outcome: 'Strategic roadmap for export-led growth',
                  metric: '35% yield increase in pilot states',
                },
                {
                  title: 'Urban Development Strategy',
                  client: 'State Government Partnership',
                  outcome: 'Evidence-based urban planning framework',
                  metric: '4 states adopted framework',
                },
                {
                  title: 'Digital Skills Program Design',
                  client: 'Development Partner',
                  outcome: 'Curriculum development and pilot training',
                  metric: '2,500+ professionals trained',
                },
              ].map((story, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg border border-outline-variant hover:shadow-lg transition-all">
                  <span className="inline-block bg-research-blue/10 text-research-blue px-3 py-1 rounded-full font-label-sm text-label-sm mb-4">
                    Case Study
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{story.title}</h3>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-4">{story.client}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">{story.outcome}</p>
                  <div className="pt-4 border-t border-outline-variant">
                    <p className="font-headline-md text-headline-md text-nigeria-green-vibrant">{story.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement Process */}
        <section className="py-24 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4 text-center">How We Work Together</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto text-center">
              Our collaborative engagement model ensures alignment with your strategic objectives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Discovery', desc: 'Understanding your research needs and objectives' },
                { num: '02', title: 'Design', desc: 'Developing customized research methodology' },
                { num: '03', title: 'Execution', desc: 'Conducting rigorous research and analysis' },
                { num: '04', title: 'Delivery', desc: 'Presenting findings and recommendations' },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  {idx < 3 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-research-blue text-white rounded-full flex items-center justify-center font-label-md">
                      →
                    </div>
                  )}
                  <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant">
                    <div className="font-display-lg text-display-lg text-nigeria-green-vibrant mb-4">{step.num}</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{step.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-nigeria-green-deep text-on-primary px-margin-mobile md:px-margin-desktop">
          <div className="max-w-max-width mx-auto text-center">
            <h2 className="font-headline-lg text-headline-lg text-primary-fixed mb-6">Ready to Partner with NISER?</h2>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mx-auto mb-8">
              {`Let's discuss how NISER's research and advisory services can support your development objectives.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-accent-mint text-nigeria-green-deep px-8 py-4 rounded-lg font-label-md text-label-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">mail</span> Get in Touch
              </Link>
              <Link href="/insights" className="border-2 border-accent-mint text-accent-mint px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-accent-mint/10 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">library_books</span> View Recent Work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
