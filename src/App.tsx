import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadsListView } from './components/leads/LeadsListView';
import { LeadGeneratorView } from './components/leads/LeadGeneratorView';
import { LeadDetailView } from './components/leads/LeadDetailView';
import { CompaniesView } from './components/companies/CompaniesView';
import { ContactsView } from './components/contacts/ContactsView';
import { CampaignsView } from './components/campaigns/CampaignsView';
import { FollowUpsView } from './components/followups/FollowUpsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ImportView } from './components/import/ImportView';
import { ExportView } from './components/export/ExportView';
import { TemplatesView } from './components/templates/TemplatesView';
import { UsersView } from './components/users/UsersView';
import { SettingsView } from './components/settings/SettingsView';
import { AddLeadModal } from './components/modals/AddLeadModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('/dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleNavigate = (route: string) => {
    if (route && route.startsWith('/leads/')) {
      const id = route.replace('/leads/', '');
      setSelectedLeadId(id);
      setCurrentRoute('/lead-detail');
    } else {
      setCurrentRoute(route || '/dashboard');
    }
  };

  const handleLeadCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* GLOBAL HEADER */}
      <Header
        onNavigate={handleNavigate}
        onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
      />

      <div className="flex flex-1 pt-16">
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          activeRoute={currentRoute}
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
        />

        {/* MAIN ROUTE CONTENT CANVAS */}
        <main className="flex-1 lg:pl-64 min-w-0 transition-all duration-300">
          {currentRoute === '/dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
            />
          )}

          {currentRoute === '/generator' && (
            <LeadGeneratorView
              onNavigate={handleNavigate}
              onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
            />
          )}

          {currentRoute === '/leads' && (
            <LeadsListView
              key={refreshTrigger}
              onNavigate={handleNavigate}
              onOpenAddLeadModal={() => setIsAddLeadModalOpen(true)}
            />
          )}

          {currentRoute === '/lead-detail' && selectedLeadId && (
            <LeadDetailView
              leadId={selectedLeadId}
              onBack={() => setCurrentRoute('/leads')}
              onNavigate={handleNavigate}
            />
          )}

          {currentRoute === '/companies' && (
            <CompaniesView onNavigate={handleNavigate} />
          )}

          {currentRoute === '/contacts' && (
            <ContactsView />
          )}

          {currentRoute === '/campaigns' && (
            <CampaignsView />
          )}

          {currentRoute === '/followups' && (
            <FollowUpsView onNavigate={handleNavigate} />
          )}

          {currentRoute === '/analytics' && (
            <AnalyticsView />
          )}

          {currentRoute === '/import' && (
            <ImportView onNavigate={handleNavigate} />
          )}

          {currentRoute === '/export' && (
            <ExportView />
          )}

          {currentRoute === '/templates' && (
            <TemplatesView />
          )}

          {currentRoute === '/users' && (
            <UsersView />
          )}

          {currentRoute === '/settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* ADD LEAD GLOBAL MODAL */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSuccess={handleLeadCreated}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
