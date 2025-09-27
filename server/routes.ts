import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { z } from "zod";
import { storage } from "./storage";
import { onlyOfficeService } from "./services/onlyoffice";
import { insertDocumentSchema } from "@shared/schema";
import { auth } from "./middleware/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only DOCX, XLSX, and PPTX files are allowed."));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User profile route
  app.get("/api/profile", auth, async (req: any, res: any) => {
    try {
      if (!req.user?.uid) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userProfile = await storage.getUser(req.user.uid);
      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res.json(userProfile);
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Document CRUD routes
  app.post("/api/documents", auth, upload.single("file"), async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user?.uid;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Validate request body
      const documentData = {
        title: req.body.title,
        description: req.body.description || "",
        recipientDepartments: JSON.parse(req.body.recipientDepartments || "[]"),
        priority: req.body.priority || "medium",
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size.toString(),
        createdBy: userId,
      };

      const validatedData = insertDocumentSchema.parse(documentData);

      // For MVP, we'll use a placeholder URL
      const fileUrl = `http://localhost:5000/uploads/${Date.now()}_${req.file.originalname}`;
      
      // Save document metadata
      const document = await storage.createDocument({
        ...validatedData,
        fileUrl,
      });

      // Create notifications for recipient departments
      await storage.createNotification({
        title: "New Document Received",
        message: `${validatedData.title} from ${req.user?.name || "Unknown User"}`,
        targetDepartments: validatedData.recipientDepartments,
        documentId: document.id,
      });

      res.json(document);
    } catch (error: any) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: error.message || "Failed to create document" });
    }
  });

  app.get("/api/documents/sent/:userId", auth, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      if (req.user?.uid !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const documents = await storage.getDocumentsByCreator(userId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/documents/received/:departmentId", auth, async (req: any, res: any) => {
    try {
      const { departmentId } = req.params;
      const documents = await storage.getDocumentsByDepartment(departmentId);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/documents/:id", auth, async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if user has access to this document
      const hasAccess = document.createdBy === req.user?.uid || 
                       document.recipientDepartments.includes(req.user?.departmentId || "");
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(document);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // OnlyOffice integration routes
  app.get("/api/onlyoffice/config/:id", auth, async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      // Check if user has access to this document
      const hasAccess = document.createdBy === req.user?.uid || 
                       document.recipientDepartments.includes(req.user?.departmentId || "");
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      // For MVP, use direct file URL
      const signedUrl = document.fileUrl;
      
      // Generate OnlyOffice config
      const config = onlyOfficeService.generateConfig({
        documentId: document.id,
        title: document.fileName,
        url: signedUrl,
        fileType: document.fileType,
        user: {
          id: req.user!.uid,
          name: req.user!.name || req.user!.email || "Unknown User",
        },
        permissions: {
          edit: document.createdBy === req.user?.uid, // Only creator can edit
          download: true,
          print: true,
        },
      });

      res.json(config);
    } catch (error: any) {
      console.error("Error generating OnlyOffice config:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/onlyoffice/callback", async (req, res) => {
    try {
      const { key, status, url } = req.body;
      
      // Verify JWT token
      const isValid = onlyOfficeService.verifyCallback(req.body);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid callback token" });
      }

      // Handle document save
      if (status === 2 && url) { // Document ready for saving
        const documentId = key.split("_")[0]; // Extract document ID from key
        const document = await storage.getDocument(documentId);
        
        if (document) {
          // For MVP, we'll simulate file update
          console.log("Document updated via OnlyOffice:", documentId);
          
          // Update document in storage with the new URL from OnlyOffice
          await storage.updateDocument(documentId, { fileUrl: url });
        }
      }

      res.json({ error: 0 });
    } catch (error: any) {
      console.error("OnlyOffice callback error:", error);
      res.json({ error: 1, message: error.message });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:departmentId", auth, async (req: any, res: any) => {
    try {
      const { departmentId } = req.params;
      const notifications = await storage.getNotificationsByDepartment(departmentId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", auth, async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
