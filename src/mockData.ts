
import { 
  LeaderboardEntry, 
  UserRole, 
  ArtistProfile, 
  MarketplaceItem, 
  RosterMember, 
  ServiceListing, 
  Lead, 
  ForumThread, 
  Article,
  Proposal,
  TreasuryAsset,
  StaffMember,
  ModerationCase,
  SupportTicket,
  CircleMember
} from './types';

// --- MOCK CIRCLE DATA ---
const mockFollowers: CircleMember[] = [
  { id: 'f1', name: 'Elena Vance', avatar: 'https://i.pravatar.cc/150?u=f1', role: 'Vocalist' },
  { id: 'f2', name: 'Marcus Cole', avatar: 'https://i.pravatar.cc/150?u=f2', role: 'Producer' },
  { id: 'f3', name: 'Aria Chen', avatar: 'https://i.pravatar.cc/150?u=f3', role: 'Reveller' },
];

const mockBusinessAssociates: CircleMember[] = [
  { id: 'b1', name: 'Julian Cross', avatar: 'https://i.pravatar.cc/150?u=b1', role: 'Venue Manager' },
  { id: 'b2', name: 'Starlight Booking', avatar: 'https://i.pravatar.cc/150?u=b2', role: 'Agency' },
];


// --- BASE PROFILES FOR EACH ROLE ---

export const MOCK_ARTIST_PROFILE: ArtistProfile = {
  id: 'u_artist',
  name: 'Luna Eclipse',
  avatar: 'https://picsum.photos/seed/u1/200',
  role: UserRole.ARTIST,
  xp: 450,
  level: 2,
  password: 'live', // Default mock password
  coverImage: 'https://picsum.photos/seed/gig1/1200/400',
  bio: "Electronic synthesis meets classical composition. Based in Brooklyn, Luna Eclipse has been redefining the ambient techno scene since 2021.\n\nMy sets are an immersive journey through sound and light, perfect for intimate venues and large-scale festivals alike.",
  location: 'Brooklyn, NY',
  genres: ['Techno', 'Ambient', 'Electronica'],
  verified: true,
  followers: mockFollowers,
  businessAssociates: mockBusinessAssociates,
  pressKit: {
    photos: ['https://picsum.photos/seed/gig2/400/400', 'https://picsum.photos/seed/gig3/400/400'],
    topTracks: [
      { title: 'Midnight Protocol', duration: '5:42', plays: '124' },
      { title: 'Neon Rain', duration: '4:15', plays: '98' }
    ],
    techRiderUrl: '#',
    socials: [{ platform: 'Instagram', followers: '45' }, { platform: 'Twitter', followers: '12' }]
  },
  stats: { gigsCompleted: 3, activeGigs: 1, rating: 4.9, responseTime: '< 2 hrs' },
  equityOpportunities: [
    {
      id: 'eq-1',
      title: 'Project: \"Neon Horizons\" Album',
      type: 'Project Equity',
      description: 'Invest in the production and marketing of the upcoming sophomore album.',
      totalValuation: 5000,
      currency: 'USD',
      equityAvailablePercentage: 20,
      minInvestment: 50,
      tokenSymbol: '$NEON2',
      technology: 'ERC-20',
      termsSummary: 'Investors receive 20% of net royalties for 5 years.',
      riskLevel: 'Medium',
      backersCount: 2
    }
  ],
  subscription: { 
    planName: 'Community Pro', 
    status: 'Active', 
    expiryDate: '2024-10-24', 
    supportTier: 'Priority', 
    autoRenew: true,
    hasLeadGeniusSync: false
  },
  savedPaymentMethods: {
    crypto: [{ id: 'w1', network: 'Ethereum', address: '0x71C...9A23', label: 'Main Vault', isDefault: true }],
    fiat: [{ id: 'c1', type: 'Card', last4: '4242', label: 'Chase Business', isDefault: true }]
  },
  revenue: {
    totalLifetime: 850,
    pendingPayout: 150,
    lastMonth: 340,
    breakdown: {
      gigs: 600,
      merch: 100,
      royalties: 50,
      licensing: 100
    },
    recentPayouts: [
      { date: '2023-09-15', amount: 200, method: 'Crypto (ETH)', status: 'Completed' },
      { date: '2023-08-15', amount: 150, method: 'Bank Transfer', status: 'Completed' }
    ]
  },
  leadQueries: []
};

