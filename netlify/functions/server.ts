import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import express from "express";
import { registerRoutes } from "../../server/routes";

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
let server: any;
registerRoutes(app).then((s) => {
  server = s;
});

// Netlify serverless function handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  return new Promise((resolve) => {
    const { httpMethod, path, body, headers, queryStringParameters } = event;
    
    // Convert Netlify event to Express request-like object
    const req = {
      method: httpMethod,
      url: path,
      path: path,
      body: body ? JSON.parse(body) : {},
      headers: headers || {},
      query: queryStringParameters || {},
      get: (name: string) => headers?.[name.toLowerCase()] || headers?.[name],
      protocol: 'https',
    } as any;

    // Create response object
    let responseBody: any;
    let statusCode = 200;
    let responseHeaders: Record<string, string> = {};

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseBody = data;
        responseHeaders['Content-Type'] = 'application/json';
        return res;
      },
      send: (data: any) => {
        responseBody = data;
        return res;
      },
      set: (headers: Record<string, string>) => {
        Object.assign(responseHeaders, headers);
        return res;
      },
      end: (data?: any) => {
        if (data) responseBody = data;
        resolve({
          statusCode,
          headers: responseHeaders,
          body: typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody),
        });
      },
    } as any;

    // Handle the request
    app(req, res);
  });
};
