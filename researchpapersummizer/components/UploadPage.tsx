
import React, { useState, useRef } from 'react';
import { extractTextFromPdf } from '../services/pdfService';
import { ResearchDocument } from '../types';
import { generateUUID } from '../utils/uuid';

interface UploadPageProps {
  onUploadComplete: (doc: ResearchDocument) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setProgress(20);

      const { text, pages } = await extractTextFromPdf(file);
      setProgress(80);

      const newDoc: ResearchDocument = {
        id: generateUUID(),
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        content: text,
        pageCount: pages,
      };

      setProgress(100);
      setTimeout(() => {
        onUploadComplete(newDoc);
        setIsUploading(false);
      }, 500);

    } catch (err: any) {
      setError("Failed to parse PDF: " + err.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload Research Paper</h2>
        <p className="text-slate-500">Fast, secure PDF parsing and AI preparation.</p>
      </div>

      <div 
        className={`bg-white border-2 border-dashed ${isUploading ? 'border-blue-400' : 'border-slate-300'} rounded-2xl p-12 text-center transition-all duration-300`}
      >
        {!isUploading ? (
          <>
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-4">
                <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-700">Drag and drop your PDF</h3>
              <p className="text-slate-400 mt-2">Maximum file size 10MB. Academic papers only.</p>
            </div>
            
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
            >
              Choose PDF File
            </button>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center space-x-2 justify-center">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{error}</span>
              </div>
            )}
          </>
        ) : (
          <div className="py-8">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Extracting Text
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                <div 
                  style={{ width: `${progress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-300"
                ></div>
              </div>
              <p className="text-slate-500 text-sm animate-pulse">Reading pages and metadata...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'fa-lock', title: 'Private', text: 'Data stays in your browser' },
          { icon: 'fa-bolt', title: 'Fast', text: 'Real-time text extraction' },
          { icon: 'fa-brain', title: 'AI Ready', text: 'Optimized for LLM analysis' },
        ].map((feat, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="bg-slate-100 p-3 rounded-lg mb-3">
              <i className={`fa-solid ${feat.icon} text-slate-600`}></i>
            </div>
            <h4 className="font-bold text-slate-800 text-sm">{feat.title}</h4>
            <p className="text-slate-500 text-xs">{feat.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
