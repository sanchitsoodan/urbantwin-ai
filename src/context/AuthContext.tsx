import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, SignUpFormData, LoginFormData } from '../types/auth';
import { 
  getDatabaseUsers, 
  getCurrentSessionUser, 
  setCurrentSessionUser, 
  signUpUser, 
  loginUser, 
  toggleUserAdminStatus,
  deleteDatabaseUser,
  exportDatabaseJson
} from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  allUsers: UserProfile[];
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'database';
  openAuthModal: (mode?: 'login' | 'signup' | 'database') => void;
  closeAuthModal: () => void;
  signUp: (data: SignUpFormData) => Promise<UserProfile>;
  login: (data: LoginFormData) => Promise<UserProfile>;
  logout: () => void;
  toggleUserAdmin: (userId: string) => void;
  removeUser: (userId: string) => void;
  exportDatabase: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentSessionUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => getDatabaseUsers());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'database'>('signup');

  const isAdmin = !!(currentUser && currentUser.isAdmin);
  const isSuperAdmin = !!(currentUser && currentUser.isSuperAdmin);

  const openAuthModal = useCallback((mode: 'login' | 'signup' | 'database' = 'signup') => {
    // If trying to open database but not an admin, redirect to login
    if (mode === 'database' && !currentUser?.isAdmin) {
      setAuthModalMode('login');
    } else {
      setAuthModalMode(mode);
    }
    setIsAuthModalOpen(true);
  }, [currentUser]);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signUp = useCallback(async (data: SignUpFormData) => {
    const user = await signUpUser(data);
    setCurrentUser(user);
    setAllUsers(getDatabaseUsers());
    setIsAuthModalOpen(false);
    return user;
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    const user = await loginUser(data);
    setCurrentUser(user);
    setAllUsers(getDatabaseUsers());
    setIsAuthModalOpen(false);
    return user;
  }, []);

  const logout = useCallback(() => {
    setCurrentSessionUser(null);
    setCurrentUser(null);
  }, []);

  const toggleUserAdmin = useCallback((userId: string) => {
    const updated = toggleUserAdminStatus(userId);
    setAllUsers(updated);
    setCurrentUser(getCurrentSessionUser());
  }, []);

  const removeUser = useCallback((userId: string) => {
    const updated = deleteDatabaseUser(userId);
    setAllUsers(updated);
    setCurrentUser(getCurrentSessionUser());
  }, []);

  const exportDatabase = useCallback(() => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urbantwin_users_database_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isSuperAdmin,
        allUsers,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signUp,
        login,
        logout,
        toggleUserAdmin,
        removeUser,
        exportDatabase
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
