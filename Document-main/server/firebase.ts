import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_STORAGE_BUCKET) {
  throw new Error("Missing required Firebase environment variables: FIREBASE_PROJECT_ID and FIREBASE_STORAGE_BUCKET");
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

let app: App;

if (!getApps().length) {
  app = initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
} else {
  app = getApps()[0];
}

export const storage = getStorage(app);
export const bucket = storage.bucket();
