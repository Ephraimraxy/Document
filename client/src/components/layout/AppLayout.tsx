import { ReactNode } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  FileText, 
  Workflow, 
  BarChart3, 
  Bell, 
  LogOut, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  onCreateDocument?: () => void;
}

export const AppLayout = ({ children, onCreateDocument }: AppLayoutProps) => {
  const { user, logout, notifications } = useUser();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return <>{children}</>;

  const unreadNotifications = notifications.filter(notif => !notif.read);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'My Documents' },
    { path: '/workflow', icon: Workflow, label: 'Workflows' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  // Filter nav items based on role
  const filteredNavItems = navItems.filter(item => {
    if (item.path === '/analytics' && user.role === 'creator') return false;
    return true;
  });

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuEdit</h1>
                <p className="text-xs text-gray-500">Document Workflow</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {filteredNavItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`flex items-center ${
                  sidebarOpen ? 'px-3' : 'px-2 justify-center'
                } py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </a>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.department}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-center"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {location === '/' && 'Dashboard'}
                {location === '/documents' && 'My Documents'}
                {location === '/workflow' && 'Workflow Management'}
                {location === '/analytics' && 'Analytics & Reports'}
              </h2>
              {user.role === 'admin' && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  Admin
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {onCreateDocument && (
                <Button 
                  onClick={onCreateDocument}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="button-create-document"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Document
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
