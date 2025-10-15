import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { Link } from 'wouter';
import { DocumentCreator } from '../components/documents/DocumentCreator';

export default function DashboardPage() {
  const { user, documents, notifications } = useUser();
  const [showDocumentCreator, setShowDocumentCreator] = useState(false);

  if (!user) return null;

  const myDocuments = documents.filter(doc => doc.createdBy === user.id);
  const pendingApprovals = documents.filter(doc => 
    doc.workflow.assignedTo.includes(user.id) && doc.status === 'review'
  );
  const recentDocuments = myDocuments.slice(0, 5);
  const approvedCount = myDocuments.filter(doc => doc.status === 'approved').length;

  const handleDocumentCreated = () => {
    setShowDocumentCreator(false);
  };

  const stats = [
    {
      title: 'Total Documents',
      value: myDocuments.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Approved',
      value: approvedCount,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Activity Score',
      value: `${Math.min(myDocuments.length * 10, 100)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  if (showDocumentCreator) {
    return (
      <AppLayout>
        <div className="p-6 flex items-center justify-center min-h-full">
          <div className="w-full max-w-md">
            <DocumentCreator onDocumentCreated={handleDocumentCreated} />
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => setShowDocumentCreator(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout onCreateDocument={() => setShowDocumentCreator(true)}>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your documents today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Documents</CardTitle>
                <Link href="/documents">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <CardDescription>Your latest document activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-4">No documents yet</p>
                  <Button onClick={() => setShowDocumentCreator(true)} size="sm">
                    Create Your First Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.type.toUpperCase()}</p>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Pending Actions
              </CardTitle>
              <CardDescription>Documents awaiting your review</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">All caught up!</p>
                  <p className="text-sm text-gray-400 mt-1">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="text-sm text-gray-600">Assigned for review</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4" 
                onClick={() => setShowDocumentCreator(true)}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-medium">New Document</span>
                  </div>
                  <span className="text-xs text-gray-500">Create Word, Excel, or PowerPoint</span>
                </div>
              </Button>
              
              <Link href="/documents">
                <Button variant="outline" className="justify-start h-auto py-4 w-full">
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center mb-1">
                      <Activity className="h-4 w-4 mr-2" />
                      <span className="font-medium">My Documents</span>
                    </div>
                    <span className="text-xs text-gray-500">View and manage all files</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/workflow">
                <Button variant="outline" className="justify-start h-auto py-4 w-full">
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center mb-1">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-medium">Workflows</span>
                    </div>
                    <span className="text-xs text-gray-500">Manage approval processes</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
