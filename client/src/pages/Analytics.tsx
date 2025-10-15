import { AppLayout } from '../components/layout/AppLayout';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <AnalyticsDashboard />
      </div>
    </AppLayout>
  );
}
