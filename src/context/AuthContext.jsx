import { createContext, useEffect, useState } from 'react';
import { TOKEN_KEY, USER_KEY } from '../api/axiosInstance';
import getMe from '../api/auth/getMe';
import loginUser from '../api/auth/loginUser';
import registerUser from '../api/auth/registerUser';

export const AuthContext = createContext(null); // eslint-disable-line react-refresh/only-export-components

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);

  // Keep the cached user fresh when the app loads with a saved token.
  useEffect(() => {
    if (!token) return undefined;

    let active = true;

    getMe()
      .then((freshUser) => {
        if (!active) return;
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // The axios 401 interceptor clears the session and redirects.
      });

    return () => {
      active = false;
    };
  }, [token]);

  const startSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const session = await loginUser({ email, password });
    startSession(session.token, session.user);
    return session.user;
  };

  // Registration does not return a token; the page sends users to /login.
  const register = async (name, email, password) => registerUser({ name, email, password });

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Default export keeps the provider easy to import in App.jsx.
export default AuthProvider;
