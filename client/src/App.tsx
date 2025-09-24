import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import NotificationToast from "@/components/NotificationToast";
import Dashboard from "@/pages/Dashboard";
import CreateDocument from "@/pages/CreateDocument";
import DocumentEditor from "@/pages/DocumentEditor";
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
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
