import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../services/firebase-admin";
import { storage } from "../storage";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    name?: string;
    departmentId?: string;
  };
}

export async function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No valid authorization header" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAdmin.verifyIdToken(idToken);

    // Fetch user profile from PostgreSQL database
    let userProfile = await storage.getUser(decodedToken.uid);
    
    // If user doesn't exist in our database, create them from Firebase token
    if (!userProfile && decodedToken.email) {
      try {
        userProfile = await storage.createUser({
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          departmentId: "admin", // Default to admin department, can be changed later
          role: "user"
        });
      } catch (error) {
        console.error("Error creating user profile:", error);
      }
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email!,
      name: userProfile?.name || decodedToken.name,
      departmentId: userProfile?.departmentId,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid authentication token" });
  }
}
