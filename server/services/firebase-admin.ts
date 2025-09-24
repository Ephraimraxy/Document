import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK with environment variables
if (!getApps().length) {
  // Use environment variables for Firebase project configuration
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  
  if (!projectId) {
    console.warn("Firebase Admin SDK not initialized - missing project configuration");
  } else {
    try {
      initializeApp({
        projectId,
        storageBucket: `${projectId}.firebasestorage.app`,
      });
    } catch (error) {
      console.warn("Firebase Admin SDK initialization skipped:", error);
    }
  }
}

const auth = getAuth();
const storage = getStorage();
const firestore = getFirestore();

export const firebaseAdmin = {
  auth,
  storage,
  firestore,

  async verifyIdToken(idToken: string) {
    try {
      return await auth.verifyIdToken(idToken);
    } catch (error) {
      console.error("Error verifying ID token:", error);
      throw new Error("Invalid authentication token");
    }
  },

  async uploadFile(file: any, path: string): Promise<string> {
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
