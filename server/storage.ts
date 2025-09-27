import type { 
  User, 
  InsertUser, 
  Document, 
  InsertDocument, 
  Notification, 
  InsertNotification,
  Department,
  InsertDepartment 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Departments
  getDepartment(id: string): Promise<Department | undefined>;
  getAllDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;

  // Documents
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  getDocumentsByCreator(creatorId: string): Promise<Document[]>;
  getDocumentsByDepartment(departmentId: string): Promise<Document[]>;

  // Notifications
  getNotification(id: string): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByDepartment(departmentId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
}

// Note: Removed PostgreSQL and MemStorage implementations as we're now using Firestore

import { FirestoreStorage } from "./storage/firestore-storage";

// Use Firestore storage as requested by user
export const storage = new FirestoreStorage();
