import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const ONLYOFFICE_SECRET = process.env.ONLYOFFICE_SECRET || "6c7176c0e28d4653a9c7178cff054122";
const ONLYOFFICE_SERVER = process.env.ONLYOFFICE_SERVER || "https://0df6a6d6.docs.onlyoffice.com";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Handle doc-config endpoint
    if (event.path === '/api/doc-config' && event.httpMethod === 'POST') {
      const body = event.body ? JSON.parse(event.body) : {};
      const { documentType = "docx", title = "Untitled Document" } = body;
      
      const documentKey = randomUUID();
      const fileType = documentType;
      
      // Get the site URL from the event
      const siteUrl = `https://${event.headers.host}`;
      
      // Use public template URLs that OnlyOffice can definitely access
      const publicTemplateUrls = {
        'docx': 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-doc-file.docx',
        'xlsx': 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-xlsx-file.xlsx',
        'pptx': 'https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx'
      };
      
      const documentUrl = publicTemplateUrls[fileType] || `${siteUrl}/templates/blank.${fileType}`;
      
      // Debug logging
      console.log('Generated document URL:', documentUrl);
      console.log('Host header:', event.headers.host);
      console.log('File type:', fileType);
      
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
          callbackUrl: `${siteUrl}/api/callback`,
        },
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
        }),
      };
    }

    // Handle callback endpoint
    if (event.path === '/api/callback') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ error: 0 }),
      };
    }

    // Handle template files
    if (event.path.startsWith('/templates/')) {
      // For now, return a simple response indicating the template would be served
      // In a real implementation, you'd serve the actual template files
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Access-Control-Allow-Origin': '*',
        },
        body: 'Template file would be served here',
      };
    }

    // Default response
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
