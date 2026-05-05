import React, { createContext, useContext, useReducer } from 'react';
import {
  reducer,
  AuthActions,
  getInitialStateFromStorage,
} from './reducer';
import { User, UserRole, AuthState } from '../../types';

interface AuthContextValue extends AuthState {
  dispatch: React.Dispatch<AuthActions>;
  isAdmin: boolean;
  isMember: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, getInitialStateFromStorage());

  const role     = state.user?.role ?? null;
  const isAdmin  = role === 'ADMIN';
  const isMember = role === 'MEMBER';

  return (
    <AuthContext.Provider value={{ ...state, dispatch, isAdmin, isMember, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// Convenience helpers
export const useIsAdmin  = () => useAuth().isAdmin;
export const useIsMember = () => useAuth().isMember;
export const useCurrentUser = (): User | null => useAuth().user;
