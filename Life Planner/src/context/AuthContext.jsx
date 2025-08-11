// /src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { fakeUsers } from "../data/fakeUsers";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Login
  const login = (email, password) => {
    const foundUser = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  // Register
  const register = (email, password, name) => {
    const exists = fakeUsers.find((u) => u.email === email);
    if (exists) return false;
    const newUser = { id: Date.now(), email, password, name };
    fakeUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    return true;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
