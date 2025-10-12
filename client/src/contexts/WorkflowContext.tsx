// Workflow management context
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkflowTemplate, WorkflowStep, DigitalSignature, AuditLog, CollaborationSession } from '../types/workflow';
import { Document, User, Approval } from '../types';

interface WorkflowContextType {
  // Workflow Templates
  templates: WorkflowTemplate[];
  createTemplate: (template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WorkflowTemplate>;
  updateTemplate: (id: string, updates: Partial<WorkflowTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  // Workflow Execution
  startWorkflow: (documentId: string, templateId: string) => Promise<void>;
  executeStep: (documentId: string, stepId: string, action: string, data?: any) => Promise<void>;
  getCurrentStep: (documentId: string) => WorkflowStep | null;
  getWorkflowHistory: (documentId: string) => AuditLog[];
  
  // Digital Signatures
  signatures: DigitalSignature[];
  addSignature: (documentId: string, signature: string, certificate?: string) => Promise<DigitalSignature>;
  verifySignature: (signatureId: string) => Promise<boolean>;
  
  // Collaboration
  sessions: CollaborationSession[];
  joinSession: (documentId: string, userId: string) => Promise<void>;
  leaveSession: (documentId: string, userId: string) => Promise<void>;
  updatePermissions: (sessionId: string, userId: string, permissions: string[]) => Promise<void>;
  
  // Audit Trail
  auditLogs: AuditLog[];
  addAuditLog: (documentId: string, action: string, details: Record<string, any>) => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [signatures, setSignatures] = useState<DigitalSignature[]>([]);
  const [sessions, setSessions] = useState<CollaborationSession[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Initialize with sample workflow templates
  useEffect(() => {
    const sampleTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'Standard Document Approval',
        description: 'Standard workflow for document review and approval',
        department: 'All',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [
          {
            id: 'step1',
            name: 'Document Creation',
            type: 'creation',
            assignedTo: [],
            requiredApprovals: 0,
            actions: [],
            nextSteps: ['step2'],
            previousSteps: []
          },
          {
            id: 'step2',
            name: 'Department Review',
            type: 'review',
            assignedTo: [],
            requiredApprovals: 1,
            timeLimit: 48,
            actions: [
              { type: 'assign', target: 'department_head', parameters: {} },
              { type: 'notify', target: 'reviewer', parameters: { message: 'Document requires your review' } }
            ],
            nextSteps: ['step3', 'step4'],
            previousSteps: ['step1']
          },
          {
            id: 'step3',
            name: 'Management Approval',
            type: 'approval',
            assignedTo: [],
            requiredApprovals: 1,
            timeLimit: 72,
            actions: [
              { type: 'assign', target: 'manager', parameters: {} },
              { type: 'notify', target: 'approver', parameters: { message: 'Document requires your approval' } }
            ],
            nextSteps: ['step5'],
            previousSteps: ['step2']
          },
          {
            id: 'step4',
            name: 'Rejection',
            type: 'rejection',
            assignedTo: [],
            requiredApprovals: 0,
            actions: [
              { type: 'notify', target: 'creator', parameters: { message: 'Document has been rejected' } }
            ],
            nextSteps: [],
            previousSteps: ['step2']
          },
          {
            id: 'step5',
            name: 'Digital Signature',
            type: 'signature',
            assignedTo: [],
            requiredApprovals: 1,
            actions: [
              { type: 'assign', target: 'signatory', parameters: {} },
              { type: 'notify', target: 'signer', parameters: { message: 'Document requires your signature' } }
            ],
            nextSteps: ['step6'],
            previousSteps: ['step3']
          },
          {
            id: 'step6',
            name: 'Finalization',
            type: 'finalization',
            assignedTo: [],
            requiredApprovals: 0,
            actions: [
              { type: 'notify', target: 'all', parameters: { message: 'Document has been finalized' } }
            ],
            nextSteps: [],
            previousSteps: ['step5']
          }
        ]
      },
      {
        id: '2',
        name: 'Financial Document Workflow',
        description: 'Specialized workflow for financial documents',
        department: 'Finance',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [
          {
            id: 'fin1',
            name: 'Financial Review',
            type: 'review',
            assignedTo: [],
            requiredApprovals: 2,
            timeLimit: 24,
            actions: [
              { type: 'assign', target: 'finance_team', parameters: {} }
            ],
            nextSteps: ['fin2'],
            previousSteps: []
          },
          {
            id: 'fin2',
            name: 'CFO Approval',
            type: 'approval',
            assignedTo: [],
            requiredApprovals: 1,
            timeLimit: 48,
            actions: [
              { type: 'assign', target: 'cfo', parameters: {} }
            ],
            nextSteps: ['fin3'],
            previousSteps: ['fin1']
          },
          {
            id: 'fin3',
            name: 'Legal Review',
            type: 'review',
            assignedTo: [],
            requiredApprovals: 1,
            timeLimit: 72,
            actions: [
              { type: 'assign', target: 'legal_team', parameters: {} }
            ],
            nextSteps: ['fin4'],
            previousSteps: ['fin2']
          },
          {
            id: 'fin4',
            name: 'Executive Signature',
            type: 'signature',
            assignedTo: [],
            requiredApprovals: 1,
            actions: [
              { type: 'assign', target: 'executive', parameters: {} }
            ],
            nextSteps: [],
            previousSteps: ['fin3']
          }
        ]
      }
    ];

    setTemplates(sampleTemplates);
  }, []);

  const createTemplate = async (template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowTemplate> => {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = async (id: string, updates: Partial<WorkflowTemplate>) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id 
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      )
    );
  };

