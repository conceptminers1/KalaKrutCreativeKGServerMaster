
// src/services/knowledgeGraphService.ts

import { 
  MOCK_ROSTER,
  MOCK_USERS_BY_ROLE,
  MOCK_ARTIST_PROFILE
} from '../mockData';
import { UserRole, RosterMember, ArtistProfile } from '../types';

// --- DEFINITIVE DATA MERGING LOGIC ---

/**
 * Creates a single, clean list of users by merging login stubs with real profiles.
 * This is the single source of truth for all user data in the app.
 * It uses the user's `name` to reliably merge profiles, solving previous data bugs.
 */
const getMergedRoster = (): ArtistProfile[] => {
    // Create a map of detailed profiles from MOCK_USERS_BY_ROLE, keyed by name.
    const detailedProfileMap = new Map(Object.values(MOCK_USERS_BY_ROLE).map(p => [p.name, p]));

    // Map over the basic roster info from MOCK_ROSTER.
    return MOCK_ROSTER.map(rosterUser => {
        // Find the corresponding detailed profile using the user's name as the key.
        const detailedProfile = detailedProfileMap.get(rosterUser.name);

        if (detailedProfile) {
            // A specific profile was found. Return it, but ensure the rosterUser's unique
            // login details (like id, email, password, isMock) take precedence.
            return { ...detailedProfile, ...rosterUser };
        } else {
            // Fallback for demo users or any users in MOCK_ROSTER not in MOCK_USERS_BY_ROLE.
            // This is a safety net. For instance, a "Demo Artist" won't have a detailed profile.
            return { ...MOCK_ARTIST_PROFILE, ...rosterUser };
        }
    });
};


// This finalRoster is the definitive source of user data for the service.
const finalRoster = getMergedRoster();

// --- Corrected Graph and Node Definitions ---

interface Node {
  id: string;
  label: string;
  type: string; // Keep as string to accommodate all roles
}

interface Edge {
  source: string;
  target: string;
  label: 'PLAYS_AT' | 'SPONSORED_BY' | 'USES_SERVICE' | 'OVERSEES' | 'CONNECTED_TO';
}

// Helper to find the CORRECT user profiles from the merged list.
const findUser = (role: UserRole) => finalRoster.find(m => m.role === role);

// Define constants for all user types in the requested order, using the merged roster.
const artist = findUser(UserRole.ARTIST);
const venue = findUser(UserRole.VENUE);
const serviceProvider = findUser(UserRole.SERVICE_PROVIDER);
const organizer = findUser(UserRole.ORGANIZER);
const sponsor = findUser(UserRole.SPONSOR);
const reveller = findUser(UserRole.REVELLER);
const admin = findUser(UserRole.ADMIN);
const daoGovernor = findUser(UserRole.DAO_GOVERNOR);
const daoMember = findUser(UserRole.DAO_MEMBER);

// INITIAL_NODES now correctly uses the REAL names for labels for ALL users.
export const INITIAL_NODES: Node[] = [
  ...(artist ? [{ id: artist.id, label: artist.name, type: 'Artist' }] : []),
  ...(venue ? [{ id: venue.id, label: venue.name, type: 'Venue' }] : []),
  ...(serviceProvider ? [{ id: serviceProvider.id, label: serviceProvider.name, type: 'Service' }] : []),
  ...(organizer ? [{ id: organizer.id, label: organizer.name, type: 'Organizer' }] : []),
  ...(sponsor ? [{ id: sponsor.id, label: sponsor.name, type: 'Sponsor' }] : []),
  ...(reveller ? [{ id: reveller.id, label: reveller.name, type: 'Reveller' }] : []),
  ...(admin ? [{ id: admin.id, label: admin.name, type: 'Admin' }] : []),
  ...(daoGovernor ? [{ id: daoGovernor.id, label: daoGovernor.name, type: 'DAO Governor' }] : []),
  ...(daoMember ? [{ id: daoMember.id, label: daoMember.name, type: 'DAO Member' }] : []),
  { id: 'treasury_main', label: 'Main Treasury', type: 'Treasury' },
];

// Edges remain correct as they use IDs, which are consistent.
export const INITIAL_EDGES: Edge[] = [
  ...(artist && venue ? [{ source: artist.id, target: venue.id, label: 'PLAYS_AT' as const }] : []),
  ...(artist && sponsor ? [{ source: artist.id, target: sponsor.id, label: 'SPONSORED_BY' as const }] : []),
  ...(artist && serviceProvider ? [{ source: artist.id, target: serviceProvider.id, label: 'USES_SERVICE' as const }] : []),
  ...(daoGovernor && artist ? [{ source: daoGovernor.id, target: artist.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor && venue ? [{ source: daoGovernor.id, target: venue.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor && sponsor ? [{ source: daoGovernor.id, target: sponsor.id, label: 'OVERSEES' as const }] : []),
  ...(daoGovernor ? [{ source: daoGovernor.id, target: 'treasury_main', label: 'CONNECTED_TO' as const }] : []),
];


// --- KnowledgeGraph Class Implementation (Preserved) ---

class KnowledgeGraph {
  private connections: Map<string, string[]>;
  public nodes: Node[];
  public edges: Edge[];

  constructor() {
    this.connections = new Map();
    this.nodes = [];
    this.edges = [];
  }

  public loadData(nodes: Node[], edges: Edge[]): void {
    this.nodes = nodes;
    this.edges = edges;
    this.connections.clear();

    edges.forEach(edge => {
      const targetNode = nodes.find(n => n.id === edge.target);
      const connectionLabel = targetNode ? `${targetNode.type}:${targetNode.label}` : edge.target;
      if (!this.connections.has(edge.source)) {
        this.connections.set(edge.source, []);
      }
      this.connections.get(edge.source)!.push(connectionLabel);

      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode) {
          const reverseConnectionLabel = `${sourceNode.type}:${sourceNode.label}`;
          if (!this.connections.has(edge.target)) {
              this.connections.set(edge.target, []);
          }
          if (!this.connections.get(edge.target)!.includes(reverseConnectionLabel)) {
            this.connections.get(edge.target)!.push(reverseConnectionLabel);
          }
      }
    });
  }

  public getConnections(id: string): string[] {
    return this.connections.get(id) || [];
  }

  /**
   * Retrieves the full community roster, now correctly named and de-duplicated at the source.
   */
  public getRosterMembers(): (RosterMember & { protected?: boolean })[] {
    return finalRoster.map(member => ({
      ...member,
      protected: member.role === UserRole.SPONSOR
    }));
  }

  public findLeads(query: string): any[] {
    if (query.includes('releases') && query.includes('no upcoming events')) {
      return [
        { id: 'ai-l1', name: 'DJ Quantum', reason: 'Has 3 new tracks, zero upcoming gigs.' },
        { id: 'ai-l2', name: 'The Vinylists', reason: 'Album dropped last month, no tour dates.' }
      ];
    }
    return [];
  }
}

// --- Singleton Instantiation (Preserved) ---

const knowledgeGraph = new KnowledgeGraph();
knowledgeGraph.loadData(INITIAL_NODES, INITIAL_EDGES);

export { knowledgeGraph };