export const MOCK_DAO_GOVERNOR_PROFILE: ArtistProfile = {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_dao_gov',
    name: 'Governor Alice',
    role: UserRole.DAO_GOVERNOR,
    avatar: 'https://picsum.photos/seed/dao/200',
    level: 15,
    bio: 'Founding member of the KalaKrut DAO. Focused on sustainable growth and artist empowerment.',
    stats: { gigsCompleted: 0, activeGigs: 0, rating: 5.0, responseTime: 'N/A' },
};

export const MOCK_DAO_MEMBER_PROFILE: ArtistProfile = {
    ...MOCK_ARTIST_PROFILE,
    id: 'u_dao_member',
    name: 'Leo Valdez',
    role: UserRole.DAO_MEMBER,
    avatar: 'https://picsum.photos/seed/daomember/200',
    level: 8,
    xp: 2500,
    bio: 'Sound engineer and long-time community member. Recently accepted nomination to join the DAO.',
    stats: { gigsCompleted: 1, activeGigs: 1, rating: 4.8, responseTime: '< 24 hrs' },
};


// Mock Users for Role Switcher
export const MOCK_USERS_BY_ROLE: Record<UserRole, ArtistProfile> = {
  [UserRole.ARTIST]: MOCK_ARTIST_PROFILE,
  [UserRole.VENUE]: { ...MOCK_ARTIST_PROFILE, id: 'u_venue', name: 'The Warehouse', role: UserRole.VENUE, avatar: 'https://picsum.photos/seed/venue1/200', location: 'London, UK', stats: { gigsCompleted: 5, activeGigs: 2, rating: 4.8, responseTime: '< 6 hrs' } },
  [UserRole.SPONSOR]: { ...MOCK_ARTIST_PROFILE, id: 'u_sponsor', name: 'RedBull Music', role: UserRole.SPONSOR, avatar: 'https://picsum.photos/seed/sponsor1/200', location: 'Global', stats: { gigsCompleted: 2, activeGigs: 1, rating: 5.0, responseTime: '< 24 hrs' } },
  [UserRole.ORGANIZER]: { ...MOCK_ARTIST_PROFILE, id: 'u_org', name: 'Festival Co.', role: UserRole.ORGANIZER, avatar: 'https://picsum.photos/seed/org/200', stats: { gigsCompleted: 1, activeGigs: 1, rating: 4.7, responseTime: '< 12 hrs' } },
  [UserRole.SERVICE_PROVIDER]: { ...MOCK_ARTIST_PROFILE, id: 'u_service', name: 'Legal Eagle', role: UserRole.SERVICE_PROVIDER, avatar: 'https://picsum.photos/seed/legal/200', stats: { gigsCompleted: 3, activeGigs: 2, rating: 4.9, responseTime: '< 48 hrs' } },
  
  [UserRole.REVELLER]: { ...MOCK_ARTIST_PROFILE, id: 'u_reveller', name: 'Alex Fan', role: UserRole.REVELLER, avatar: 'https://picsum.photos/seed/fan1/200', level: 2, xp: 150, stats: { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: 'N/A' } },
  [UserRole.ADMIN]: { ...MOCK_ARTIST_PROFILE, id: 'u_admin', name: 'System Admin', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/200', level: 99, stats: { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: 'N/A' } },
  [UserRole.SYSTEM_ADMIN_LIVE]: { ...MOCK_ARTIST_PROFILE, id: 'u_sys_admin_live', name: 'Kala Owner', role: UserRole.SYSTEM_ADMIN_LIVE, avatar: 'https://picsum.photos/seed/sysadmin/200', level: 100, password: 'live', stats: { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: 'N/A' } },
  
  [UserRole.DAO_GOVERNOR]: MOCK_DAO_GOVERNOR_PROFILE,
  [UserRole.DAO_MEMBER]: MOCK_DAO_MEMBER_PROFILE,
};


export const MOCK_ROSTER: RosterMember[] = [
  // --- LIVE USERS (for Web2 & Web3 login) ---
  {
    id: 'u_sys_admin_live',
    name: 'Kala Owner',
    role: UserRole.SYSTEM_ADMIN_LIVE,
    email: 'bhoominpandya@gmail.com',
    password: 'live',
    isMock: false,
    onboardingComplete: true,
    avatar: MOCK_USERS_BY_ROLE[UserRole.SYSTEM_ADMIN_LIVE].avatar,
    location: 'Decentralized',
  },
  {
    id: 'u_artist',
    name: 'Luna Eclipse',
    role: UserRole.ARTIST,
    email: 'luna@example.com',
    password: 'live',
    walletAddress: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    isMock: false,
    onboardingComplete: true,
    avatar: MOCK_USERS_BY_ROLE[UserRole.ARTIST].avatar,
    location: 'Brooklyn, NY',
  },
  {
    id: 'r2',
    name: 'The Warehouse',
    role: UserRole.VENUE,
    email: 'warehouse@example.com',
    password: 'live',
    walletAddress: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    isMock: false,
    onboardingComplete: true,
    avatar: MOCK_USERS_BY_ROLE[UserRole.VENUE].avatar,
    location: 'London, UK',
  },

  // --- DEMO USERS (for "Click-to-enter" functionality) ---
  {
    id: 'demo_artist',
    name: 'Luna Eclipse',
    role: UserRole.ARTIST,
    email: 'artist@demo.com',
    password: 'demo',
    walletAddress: '0x1111111111111111111111111111111111111111',
    isMock: true, 
    onboardingComplete: true,
    avatar: 'https://picsum.photos/seed/demoartist/200'
  },
  {
    id: 'demo_venue',
    name: 'The Warehouse',
    role: UserRole.VENUE,
    email: 'venue@demo.com',
    password: 'demo',
    walletAddress: '0x2222222222222222222222222222222222222222',
    isMock: true, 
    onboardingComplete: true,
    avatar: 'https://picsum.photos/seed/demovenue/200'
  },
    {
    id: 'demo_sponsor',
    name: 'RedBull Music',
    role: UserRole.SPONSOR,
    email: 'sponsor@demo.com',
    password: 'demo',
    walletAddress: '0x3333333333333333333333333333333333333333',
    isMock: true, 
    onboardingComplete: true,
    avatar: 'https://picsum.photos/seed/demosponsor/200'
  },
  {
    id: 'demo_reveller',
    name: 'Alex Fan',
    role: UserRole.REVELLER,
    email: 'reveller@demo.com',
    password: 'demo',
    walletAddress: '0x4444444444444444444444444444444444444444',
    isMock: true, 
    onboardingComplete: true,
    avatar: 'https://picsum.photos/seed/demoreveller/200'
  },
  {
    id: 'demo_organizer',
    name: 'Festival Co.',
    role: UserRole.ORGANIZER,
    email: 'organizer@demo.com',
    password: 'demo',
    walletAddress: '0x5555555555555555555555555555555555555555',
    isMock: true, 
    onboardingComplete: true,
    avatar: 'https://picsum.photos/seed/demoorganizer/200'
  },
  {
    id: 'demo_service_provider',
    name: 'Legal Eagle',
    role: UserRole.SERVICE_PROVIDER,
    email: 'service@demo.com',
    password: 'demo',
    walletAddress: '0x6666666666666666666666666666666666666666',
    isMock: true, 
    onboardingComplete: true,
    avatar: 'https://picsum.photos/seed/demoservice/200'
  },
  {
    id: 'demo_dao_governor',
    name: 'Governor Alice',
    role: UserRole.DAO_GOVERNOR,
    email: 'governor@demo.com',
    password: 'demo',
    walletAddress: '0x7777777777777777777777777777777777777777',
    isMock: true,
    onboardingComplete: true,
    avatar: MOCK_USERS_BY_ROLE[UserRole.DAO_GOVERNOR].avatar
  },
  {
    id: 'demo_dao_member',
    name: 'Leo Valdez',
    role: UserRole.DAO_MEMBER,
    email: 'member@demo.com',
    password: 'demo',
    walletAddress: '0x8888888888888888888888888888888888888888',
    isMock: true,
    onboardingComplete: true,
    avatar: MOCK_USERS_BY_ROLE[UserRole.DAO_MEMBER].avatar
  },
  {
    id: 'demo_admin',
    name: 'System Admin',
    role: UserRole.ADMIN,
    email: 'admin@demo.com',
    password: 'demo',
    walletAddress: '0x9999999999999999999999999999999999999999',
    isMock: true,
    onboardingComplete: true,
    avatar: MOCK_USERS_BY_ROLE[UserRole.ADMIN].avatar
  }
];


export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, user: { ...MOCK_USERS_BY_ROLE[UserRole.ARTIST], name: 'Luna Eclipse', xp: 450, level: 2 }, badges: ['Early Adopter'], change: 0 },
  { rank: 2, user: { ...MOCK_USERS_BY_ROLE[UserRole.VENUE], name: 'The Warehouse', xp: 320, level: 1 }, badges: ['Super Host'], change: 0 },
  { rank: 3, user: { ...MOCK_USERS_BY_ROLE[UserRole.REVELLER], name: 'CryptoFan_99', xp: 150, level: 1 }, badges: ['Collector'], change: 0 },
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-101',
    title: 'Initialize Treasury',
    description: 'Proposal to seed the community treasury with initial grant funding.',
    votesFor: 3,
    votesAgainst: 0,
    deadline: '2023-10-20',
    status: 'Active',
    creator: 'Governor Alice',
    quorumRequired: 20,
    currentParticipation: 100, // 3/3 users voted
    isCritical: true
  }
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: 'Cyberpunk Guitar (Limited Ed.)',
    type: 'Instrument',
    price: 1200,
    currency: 'USD',
    image: 'https://picsum.photos/seed/guitar/400/400',
    seller: { name: 'Neon Pulse', avatar: 'https://picsum.photos/seed/u2/50', verified: true },
    isAuction: false,
    description: 'Custom painted Cyberpunk 2077 themed electric guitar. Modified pickups for extra crunch. Used on stage during the \"Neon Nights\" tour.',
    condition: 'Like New'
  },
  {
    id: 'm2',
    title: 'Lifetime Backstage Pass NFT',
    type: 'NFT',
    price: 0.5,
    currency: 'ETH',
    image: 'https://picsum.photos/seed/nft1/400/400',
    seller: { name: 'The Warehouse', avatar: 'https://picsum.photos/seed/venue1/50', verified: true },
    isAuction: true,
    endTime: '2d 14h',
    description: 'Granting lifetime backstage access to all events at The Warehouse London. Includes VIP bar access and meet & greet privileges. Tradable on secondary market.',
    condition: 'Digital'
  }
];

