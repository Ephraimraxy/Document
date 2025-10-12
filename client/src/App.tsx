import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "./contexts/UserContext";
import { WorkflowProvider } from "./contexts/WorkflowContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Dashboard } from "./components/dashboard/Dashboard";
import { WorkflowManagement } from "./components/workflow/WorkflowManagement";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  const { user } = useUser();

  return (
    <Switch>
      <Route path="/" component={user ? Dashboard : LoginForm} />
      <Route path="/workflow" component={user ? WorkflowManagement : LoginForm} />
      <Route path="/analytics" component={user ? AnalyticsDashboard : LoginForm} />
      <Route path="/legacy" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <WorkflowProvider>
            <AnalyticsProvider>
              <Toaster />
              <Router />
            </AnalyticsProvider>
          </WorkflowProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
