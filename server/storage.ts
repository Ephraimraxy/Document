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
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private departments: Map<string, Department>;
  private documents: Map<string, Document>;
  private notifications: Map<string, Notification>;

  constructor() {
    this.users = new Map();
    this.departments = new Map();
    this.documents = new Map();
    this.notifications = new Map();

    // Initialize default departments
    const defaultDepartments = [
      { id: "admin", name: "Admin", description: "Administration" },
      { id: "accounts", name: "Accounts", description: "Finance and Accounting" },
      { id: "hr", name: "HR", description: "Human Resources" },
      { id: "audit", name: "Audit", description: "Internal Audit" },
      { id: "ict", name: "ICT", description: "Information and Communication Technology" },
      { id: "logistics", name: "Logistics", description: "Supply Chain and Logistics" },
      { id: "marketing", name: "Marketing", description: "Marketing and Communications" },
    ];

    defaultDepartments.forEach(dept => {
      this.departments.set(dept.id, dept);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Departments
  async getDepartment(id: string): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async getAllDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const id = randomUUID();
    const department: Department = { ...insertDepartment, id };
    this.departments.set(id, department);
    return department;
  }

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;

    const updatedDocument = { 
      ...document, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async getDocumentsByCreator(creatorId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.createdBy === creatorId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getDocumentsByDepartment(departmentId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.recipientDepartments.includes(departmentId))
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  // Notifications
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      ...insertNotification, 
      id,
      read: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByDepartment(departmentId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.targetDepartments.includes(departmentId))
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      this.notifications.set(id, notification);
    }
  }
}

export const storage = new MemStorage();
