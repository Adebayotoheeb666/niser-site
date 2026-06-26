// ─── Shared sub-types ────────────────────────────────────────────────────────

export interface AuthorSummary {
  id: string;
  fullName: string;
  slug: string;
  titlePrefix: string;
  position: string;
  photo: string;
}

export interface DatasetResource {
  id: string;
  name: string;
  format: "CSV" | "JSON" | "PDF" | "XLSX";
  url: string;
  size?: string;
  description?: string;
}

export interface Dataset {
  id: string;
  title: string;
  notes: string;
  author: string;
  tags: string[];
  resources: DatasetResource[];
  organization: {
    name: string;
    title: string;
    description?: string;
  };
  metadataCreated: string;
  metadataModified: string;
  maintainer?: string;
  licenseTitle?: string;
  rowsCount?: number;
  previewData?: Record<string, string | number>[];
}

// ─── Publication ─────────────────────────────────────────────────────────────

export type PublicationType =
  | "working_paper"
  | "policy_brief"
  | "journal_article"
  | "book_chapter"
  | "annual_report"
  | "conference_paper";

export type ResearchDivision =
  | "macroeconomics"
  | "poverty_social"
  | "agriculture"
  | "governance"
  | "industry";

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
  status: "draft" | "review" | "published";
}

// ─── Researcher ──────────────────────────────────────────────────────────────

export type TitlePrefix = "Prof" | "Dr" | "Mr" | "Mrs" | "Ms";

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
  status: "draft" | "published";
}

// ─── Insight ─────────────────────────────────────────────────────────────────

export type InsightContentType =
  | "policy_brief"
  | "commentary"
  | "analysis"
  | "opinion"
  | "rapid_response";

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
  status: "draft" | "ai_draft" | "review" | "published";
}

// ─── Event ───────────────────────────────────────────────────────────────────

export type EventType = "seminar" | "workshop" | "conference" | "webinar";

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
  status: "draft" | "published";
  summary?: string;
}

// ─── News ────────────────────────────────────────────────────────────────────

export type NewsCategory = "institutional" | "media" | "external";

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
  status: "draft" | "published";
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
  status: "draft" | "published";
}

// ─── Procurement ─────────────────────────────────────────────────────────────

export type ProcurementType = "tender" | "award" | "expression_of_interest";

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
  status: "draft" | "published";
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

// ─── Job ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  level: string;
  jobType: string;
  location: string;
  postedDate: string;
  closingDate: string;
  salaryRange?: string;
  applicationUrl?: string;
  description?: string;
  isActive: boolean;
  status: "draft" | "published";
}

export interface JobParams {
  limit?: number;
  active?: boolean;
}

// ─── Internship ───────────────────────────────────────────────────────────────

export interface Internship {
  id: string;
  title: string;
  slug: string;
  department: string;
  duration: string;
  stipend?: string;
  closingDate: string;
  applicationUrl?: string;
  description?: string;
  isActive: boolean;
  status: "draft" | "published";
}

// ─── Training ─────────────────────────────────────────────────────────────────

export interface TrainingProgram {
  id: string;
  title: string;
  slug: string;
  programType: string;
  startDate: string;
  endDate?: string;
  location?: string;
  fee?: string;
  capacity?: number;
  registrationUrl?: string;
  trainingStatus: string;
  targetAudience?: string;
  duration?: string;
  description?: string;
  status: "draft" | "published";
}

export interface TrainingParams {
  limit?: number;
  status?: string;
}

// ─── Annual Report ────────────────────────────────────────────────────────────

export interface AnnualReport {
  id: string;
  title: string;
  slug: string;
  year: number;
  highlights?: string;
  pdfFile?: string;
  coverImage?: string;
  description?: string;
  status: "draft" | "published";
}

// ─── Partner ──────────────────────────────────────────────────────────────────

export interface Partner {
  id: string;
  name: string;
  slug: string;
  partnerType: string;
  country?: string;
  description?: string;
  websiteUrl?: string;
  logo?: string;
  partnershipType?: string;
  sinceYear?: number;
  isActive: boolean;
  status: "draft" | "published";
}

export interface PartnerParams {
  limit?: number;
  type?: string;
}

// ─── Research Center ──────────────────────────────────────────────────────────

export interface ResearchCenter {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  director?: AuthorSummary;
  established?: number;
  focusAreas?: string[];
  activeProjects?: number;
  email?: string;
  websiteUrl?: string;
  description?: string;
  status: "draft" | "published";
}

// ─── Working Group ────────────────────────────────────────────────────────────

export interface WorkingGroup {
  id: string;
  title: string;
  slug: string;
  lead?: AuthorSummary;
  membersCount?: number;
  focusArea?: string;
  established?: string;
  isActive: boolean;
  email?: string;
  description?: string;
  status: "draft" | "published";
}

// ─── Governance ───────────────────────────────────────────────────────────────

export type GovernanceRoleType = "executive" | "board" | "advisory";

export interface GovernanceMember {
  id: string;
  name: string;
  slug: string;
  roleType: GovernanceRoleType;
  memberTitle?: string;
  bio?: string;
  photo?: string;
  sortOrder?: number;
  email?: string;
  linkedin?: string;
  status: "draft" | "published";
}

export interface GovernanceParams {
  roleType?: GovernanceRoleType;
}

// ─── Funding Opportunity ──────────────────────────────────────────────────────

export interface FundingOpportunity {
  id: string;
  title: string;
  slug: string;
  fundingType: string;
  amountRange?: string;
  deadline?: string;
  eligibility?: string;
  applicationUrl?: string;
  sponsor?: string;
  isActive: boolean;
  description?: string;
  status: "draft" | "published";
}

export interface FundingParams {
  active?: boolean;
  limit?: number;
}

// ─── Case Study ───────────────────────────────────────────────────────────────

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client?: string;
  outcomeMetric?: string;
  year?: number;
  serviceArea?: string;
  description?: string;
  featuredImage?: string;
  status: "draft" | "published";
}
