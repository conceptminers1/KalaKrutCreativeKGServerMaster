
export enum UserRole {
  ADMIN = 'Admin',
  SYSTEM_ADMIN_LIVE = 'System Admin (Live)',
  ARTIST = 'Artist',
  VENUE = 'Venue',
  SPONSOR = 'Sponsor',
  REVELLER = 'Reveller',
  ORGANIZER = 'Organizer',
  DAO_MEMBER = 'DAO Member',
  SERVICE_PROVIDER = 'Service Provider',
  DAO_GOVERNOR = 'DAO Governor'
}

export interface SmartContractDraft {
  id: string;
  contractType: 'IERC-20' | 'IERC-721' | 'Service Agreement';
  content: string; // The legal text or pseudo-code
  lastEditedBy: 'User' | 'Admin';
  version: number;
  status: 'Draft' | 'Pending Review' | 'Negotiation' | 'Active' | 'Rejected';
  adminNotes?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  walletAddress?: string;
  email?: string;
  xp: number;
  level: number;
  password?: string; // For mock auth simulation
}

export interface RevenueStats {
  totalLifetime: number;
  pendingPayout: number;
  lastMonth: number;
  breakdown: {
    gigs: number;
    merch: number;
    royalties: number;
    licensing: number;
  };
  recentPayouts: { date: string; amount: number; method: string; status: 'Completed' | 'Processing' }[];
}

export interface EquityOpportunity {
  id: string;
  title: string;
  type: 'Project Equity' | 'Career Equity' | 'Asset Fractionalization';
  description: string;
  totalValuation: number;
  currency: 'USD' | 'ETH';
  equityAvailablePercentage: number;
  minInvestment: number;
  tokenSymbol?: string;
  technology: 'ERC-20' | 'ERC-1155' | 'Legal DAO Wrapper';
  termsSummary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  backersCount: number;
}

export interface LeadQuery {
  id: string;
  date: string;
  query: string;
  responseSummary: string;
  method: 'Auto-Sync' | 'Manual Entry';
  isPaidService: boolean;
}

export interface CircleMember {
    id: string;
    name: string;
    avatar: string;
    role: string;
}

export interface ArtistProfile extends User {
  onboardingComplete: boolean;
  coverImage: string;
  bio: string;
  location: string;
  genres: string[];
  verified: boolean;
  followers?: CircleMember[];
  businessAssociates?: CircleMember[];
  pressKit: {
    photos: string[];
    topTracks: { title: string; duration: string; plays: string }[];
    techRiderUrl: string;
    socials: { platform: string; followers: string }[];
  };
  stats: {
    gigsCompleted: number;
    activeGigs: number;
    rating: number;
    responseTime: string;
  };
  equityOpportunities?: EquityOpportunity[];
  subscription?: {
    planName: string;
    status: 'Active' | 'Expired' | 'Grace Period';
    expiryDate: string;
    supportTier: 'Standard' | 'Priority' | 'Elite';
    autoRenew: boolean;
    hasLeadGeniusSync?: boolean;
  };
  savedPaymentMethods?: {
    crypto: { id: string; network: string; address: string; label: string; isDefault?: boolean }[];
    fiat: { id: string; type: 'Card' | 'Bank'; last4: string; label: string; expiry?: string; isDefault?: boolean }[];
  };
  revenue?: RevenueStats;
  leadQueries?: LeadQuery[];
}

export interface RosterMember {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  location: string;
  verified: boolean;
  onboardingComplete: boolean;
  walletAddress?: string;
  assets: {
    ips: any[];
    contents: any[];
    events: any[];
    products: any[];
    services: any[];
    equipment: any[];
    instruments: any[];
    tickets: any[];
  };
  rating: number;
  subscriberOnly: {
    email: string;
    phone: string;
    agentContact: string;
  };
  isMock?: boolean;
  password?: string;
}

