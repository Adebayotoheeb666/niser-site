import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Working Groups | NISER',
  description: 'Learn about NISER&apos;s collaborative working groups focused on key research areas and policy challenges.',
};

export default function WorkingGroupsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="w-full">
        {/* Hero Section */}
        <section className="bg-surface-container-lowest py-16">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <h1 className="font-display-md text-display-md text-nigeria-green-deep mb-4">Research Working Groups</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Collaborative teams advancing frontier research on critical development challenges and policy priorities.
            </p>
          </div>
        </section>

        {/* Working Groups Grid */}
        <section className="py-16 bg-surface">
          <div className="px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Macroeconomics & Growth', lead: 'Dr. Chioma Eze', members: 8, focus: 'Fiscal and monetary policy, economic growth strategies' },
                { title: 'Poverty & Social Protection', lead: 'Dr. Abdulwaheed Ahmed', members: 6, focus: 'Welfare programs, targeted interventions' },
                { title: 'Agricultural Development', lead: 'Dr. Zainab Mohammed', members: 7, focus: 'Value chains, food security, rural livelihoods' },
                { title: 'Governance & Institutions', lead: 'Prof. Adeyemi Okuntuyi', members: 9, focus: 'Political economy, institutional reform' },
                { title: 'Industrialization & Trade', lead: 'Dr. Oluwaseun Adeyemi', members: 5, focus: 'Manufacturing, export competitiveness' },
                { title: 'Energy & Environment', lead: 'Dr. Fatima Ibrahim', members: 7, focus: 'Clean energy, climate policy, sustainability' },
              ].map((group, i) => (
                <div key={i} className="bg-surface-container-lowest border border-surface-gray p-8 rounded-lg hover:border-nigeria-green-vibrant transition-colors">
                  <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-2">{group.title}</h3>
                  <div className="flex gap-4 mb-4 text-label-md text-on-surface-variant">
                    <span>{group.members} Members</span>
                    <span>•</span>
                    <span>Led by {group.lead}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">{group.focus}</p>
                  <button className="text-nigeria-green-vibrant font-label-md flex items-center hover:underline">
                    View Group <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
