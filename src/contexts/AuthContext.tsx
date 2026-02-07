
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { RosterMember, UserRole, ArtistProfile } from '../types';

interface AuthContextType {
  currentUser: RosterMember | null;
  loading: boolean;
  login: (role: UserRole, method: 'web2' | 'web3', credentials: any) => Promise<void>;
  logout: () => void;
  signup: (profile: ArtistProfile) => Promise<void>;
  setCurrentUser: (user: RosterMember | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<RosterMember | null>(null);
  const [loading, setLoading] = useState(true);
  const { users, addUser, findUserByEmail } = useData();
  const { notify: showToast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('kk_currentUser');
      if (storedUser) {
        const user: RosterMember = JSON.parse(storedUser);
        if (users.find(u => u.id === user.id)) {
          setCurrentUser(user);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [users]);

  const login = useCallback(async (role: UserRole, method: 'web2' | 'web3', credentials: any) => {
    setLoading(true);
    const { email, password, isDemo } = credentials;

    if (isDemo) {
        const demoUser: RosterMember = {
            id: `demo_${role.toLowerCase()}_${Date.now()}`,
            name: `Demo ${role}`,
            role: role,
            avatar: `https://ui-avatars.com/api/?name=Demo+${role}&background=random`,
            location: 'Virtual Space',
            verified: true,
            rating: 5,
            assets: { ips: [], contents: [], events: [], products: [], services: [], equipment: [], instruments: [], tickets: [] },
            subscriberOnly: { email: 'demo@kalakrut.io', phone: 'N/A', agentContact: 'System' },
            isMock: true,
            onboardingComplete: true
        };
        setCurrentUser(demoUser);
        localStorage.setItem('kk_currentUser', JSON.stringify(demoUser));
        showToast(`Logged in as Demo ${role}: Explore the platform with sample data.`, 'success');
        setLoading(false);
        return;
    }

    const existingUser = findUserByEmail(email);

    if (existingUser) {
        if (existingUser.password === password) {
            if(existingUser.role !== role) {
                showToast(`Role Mismatch: Your account is a ${existingUser.role}, not a ${role}.`, 'error');
            } else {
                setCurrentUser(existingUser);
                localStorage.setItem('kk_currentUser', JSON.stringify(existingUser));
                showToast(`Welcome back, ${existingUser.name}!`, 'success');
            }
        } else {
            showToast('Invalid Credentials: The password you entered is incorrect.', 'error');
        }
    } else {
        showToast('New User? Creating Account... You will be guided through onboarding.', 'info');
        const newProfile: ArtistProfile = {
            id: `user_${Date.now()}`,
            name: email.split('@')[0],
            email,
            password,
            role,
            onboardingComplete: false,
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
            coverImage: 'https://picsum.photos/seed/picsum/1600/400',
            bio: 'New user, bio not yet updated.',
            location: 'Not set',
            genres: [],
            verified: false,
            pressKit: { photos: [], topTracks: [], techRiderUrl: '', socials: [] },
            stats: { gigsCompleted: 0, activeGigs: 0, rating: 0, responseTime: 'N/A' },
            xp: 0,
            level: 1
        };
        await addUser(newProfile);
        const newUser = findUserByEmail(email);
        if (newUser) {
            setCurrentUser(newUser);
            localStorage.setItem('kk_currentUser', JSON.stringify(newUser));
            showToast(`Account created for ${newUser.name}!`, 'success');
        } else {
            showToast('Error creating account. Please try again.', 'error');
        }
    }
    setLoading(false);
  }, [findUserByEmail, addUser, showToast, users]);

  const signup = useCallback(async (profile: ArtistProfile) => {
    if (findUserByEmail(profile.email)) {
        showToast('Registration Failed: An account with this email already exists.', 'error');
        return;
    }
    await addUser(profile);
    const newUser = findUserByEmail(profile.email);
    if (newUser) {
        setCurrentUser(newUser);
        localStorage.setItem('kk_currentUser', JSON.stringify(newUser));
        showToast(`Account created for ${newUser.name}! Please complete your profile.`, 'success');
    } else {
        showToast("Error creating account.", 'error');
    }
  }, [findUserByEmail, addUser, showToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('kk_currentUser');
    showToast('You have been logged out.', 'success');
  }, [showToast]);

  const value = { currentUser, loading, login, logout, signup, setCurrentUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
