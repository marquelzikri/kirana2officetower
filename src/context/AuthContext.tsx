import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { fetchCurrentAuthUserApi, fetchSetupStatusApi, loginApi, logoutApi, onboardOwnerApi } from '@/services/authService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  hasUsers: boolean | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  onboardOwner: (data: { username: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshSetupStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSetupStatus = useCallback(async () => {
    try {
      const status = await fetchSetupStatusApi();
      setHasUsers(status.hasUsers);
    } catch {
      setHasUsers(true);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      await refreshSetupStatus();
      const currentUser = await fetchCurrentAuthUserApi();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshSetupStatus]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    setUser(res.user);
    setHasUsers(true);
  };

  const onboardOwner = async (data: { username: string; password: string; name: string }) => {
    const res = await onboardOwnerApi(data);
    setUser(res.user);
    setHasUsers(true);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  return (
    <AuthContext.Provider
      value={{
        user,
        hasUsers,
        isLoading,
        isAuthenticated,
        isOwner,
        isAdmin,
        login,
        onboardOwner,
        logout,
        refreshUser,
        refreshSetupStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
