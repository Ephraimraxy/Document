import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCBeoJfNrXFFbJYyQsU5z2BDOW0EJYBvkk",
  authDomain: "lexivox-cd3ee.firebaseapp.com",
  projectId: "lexivox-cd3ee",
  storageBucket: "lexivox-cd3ee.firebasestorage.app",
  messagingSenderId: "322901459727",
  appId: "1:322901459727:web:f0bbd745f24956124c347a",
  measurementId: "G-LCEYYG50DV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Note: Firebase emulators disabled for production use
// Uncomment the following block only if you want to use Firebase emulators in development
/*
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
  } catch (error) {
    console.log("Firebase emulators already connected");
  }
}
*/

export default app;
