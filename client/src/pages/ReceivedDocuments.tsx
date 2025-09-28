import { useDocuments } from "@/hooks/useDocuments";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import DocumentCard from "@/components/DocumentCard";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Inbox } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function ReceivedDocuments() {
  const { receivedDocuments, isLoading } = useDocuments();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { sidebarWidth } = useSidebar();

  const filteredDocuments = receivedDocuments?.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewDocument = (documentId: string) => {
    setLocation(`/view/${documentId}`);
  };

  if (isLoading) {
    return (
      <div className={`${sidebarWidth} min-h-screen transition-all duration-300`}>
        <Header 
          title="Received Documents" 
          subtitle="Documents sent to your department" 
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
        title="Received Documents" 
        subtitle="Documents sent to your department" 
      />
      
      <main className="p-6">
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search received documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-received"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                showSender={true}
                onView={handleViewDocument}
                data-testid={`received-document-${document.id}`}
              />
            ))
          ) : (
            <Card data-testid="no-received-documents">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                  <div className="text-muted-foreground">
                    {searchTerm ? "No documents match your search." : "No documents received yet."}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Documents sent to your department will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}