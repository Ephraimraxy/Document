import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import DocumentCard from "@/components/DocumentCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Share } from "lucide-react";
import { useLocation } from "wouter";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { sentDocuments, receivedDocuments, isLoading } = useDocuments();
  const [, setLocation] = useLocation();
  const { sidebarWidth } = useSidebar();

  const stats = {
    totalDocuments: sentDocuments?.length || 0,
    pendingReviews: sentDocuments?.filter(doc => doc.status === "pending").length || 0,
    overdue: sentDocuments?.filter(doc => doc.status === "overdue").length || 0,
    shared: sentDocuments?.filter(doc => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(doc.createdAt!) > weekAgo;
    }).length || 0,
  };

  const handleEditDocument = (documentId: string) => {
    setLocation(`/edit/${documentId}`);
  };

  const handleViewDocument = (documentId: string) => {
    setLocation(`/view/${documentId}`);
  };

  if (isLoading) {
    return (
      <div className={`${sidebarWidth} min-h-screen transition-all duration-300`}>
        <Header 
          title="Dashboard" 
          subtitle="Overview of your documents and activities" 
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sidebarWidth} min-h-screen transition-all duration-300`}>
      <Header 
        title="Dashboard" 
        subtitle="Overview of your documents and activities" 
      />
      
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-total-documents">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.totalDocuments}
                  </p>
                  <p className="text-muted-foreground text-sm">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-pending-reviews">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="text-accent text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.pendingReviews}
                  </p>
                  <p className="text-muted-foreground text-sm">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-overdue">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="text-destructive text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.overdue}
                  </p>
                  <p className="text-muted-foreground text-sm">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-shared">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                  <Share className="text-secondary text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stats.shared}
                  </p>
                  <p className="text-muted-foreground text-sm">Shared This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documents Sent */}
          <Card>
            <CardHeader>
              <CardTitle>Documents Sent by Me</CardTitle>
              <CardDescription>Recent documents you've created and shared</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentDocuments && sentDocuments.length > 0 ? (
                  sentDocuments.slice(0, 3).map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onEdit={handleEditDocument}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No documents sent yet
                  </p>
                )}
              </div>
              {sentDocuments && sentDocuments.length > 3 && (
                <div className="mt-4">
                  <button 
                    className="w-full text-center text-primary hover:text-primary/80 text-sm font-medium py-2"
                    onClick={() => setLocation("/documents")}
                    data-testid="link-view-all-sent"
                  >
                    View All Sent Documents →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents Received */}
          <Card>
            <CardHeader>
              <CardTitle>Documents Received</CardTitle>
              <CardDescription>Documents sent to your department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receivedDocuments && receivedDocuments.length > 0 ? (
                  receivedDocuments.slice(0, 3).map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      showSender={true}
                      onView={handleViewDocument}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No documents received yet
                  </p>
                )}
              </div>
              {receivedDocuments && receivedDocuments.length > 3 && (
                <div className="mt-4">
                  <button 
                    className="w-full text-center text-primary hover:text-primary/80 text-sm font-medium py-2"
                    onClick={() => setLocation("/received")}
                    data-testid="link-view-all-received"
                  >
                    View All Received Documents →
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
