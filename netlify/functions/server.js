// netlify/functions/server.ts
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
var ONLYOFFICE_SECRET = process.env.ONLYOFFICE_SECRET || "6c7176c0e28d4653a9c7178cff054122";
var ONLYOFFICE_SERVER = process.env.ONLYOFFICE_SERVER || "https://0df6a6d6.docs.onlyoffice.com";
var handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  try {
    if (event.path === "/api/doc-config" && event.httpMethod === "POST") {
      const body = event.body ? JSON.parse(event.body) : {};
      const { documentType = "docx", title = "Untitled Document" } = body;
      const documentKey = randomUUID();
      const fileType = documentType;
      const siteUrl = `https://${event.headers.host}`;
      const documentUrl = `${siteUrl}/templates/blank.${fileType}`;
      const docConfig = {
        document: {
          fileType,
          key: documentKey,
          title,
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
          callbackUrl: `${siteUrl}/api/callback`
        }
      };
      const token = jwt.sign(docConfig, ONLYOFFICE_SECRET, {
        expiresIn: "1h"
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          docConfig,
          token,
          serverUrl: ONLYOFFICE_SERVER
        })
      };
    }
    if (event.path === "/api/callback") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: 0 })
      };
    }
    if (event.path.startsWith("/templates/")) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Access-Control-Allow-Origin": "*"
        },
        body: "Template file would be served here"
      };
    }
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Not found" })
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" })
    };
  }
};
export {
  handler
};
