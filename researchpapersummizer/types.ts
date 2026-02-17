

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  SUMMARIZER = 'SUMMARIZER',
  INSIGHTS = 'INSIGHTS',
  SEARCH = 'SEARCH',
  CHAT = 'CHAT',
  LANDING = 'LANDING',
  RESEARCH_READINESS = 'RESEARCH_READINESS'
}

export interface ResearchDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  content: string;
  pageCount: number;
  summary?: DocumentSummary;
  insights?: DocumentInsights;
  chunks?: DocumentChunk[];
}

export interface DocumentSummary {
  abstract: string;
  findings: string[];
  methodology: string;
  limitations: string;
}

export interface DocumentInsights {
  keyConcepts: string[];
  objectives: string[];
  results: string[];
  conclusions: string[];
}

export interface DocumentChunk {
  text: string;
  page: number;
  embedding?: number[];
}

export interface SearchResult {
  docId: string;
  docName: string;
  text: string;
  page: number;
  score: number;
}
