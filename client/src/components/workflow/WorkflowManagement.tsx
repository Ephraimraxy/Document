// Workflow management dashboard
import React, { useState } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Workflow, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export const WorkflowManagement: React.FC = () => {
  const { 
    templates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    auditLogs,
    sessions 
  } = useWorkflow();
  
  const { user, documents } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const getWorkflowStats = () => {
    const activeWorkflows = documents.filter(doc => 
      doc.status === 'review' || doc.status === 'approved'
    ).length;
    
    const pendingApprovals = documents.filter(doc => 
      doc.workflow.assignedTo.includes(user?.id || '') && doc.status === 'review'
    ).length;
    
    const completedToday = documents.filter(doc => 
      doc.status === 'approved' && 
      new Date(doc.updatedAt).toDateString() === new Date().toDateString()
    ).length;

    return { activeWorkflows, pendingApprovals, completedToday };
  };

  const getTemplateStatus = (template: any) => {
    if (template.isActive) {
      return { icon: <CheckCircle className="h-4 w-4 text-green-600" />, text: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { icon: <XCircle className="h-4 w-4 text-red-600" />, text: 'Inactive', color: 'bg-red-100 text-red-800' };
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'creation': return <FileText className="h-4 w-4" />;
      case 'review': return <Users className="h-4 w-4" />;
      case 'approval': return <CheckCircle className="h-4 w-4" />;
      case 'signature': return <Workflow className="h-4 w-4" />;
      case 'finalization': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = getWorkflowStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Management</h1>
          <p className="text-gray-600">Manage document workflows and approvals</p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        {/* Workflow Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Workflow Templates</h2>
            <Button>
              <Workflow className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(template => {
              const status = getTemplateStatus(template);
              return (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge className={status.color}>
                        {status.icon}
                        {status.text}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{template.department}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Steps:</span>
                        <span className="font-medium">{template.steps.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Workflow Steps Preview */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Workflow Steps:</h4>
                      <div className="space-y-2">
                        {template.steps.slice(0, 3).map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-2 text-sm">
                            {getStepIcon(step.type)}
                            <span className="text-gray-600">{step.name}</span>
                            {index < 2 && <span className="text-gray-400">→</span>}
                          </div>
                        ))}
                        {template.steps.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{template.steps.length - 3} more steps
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Use
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {template.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Active Workflows */}
        <TabsContent value="active" className="space-y-6">
          <h2 className="text-lg font-semibold">Active Workflows</h2>
          <div className="space-y-4">
            {documents.filter(doc => doc.status === 'review' || doc.status === 'approved').map(doc => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-600">
                          {doc.type.toUpperCase()} • {doc.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={doc.status === 'review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {doc.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit" className="space-y-6">
          <h2 className="text-lg font-semibold">Audit Trail</h2>
          <div className="space-y-4">
            {auditLogs.slice(0, 10).map(log => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">
                          Document ID: {log.documentId}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Collaboration */}
        <TabsContent value="collaboration" className="space-y-6">
          <h2 className="text-lg font-semibold">Active Collaboration Sessions</h2>
          <div className="space-y-4">
            {sessions.map(session => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Document Session</p>
                        <p className="text-sm text-gray-600">
                          {session.activeUsers.length} active users
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last activity: {new Date(session.lastActivity).toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
