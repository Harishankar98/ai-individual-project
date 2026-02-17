
import React from 'react';
import { ResearchDocument } from '../types';

interface DashboardProps {
  documents: ResearchDocument[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onUploadClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, onDelete, onSelect, onUploadClick }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Research Library</h2>
          <p className="text-slate-500">Manage and analyze your research papers.</p>
        </div>
        <button 
          onClick={onUploadClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add Paper</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-20 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <i className="fa-solid fa-file-circle-plus text-slate-300 text-5xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No documents yet</h3>
          <p className="text-slate-400 max-w-sm mb-6">Upload your first PDF research paper to begin extracting summaries and insights.</p>
          <button 
            onClick={onUploadClick}
            className="text-blue-600 font-medium hover:underline"
          >
            Get started by uploading a paper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div 
              key={doc.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              onClick={() => onSelect(doc.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <i className="fa-solid fa-file-pdf text-xl"></i>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                  className="text-slate-300 hover:text-red-500 p-1"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-1 mb-1">{doc.name}</h4>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span>{doc.pageCount} pages</span>
                <span>&bull;</span>
                <span>{formatSize(doc.size)}</span>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                {doc.summary ? (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Summarized</span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Pending AI</span>
                )}
                {doc.insights && (
                   <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Insights Done</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
