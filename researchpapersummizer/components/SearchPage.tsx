
import React, { useState } from 'react';
import { ResearchDocument, SearchResult } from '../types';
import { getEmbeddings, refineSearchResults, search } from '../services/geminiService';

interface SearchPageProps {
  documents: ResearchDocument[];
}

const SearchPage: React.FC<SearchPageProps> = ({ documents }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults([]);
    setAiResponse(null);

    try {
      const response = await search(query);
      setAiResponse(response.answer);
    } catch (err: any) {
      console.error(err);
      setAiResponse(`Failed to fetch search results: ${err.message || "Please ensure the backend is running."}`);
    } finally {
      setIsSearching(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto py-6 h-full flex flex-col">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Cross-Document Semantic Search</h2>
        <p className="text-slate-500">Search through all your papers using natural language queries.</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What are the effects of transformer architecture on sequence modeling?"
          className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 pr-16 text-lg focus:border-blue-500 focus:outline-none transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute right-3 top-3 bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          {isSearching ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-10">
        {isSearching && (
          <div className="space-y-4 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-3xl w-full"></div>
            <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
            <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
          </div>
        )}

        {aiResponse && (
          <div className="bg-white border border-blue-100 p-8 rounded-3xl shadow-md border-t-4 border-t-blue-500">
            <div className="flex items-center space-x-2 text-blue-600 mb-4 font-bold text-sm uppercase tracking-wider">
              <i className="fa-solid fa-sparkles"></i>
              <span>AI Synthesized Answer</span>
            </div>
            <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-lg">
              {aiResponse}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">Source References</h3>
            {results.map((res, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold">SOURCE</span>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">{res.docName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">PAGE {res.page}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">&ldquo;{res.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}

        {!isSearching && !aiResponse && documents.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center">
            <i className="fa-solid fa-search text-slate-200 text-5xl mb-4"></i>
            <h4 className="text-slate-800 font-bold mb-2">Ready to query {documents.length} documents</h4>
            <p className="text-slate-500 text-sm">Ask complex questions like "How does the author define scalability?"</p>
          </div>
        )}

        {documents.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center">
            <i className="fa-solid fa-triangle-exclamation text-amber-300 text-5xl mb-4"></i>
            <h4 className="text-amber-800 font-bold mb-2">No documents to search</h4>
            <p className="text-amber-600 text-sm">Please upload some research papers first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
