import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginCollege, registerCollege, logoutCollege, getAccessToken } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    const handleSessionExpired = () => {
      setUser(null);
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const res = await loginCollege(credentials);
      setUser(res.user);
      return res;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await registerCollege(userData);
      setUser(res.user);
      return res;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutCollege();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
