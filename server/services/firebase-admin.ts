import { initializeApp, getApps, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage, type Storage } from "firebase-admin/storage";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK with environment variables
let app: App | null = null;
let auth: Auth | null = null;
let storage: Storage | null = null;
let firestore: Firestore | null = null;

if (!getApps().length) {
  // Use environment variables for Firebase project configuration
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "lexivox-cd3ee";
  
  try {
    app = initializeApp({
      projectId,
      storageBucket: `${projectId}.firebasestorage.app`,
    });
    
    auth = getAuth(app);
    storage = getStorage(app);
    firestore = getFirestore(app);
    
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.warn("Firebase Admin SDK initialization failed:", error);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  storage = getStorage(app);
  firestore = getFirestore(app);
}

export const firebaseAdmin = {
  auth,
  storage,
  firestore,

  async verifyIdToken(idToken: string) {
    if (!auth) {
      throw new Error("Firebase Admin SDK not initialized");
    }
    try {
      return await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw new Error("Invalid authentication token");
    }
  },

  async uploadFile(file: any, path: string): Promise<string> {
    if (!storage) {
      throw new Error("Firebase Admin SDK not initialized");
    }
    try {
      const bucket = storage.bucket();
      const fileRef = bucket.file(path);
      
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Make file publicly readable
      await fileRef.makePublic();
      
      return `https://storage.googleapis.com/${bucket.name}/${path}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  },

  async uploadBuffer(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
    if (!storage) {
      throw new Error("Firebase Admin SDK not initialized");
    }
    try {
      const bucket = storage.bucket();
      const path = `documents/updated/${Date.now()}_${fileName}`;
      const fileRef = bucket.file(path);
      
      await fileRef.save(buffer, {
        metadata: {
          contentType,
        },
      });

      await fileRef.makePublic();
      
      return `https://storage.googleapis.com/${bucket.name}/${path}`;
    } catch (error) {
      console.error("Error uploading buffer:", error);
      throw new Error("Failed to upload file");
    }
  },

  async getSignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
    if (!storage) {
      throw new Error("Firebase Admin SDK not initialized");
    }
    try {
      const bucket = storage.bucket();
      const fileName = fileUrl.split('/').pop();
      
      if (!fileName) {
        throw new Error("Invalid file URL");
      }

      const file = bucket.file(`documents/${fileName}`);
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + expiresIn * 1000,
      });

      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      // Return original URL as fallback if it's already public
      return fileUrl;
    }
  },

  async deleteFile(path: string): Promise<void> {
    if (!storage) {
      throw new Error("Firebase Admin SDK not initialized");
    }
    try {
      const bucket = storage.bucket();
      const file = bucket.file(path);
      await file.delete();
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file");
    }
  },
};
