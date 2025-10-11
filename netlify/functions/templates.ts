import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import fs from "fs";
import path from "path";

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    const templatePath = event.path.replace('/templates/', '');
    
    // Define template file paths
    const templates = {
      'blank.docx': 'public/templates/blank.docx',
      'blank.xlsx': 'public/templates/blank.xlsx',
      'blank.pptx': 'public/templates/blank.pptx',
    };

    const templateFile = templates[templatePath as keyof typeof templates];
    
    if (!templateFile) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: 'Template not found',
      };
    }

    // Read the template file
    const fileBuffer = fs.readFileSync(templateFile);
    
    // Determine content type based on file extension
    const contentType = templatePath.endsWith('.docx') 
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : templatePath.endsWith('.xlsx')
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename=${templatePath}`,
        'Content-Length': fileBuffer.length.toString(),
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
      body: fileBuffer.toString('base64'),
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Template serving error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Error serving template',
    };
  }
};
