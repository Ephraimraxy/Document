// Analytics and reporting types
export interface AnalyticsMetrics {
  totalDocuments: number;
  documentsCreated: number;
  documentsApproved: number;
  documentsRejected: number;
  averageProcessingTime: number; // hours
  workflowEfficiency: number; // percentage
  userActivity: UserActivityMetrics[];
  departmentPerformance: DepartmentMetrics[];
  workflowBottlenecks: WorkflowBottleneck[];
  complianceScore: number; // percentage
}

export interface UserActivityMetrics {
  userId: string;
  userName: string;
  documentsCreated: number;
  documentsReviewed: number;
  documentsApproved: number;
  averageResponseTime: number; // hours
  lastActivity: Date;
  productivityScore: number; // percentage
}

export interface DepartmentMetrics {
  departmentId: string;
  departmentName: string;
  totalDocuments: number;
  averageProcessingTime: number;
  approvalRate: number; // percentage
  rejectionRate: number; // percentage
  efficiencyScore: number; // percentage
  topPerformers: string[];
  bottlenecks: string[];
}

export interface WorkflowBottleneck {
  stepId: string;
  stepName: string;
  averageWaitTime: number; // hours
  documentsStuck: number;
  assignedUsers: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'compliance' | 'workflow' | 'user' | 'department';
  parameters: ReportParameter[];
  schedule?: ReportSchedule;
  isActive: boolean;
  createdAt: Date;
}

export interface ReportParameter {
  name: string;
  type: 'date_range' | 'department' | 'user' | 'workflow' | 'status';
  required: boolean;
  defaultValue?: any;
  options?: string[];
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  recipients: string[];
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  generatedAt: Date;
  parameters: Record<string, any>;
  data: any;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  filePath?: string;
  downloadUrl?: string;
  expiresAt: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'timeline';
  title: string;
  data: any;
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number; // seconds
  filters?: Record<string, any>;
}

export interface ComplianceMetrics {
  totalAuditLogs: number;
  securityIncidents: number;
  dataRetentionCompliance: number; // percentage
  accessControlCompliance: number; // percentage
  signatureVerificationRate: number; // percentage
  documentIntegrityScore: number; // percentage
  lastSecurityScan: Date;
  complianceScore: number; // percentage
}
