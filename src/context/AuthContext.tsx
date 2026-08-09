import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  login: (email: string) => Promise<void>;
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
    // Initial load user and users list
    api.getMe()
      .then((res) => {
        setCurrentUser(res.user);
      })
      .catch(() => {
        // Fallback demo user
        setCurrentUser({
          id: 'usr-101',
          name: 'James Bond',
          email: 'agent007@helloworld.io',
          role: 'SUPER ADMIN',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          department: 'Executive Sales',
          createdAt: new Date().toISOString(),
        });
      });

    api.getUsers()
      .then(setUsersList)
      .catch(() => {});
  }, []);

  const login = async (email: string) => {
    try {
      const res = await api.login(email);
      setToken(res.token);
      localStorage.setItem('hw007_auth_token', res.token);
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Login error', err);
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
