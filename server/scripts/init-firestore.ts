import { firebaseAdmin } from "../services/firebase-admin";

const defaultDepartments = [
  { id: "admin", name: "Admin", description: "Administration" },
  { id: "accounts", name: "Accounts", description: "Finance and Accounting" },
  { id: "hr", name: "HR", description: "Human Resources" },
  { id: "audit", name: "Audit", description: "Internal Audit" },
  { id: "ict", name: "ICT", description: "Information and Communication Technology" },
  { id: "logistics", name: "Logistics", description: "Supply Chain and Logistics" },
  { id: "marketing", name: "Marketing", description: "Marketing and Communications" },
];

async function initializeFirestore() {
  try {
    console.log("Initializing Firestore with default departments...");
    
    const db = firebaseAdmin.firestore;
    
    // Initialize default departments
    for (const dept of defaultDepartments) {
      try {
        const docRef = db.collection("departments").doc(dept.id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
          await docRef.set({
            name: dept.name,
            description: dept.description,
          });
          console.log(`✓ Department '${dept.name}' initialized`);
        } else {
          console.log(`Department '${dept.name}' already exists`);
        }
      } catch (error) {
        console.error(`Error initializing department '${dept.name}':`, error);
      }
    }
    
    console.log("Firestore initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    process.exit(1);
  }
}

initializeFirestore();