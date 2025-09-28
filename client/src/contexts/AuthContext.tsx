import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User as AppUser } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  userProfile: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get user profile from backend API
          const token = await user.getIdToken();
          const response = await fetch("/api/profile", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userProfile = await response.json();
            setUserProfile(userProfile);
          } else {
            console.error("Failed to fetch user profile:", response.statusText);
            // Fallback: create basic user profile locally
            const isAdmin = user.email === "hoseaephraim50@gmail.com";
            setUserProfile({
              id: user.uid,
              email: user.email!,
              name: user.displayName || user.email!.split('@')[0],
              departmentId: "admin",
              role: isAdmin ? "admin" : "user",
              createdAt: new Date(),
            } as AppUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback: create basic user profile locally
          const isAdmin = user.email === "hoseaephraim50@gmail.com";
          setUserProfile({
            id: user.uid,
            email: user.email!,
            name: user.displayName || user.email!.split('@')[0],
            departmentId: "admin",
            role: isAdmin ? "admin" : "user",
            createdAt: new Date(),
          } as AppUser);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
