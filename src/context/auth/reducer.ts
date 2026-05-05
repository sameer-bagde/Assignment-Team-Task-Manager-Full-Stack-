import { AuthState, User, UserRole } from '../../types';

export type AuthActions =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

export const initialState: AuthState = {
  user:            null,
  token:           null,
  isAuthenticated: false,
};

export const reducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Helper to read initial state from localStorage on boot
export const getInitialStateFromStorage = (): AuthState => {
  const token = localStorage.getItem('authToken');
  const raw   = localStorage.getItem('userData');
  if (token && raw) {
    try {
      const user = JSON.parse(raw) as User;
      return { user, token, isAuthenticated: true };
    } catch {
      return initialState;
    }
  }
  return initialState;
};

export const getUserRole = (): UserRole | null => {
  const raw = localStorage.getItem('userData');
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as User).role;
  } catch {
    return null;
  }
};
