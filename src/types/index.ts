// User Types
export enum UserRole {
  INNOVATOR = 'innovator',
  EXECUTOR = 'executor',
  INVESTOR = 'investor'
}

export interface User {
  id: string;
  address: string;
  role: UserRole;
  name?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
}

// NFT Status Types
export enum IdeaStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

export enum ProjectStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum FundingStatus {
  SEEKING = 'seeking',
  FUNDED = 'funded',
  PARTIALLY_FUNDED = 'partially_funded',
  WITHDRAWN = 'withdrawn'
}

// Milestone Types
export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  verificationCriteria: string[];
  reward?: string; // Amount in USDC
}

// NFT Types
export interface IdeaNFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  innovatorAddress: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUri?: string;
  metadataUri: string;
  royaltyPercentage: number; // Always 5% for innovators
  status: IdeaStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectNFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  ideaNFTId: string;
  executorAddress: string;
  innovatorAddress: string;
  title: string;
  description: string;
  milestones: Milestone[];
  equityPercentage: number; // 95% for executor if milestones met
  status: ProjectStatus;
  imageUri?: string;
  metadataUri: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentNFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  projectNFTId: string;
  investorAddress: string;
  executorAddress: string;
  investmentAmount: string; // In USDC
  equityPercentage: number;
  terms: InvestmentTerms;
  escrowAddress: string;
  status: FundingStatus;
  metadataUri: string;
  createdAt: Date;
  updatedAt: Date;
}

// Proposal Types
export interface ExecutorProposal {
  id: string;
  ideaNFTId: string;
  executorAddress: string;
  innovatorAddress: string;
  proposalTitle: string;
  proposalDescription: string;
  milestones: Milestone[];
  estimatedTimeline: number; // In days
  requestedEquity: number; // Usually 95%
  additionalTerms?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  fee: string; // 5 USDC or 0 if invited
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestorProposal {
  id: string;
  projectNFTId: string;
  investorAddress: string;
  executorAddress: string;
  proposalTitle: string;
  investmentAmount: string; // In USDC
  requestedEquity: number;
  terms: InvestmentTerms;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  fee: string; // 50 USDC or 0 if invited
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentTerms {
  payoutSchedule: PayoutSchedule[];
  milestoneRequirements: string[];
  exitStrategy?: string;
  additionalTerms?: string;
}

export interface PayoutSchedule {
  milestoneId: string;
  amount: string; // In USDC
  percentage: number; // Percentage of total investment
  conditions: string[];
}

// Dashboard Types
export interface InnovatorDashboard {
  ideas: IdeaNFT[];
  executorProposals: ExecutorProposal[];
  activeProjects: ProjectNFT[];
  totalRoyaltiesEarned: string;
}

export interface ExecutorDashboard {
  acceptedProjects: ProjectNFT[];
  investorProposals: InvestorProposal[];
  activeMilestones: Milestone[];
  totalEquityValue: string;
}

export interface InvestorDashboard {
  investments: InvestmentNFT[];
  portfolioValue: string;
  activeProjects: ProjectNFT[];
  completedMilestones: number;
  pendingPayouts: PayoutSchedule[];
}

// Marketplace Types
export interface MarketplaceIdea {
  idea: IdeaNFT;
  innovator: User;
  proposalCount: number;
  viewCount: number;
}

export interface MarketplaceProject {
  project: ProjectNFT;
  executor: User;
  innovator: User;
  fundingGoal: string;
  currentFunding: string;
  investorCount: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  hash: string;
  type: 'idea_creation' | 'proposal_submission' | 'proposal_acceptance' | 'investment' | 'milestone_completion' | 'payout';
  from: string;
  to: string;
  amount?: string;
  fee?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
}

// AI Agent Tool Types (for executors)
export interface AIAgentConfig {
  id: string;
  projectId: string;
  enabled: boolean;
  tools: AITool[];
  settings: AISettings;
}

export interface AITool {
  id: string;
  name: string;
  type: 'development' | 'marketing' | 'fundraising' | 'analytics';
  enabled: boolean;
  config: Record<string, any>;
}

export interface AISettings {
  autoSuggest: boolean;
  maxSuggestionsPerDay: number;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'proposal_received' | 'proposal_accepted' | 'proposal_rejected' | 'milestone_completed' | 'payment_received' | 'investment_received';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// Filter and Sort Types
export interface IdeaFilters {
  category?: string;
  status?: IdeaStatus;
  minDate?: Date;
  maxDate?: Date;
  tags?: string[];
}

export interface ProjectFilters {
  status?: ProjectStatus;
  fundingStatus?: FundingStatus;
  minFunding?: number;
  maxFunding?: number;
  category?: string;
}

export type SortOption = 'newest' | 'oldest' | 'most_funded' | 'least_funded' | 'most_proposals' | 'trending';

// Contract Addresses (CDP-specific)
export interface ContractAddresses {
  ideaNFT: string;
  projectNFT: string;
  investmentNFT: string;
  escrowFactory: string;
  paymentProcessor: string;
  network: string;
}

// CDP API Response Types
export interface CDPApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