export interface Message {
  id: string;
  sender: 'me' | 'them' | 'system';
  text: string;
  timestamp: string;
  isWarning?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  badges: string[];
  change: number;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: string;
  status: 'Active' | 'Passed' | 'Rejected' | 'Vetoed' | 'Admin_Passed';
  creator: string;
  quorumRequired: number; // Percentage (e.g., 20)
  currentParticipation: number; // Percentage (e.g., 15)
  isCritical?: boolean;
  // Linked Contract
  contractData?: SmartContractDraft; 
}

export interface Milestone {
  id: string;
  title: string;
  percentage: number;
  status: 'Pending' | 'Submitted' | 'Released';
  proof?: string;
}

export interface CollabProposal {
  id:string;
  eventName: string;
  artistName: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Funded' | 'Negotiation';
  budget: string;
  currency: 'USD' | 'ETH' | 'KALA';
  receiverNote?: string;
  sentDate: string;
  paymentType: 'Lump Sum' | 'Milestone Based';
  milestones?: Milestone[];
  // Linked Contract
  contractData?: SmartContractDraft;
}

export interface Booking {
  id: string;
  artistName: string;
  venueName: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  payoutAmount: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  type: 'NFT' | 'Physical Art' | 'Ticket' | 'Instrument' | 'Equipment';
  price: number;
  currency: 'ETH' | 'USD' | 'KALA';
  image: string;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  isAuction: boolean;
  endTime?: string;
  description?: string;
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Digital';
}

export interface ServiceListing {
  id: string;
  title: string;
  provider: string;
  category: 'Consultancy' | 'Grant Writing' | 'Legal' | 'Marketing' | 'Production';
  rate: string;
  rating: number;
  reviews: number;
  isPlatformService?: boolean;
  externalLink?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: 'Announcement' | 'Press Release' | 'Community' | 'Feature';
}

export interface Lead {
  id: string;
  email: string;
  source: string;
  status: 'New' | 'Contacted' | 'Converted';
  generatedDate: string;
  notes: string;
}

export interface ForumThread {
  id: string;
  title: string;
  category: 'Collaboration' | 'Gear Swap' | 'General' | 'Showcase';
  author: string;
  authorAvatar: string;
  replies: number;
  views: number;
  lastActive: string;
  isPinned?: boolean;
}

export interface Transaction {
  id: string;
  type: 'Incoming' | 'Outgoing' | 'Mint' | 'Gas' | 'Swap';
  description: string;
  amount: string;
  currency: 'ETH' | 'KALA' | 'USDC';
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  hash: string;
}

export interface IPFSAsset {
  id: string;
  name: string;
  type: 'Image' | 'Audio' | 'Video' | 'Document';
  size: string;
  cid: string;
  url: string;
  status: 'Uploading' | 'Pinned' | 'Minted';
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: 'Transaction' | 'Proposal' | 'Payment' | 'Technical' | 'Account';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  createdAt: string;
  lastUpdate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isRecommended?: boolean;
  supportTier: 'Standard' | 'Priority' | 'Elite';
}

export interface TreasuryAsset {
  symbol: string;
  name: string;
  balance: number;
  valueUsd: number;
  allocation: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Admin' | 'Moderator' | 'Support' | 'Developer' | 'Community Manager';
  department: 'Operations' | 'Tech' | 'Community' | 'Legal';
  status: 'Active' | 'On Leave' | 'Terminated';
  avatar: string;
  email: string;
  lastActive: string;
  
  // Detailed HR Fields
  designation: string;
  employmentDate: string;
  salary: number; // Monthly Base Salary
  currency: string;
  taxDeductions: number; // Fixed amount or calculated
  
  // Time Tracking (Monthly)
  normalHours: number;
  hoursWorked: number;
  overtimeHours: number;
  overtimePaid: number;
  
  // Leave Management (Days)
  leavesAccrued: number;
  leavesUsed: number;
  
  // Tasks
  duties: string[];
  monthlyTasks: string[];
}

export interface ModerationCase {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  violationType: string;
  contentSnippet: string;
  status: 'Blocked' | 'Appeal Pending' | 'Resolved - Unblocked' | 'Resolved - Ban Upheld';
  timestamp: string;
  appealReason?: string;
}
