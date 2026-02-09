
import { UserRole, RosterMember, IArtistProfile } from '../types.ts';
import { MOCK_USERS_BY_ROLE } from '../mockData';

// A more robust login function to prevent silent failures.
export const login = (
  roster: RosterMember[],
  role: UserRole,
  method: 'web2' | 'web3',
  loginMode: 'demo' | 'live',
  credentials?: any,
  walletAddress?: string | null
): IArtistProfile | null => {
  const isMock = loginMode === 'demo';

  let foundUser: RosterMember | undefined;

  if (method === 'web3') {
    if (!walletAddress) return null;
    foundUser = roster.find(u =>
    u.walletAddress?.toLowerCase()
    && u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    && u.isMock === isMock
    && u.role === role
    );

  } else { // web2
    if (!credentials || !credentials.email || !credentials.password) return null;

    // This logic is complex, so we'll be very specific
    if (loginMode === 'live' && role === UserRole.ADMIN) {
      foundUser = roster.find(u =>
        u.email === credentials.email &&
        u.password === credentials.password &&
        u.role === UserRole.SYSTEM_ADMIN_LIVE &&
        !u.isMock
      );
    } else {
      foundUser = roster.find(u =>
        u.email === credentials.email &&
        u.password === credentials.password &&
        u.isMock === isMock &&
        u.role === role
      );
    }
  }

  if (!foundUser) {
    return null;
  }

  // Construct the full user profile, ensuring all necessary data is present.
  const userRoleDefaults = MOCK_USERS_BY_ROLE[foundUser.role] || MOCK_USERS_BY_ROLE[UserRole.REVELLER];
  const fullProfile: IArtistProfile = {
    ...userRoleDefaults,
    ...foundUser,
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
    isMock: foundUser.isMock,
  };

  return fullProfile;
};
