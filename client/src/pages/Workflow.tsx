import { AppLayout } from '../components/layout/AppLayout';
import { WorkflowManagement } from '../components/workflow/WorkflowManagement';

export default function WorkflowPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <WorkflowManagement />
      </div>
    </AppLayout>
  );
}
