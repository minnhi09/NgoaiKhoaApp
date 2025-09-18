// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ensureUserProfile } from "../services/userService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Đảm bảo user profile tồn tại khi login
        try {
          await ensureUserProfile(u.uid, u.email);
        } catch (error) {
          console.error("Error ensuring user profile:", error);
        }
      }
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // API đơn giản để component khác gọi
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Profile sẽ được tạo tự động trong onAuthStateChanged
    return result;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

//Mục đích: có user toàn cục, biết đã đăng nhập chưa; cung cấp hàm login/register/logout cho UI.
