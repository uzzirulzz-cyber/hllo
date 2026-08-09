import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Sparkles,
  Building2,
  Users,
  Megaphone,
  CalendarCheck,
  BarChart3,
  FileSpreadsheet,
  Download,
  FileCode2,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  activeRoute?: string;
  currentRoute?: string;
  onNavigate: (route: string) => void;
  onOpenAddLeadModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  currentRoute,
  onNavigate,
  onOpenAddLeadModal,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const routeToUse = activeRoute || currentRoute || '/dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { id: 'leads', label: 'Leads', icon: Target, route: '/leads', badge: '100+' },
    { id: 'generator', label: 'Lead Generator', icon: Sparkles, route: '/generator', isHot: true },
    { id: 'companies', label: 'Companies', icon: Building2, route: '/companies' },
    { id: 'contacts', label: 'Contacts', icon: Users, route: '/contacts' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, route: '/campaigns' },
    { id: 'followups', label: 'Follow-ups', icon: CalendarCheck, route: '/followups', badgeAlert: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, route: '/analytics' },
    { id: 'import', label: 'Import Leads', icon: FileSpreadsheet, route: '/import' },
    { id: 'export', label: 'Export', icon: Download, route: '/export' },
    { id: 'templates', label: 'Templates', icon: FileCode2, route: '/templates' },
    { id: 'users', label: 'Users', icon: UserCheck, route: '/users' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
  ];

  return (
    <aside
      className={`relative bg-slate-950/90 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* TOGGLE COLLAPSE BUTTON */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-30 w-6 h-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg border border-slate-900 transition-transform"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* NAVIGATION ITEMS */}
      <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Enterprise Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = routeToUse === item.route || (item.route === '/leads' && (routeToUse || '').startsWith('/leads/'));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.route)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/80 text-white shadow-lg shadow-blue-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : item.isHot ? 'text-amber-400' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />

              {!collapsed && <span className="truncate">{item.label}</span>}

              {!collapsed && item.isHot && (
                <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-widest uppercase">
                  AI
                </span>
              )}

              {!collapsed && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {item.badge}
                </span>
              )}

              {item.badgeAlert && (
                <span className={`w-2 h-2 rounded-full bg-rose-500 animate-pulse ${collapsed ? 'absolute top-2 right-2' : 'ml-auto'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* QUICK ADD ACTION BUTTON AT BOTTOM */}
      <div className="p-3 border-t border-slate-900 bg-slate-950">
        <button
          onClick={onOpenAddLeadModal}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all ${
            collapsed ? 'p-2.5' : ''
          }`}
          title="Add Lead Manually"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          {!collapsed && <span>+ Add Lead</span>}
        </button>

        {!collapsed && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
              <span>Pipeline Goal</span>
              <span className="text-emerald-400 font-bold">78%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-[78%]" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
