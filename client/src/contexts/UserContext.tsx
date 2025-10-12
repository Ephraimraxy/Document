// User management context and hooks
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Department, Document, Notification } from '../types';

interface UserContextType {
  user: User | null;
  departments: Department[];
  documents: Document[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createDocument: (title: string, type: 'docx' | 'xlsx' | 'pptx') => Promise<Document>;
  updateDocument: (documentId: string, updates: Partial<Document>) => Promise<void>;
  submitForReview: (documentId: string, assignedTo: string[]) => Promise<void>;
  approveDocument: (documentId: string, comments?: string) => Promise<void>;
  rejectDocument: (documentId: string, comments: string) => Promise<void>;
  addComment: (documentId: string, content: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Initialize with sample data for development
  useEffect(() => {
    const sampleDepartments: Department[] = [
      {
        id: '1',
        name: 'Administration',
        description: 'Administrative operations and management',
        users: ['1', '2'],
        permissions: ['create', 'review', 'approve', 'view'],
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Human Resources',
        description: 'HR operations and employee management',
        users: ['3', '4'],
        permissions: ['create', 'review', 'approve', 'view'],
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Finance',
        description: 'Financial operations and accounting',
        users: ['5', '6'],
        permissions: ['create', 'review', 'approve', 'view'],
        createdAt: new Date()
      },
      {
        id: '4',
        name: 'Marketing',
        description: 'Marketing and communications',
        users: ['7', '8'],
        permissions: ['create', 'review', 'view'],
        createdAt: new Date()
      }
    ];

    const sampleUsers: User[] = [
      {
        id: '1',
        name: 'John Admin',
        email: 'john.admin@company.com',
        department: 'Administration',
        role: 'admin',
        createdAt: new Date(),
        lastActive: new Date()
      },
      {
        id: '2',
        name: 'Jane Manager',
        email: 'jane.manager@company.com',
        department: 'Administration',
        role: 'approver',
        createdAt: new Date(),
        lastActive: new Date()
      },
      {
        id: '3',
        name: 'Mike HR',
        email: 'mike.hr@company.com',
        department: 'Human Resources',
        role: 'approver',
        createdAt: new Date(),
        lastActive: new Date()
      },
      {
        id: '4',
        name: 'Sarah HR',
        email: 'sarah.hr@company.com',
        department: 'Human Resources',
        role: 'reviewer',
        createdAt: new Date(),
        lastActive: new Date()
      }
    ];

    setDepartments(sampleDepartments);
    
    // Auto-login for development (remove in production)
    setUser(sampleUsers[0]);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    const mockUsers = [
      { email: 'john.admin@company.com', password: 'admin123', user: {
        id: '1',
        name: 'John Admin',
        email: 'john.admin@company.com',
        department: 'Administration',
        role: 'admin' as const,
        createdAt: new Date(),
        lastActive: new Date()
      }},
      { email: 'jane.manager@company.com', password: 'manager123', user: {
        id: '2',
        name: 'Jane Manager',
        email: 'jane.manager@company.com',
        department: 'Administration',
        role: 'approver' as const,
        createdAt: new Date(),
        lastActive: new Date()
      }}
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setDocuments([]);
    setNotifications([]);
  };

  const createDocument = async (title: string, type: 'docx' | 'xlsx' | 'pptx'): Promise<Document> => {
    if (!user) throw new Error('User not authenticated');

    const newDocument: Document = {
      id: Date.now().toString(),
      title,
      type,
      status: 'draft',
      createdBy: user.id,
      department: user.department,
      createdAt: new Date(),
      updatedAt: new Date(),
      onlyOfficeUrl: `/api/template/${type}`, // Use existing OnlyOffice integration
      workflow: {
        currentStep: 'creation',
        assignedTo: [],
        approvals: [],
        comments: []
      }
    };

    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  };

  const updateDocument = async (documentId: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, ...updates, updatedAt: new Date() }
          : doc
      )
    );
  };

  const submitForReview = async (documentId: string, assignedTo: string[]) => {
    await updateDocument(documentId, {
      status: 'review',
      workflow: {
        currentStep: 'review',
        assignedTo,
        approvals: [],
        comments: []
      }
    });

    // Add notifications for assigned users
    const newNotifications: Notification[] = assignedTo.map(userId => ({
      id: Date.now().toString() + userId,
      userId,
      type: 'document_created',
      title: 'New Document for Review',
      message: `A new document has been assigned to you for review`,
      read: false,
      timestamp: new Date(),
      documentId
    }));

    setNotifications(prev => [...prev, ...newNotifications]);
  };

  const approveDocument = async (documentId: string, comments?: string) => {
    if (!user) throw new Error('User not authenticated');

    const approval: Approval = {
      id: Date.now().toString(),
      documentId,
      approverId: user.id,
      status: 'approved',
      comments: comments || '',
      timestamp: new Date()
    };

    await updateDocument(documentId, {
      status: 'approved',
      workflow: {
        currentStep: 'approved',
        assignedTo: [],
        approvals: [approval],
        comments: []
      }
    });

    // Add notification
    const notification: Notification = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'document_approved',
      title: 'Document Approved',
      message: `Document has been approved`,
      read: false,
      timestamp: new Date(),
      documentId
    };

    setNotifications(prev => [...prev, notification]);
  };

  const rejectDocument = async (documentId: string, comments: string) => {
    if (!user) throw new Error('User not authenticated');

    const approval: Approval = {
      id: Date.now().toString(),
      documentId,
      approverId: user.id,
      status: 'rejected',
      comments,
      timestamp: new Date()
    };

    await updateDocument(documentId, {
      status: 'rejected',
      workflow: {
        currentStep: 'rejected',
        assignedTo: [],
        approvals: [approval],
        comments: []
      }
    });

    // Add notification
    const notification: Notification = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'document_rejected',
      title: 'Document Rejected',
      message: `Document has been rejected: ${comments}`,
      read: false,
      timestamp: new Date(),
      documentId
    };

    setNotifications(prev => [...prev, notification]);
  };

  const addComment = async (documentId: string, content: string) => {
    if (!user) throw new Error('User not authenticated');

    const comment: Comment = {
      id: Date.now().toString(),
      documentId,
      userId: user.id,
      content,
      timestamp: new Date(),
      resolved: false
    };

    await updateDocument(documentId, {
      workflow: {
        currentStep: 'review',
        assignedTo: [],
        approvals: [],
        comments: [comment]
      }
    });
  };

  const markNotificationRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const value: UserContextType = {
    user,
    departments,
    documents,
    notifications,
    login,
    logout,
    createDocument,
    updateDocument,
    submitForReview,
    approveDocument,
    rejectDocument,
    addComment,
    markNotificationRead
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
