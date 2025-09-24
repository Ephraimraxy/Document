import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../services/firebase-admin";

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

    // Fetch user profile from Firestore
    const userDoc = await firebaseAdmin.firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    let userProfile = null;
    if (userDoc.exists) {
      userProfile = userDoc.data();
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
