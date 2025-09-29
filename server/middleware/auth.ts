import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../services/firebase-admin";
import { storage } from "../storage";
import { getDepartmentFromEmail, getRoleFromEmail } from "@shared/utils";

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
        // Automatically assign department and role based on email
        const departmentId = getDepartmentFromEmail(decodedToken.email);
        const role = getRoleFromEmail(decodedToken.email);
        
        // Deny access for unassigned users (unrecognized email addresses)
        if (departmentId === "unassigned") {
          console.warn(`Access denied for unrecognized email: ${decodedToken.email}`);
          return res.status(403).json({ 
            message: "Access denied. Your email address is not recognized. Please contact your administrator." 
          });
        }
        
        userProfile = await storage.createUser({
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          departmentId,
          role
        });
        
        console.log(`Created user profile for ${decodedToken.email} - Department: ${departmentId}, Role: ${role}`);
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
