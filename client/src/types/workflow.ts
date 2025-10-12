// Advanced workflow types and interfaces
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'creation' | 'review' | 'approval' | 'signature' | 'finalization';
  assignedTo: string[];
  requiredApprovals: number;
  timeLimit?: number; // hours
  conditions?: WorkflowCondition[];
  actions: WorkflowAction[];
  nextSteps: string[];
  previousSteps: string[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface WorkflowAction {
  type: 'assign' | 'notify' | 'escalate' | 'auto_approve' | 'reject';
  target: string;
  parameters: Record<string, any>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  department: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DigitalSignature {
  id: string;
  documentId: string;
  signerId: string;
  signature: string; // base64 encoded signature
  timestamp: Date;
  ipAddress: string;
  certificate?: string;
  verified: boolean;
}

export interface AuditLog {
  id: string;
  documentId: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
}

export interface CollaborationSession {
  id: string;
  documentId: string;
  participants: string[];
  activeUsers: string[];
  lastActivity: Date;
  permissions: Record<string, string[]>;
}
