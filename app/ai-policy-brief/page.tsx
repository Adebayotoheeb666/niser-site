'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SovereignIntelligencePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPapers, setSelectedPapers] = useState<number[]>([]);
  const [audience, setAudience] = useState('federal-ministry');
  const [focusAngle, setFocusAngle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock research papers
  const researchPapers = [
    {
      id: 1,
      title: 'Fiscal Policy Implications on SME Growth in Nigeria',
      category: 'Macroeconomics',
      date: 'October 2023',
      selected: selectedPapers.includes(1),
    },
    {
      id: 2,
      title: 'Climate Adaptation Strategies for North-Central Farmers',
      category: 'Agriculture',
      date: 'September 2023',
      selected: selectedPapers.includes(2),
    },
    {
      id: 3,
      title: 'Digital Literacy and Female Labor Participation',
      category: 'Social Welfare',
      date: 'August 2023',
      selected: selectedPapers.includes(3),
    },
  ];

  const togglePaperSelection = (id: number) => {
    if (selectedPapers.includes(id)) {
      setSelectedPapers(selectedPapers.filter((p) => p !== id));
    } else if (selectedPapers.length < 3) {
      setSelectedPapers([...selectedPapers, id]);
    }
  };

  const goToStep = (step: number) => {
    if (step === 1 || (step === 2 && selectedPapers.length > 0) || (step === 3 && focusAngle.trim())) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(4); // Show success state
    }, 2000);
  };

  const stepLabels = [
    { step: 1, label: 'Source Material' },
    { step: 2, label: 'Audience & Angle' },
    { step: 3, label: 'Preview & Publish' },
  ];

  return (
    <>
      <Header />
      <main className="mt-20 flex-grow bg-background">
        {/* Stepper Navigation */}
        <div className="sticky top-20 bg-surface-container-lowest border-b border-surface-gray z-40">
          <div className="max-w-5xl mx-auto px-4 md:px-16 py-8">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {stepLabels.map((item) => (
                <button
                  key={item.step}
                  onClick={() => goToStep(item.step)}
                  className={`p-4 rounded-lg border-b-4 transition-all ${
                    currentStep === item.step
                      ? 'border-nigeria-green-vibrant bg-surface-container-low'
                      : currentStep > item.step
                        ? 'border-nigeria-green-vibrant opacity-60'
                        : 'border-outline-variant opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                    Step {String(item.step).padStart(2, '0')}
                  </div>
                  <div className="font-headline-md text-headline-md text-nigeria-green-deep">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-16 py-12">
          {/* Step 1: Source Material Selection */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h2 className="font-display-lg text-display-lg text-nigeria-green-deep mb-4">Select Source Materials</h2>
                <p className="font-body-lg text-on-surface-variant max-w-2xl">
                  Choose up to 3 research papers from NISER&apos;s database to synthesize into your policy brief.
                </p>
              </div>

              <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search publications..."
                    className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none"
                  />
                  <span className="material-symbols-outlined absolute left-4 top-3 text-on-surface-variant">
                    search
                  </span>
                </div>
                <div className="text-label-md text-on-surface-variant whitespace-nowrap">
                  {selectedPapers.length} / 3 Selected
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {researchPapers.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => togglePaperSelection(paper.id)}
                    className={`p-6 rounded-lg border-2 transition-all text-left relative ${
                      paper.selected
                        ? 'border-nigeria-green-vibrant bg-secondary-container/10'
                        : 'border-surface-gray hover:border-nigeria-green-vibrant'
                    }`}
                  >
                    {paper.selected && (
                      <div className="absolute top-4 right-4 bg-nigeria-green-vibrant text-white rounded-full p-1">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                    )}
                    <span className="inline-block px-2 py-1 bg-surface-container rounded text-label-sm text-research-blue mb-3">
                      {paper.category}
                    </span>
                    <h4 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">{paper.title}</h4>
                    <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      <span>{paper.date}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => goToStep(2)}
                  disabled={selectedPapers.length === 0}
                  className="bg-nigeria-green-deep text-on-primary px-8 py-3 rounded-lg font-bold flex items-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Configuration
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Audience & Angle Configuration */}
          {currentStep === 2 && (
            <div className="animate-fadeIn max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="font-display-lg text-display-lg text-nigeria-green-deep mb-4">Configure Brief</h2>
                <p className="font-body-lg text-on-surface-variant">
                  Define the target audience and analytical lens for your brief.
                </p>
              </div>

              <div className="space-y-8">
                {/* Audience Selection */}
                <div>
                  <label className="font-headline-md text-headline-md text-nigeria-green-deep block mb-4">
                    Who is this brief for?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'federal-ministry', label: 'Federal Ministry' },
                      { value: 'media-press', label: 'Media & Press' },
                      { value: 'private-sector', label: 'Private Sector' },
                      { value: 'development-partners', label: 'Development Partners' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`p-4 rounded-lg border-2 flex items-center gap-4 cursor-pointer transition-all ${
                          audience === option.value
                            ? 'border-nigeria-green-vibrant bg-secondary-container/10'
                            : 'border-outline-variant hover:border-nigeria-green-vibrant'
                        }`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={option.value}
                          checked={audience === option.value}
                          onChange={(e) => setAudience(e.target.value)}
                          className="w-5 h-5"
                        />
                        <span className="font-label-md">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Focus Angle */}
                <div>
                  <label className="font-headline-md text-headline-md text-nigeria-green-deep block mb-2">
                    Focus Angle
                  </label>
                  <p className="font-body-md text-on-surface-variant mb-4">
                    Define the lens through which the AI should interpret the source data.
                  </p>
                  <textarea
                    value={focusAngle}
                    onChange={(e) => setFocusAngle(e.target.value)}
                    placeholder="e.g., Focus on the budgetary requirements for implementing gender-sensitive digital training programs..."
                    className="w-full p-4 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-research-blue focus:outline-none"
                    rows={4}
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-surface-gray">
                  <button
                    onClick={() => goToStep(1)}
                    className="text-on-surface-variant hover:text-nigeria-green-deep font-bold flex items-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    disabled={!focusAngle.trim()}
                    className="bg-nigeria-green-deep text-on-primary px-10 py-3 rounded-lg font-bold flex items-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    Generate Draft
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Publish */}
          {currentStep === 3 && (
            <div className="animate-fadeIn max-w-3xl mx-auto">
              <div className="bg-surface-container-lowest p-10 rounded-xl border border-surface-gray relative">
                {/* AI Badge */}
                <div className="absolute -top-4 right-10 bg-research-blue text-white px-4 py-1 rounded-full flex items-center gap-2 shadow-lg">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span className="font-label-sm uppercase tracking-widest">AI Generated Draft</span>
                </div>

                <header className="mb-10 border-b border-surface-gray pb-8">
                  <span className="font-label-md text-nigeria-green-vibrant uppercase tracking-widest block mb-2">
                    Policy Brief SI-2024-082
                  </span>
                  <h2 className="font-display-lg text-display-lg text-nigeria-green-deep leading-tight mb-6">
                    Digital Transition as a Catalyst for SME Inclusivity
                  </h2>
                  <div className="text-right">
                    <span className="font-label-sm text-on-surface-variant block">TARGET AUDIENCE</span>
                    <span className="font-label-md font-bold capitalize">{audience.replace('-', ' ')}</span>
                  </div>
                </header>

                <div className="space-y-10 mb-12">
                  {/* Key Findings */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline-md text-nigeria-green-deep flex items-center gap-2">
                        <span className="material-symbols-outlined">analytics</span>
                        Key Findings
                      </h3>
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-nigeria-green-deep">
                        edit_note
                      </span>
                    </div>
                    <div className="p-4 bg-surface-container-lowest border border-dashed border-outline-variant rounded font-body-md text-on-surface-variant leading-relaxed space-y-3">
                      <p>• SME growth in Nigeria is throttled by a 15% digital infrastructure gap in North-Central region.</p>
                      <p>• Female-led SMEs show 22% higher mobile payment adoption than male-led counterparts.</p>
                      <p>• Digital literacy correlates with 1.8x increase in SME survival rates during inflation.</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline-md text-nigeria-green-deep flex items-center gap-2">
                        <span className="material-symbols-outlined">gavel</span>
                        Policy Recommendations
                      </h3>
                      <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-nigeria-green-deep">
                        edit_note
                      </span>
                    </div>
                    <div className="p-4 bg-surface-container-lowest border border-dashed border-outline-variant rounded font-body-md text-on-surface-variant leading-relaxed space-y-3">
                      <p>1. <strong>Incentivized Infrastructure:</strong> Tax rebates for telecom providers expanding 4G coverage.</p>
                      <p>2. <strong>Gender-Targeted Grants:</strong> Sovereign fund for female-led tech training programs.</p>
                      <p>3. <strong>Regulatory Sandbox:</strong> Policy Lab monitoring AI-driven credit scoring integration.</p>
                    </div>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="mt-16 pt-10 border-t border-surface-gray flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <button className="border border-outline-variant px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-gray transition-all">
                      <span className="material-symbols-outlined">download</span>
                      PDF
                    </button>
                    <button className="border border-outline-variant px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-surface-gray transition-all">
                      <span className="material-symbols-outlined">share</span>
                      Collab
                    </button>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full md:w-auto bg-nigeria-green-vibrant text-on-primary px-12 py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-nigeria-green-deep transition-all shadow-lg disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">publish</span>
                        Approve & Publish to Insights
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12">
                <button
                  onClick={() => goToStep(2)}
                  className="text-on-surface-variant hover:text-nigeria-green-deep font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Configuration
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="animate-fadeIn max-w-lg mx-auto text-center py-12">
              <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[48px]">check_circle</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg mb-4">Successfully Published</h2>
              <p className="font-body-md text-on-surface-variant mb-8">
                The AI Policy Brief has been validated and published to the NISER Insights repository. Stakeholders have been notified.
              </p>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedPapers([]);
                  setAudience('federal-ministry');
                  setFocusAngle('');
                }}
                className="bg-nigeria-green-deep text-on-primary px-8 py-3 rounded-lg font-bold w-full"
              >
                Generate Another
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}
