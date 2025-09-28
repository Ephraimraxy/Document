import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import NotificationToast from "@/components/NotificationToast";
import Dashboard from "@/pages/Dashboard";
import CreateDocument from "@/pages/CreateDocument";
import DocumentEditor from "@/pages/DocumentEditor";
import MyDocuments from "@/pages/MyDocuments";
import ReceivedDocuments from "@/pages/ReceivedDocuments";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/not-found";
import { useNotifications } from "@/hooks/useNotifications";

function AppContent() {
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar unreadCount={unreadCount} />
      <NotificationToast />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/create" component={CreateDocument} />
        <Route path="/documents" component={MyDocuments} />
        <Route path="/received" component={ReceivedDocuments} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/edit/:id" component={DocumentEditor} />
        <Route path="/view/:id" component={DocumentEditor} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function Router() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
