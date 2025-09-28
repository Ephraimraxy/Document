import { useDocuments } from "@/hooks/useDocuments";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import DocumentCard from "@/components/DocumentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function MyDocuments() {
  const { sentDocuments, isLoading } = useDocuments();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { sidebarWidth } = useSidebar();

  const filteredDocuments = sentDocuments?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          title="My Documents" 
          subtitle="Documents you've created and shared" 
        />
        <div className="p-6">
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
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
        title="My Documents" 
        subtitle="Documents you've created and shared" 
      />
      
      <main className="p-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-documents"
            />
          </div>
          <Button onClick={() => setLocation("/create")} data-testid="button-create-document">
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onEdit={handleEditDocument}
                onView={handleViewDocument}
                data-testid={`document-${document.id}`}
              />
            ))
          ) : (
            <Card data-testid="no-documents-message">
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {searchTerm ? "No documents match your search." : "No documents created yet."}
                </div>
                {!searchTerm && (
                  <Button 
                    className="mt-4" 
                    onClick={() => setLocation("/create")}
                    data-testid="button-create-first-document"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Document
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}