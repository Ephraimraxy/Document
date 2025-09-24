import jwt from "jsonwebtoken";
import fetch from "node-fetch";

interface OnlyOfficeUser {
  id: string;
  name: string;
}

interface OnlyOfficePermissions {
  edit: boolean;
  download: boolean;
  print: boolean;
}

interface GenerateConfigParams {
  documentId: string;
  title: string;
  url: string;
  fileType: string;
  user: OnlyOfficeUser;
  permissions: OnlyOfficePermissions;
}

interface OnlyOfficeConfig {
  documentType: string;
  document: {
    fileType: string;
    key: string;
    title: string;
    url: string;
  };
  editorConfig: {
    callbackUrl: string;
    user: {
      id: string;
      name: string;
    };
  };
  token: string;
}

class OnlyOfficeService {
  private secret: string;
  private serverUrl: string;

  constructor() {
    this.secret = process.env.ONLYOFFICE_JWT_SECRET || "defaultsecret";
    this.serverUrl = process.env.ONLYOFFICE_URL || "http://onlyoffice.mycompany.local";
  }

  private getDocumentType(fileType: string): string {
    if (fileType.includes("word")) return "word";
    if (fileType.includes("sheet")) return "cell";
    if (fileType.includes("presentation")) return "slide";
    return "word";
  }

  private getFileExtension(fileType: string): string {
    if (fileType.includes("word")) return "docx";
    if (fileType.includes("sheet")) return "xlsx";
    if (fileType.includes("presentation")) return "pptx";
    return "docx";
  }

  generateConfig(params: GenerateConfigParams): OnlyOfficeConfig {
    const documentType = this.getDocumentType(params.fileType);
    const fileExtension = this.getFileExtension(params.fileType);
    const key = `${params.documentId}_${Date.now()}`;

    const config = {
      documentType,
      document: {
        fileType: fileExtension,
        key,
        title: params.title,
        url: params.url,
      },
      editorConfig: {
        callbackUrl: `${process.env.BASE_URL || "http://localhost:5000"}/api/onlyoffice/callback`,
        user: {
          id: params.user.id,
          name: params.user.name,
        },
        customization: {
          autosave: true,
          forcesave: true,
        },
        permissions: params.permissions,
      },
    };

    const token = jwt.sign(config, this.secret, { algorithm: "HS256" });

    return {
      ...config,
      token,
    };
  }

  verifyCallback(payload: any): boolean {
    try {
      if (!payload.token) {
        return false;
      }

      jwt.verify(payload.token, this.secret);
      return true;
    } catch (error) {
      console.error("JWT verification failed:", error);
      return false;
    }
  }

  async downloadDocument(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download document: ${response.statusText}`);
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      console.error("Error downloading document:", error);
      throw new Error("Failed to download document from OnlyOffice");
    }
  }

  createJWT(payload: any): string {
    return jwt.sign(payload, this.secret, { algorithm: "HS256" });
  }

  verifyJWT(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      console.error("JWT verification failed:", error);
      throw new Error("Invalid JWT token");
    }
  }
}

export const onlyOfficeService = new OnlyOfficeService();
