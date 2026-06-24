'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LiteratureAssistantPage() {
  const [researchQuestion, setResearchQuestion] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [includeNISER, setIncludeNISER] = useState(true);
  const [includeCrossRef, setIncludeCrossRef] = useState(true);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((f) => f.name);
      setUploadedFiles([...uploadedFiles, ...files].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSynthesize = () => {
    if (researchQuestion.trim()) {
      setIsSynthesizing(true);
      setTimeout(() => {
        setIsSynthesizing(false);
        setShowSynthesis(true);
      }, 2000);
    }
  };

  return (
    <>
      <Header />
      <main className="mt-20 flex-grow bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <section className="mb-8 pt-8">
            <div className="flex items-center gap-2 text-research-blue mb-2">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h1 className="font-headline-md text-headline-md font-bold">Literature Review Assistant</h1>
            </div>
            <p className="font-body-lg text-on-surface-variant max-w-3xl">
              Accelerate your research with AI-powered literature synthesis. Identify research gaps and generate comprehensive reviews using NISER's research corpus.
            </p>
          </section>

          {/* Two-Pane Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 min-h-[600px]">
            {/* Left Pane: Input */}
            <div className="flex flex-col gap-8 bg-white p-8 rounded-xl border border-surface-gray">
              {/* Research Question */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">Primary Research Question</label>
                <textarea
                  value={researchQuestion}
                  onChange={(e) => setResearchQuestion(e.target.value)}
                  placeholder="Enter the core question or hypothesis for AI synthesis..."
                  className="w-full p-4 border border-outline-variant rounded-xl focus:ring-2 focus:ring-research-blue focus:border-transparent bg-background text-body-md font-body-md transition-all"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface">External Literature (PDFs)</label>
                <label className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 group-hover:text-nigeria-green-vibrant transition-colors">
                    upload_file
                  </span>
                  <p className="font-label-md text-label-md text-on-surface">Drag and drop or click to browse</p>
                  <p className="text-label-sm text-on-surface-variant opacity-60 mt-1">Maximum 5 files, 50MB each</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-surface-gray">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-research-blue">description</span>
                          <span className="font-body-md text-on-surface truncate">{file}</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-full border border-outline-variant cursor-pointer hover:border-nigeria-green-vibrant transition-colors">
                  <input
                    type="checkbox"
                    checked={includeNISER}
                    onChange={(e) => setIncludeNISER(e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-label-md text-label-md">Include NISER Archives</span>
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-full border border-outline-variant cursor-pointer hover:border-nigeria-green-vibrant transition-colors">
                  <input
                    type="checkbox"
                    checked={includeCrossRef}
                    onChange={(e) => setIncludeCrossRef(e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-label-md text-label-md">Cross-reference Datasets</span>
                </label>
              </div>

              {/* Synthesize Button */}
              <button
                onClick={handleSynthesize}
                disabled={!researchQuestion.trim() || isSynthesizing}
                className="w-full bg-nigeria-green-deep text-white font-label-md text-label-md py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSynthesizing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Synthesizing Literature...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">psychology</span>
                    Synthesize Literature Review
                  </>
                )}
              </button>
            </div>

            {/* Right Pane: Output */}
            <div className="flex flex-col bg-background p-8 rounded-xl border border-surface-gray overflow-hidden">
              {showSynthesis ? (
                <div className="flex-1 overflow-y-auto space-y-8">
                  <div className="flex justify-between items-center sticky top-0 bg-background pb-4 border-b border-surface-gray">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-secondary-container text-sm">
                          history_edu
                        </span>
                      </span>
                      <span className="font-label-md text-label-md font-bold uppercase tracking-tight text-on-surface-variant">
                        Generated Synthesis
                      </span>
                    </div>
                    <button className="bg-nigeria-green-vibrant text-white px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-nigeria-green-deep transition-all">
                      <span className="material-symbols-outlined text-sm">save</span> Save
                    </button>
                  </div>

                  {/* Synthesis Content */}
                  <div className="space-y-6 pb-8">
                    <div>
                      <h2 className="font-headline-lg text-headline-lg text-nigeria-green-deep mb-4 border-b border-surface-gray pb-2">
                        Literature Synthesis: Impact of Digital Literacy on Rural Micro-Enterprises
                      </h2>
                    </div>

                    <div>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">NISER Internal Perspective</h3>
                      <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
                        Analysis of internal policy documents (2018-2023) reveals consistent emphasis on the Digital Divide as a structural barrier to economic integration. Specifically, Adeyemi et al. (2021) in the NISER Economic Review highlighted that infrastructure alone accounts for only 40% of adoption variance.
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="font-body-md text-on-surface-variant list-disc">
                          <a href="#" className="text-research-blue underline hover:text-nigeria-green-vibrant">
                            NISER/PB/2021/04: Sub-Saharan Digital Readiness
                          </a>
                        </li>
                        <li className="font-body-md text-on-surface-variant list-disc">
                          <a href="#" className="text-research-blue underline hover:text-nigeria-green-vibrant">
                            Internal Memo: FCT Micro-Enterprise Data Audit 2022
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">External Literature Summary</h3>
                      <p className="font-body-md text-on-surface-variant mb-4 leading-relaxed">
                        Global trends from World Bank and UNESCO datasets suggest that social learning is the primary driver of digital tool adoption in emerging markets. External findings contrast with internal data regarding mobile-money penetration speed in northern clusters.
                      </p>
                      <p className="font-body-md text-on-surface-variant leading-relaxed">
                        Current external consensus leans toward the Capability Approach—suggesting that without functional literacy, digital tools remain underutilized assets.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-headline-md text-headline-md text-nigeria-green-deep mb-3">Identified Gaps</h3>
                      <p className="font-body-md text-on-surface-variant mb-4">
                        The synthesis identifies critical disconnect between national-level policy directives and localized execution frameworks within Nigerian Southwest zone.
                      </p>
                      <ul className="space-y-2 ml-6">
                        <li className="font-body-md text-on-surface-variant list-disc">
                          Lack of longitudinal data on specific FinTech intervention impacts
                        </li>
                        <li className="font-body-md text-on-surface-variant list-disc">
                          Under-researched correlation between gender-based digital education and household income stability
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8 pt-8 border-t border-surface-gray">
                      <p className="font-label-sm text-label-sm text-on-surface-variant italic mb-4">
                        Citations generated automatically from NISER Knowledge Management System (KMS).
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button className="text-research-blue border border-research-blue px-3 py-2 rounded text-label-sm font-label-sm hover:bg-surface-container-high transition-colors">
                          Download PDF Report
                        </button>
                        <button className="text-on-surface-variant border border-outline-variant px-3 py-2 rounded text-label-sm font-label-sm hover:bg-surface-container-high transition-colors">
                          Copy to Clipboard
                        </button>
                        <button className="text-on-surface-variant border border-outline-variant px-3 py-2 rounded text-label-sm font-label-sm hover:bg-surface-container-high transition-colors">
                          Export Citations
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-20 mb-4">
                    description
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No Synthesis Yet</h3>
                  <p className="font-body-md text-on-surface-variant max-w-sm">
                    Complete your research question on the left and click synthesize to generate a comprehensive literature review.
                  </p>
                </div>
              )}
            </div>
          </div>
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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
