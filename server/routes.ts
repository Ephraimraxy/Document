import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { getTemplateUrl, createBlankTemplates } from "./documentTemplates";

const ONLYOFFICE_SECRET = process.env.ONLYOFFICE_SECRET || "6c7176c0e28d4653a9c7178cff054122";
const ONLYOFFICE_SERVER = process.env.ONLYOFFICE_SERVER || "https://0df6a6d6.docs.onlyoffice.com";

createBlankTemplates().catch(console.error);

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/doc-config", async (req, res) => {
    try {
      console.log("Received request to /api/doc-config:", req.body);
      const { documentType = "docx", title = "Untitled Document" } = req.body;
      
      const documentKey = randomUUID();
      const fileType = documentType;
      
      const host = `${req.protocol}://${req.get('host')}`;
      const documentUrl = getTemplateUrl(fileType, host);
      
      const docConfig = {
        document: {
          fileType: fileType,
          key: documentKey,
          title: title,
          url: documentUrl,
          permissions: {
            comment: true,
            copy: true,
            download: true,
            edit: true,
            fillForms: true,
            modifyContentControl: true,
            modifyFilter: true,
            print: true,
            review: true
          }
        },
        documentType: fileType === "docx" ? "word" : fileType === "xlsx" ? "cell" : "slide",
        editorConfig: {
          mode: "edit",
          callbackUrl: `${req.protocol}://${req.get('host')}/api/callback`,
        },
      };
      
      const token = jwt.sign(docConfig, ONLYOFFICE_SECRET, {
        expiresIn: "1h"
      });
      
      console.log("Sending response:", { docConfig, token, serverUrl: ONLYOFFICE_SERVER });
      res.json({
        docConfig,
        token,
        serverUrl: ONLYOFFICE_SERVER
      });
    } catch (error) {
      console.error("Error generating doc config:", error);
      res.status(500).json({ error: "Failed to generate document configuration" });
    }
  });
  
  app.get("/api/callback", async (req, res) => {
    console.log("GET /api/callback");
    res.json({ error: 0 });
  });

  app.post("/api/callback", async (req, res) => {
    console.log("POST /api/callback:", req.body);
    res.json({ error: 0 });
  });

  // Serve blank documents for OnlyOffice
  app.get("/api/blank-docx", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const templatePath = path.resolve(process.cwd(), "public", "templates", "blank.docx");
      const fileBuffer = fs.readFileSync(templatePath);
      
      res.set({
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "inline; filename=blank.docx",
        "Content-Length": fileBuffer.length.toString()
      });
      
      res.send(fileBuffer);
    } catch (error) {
      console.error("Error serving blank docx:", error);
      res.status(500).json({ error: "Failed to serve document" });
    }
  });

  app.get("/api/blank-xlsx", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const templatePath = path.resolve(process.cwd(), "public", "templates", "blank.xlsx");
      const fileBuffer = fs.readFileSync(templatePath);
      
      res.set({
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "inline; filename=blank.xlsx",
        "Content-Length": fileBuffer.length.toString()
      });
      
      res.send(fileBuffer);
    } catch (error) {
      console.error("Error serving blank xlsx:", error);
      res.status(500).json({ error: "Failed to serve document" });
    }
  });

  app.get("/api/blank-pptx", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const templatePath = path.resolve(process.cwd(), "public", "templates", "blank.pptx");
      const fileBuffer = fs.readFileSync(templatePath);
      
      res.set({
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": "inline; filename=blank.pptx",
        "Content-Length": fileBuffer.length.toString()
      });
      
      res.send(fileBuffer);
    } catch (error) {
      console.error("Error serving blank pptx:", error);
      res.status(500).json({ error: "Failed to serve document" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
