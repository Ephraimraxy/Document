import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  FileText, 
  Table, 
  Presentation, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Edit
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { format } from 'date-fns';
import { DocumentCreator } from '../components/documents/DocumentCreator';

export default function Documents() {
  const { user, documents } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDocumentCreator, setShowDocumentCreator] = useState(false);

  const myDocuments = documents.filter(doc => doc.createdBy === user?.id);

  const filteredDocuments = myDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'docx': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'xlsx': return <Table className="h-5 w-5 text-green-600" />;
      case 'pptx': return <Presentation className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    const icons = {
      draft: <Edit className="h-3 w-3" />,
      review: <Clock className="h-3 w-3" />,
      approved: <CheckCircle className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles]} flex items-center gap-1`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleDocumentCreated = () => {
    setShowDocumentCreator(false);
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
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-documents"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32" data-testid="select-status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No documents found</p>
                <p className="text-sm mt-1">Create your first document to get started</p>
                <Button 
                  onClick={() => setShowDocumentCreator(true)} 
                  className="mt-4"
                  data-testid="button-create-first-document"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow" data-testid={`card-document-${doc.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate" data-testid={`text-document-title-${doc.id}`}>
                          {doc.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Created {format(new Date(doc.createdAt), 'MMM d, yyyy')} • 
                          Updated {format(new Date(doc.updatedAt), 'MMM d, yyyy')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(doc.status)}
                          <Badge variant="outline" className="text-xs">
                            {doc.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(`/legacy?type=${doc.type}&title=${encodeURIComponent(doc.title)}`, '_blank')}
                        data-testid={`button-edit-${doc.id}`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
