import { createContext, useContext, useEffect, useState } from "react";

import { getMe, login as loginRequest, logout as logoutRequest } from "../api/endpoints";

const STORAGE_KEY = "admin_token";

const AuthContext = createContext(null);

/**
 * Holds the admin's auth token + user, backed by sessionStorage (cleared
 * when the tab closes -- narrows, though doesn't eliminate, the window an
 * XSS bug could exfiltrate it in; see the admin portal's design notes).
 *
 * On mount, a stored token is revalidated against GET /api/auth/me/ so a
 * token deleted/rotated server-side (e.g. via Django admin) doesn't leave
 * the SPA thinking it's still logged in.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(token ? "loading" : "anonymous");

  useEffect(() => {
    if (!token) {
      setStatus("anonymous");
      return;
    }

    let cancelled = false;
    getMe(token)
      .then((me) => {
        if (!cancelled) {
          setUser(me);
          setStatus("authenticated");
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearSession();
          setStatus("anonymous");
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function persistSession(nextToken) {
    try {
      sessionStorage.setItem(STORAGE_KEY, nextToken);
    } catch {
      // sessionStorage unavailable (private browsing, etc.) -- the session
      // still works for this page load, just won't survive a reload.
    }
    setToken(nextToken);
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  }

  async function login(username, password) {
    const { token: newToken, user: newUser } = await loginRequest(username, password);
    persistSession(newToken);
    setUser(newUser);
    setStatus("authenticated");
  }

  async function logout() {
    if (token) {
      // Best-effort: the local session ends either way.
      logoutRequest(token).catch(() => {});
    }
    clearSession();
    setStatus("anonymous");
  }

  return (
    <AuthContext.Provider value={{ token, user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
