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
import type { IStorage } from "../storage";

export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private documents = new Map<string, Document>();
  private notifications = new Map<string, Notification>();
  private departments = new Map<string, Department>();

  constructor() {
    // Initialize with default departments
    this.initializeDefaultDepartments();
  }

  private initializeDefaultDepartments() {
    const defaultDepartments = [
      { id: "admin", name: "Admin", description: "Administrative Department" },
      { id: "accounts", name: "Accounts", description: "Accounting Department" },
      { id: "hr", name: "HR", description: "Human Resources Department" },
      { id: "audit", name: "Audit", description: "Audit Department" },
      { id: "ict", name: "ICT", description: "Information and Communication Technology" },
      { id: "logistics", name: "Logistics", description: "Logistics Department" },
      { id: "marketing", name: "Marketing", description: "Marketing Department" },
      { id: "unassigned", name: "Unassigned", description: "Unrecognized email addresses - access denied" },
    ];

    defaultDepartments.forEach(dept => {
      this.departments.set(dept.id, dept as Department);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const userData: User = {
      id,
      ...insertUser,
      role: insertUser.role || (insertUser.email === "hoseaephraim50@gmail.com" ? "admin" : "user"),
      createdAt: new Date(),
    };
    
    this.users.set(id, userData);
    return userData;
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

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = randomUUID();
    const departmentData: Department = {
      id,
      name: department.name,
      description: department.description || null,
    };
    
    this.departments.set(id, departmentData);
    return departmentData;
  }

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const documentData: Document = {
      id,
      title: insertDocument.title,
      description: insertDocument.description || null,
      fileName: insertDocument.fileName,
      fileUrl: insertDocument.fileUrl,
      fileSize: insertDocument.fileSize,
      fileType: insertDocument.fileType,
      createdBy: insertDocument.createdBy,
      recipientDepartments: insertDocument.recipientDepartments,
      priority: insertDocument.priority || "medium",
      dueDate: insertDocument.dueDate || null,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.documents.set(id, documentData);
    return documentData;
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
    return Array.from(this.documents.values()).filter(
      doc => doc.createdBy === creatorId
    );
  }

  async getDocumentsByDepartment(departmentId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      doc => doc.recipientDepartments.includes(departmentId)
    );
  }

  // Notifications
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notificationData: Notification = {
      id,
      title: insertNotification.title,
      message: insertNotification.message,
      targetDepartments: insertNotification.targetDepartments,
      documentId: insertNotification.documentId || null,
      read: false,
      createdAt: new Date(),
    };
    
    this.notifications.set(id, notificationData);
    return notificationData;
  }

  async getNotificationsByDepartment(departmentId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      notification => notification.targetDepartments.includes(departmentId)
    );
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      this.notifications.set(id, notification);
    }
  }
}