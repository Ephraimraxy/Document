// Analytics context and data management
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AnalyticsMetrics, 
  UserActivityMetrics, 
  DepartmentMetrics, 
  WorkflowBottleneck,
  ReportTemplate,
  GeneratedReport,
  DashboardWidget,
  ComplianceMetrics
} from '../types/analytics';
import { Document, User } from '../types';

interface AnalyticsContextType {
  // Metrics
  metrics: AnalyticsMetrics | null;
  userActivity: UserActivityMetrics[];
  departmentMetrics: DepartmentMetrics[];
  workflowBottlenecks: WorkflowBottleneck[];
  complianceMetrics: ComplianceMetrics | null;
  
  // Reports
  reportTemplates: ReportTemplate[];
  generatedReports: GeneratedReport[];
  createReportTemplate: (template: Omit<ReportTemplate, 'id' | 'createdAt'>) => Promise<ReportTemplate>;
  generateReport: (templateId: string, parameters: Record<string, any>) => Promise<GeneratedReport>;
  scheduleReport: (templateId: string, schedule: any) => Promise<void>;
  
  // Dashboard
  dashboardWidgets: DashboardWidget[];
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => Promise<void>;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => Promise<void>;
  removeWidget: (widgetId: string) => Promise<void>;
  
  // Data fetching
  refreshMetrics: () => Promise<void>;
  exportData: (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, any>) => Promise<string>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivityMetrics[]>([]);
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetrics[]>([]);
  const [workflowBottlenecks, setWorkflowBottlenecks] = useState<WorkflowBottleneck[]>([]);
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics | null>(null);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [dashboardWidgets, setDashboardWidgets] = useState<DashboardWidget[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleMetrics: AnalyticsMetrics = {
      totalDocuments: 1247,
      documentsCreated: 89,
      documentsApproved: 67,
      documentsRejected: 12,
      averageProcessingTime: 2.4,
      workflowEfficiency: 87.5,
      userActivity: [],
      departmentPerformance: [],
      workflowBottlenecks: [],
      complianceScore: 94.2
    };

    const sampleUserActivity: UserActivityMetrics[] = [
      {
        userId: '1',
        userName: 'John Admin',
        documentsCreated: 23,
        documentsReviewed: 45,
        documentsApproved: 38,
        averageResponseTime: 1.2,
        lastActivity: new Date(),
        productivityScore: 92.5
      },
      {
        userId: '2',
        userName: 'Jane Manager',
        documentsCreated: 18,
        documentsReviewed: 67,
        documentsApproved: 52,
        averageResponseTime: 0.8,
        lastActivity: new Date(),
        productivityScore: 96.8
      },
      {
        userId: '3',
        userName: 'Mike HR',
        documentsCreated: 12,
        documentsReviewed: 34,
        documentsApproved: 28,
        averageResponseTime: 2.1,
        lastActivity: new Date(),
        productivityScore: 78.3
      }
    ];

    const sampleDepartmentMetrics: DepartmentMetrics[] = [
      {
        departmentId: '1',
        departmentName: 'Administration',
        totalDocuments: 456,
        averageProcessingTime: 1.8,
        approvalRate: 89.2,
        rejectionRate: 10.8,
        efficiencyScore: 91.5,
        topPerformers: ['John Admin', 'Jane Manager'],
        bottlenecks: ['Legal Review']
      },
      {
        departmentId: '2',
        departmentName: 'Human Resources',
        totalDocuments: 234,
        averageProcessingTime: 2.3,
        approvalRate: 85.7,
        rejectionRate: 14.3,
        efficiencyScore: 87.2,
        topPerformers: ['Mike HR'],
        bottlenecks: ['Background Check']
      },
      {
        departmentId: '3',
        departmentName: 'Finance',
        totalDocuments: 189,
        averageProcessingTime: 3.1,
        approvalRate: 92.1,
        rejectionRate: 7.9,
        efficiencyScore: 88.9,
        topPerformers: ['Sarah Finance'],
        bottlenecks: ['Audit Review']
      }
    ];

    const sampleBottlenecks: WorkflowBottleneck[] = [
      {
        stepId: 'legal_review',
        stepName: 'Legal Review',
        averageWaitTime: 48,
        documentsStuck: 12,
        assignedUsers: ['Legal Team'],
        severity: 'high',
        recommendations: [
          'Increase legal team capacity',
          'Implement automated legal checks',
          'Set up escalation procedures'
        ]
      },
      {
        stepId: 'executive_approval',
        stepName: 'Executive Approval',
        averageWaitTime: 72,
        documentsStuck: 8,
        assignedUsers: ['Executive Team'],
        severity: 'medium',
        recommendations: [
          'Delegate approval authority',
          'Implement mobile approval',
          'Set up automatic escalation'
        ]
      }
    ];

    const sampleCompliance: ComplianceMetrics = {
      totalAuditLogs: 15420,
      securityIncidents: 0,
      dataRetentionCompliance: 98.5,
      accessControlCompliance: 96.8,
      signatureVerificationRate: 100,
      documentIntegrityScore: 99.2,
      lastSecurityScan: new Date(),
      complianceScore: 98.7
    };

    const sampleReportTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Monthly Performance Report',
        description: 'Comprehensive monthly performance analysis',
        type: 'performance',
        parameters: [
          { name: 'date_range', type: 'date_range', required: true },
          { name: 'department', type: 'department', required: false }
        ],
        schedule: {
          frequency: 'monthly',
          dayOfMonth: 1,
          time: '09:00',
          recipients: ['admin@company.com', 'manager@company.com']
        },
        isActive: true,
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Compliance Audit Report',
        description: 'Security and compliance audit report',
        type: 'compliance',
        parameters: [
          { name: 'date_range', type: 'date_range', required: true }
        ],
        isActive: true,
        createdAt: new Date()
      }
    ];

    const sampleWidgets: DashboardWidget[] = [
      {
        id: '1',
        type: 'metric',
        title: 'Total Documents',
        data: { value: 1247, change: '+12%', trend: 'up' },
        position: { x: 0, y: 0, w: 3, h: 2 }
      },
      {
        id: '2',
        type: 'chart',
        title: 'Document Processing Trend',
        data: {
          type: 'line',
          data: [
            { month: 'Jan', documents: 120 },
            { month: 'Feb', documents: 135 },
            { month: 'Mar', documents: 142 },
            { month: 'Apr', documents: 158 },
            { month: 'May', documents: 167 },
            { month: 'Jun', documents: 189 }
          ]
        },
        position: { x: 3, y: 0, w: 6, h: 4 }
      },
      {
        id: '3',
        type: 'gauge',
        title: 'Workflow Efficiency',
        data: { value: 87.5, max: 100, color: 'green' },
        position: { x: 9, y: 0, w: 3, h: 2 }
      }
    ];

    setMetrics(sampleMetrics);
    setUserActivity(sampleUserActivity);
    setDepartmentMetrics(sampleDepartmentMetrics);
    setWorkflowBottlenecks(sampleBottlenecks);
    setComplianceMetrics(sampleCompliance);
    setReportTemplates(sampleReportTemplates);
    setDashboardWidgets(sampleWidgets);
  }, []);

  const createReportTemplate = async (template: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<ReportTemplate> => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setReportTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const generateReport = async (templateId: string, parameters: Record<string, any>): Promise<GeneratedReport> => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const report: GeneratedReport = {
      id: Date.now().toString(),
      templateId,
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      generatedAt: new Date(),
      parameters,
      data: {}, // This would contain actual report data
      format: 'pdf',
      downloadUrl: `/api/reports/${Date.now()}.pdf`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    setGeneratedReports(prev => [...prev, report]);
    return report;
  };

  const scheduleReport = async (templateId: string, schedule: any) => {
    // This would implement actual scheduling logic
    console.log('Scheduling report:', templateId, schedule);
  };

  const addWidget = async (widget: Omit<DashboardWidget, 'id'>) => {
    const newWidget: DashboardWidget = {
      ...widget,
      id: Date.now().toString()
    };
    setDashboardWidgets(prev => [...prev, newWidget]);
  };

  const updateWidget = async (widgetId: string, updates: Partial<DashboardWidget>) => {
    setDashboardWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, ...updates }
          : widget
      )
    );
  };

  const removeWidget = async (widgetId: string) => {
    setDashboardWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };

  const refreshMetrics = async () => {
    // This would fetch fresh data from the API
    console.log('Refreshing metrics...');
  };

  const exportData = async (format: 'csv' | 'excel' | 'pdf', filters?: Record<string, any>): Promise<string> => {
    // This would generate and return download URL
    const downloadUrl = `/api/export/${format}?${new URLSearchParams(filters).toString()}`;
    return downloadUrl;
  };

  const value: AnalyticsContextType = {
    metrics,
    userActivity,
    departmentMetrics,
    workflowBottlenecks,
    complianceMetrics,
    reportTemplates,
    generatedReports,
    createReportTemplate,
    generateReport,
    scheduleReport,
    dashboardWidgets,
    addWidget,
    updateWidget,
    removeWidget,
    refreshMetrics,
    exportData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
