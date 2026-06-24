// ─── Shared sub-types ────────────────────────────────────────────────────────

export interface AuthorSummary {
  id: string;
  fullName: string;
  slug: string;
  titlePrefix: string;
  position: string;
  photo: string;
}

// ─── Publication ─────────────────────────────────────────────────────────────

export type PublicationType =
  | 'working_paper'
  | 'policy_brief'
  | 'journal_article'
  | 'book_chapter'
  | 'annual_report'
  | 'conference_paper';

export type ResearchDivision =
  | 'macroeconomics'
  | 'poverty_social'
  | 'agriculture'
  | 'governance'
  | 'industry';

export interface Publication {
  id: string;
  title: string;
  slug: string;
  publicationType: PublicationType;
  authors: AuthorSummary[];
  researchDivision: ResearchDivision;
  abstract: string;
  keywords: string[];
  publishedYear: number;
  doi?: string;
  pdfFile?: string;
  featuredImage?: string;
  isOpenAccess: boolean;
  citationCount?: number;
  status: 'draft' | 'review' | 'published';
}

// ─── Researcher ──────────────────────────────────────────────────────────────

export type TitlePrefix = 'Prof' | 'Dr' | 'Mr' | 'Mrs' | 'Ms';

export interface Researcher {
  id: string;
  fullName: string;
  slug: string;
  titlePrefix?: TitlePrefix;
  position: string;
  division: ResearchDivision;
  photo?: string;
  biography?: string;
  researchInterests?: string[];
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  email?: string;
  selectedPublications?: Publication[];
  isActive: boolean;
  status: 'draft' | 'published';
}

// ─── Insight ─────────────────────────────────────────────────────────────────

export type InsightContentType =
  | 'policy_brief'
  | 'commentary'
  | 'analysis'
  | 'opinion'
  | 'rapid_response';

export interface Insight {
  id: string;
  title: string;
  slug: string;
  contentType: InsightContentType;
  author?: AuthorSummary;
  publishedDate: string;
  body?: string;
  bodyPlaintext?: string;
  socialSummary?: string;
  featuredImage?: string;
  tags?: string[];
  isBreaking?: boolean;
  aiGenerated?: boolean;
  status: 'draft' | 'ai_draft' | 'review' | 'published';
}

// ─── Event ───────────────────────────────────────────────────────────────────

export type EventType = 'seminar' | 'workshop' | 'conference' | 'webinar';

export interface CMSEvent {
  id: string;
  title: string;
  slug: string;
  eventType: EventType;
  startDate: string;
  endDate?: string;
  location?: string;
  isOnline: boolean;
  registrationUrl?: string;
  recordingUrl?: string;
  speakers?: AuthorSummary[];
  division?: ResearchDivision;
  status: 'draft' | 'published';
  summary?: string;
}

// ─── News ────────────────────────────────────────────────────────────────────

export type NewsCategory = 'institutional' | 'media' | 'external';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  body?: string;
  summary?: string;
  publishedDate: string;
  category: NewsCategory;
  externalUrl?: string;
  featuredImage?: string;
  status: 'draft' | 'published';
}

// ─── Division ────────────────────────────────────────────────────────────────

export interface Division {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  description?: string;
  headOfDivision?: AuthorSummary;
  researchers?: AuthorSummary[];
  activeProjectsCount?: number;
  recentPublications?: Publication[];
  email?: string;
  status: 'draft' | 'published';
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export type ProcurementType = 'tender' | 'award' | 'expression_of_interest';

export interface ProcurementNotice {
  id: string;
  title: string;
  slug: string;
  noticeType: ProcurementType;
  issueDate: string;
  closingDate?: string;
  budget?: number;
  description?: string;
  documentFile?: string;
  awardedTo?: string;
  awardValue?: number;
  status: 'draft' | 'published';
}

// ─── API Params ──────────────────────────────────────────────────────────────

export interface PublicationParams {
  limit?: number;
  page?: number;
  type?: PublicationType;
  division?: ResearchDivision;
  year?: number;
}

export interface ResearcherParams {
  active?: boolean;
  division?: ResearchDivision;
}

export interface InsightParams {
  limit?: number;
  page?: number;
  contentType?: InsightContentType;
}

export interface EventParams {
  upcoming?: boolean;
  limit?: number;
}

export interface NewsParams {
  limit?: number;
  category?: NewsCategory;
}
