
import React, { useState } from 'react';
import { ResearchDocument, DocumentSummary } from '../types';
import { generateSummary } from '../services/geminiService';
import { exportSummaryToPDF } from '../utils/pdfExport';

interface SummarizerPageProps {
  documents: ResearchDocument[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onUpdateDoc: (doc: ResearchDocument) => void;
}

const SummarizerPage: React.FC<SummarizerPageProps> = ({ documents, selectedDocId, onSelectDoc, onUpdateDoc }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleGenerate = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    setError(null);
    try {
      const summary = await generateSummary(selectedDoc.content);
      onUpdateDoc({ ...selectedDoc, summary });
    } catch (err: any) {
      setError("AI generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!selectedDoc?.summary) return;
    const text = `Abstract: ${selectedDoc.summary.abstract}\n\nKey Findings:\n${selectedDoc.summary.findings.join('\n')}\n\nMethodology: ${selectedDoc.summary.methodology}`;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-5xl mx-auto flex h-full">
      {/* Sidebar Doc List */}
      <div className="w-1/3 pr-8 border-r border-slate-200 overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Select Paper</h3>
        <div className="space-y-3">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDocId === doc.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
            >
              <div className="flex items-center space-x-3">
                <i className={`fa-solid fa-file-pdf ${selectedDocId === doc.id ? 'text-blue-600' : 'text-slate-400'}`}></i>
                <span className={`text-sm font-medium line-clamp-1 ${selectedDocId === doc.id ? 'text-blue-900' : 'text-slate-700'}`}>
                  {doc.name}
                </span>
              </div>
            </button>
          ))}
          {documents.length === 0 && (
            <div className="text-slate-400 text-sm italic">No papers uploaded.</div>
          )}
        </div>
      </div>

      {/* Summary Viewer */}
      <div className="flex-1 pl-8 overflow-y-auto custom-scrollbar">
        {!selectedDoc ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
            <i className="fa-solid fa-arrow-left text-4xl mb-4 opacity-20"></i>
            <p>Select a document from the left to generate its AI summary.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 line-clamp-1">{selectedDoc.name}</h2>
                <span className="text-xs text-slate-500 uppercase font-bold">Research Paper Summary</span>
              </div>
              <div className="flex items-center space-x-3">
                {selectedDoc.summary ? (
                  <>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <i className="fa-solid fa-copy"></i>
                    </button>
                    <button
                      onClick={() => exportSummaryToPDF(selectedDoc.name, selectedDoc.summary!)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                      title="Download as PDF"
                    >
                      <i className="fa-solid fa-file-pdf"></i>
                      <span>Download PDF</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md shadow-blue-200 flex items-center space-x-2"
                  >
                    {loading ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                    )}
                    <span>{loading ? 'Analyzing...' : 'Generate AI Summary'}</span>
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center space-x-2">
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-20 bg-slate-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            )}

            {selectedDoc.summary && (
              <div className="space-y-10 pb-10">
                <section>
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-4">Abstract</h3>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed shadow-sm">
                    {selectedDoc.summary.abstract}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">Key Findings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedDoc.summary.findings.map((finding, idx) => (
                      <div key={idx} className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start space-x-3">
                        <div className="bg-emerald-500 text-white p-1 rounded-full text-[10px] flex-shrink-0 mt-1">
                          <i className="fa-solid fa-check"></i>
                        </div>
                        <p className="text-emerald-900 text-sm font-medium">{finding}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-amber-500 pl-3 mb-4">Methodology</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-600 text-sm leading-relaxed min-h-[150px]">
                      {selectedDoc.summary.methodology}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-red-500 pl-3 mb-4">Limitations</h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 text-slate-600 text-sm leading-relaxed min-h-[150px]">
                      {selectedDoc.summary.limitations}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummarizerPage;