  const deleteTemplate = async (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  const startWorkflow = async (documentId: string, templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    const firstStep = template.steps.find(step => step.previousSteps.length === 0);
    if (!firstStep) throw new Error('No starting step found');

    await addAuditLog(documentId, 'workflow_started', {
      templateId,
      templateName: template.name,
      firstStep: firstStep.id
    });
  };

  const executeStep = async (documentId: string, stepId: string, action: string, data?: any) => {
    await addAuditLog(documentId, 'step_executed', {
      stepId,
      action,
      data,
      timestamp: new Date()
    });
  };

  const getCurrentStep = (documentId: string): WorkflowStep | null => {
    // This would typically query the database for the current step
    // For now, return the first step of the first template
    const template = templates[0];
    return template?.steps[0] || null;
  };

  const getWorkflowHistory = (documentId: string): AuditLog[] => {
    return auditLogs.filter(log => log.documentId === documentId);
  };

  const addSignature = async (documentId: string, signature: string, certificate?: string): Promise<DigitalSignature> => {
    const newSignature: DigitalSignature = {
      id: Date.now().toString(),
      documentId,
      signerId: 'current_user', // This would come from auth context
      signature,
      timestamp: new Date(),
      ipAddress: '127.0.0.1', // This would be the actual IP
      certificate,
      verified: false
    };

    setSignatures(prev => [...prev, newSignature]);
    
    await addAuditLog(documentId, 'signature_added', {
      signatureId: newSignature.id,
      signerId: newSignature.signerId
    });

    return newSignature;
  };

  const verifySignature = async (signatureId: string): Promise<boolean> => {
    // This would implement actual signature verification
    // For now, just mark as verified
    setSignatures(prev => 
      prev.map(sig => 
        sig.id === signatureId 
          ? { ...sig, verified: true }
          : sig
      )
    );
    return true;
  };

  const joinSession = async (documentId: string, userId: string) => {
    let session = sessions.find(s => s.documentId === documentId);
    
    if (!session) {
      session = {
        id: Date.now().toString(),
        documentId,
        participants: [userId],
        activeUsers: [userId],
        lastActivity: new Date(),
        permissions: { [userId]: ['read', 'comment'] }
      };
      setSessions(prev => [...prev, session!]);
    } else {
      if (!session.participants.includes(userId)) {
        session.participants.push(userId);
      }
      if (!session.activeUsers.includes(userId)) {
        session.activeUsers.push(userId);
      }
      session.lastActivity = new Date();
      
      setSessions(prev => 
        prev.map(s => s.id === session!.id ? session! : s)
      );
    }

    await addAuditLog(documentId, 'user_joined_session', {
      userId,
      sessionId: session.id
    });
  };

  const leaveSession = async (documentId: string, userId: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.documentId === documentId
          ? {
              ...session,
              activeUsers: session.activeUsers.filter(id => id !== userId),
              lastActivity: new Date()
            }
          : session
      )
    );

    await addAuditLog(documentId, 'user_left_session', { userId });
  };

  const updatePermissions = async (sessionId: string, userId: string, permissions: string[]) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId
          ? {
              ...session,
              permissions: {
                ...session.permissions,
                [userId]: permissions
              }
            }
          : session
      )
    );

    await addAuditLog('', 'permissions_updated', {
      sessionId,
      userId,
      permissions
    });
  };

  const addAuditLog = async (documentId: string, action: string, details: Record<string, any>) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      documentId,
      userId: 'current_user', // This would come from auth context
      action,
      details,
      timestamp: new Date(),
      ipAddress: '127.0.0.1' // This would be the actual IP
    };

    setAuditLogs(prev => [...prev, log]);
  };

  const value: WorkflowContextType = {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    startWorkflow,
    executeStep,
    getCurrentStep,
    getWorkflowHistory,
    signatures,
    addSignature,
    verifySignature,
    sessions,
    joinSession,
    leaveSession,
    updatePermissions,
    auditLogs,
    addAuditLog
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};
