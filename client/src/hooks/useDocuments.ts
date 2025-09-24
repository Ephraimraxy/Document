import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type { Document } from "@shared/schema";

export function useDocuments() {
  const { user, userProfile } = useAuth();

  const sentDocumentsQuery = useQuery<Document[]>({
    queryKey: ["/api/documents", "sent", user?.uid],
    enabled: !!user?.uid,
  });

  const receivedDocumentsQuery = useQuery<Document[]>({
    queryKey: ["/api/documents", "received", userProfile?.departmentId],
    enabled: !!userProfile?.departmentId,
  });

  return {
    sentDocuments: sentDocumentsQuery.data,
    receivedDocuments: receivedDocumentsQuery.data,
    isLoading: sentDocumentsQuery.isLoading || receivedDocumentsQuery.isLoading,
    error: sentDocumentsQuery.error || receivedDocumentsQuery.error,
  };
}
