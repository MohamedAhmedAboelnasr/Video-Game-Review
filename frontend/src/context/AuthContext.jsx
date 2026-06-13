import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // 🔐 LOGIN (email OR username)
  function login(identifier, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) =>
        (u.email === identifier || u.username === identifier) &&
        u.password === password
    );

    if (!found) return false;

    localStorage.setItem("user", JSON.stringify(found));
    setUser(found);
    return true;
  }

  // 🆕 SIGNUP WITH VALIDATION
  function signup({ username, email, password, confirmPassword }) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔍 Regex Rules
    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    if (!usernameRegex.test(username))
      return { success: false, message: "Invalid username (3-15 chars, letters/numbers/_)" };

    if (!emailRegex.test(email))
      return { success: false, message: "Invalid email format" };

    if (!passwordRegex.test(password))
      return {
        success: false,
        message: "Password must be 6+ chars, include 1 uppercase & 1 number",
      };

    if (password !== confirmPassword)
      return { success: false, message: "Passwords do not match" };

    if (users.find((u) => u.email === email))
      return { success: false, message: "Email already exists" };

    if (users.find((u) => u.username === username))
      return { success: false, message: "Username already taken" };

    const newUser = { username, email, password };

    const updated = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updated));

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}