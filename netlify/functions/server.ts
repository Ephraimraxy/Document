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
      
      // Use our own API endpoint to serve templates - most reliable approach
      const documentUrl = `${siteUrl}/api/template/${fileType}`;
      
      console.log('Generated document URL:', documentUrl);
      
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

    // Handle template serving endpoint
    if (event.path.startsWith('/api/template/')) {
      const fileType = event.path.split('/').pop();
      
      // Create minimal blank documents
      let templateBuffer;
      let contentType;
      
      if (fileType === 'docx') {
        // Minimal DOCX
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
        
        zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
        
        zip.folder('word').file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body><w:p><w:r><w:t></w:t></w:r></w:p></w:body>
</w:document>`);
        
        templateBuffer = await zip.generateAsync({type: 'nodebuffer'});
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
      } else if (fileType === 'xlsx') {
        // Minimal XLSX
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`);
        
        zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`);
        
        zip.folder('xl').file('workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>`);
        
        zip.folder('xl/_rels').file('workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`);
        
        zip.folder('xl/worksheets').file('sheet1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData/>
</worksheet>`);
        
        templateBuffer = await zip.generateAsync({type: 'nodebuffer'});
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        
      } else if (fileType === 'pptx') {
        // Minimal PPTX
        const JSZip = require('jszip');
        const zip = new JSZip();
        
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
</Types>`);
        
        zip.folder('_rels').file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);
        
        zip.folder('ppt').file('presentation.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:sldIdLst/>
</p:presentation>`);
        
        templateBuffer = await zip.generateAsync({type: 'nodebuffer'});
        contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Template not found' }),
        };
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename=blank.${fileType}`,
          'Content-Length': templateBuffer.length.toString(),
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        },
        body: templateBuffer.toString('base64'),
        isBase64Encoded: true,
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
