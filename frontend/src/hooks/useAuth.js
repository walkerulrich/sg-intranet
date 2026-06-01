import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("sg_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((token, userData) => {
    localStorage.setItem("sg_token", token);
    localStorage.setItem("sg_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sg_token");
    localStorage.removeItem("sg_user");
    setUser(null);
  }, []);

  return { user, login, logout, isAuthenticated: !!user };
}
