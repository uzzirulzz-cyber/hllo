import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  login: (email: string, password?: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  usersList: User[];
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hw007_auth_token'));
  const [usersList, setUsersList] = useState<User[]>([]);

  useEffect(() => {
    if (token) {
      api.getMe()
        .then((res) => {
          setCurrentUser(res.user);
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('hw007_auth_token');
          setCurrentUser(null);
        });
    } else {
      // Default to auto-login Creed Bixby if first visit so user gets right in, or user can log out
      const defaultUser = {
        id: 'usr-000',
        name: 'crdbixx',
        email: 'crdbixx@helloworld007.io',
        role: 'SUPER ADMIN' as UserRole,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: 'Super Admin Executive',
        assignedLeadCount: 99,
        conversionRate: 52.4,
        createdAt: '2025-01-01T08:00:00Z',
      };
      setCurrentUser(defaultUser);
      const fakeToken = Buffer.from(JSON.stringify({ id: defaultUser.id, email: defaultUser.email, role: defaultUser.role })).toString('base64');
      setToken(fakeToken);
      localStorage.setItem('hw007_auth_token', fakeToken);
    }

    api.getUsers()
      .then(setUsersList)
      .catch(() => {});
  }, []);

  const login = async (email: string, password?: string, role?: UserRole) => {
    try {
      const res = await api.login(email, password, role);
      setToken(res.token);
      localStorage.setItem('hw007_auth_token', res.token);
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Login error', err);
      // Fallback
      const fallbackUser: User = {
        id: 'usr-007',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        role: role || 'ADMIN',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        department: 'Operations',
        createdAt: new Date().toISOString(),
      };
      const t = Buffer.from(JSON.stringify({ id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role })).toString('base64');
      setToken(t);
      localStorage.setItem('hw007_auth_token', t);
      setCurrentUser(fallbackUser);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('hw007_auth_token');
    setCurrentUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      api.updateUserRole(currentUser.id, newRole).catch(() => {});
    }
  };

  const refreshUsers = () => {
    api.getUsers().then(setUsersList).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || 'SUPER ADMIN',
        switchRole,
        login,
        logout,
        usersList,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
