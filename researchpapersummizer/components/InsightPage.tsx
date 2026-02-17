
import React, { useState } from 'react';
import { ResearchDocument, DocumentInsights } from '../types';
import { extractInsights } from '../services/geminiService';
import { exportInsightsToPDF } from '../utils/pdfExport';

interface InsightPageProps {
  documents: ResearchDocument[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onUpdateDoc: (doc: ResearchDocument) => void;
}


const InsightPage: React.FC<InsightPageProps> = ({ documents, selectedDocId, onSelectDoc, onUpdateDoc }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleExtract = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    setError(null);
    try {
      const insights = await extractInsights(selectedDoc.content);
      onUpdateDoc({ ...selectedDoc, insights });
    } catch (err: any) {
      setError("Insights extraction failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex h-full">
      {/* Selector side */}
      <div className="w-1/4 pr-8 border-r border-slate-200 overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Papers</h3>
        <div className="space-y-2">
          {documents.map(doc => (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-all ${selectedDocId === doc.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-600'
                }`}
            >
              <div className="truncate">{doc.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-8 overflow-y-auto custom-scrollbar">
        {!selectedDoc ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <i className="fa-solid fa-lightbulb text-6xl mb-4"></i>
            <p>Select a paper to extract technical insights.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn pb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Insights</h2>
              <div className="flex items-center space-x-3">
                {selectedDoc.insights && (
                  <button
                    onClick={() => exportInsightsToPDF(selectedDoc.name, selectedDoc.insights!)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    title="Download as PDF"
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>Download PDF</span>
                  </button>
                )}
                {!selectedDoc.insights && (
                  <button
                    onClick={handleExtract}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center space-x-2"
                  >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-brain"></i>}
                    <span>{loading ? 'Mining Data...' : 'Extract Deep Insights'}</span>
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

            {selectedDoc.insights ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Objectives */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                      <i className="fa-solid fa-bullseye text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Objectives</h3>
                  </div>
                  <ul className="space-y-4">
                    {selectedDoc.insights.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-3 group">
                        <span className="text-blue-500 font-bold mt-1 text-sm">{i + 1}.</span>
                        <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-900 transition-colors">{obj}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Concepts */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                      <i className="fa-solid fa-atom text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Key Concepts</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoc.insights.keyConcepts.map((concept, i) => (
                      <span key={i} className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm border border-slate-200 font-medium">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="bg-slate-900 p-6 rounded-3xl shadow-xl md:col-span-2">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-amber-400 text-slate-900 p-3 rounded-2xl">
                      <i className="fa-solid fa-chart-line text-lg"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Results & Empirical Findings</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedDoc.insights.results.map((res, i) => (
                      <div key={i} className="bg-slate-800 border border-slate-700 p-5 rounded-2xl">
                        <p className="text-slate-300 text-base italic leading-relaxed">"{res}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conclusions */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
                      <i className="fa-solid fa-flag-checkered text-lg"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Critical Conclusions</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedDoc.insights.conclusions.map((conc, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border-l-4 border-green-500">
                        <p className="text-slate-700 text-sm font-medium">{conc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-medium animate-pulse">Running advanced semantic analysis...</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightPage;
