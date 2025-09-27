import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { departments } from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const defaultDepartments = [
  { id: "admin", name: "Admin", description: "Administration" },
  { id: "accounts", name: "Accounts", description: "Finance and Accounting" },
  { id: "hr", name: "HR", description: "Human Resources" },
  { id: "audit", name: "Audit", description: "Internal Audit" },
  { id: "ict", name: "ICT", description: "Information and Communication Technology" },
  { id: "logistics", name: "Logistics", description: "Supply Chain and Logistics" },
  { id: "marketing", name: "Marketing", description: "Marketing and Communications" },
];

async function initializeDatabase() {
  try {
    console.log("Initializing database with default departments...");
    
    // Insert default departments if they don't exist
    for (const dept of defaultDepartments) {
      try {
        await db.insert(departments).values(dept).onConflictDoNothing();
        console.log(`✓ Department '${dept.name}' initialized`);
      } catch (error) {
        console.log(`Department '${dept.name}' already exists`);
      }
    }
    
    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();