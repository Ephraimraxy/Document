// Main dashboard component
import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, FileText, Users, CheckCircle, XCircle, Clock, Workflow, Settings, BarChart3, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { DocumentCreator } from '../documents/DocumentCreator';

export const Dashboard: React.FC = () => {
  const { user, documents, notifications, createDocument, logout } = useUser();
  const [showDocumentCreator, setShowDocumentCreator] = useState(false);

  if (!user) return null;

  const pendingDocuments = documents.filter(doc => 
    doc.workflow.assignedTo.includes(user.id) && doc.status === 'review'
  );
  
  const myDocuments = documents.filter(doc => doc.createdBy === user.id);
  
  const unreadNotifications = notifications.filter(notif => !notif.read);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleDocumentCreated = (document: any) => {
    setShowDocumentCreator(false);
    // Document is automatically added to the list via context
  };

  if (showDocumentCreator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <DocumentCreator onDocumentCreated={handleDocumentCreated} />
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setShowDocumentCreator(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DocuEdit</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user.name} ({user.department})
                {user.role === 'admin' && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    🔐 ADMIN
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowDocumentCreator(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Document
              </Button>
              <Link href="/workflow">
                <Button variant="outline" size="sm">
                  <Workflow className="h-4 w-4 mr-2" />
                  Workflows
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <div className="relative">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {unreadNotifications.length > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {unreadNotifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {user.role === 'admin' && (
                  <Button variant="outline" size="sm" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={logout}>
                  <Settings className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Actions
              </CardTitle>
              <CardDescription>
                Documents requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingDocuments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending documents</p>
                ) : (
                  pendingDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-gray-600">{doc.type.toUpperCase()}</p>
                      </div>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* My Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                My Documents
              </CardTitle>
              <CardDescription>
                Documents you've created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myDocuments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No documents created yet</p>
                ) : (
                  myDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Document
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Documents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pending Approvals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest document activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.slice(0, 5).map(notification => (
                <div key={notification.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
