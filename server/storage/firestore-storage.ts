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
import { firebaseAdmin } from "../services/firebase-admin";
import { randomUUID } from "crypto";
import type { IStorage } from "../storage";

export class FirestoreStorage implements IStorage {
  private db = firebaseAdmin.firestore;

  // Users
  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await this.db.collection("users").doc(id).get();
      if (!doc.exists) return undefined;
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const query = await this.db.collection("users").where("email", "==", email).limit(1).get();
      if (query.empty) return undefined;
      const doc = query.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const userData = {
        ...insertUser,
        role: insertUser.role || "user",
        createdAt: new Date(),
      };
      
      await this.db.collection("users").doc(id).set(userData);
      return { id, ...userData } as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    try {
      await this.db.collection("users").doc(id).update(updates);
      return await this.getUser(id);
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  // Departments
  async getDepartment(id: string): Promise<Department | undefined> {
    try {
      const doc = await this.db.collection("departments").doc(id).get();
      if (!doc.exists) return undefined;
      return { id: doc.id, ...doc.data() } as Department;
    } catch (error) {
      console.error("Error getting department:", error);
      return undefined;
    }
  }

  async getAllDepartments(): Promise<Department[]> {
    try {
      const snapshot = await this.db.collection("departments").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
    } catch (error) {
      console.error("Error getting departments:", error);
      return [];
    }
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    try {
      const id = randomUUID();
      const departmentData = {
        ...insertDepartment,
        description: insertDepartment.description || null,
      };
      
      await this.db.collection("departments").doc(id).set(departmentData);
      return { id, ...departmentData } as Department;
    } catch (error) {
      console.error("Error creating department:", error);
      throw new Error("Failed to create department");
    }
  }

  // Documents
  async getDocument(id: string): Promise<Document | undefined> {
    try {
      const doc = await this.db.collection("documents").doc(id).get();
      if (!doc.exists) return undefined;
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
        dueDate: data?.dueDate?.toDate() || null,
      } as Document;
    } catch (error) {
      console.error("Error getting document:", error);
      return undefined;
    }
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    try {
      const id = randomUUID();
      const now = new Date();
      const documentData = {
        ...insertDocument,
        description: insertDocument.description || null,
        dueDate: insertDocument.dueDate || null,
        status: "pending",
        priority: insertDocument.priority || "medium",
        createdAt: now,
        updatedAt: now,
      };
      
      await this.db.collection("documents").doc(id).set(documentData);
      return { id, ...documentData } as Document;
    } catch (error) {
      console.error("Error creating document:", error);
      throw new Error("Failed to create document");
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      await this.db.collection("documents").doc(id).update(updateData);
      return await this.getDocument(id);
    } catch (error) {
      console.error("Error updating document:", error);
      return undefined;
    }
  }

  async getDocumentsByCreator(creatorId: string): Promise<Document[]> {
    try {
      const snapshot = await this.db
        .collection("documents")
        .where("createdBy", "==", creatorId)
        .orderBy("createdAt", "desc")
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          dueDate: data.dueDate?.toDate() || null,
        } as Document;
      });
    } catch (error) {
      console.error("Error getting documents by creator:", error);
      return [];
    }
  }

  async getDocumentsByDepartment(departmentId: string): Promise<Document[]> {
    try {
      const snapshot = await this.db
        .collection("documents")
        .where("recipientDepartments", "array-contains", departmentId)
        .orderBy("createdAt", "desc")
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          dueDate: data.dueDate?.toDate() || null,
        } as Document;
      });
    } catch (error) {
      console.error("Error getting documents by department:", error);
      return [];
    }
  }

  // Notifications
  async getNotification(id: string): Promise<Notification | undefined> {
    try {
      const doc = await this.db.collection("notifications").doc(id).get();
      if (!doc.exists) return undefined;
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
      } as Notification;
    } catch (error) {
      console.error("Error getting notification:", error);
      return undefined;
    }
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    try {
      const id = randomUUID();
      const notificationData = {
        ...insertNotification,
        documentId: insertNotification.documentId || null,
        read: false,
        createdAt: new Date(),
      };
      
      await this.db.collection("notifications").doc(id).set(notificationData);
      return { id, ...notificationData } as Notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  async getNotificationsByDepartment(departmentId: string): Promise<Notification[]> {
    try {
      const snapshot = await this.db
        .collection("notifications")
        .where("targetDepartments", "array-contains", departmentId)
        .orderBy("createdAt", "desc")
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Notification;
      });
    } catch (error) {
      console.error("Error getting notifications by department:", error);
      return [];
    }
  }

  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await this.db.collection("notifications").doc(id).update({ read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Failed to mark notification as read");
    }
  }
}