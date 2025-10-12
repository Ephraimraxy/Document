// User management types and interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'creator' | 'reviewer' | 'approver' | 'viewer' | 'admin';
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  users: string[];
  permissions: string[];
  createdAt: Date;
}

export interface Document {
  id: string;
  title: string;
  type: 'docx' | 'xlsx' | 'pptx';
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'archived';
  createdBy: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  onlyOfficeUrl: string;
  workflow: {
    currentStep: string;
    assignedTo: string[];
    approvals: Approval[];
    comments: Comment[];
  };
}

export interface Approval {
  id: string;
  documentId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  timestamp: Date;
  signature?: string;
}

export interface Comment {
  id: string;
  documentId: string;
  userId: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'document_created' | 'document_approved' | 'document_rejected' | 'comment_added';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  documentId?: string;
}