export const MOCK_THREADS: ForumThread[] = [
  {
    id: '1',
    title: 'Welcome to the Beta!',
    category: 'General',
    author: 'System Admin',
    authorAvatar: 'https://picsum.photos/seed/admin/50',
    replies: 2,
    views: 12,
    lastActive: '1h ago',
    isPinned: true
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'KalaKrut Launches Beta',
    excerpt: 'Welcome to the future of creative collaboration. We are live with our first cohort of artists.',
    content: 'Full article content here...',
    date: 'Oct 12, 2023',
    author: 'KalaKrut Team',
    image: 'https://picsum.photos/seed/news1/800/400',
    category: 'Announcement'
  }
];

export const MOCK_SERVICES: ServiceListing[] = [
  {
    id: '1',
    title: 'Web3 Grant Writing & Strategy',
    provider: 'CryptoGrants Co.',
    category: 'Grant Writing',
    rate: '150',
    rating: 5.0,
    reviews: 1,
    isPlatformService: false
  }
];

export const MOCK_TREASURY_ASSETS: TreasuryAsset[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 2.5, valueUsd: 4500, allocation: 25, trend: 'neutral' },
  { symbol: 'USDC', name: 'USD Coin', balance: 10000, valueUsd: 10000, allocation: 55, trend: 'neutral' },
  { symbol: 'KALA', name: 'Kala Token', balance: 50000, valueUsd: 2500, allocation: 20, trend: 'up' }
];

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Sarah Connor',
    role: 'Community Manager',
    department: 'Community',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/staff1/200',
    email: 'sarah@kalakrut.io',
    lastActive: '5 mins ago',
    designation: 'Community Lead',
    employmentDate: '2023-09-01',
    salary: 4000,
    currency: 'USD',
    taxDeductions: 600,
    normalHours: 160,
    hoursWorked: 160,
    overtimeHours: 0,
    overtimePaid: 0,
    leavesAccrued: 2,
    leavesUsed: 0,
    duties: ['Manage Discord', 'Onboard initial users'],
    monthlyTasks: ['Welcome new users', 'Gather feedback']
  }
];

export const MOCK_MODERATION_CASES: ModerationCase[] = [];

export const MOCK_TICKETS: SupportTicket[] = [
  {
     id: 'TK-1001',
     userId: 'u_artist',
     userName: 'Luna Eclipse',
     subject: 'Profile Verification',
     category: 'Account',
     priority: 'Low',
     status: 'Open',
     tier: 'Tier 1',
     createdAt: '2023-10-14 09:00',
     lastUpdate: '2h ago'
  }
];
