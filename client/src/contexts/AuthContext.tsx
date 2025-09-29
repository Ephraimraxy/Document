import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User as AppUser } from "@shared/schema";
import { getDepartmentFromEmail, getRoleFromEmail } from "@shared/utils";

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
            // Fallback: create basic user profile locally using email-based department assignment
            const departmentId = getDepartmentFromEmail(user.email!);
            const role = getRoleFromEmail(user.email!);
            
            // Don't create profile for unassigned users
            if (departmentId === "unassigned") {
              console.warn(`Access denied for unrecognized email: ${user.email}`);
              setUserProfile(null);
              setUser(null);
              return;
            }
            
            setUserProfile({
              id: user.uid,
              email: user.email!,
              name: user.displayName || user.email!.split('@')[0],
              departmentId,
              role,
              createdAt: new Date(),
            } as AppUser);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Fallback: create basic user profile locally using email-based department assignment
          const departmentId = getDepartmentFromEmail(user.email!);
          const role = getRoleFromEmail(user.email!);
          
          // Don't create profile for unassigned users
          if (departmentId === "unassigned") {
            console.warn(`Access denied for unrecognized email: ${user.email}`);
            setUserProfile(null);
            setUser(null);
            return;
          }
          
          setUserProfile({
            id: user.uid,
            email: user.email!,
            name: user.displayName || user.email!.split('@')[0],
            departmentId,
            role,
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
