import { API_ENDPOINT } from '../../config/constants';
import { User } from '../../types';
import { AuthActions } from './reducer';

type AuthDispatch = React.Dispatch<AuthActions>;

export const loginAction = async (
  dispatch: AuthDispatch,
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_ENDPOINT}/users/sign_in`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return { ok: false, error: data.error || 'Sign-in failed.' };

    const user: User = data.user;
    const token: string = data.token;

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData',  JSON.stringify(user));

    dispatch({ type: 'LOGIN', payload: { user, token } });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try again.' };
  }
};

export const signupAction = async (
  dispatch: AuthDispatch,
  name: string,
  email: string,
  password: string,
  adminKey?: string,
): Promise<{ ok: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_ENDPOINT}/users`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password, adminKey }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data.errors?.[0]?.msg || data.error || 'Signup failed.';
      return { ok: false, error: msg };
    }

    const user: User = data.user;
    const token: string = data.token;

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData',  JSON.stringify(user));

    dispatch({ type: 'LOGIN', payload: { user, token } });
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try again.' };
  }
};

export const logoutAction = (dispatch: AuthDispatch) => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  dispatch({ type: 'LOGOUT' });
};
