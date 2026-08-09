import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Building2,
  Users,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Notification } from '../../types';
import { api } from '../../services/api';

interface HeaderProps {
  onNavigate: (route: string) => void;
  activeRoute: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeRoute }) => {
  const { currentUser, role, switchRole, login, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    leads: any[];
    companies: any[];
    contacts: any[];
    campaigns: any[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Load notifications
  useEffect(() => {
    api.getNotifications()
      .then(setNotifications)
      .catch(() => {});
  }, []);

  // Global search handler with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      api.globalSearch(searchQuery)
        .then((data) => {
          setSearchResults(data);
          setShowSearchDropdown(true);
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    api.markAllNotificationsRead().then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-3 flex items-center justify-between text-slate-100 shadow-xl">
      {/* BRAND & LOGO */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-amber-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-extrabold text-blue-400 text-sm tracking-wider">
              007
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 font-bold tracking-wider text-base text-slate-100">
              HELLO WORLD <span className="text-blue-400">007</span>
            </div>
            <p className="text-[10px] text-amber-400/90 font-medium tracking-widest uppercase">
              Find. Qualify. Convert.
            </p>
          </div>
        </button>

        {/* DEMO ROLE SWITCHER PILLS */}
        <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-[10px] uppercase font-semibold text-slate-400 px-2 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Role:
          </span>
          {(['SUPER ADMIN', 'ADMIN', 'AGENT'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                role === r
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* GLOBAL SEARCH BAR */}
      <div className="relative flex-1 max-w-md mx-4" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, companies, contacts, campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
            className="w-full bg-slate-900/90 text-sm text-slate-100 pl-10 pr-8 py-2 rounded-xl border border-slate-800/80 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 placeholder:text-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* SEARCH DROPDOWN */}
        {showSearchDropdown && searchResults && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-slate-400 text-xs">Searching database...</div>
            ) : (
              <div className="divide-y divide-slate-800/60 p-2">
                {/* Leads */}
                {searchResults.leads.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                      <Target className="w-3 h-3" /> Leads ({searchResults.leads.length})
                    </div>
                    {searchResults.leads.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          onNavigate(`/leads/${l.id}`);
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-blue-400">
                            {l.contactName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {l.companyName} • {l.jobTitle}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50">
                          {l.leadId}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Companies */}
                {searchResults.companies.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> Companies ({searchResults.companies.length})
                    </div>
                    {searchResults.companies.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onNavigate('/companies');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                            {c.companyName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {c.industry} • {c.country}
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{c.employees} emp</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Contacts */}
                {searchResults.contacts.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                      <Users className="w-3 h-3" /> Contacts ({searchResults.contacts.length})
                    </div>
                    {searchResults.contacts.map((cnt) => (
                      <button
                        key={cnt.id}
                        onClick={() => {
                          onNavigate('/contacts');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800/70 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-400">
                            {cnt.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {cnt.email} • {cnt.companyName}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.leads.length === 0 &&
                  searchResults.companies.length === 0 &&
                  searchResults.contacts.length === 0 &&
                  searchResults.campaigns.length === 0 && (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No matching records found for "{searchQuery}".
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT CONTROLS: NOTIFICATIONS & USER PROFILE */}
      <div className="flex items-center gap-3">
        {/* NOTIFICATIONS POPOVER */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 border-2 border-slate-950 rounded-full text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-slate-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-blue-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link) onNavigate(n.link);
                        setShowNotifications(false);
                      }}
                      className={`p-3 cursor-pointer transition-colors flex items-start gap-3 hover:bg-slate-800/60 ${
                        !n.isRead ? 'bg-slate-900/80' : 'opacity-75'
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'NEW_LEAD' && <Sparkles className="w-4 h-4 text-amber-400" />}
                        {n.type === 'FOLLOWUP_DUE' && <Clock className="w-4 h-4 text-blue-400" />}
                        {n.type === 'OVERDUE' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                        {n.type === 'CAMPAIGN_UPDATE' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {n.type === 'ASSIGNED_LEAD' && <Target className="w-4 h-4 text-cyan-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-200">{n.title}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <span className="text-[9px] text-slate-500 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* SETTINGS BUTTON */}
        <button
          onClick={() => onNavigate('/settings')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Admin Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* USER PROFILE DROPDOWN */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 transition-colors"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="User Avatar"
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/50"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200 leading-tight">{currentUser?.name || 'James Bond'}</div>
              <div className="text-[10px] text-blue-400 font-semibold leading-none">{role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-800/80">
              <div className="p-3">
                <div className="text-xs font-bold text-slate-100">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-950 text-blue-300 border border-blue-800/60">
                  {role} PERMISSIONS
                </div>
              </div>

              <div className="py-2 px-1 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 px-2 tracking-wider">
                  Switch Account Persona
                </div>
                <button
                  onClick={() => {
                    login('crdbixx@helloworld007.io', 'playbeat123', 'SUPER ADMIN');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded text-[11px] font-bold text-amber-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  👑 crdbixx (Super Admin)
                </button>
                <button
                  onClick={() => {
                    login('james.bond@helloworld007.io', 'playbeat123', 'SUPER ADMIN');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded text-[11px] font-bold text-amber-300 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  🕵️ James Bond (Super Admin)
                </button>
                <button
                  onClick={() => {
                    login('creed.bixby@helloworld007.io', 'playbeat123', 'ADMIN');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded text-[11px] font-bold text-blue-400 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  👔 Creed Bixby (Admin)
                </button>
                <button
                  onClick={() => {
                    login('a.mercer@helloworld.io', 'playbeat123', 'AGENT');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded text-[11px] font-bold text-slate-300 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  💼 Alex Mercer (Agent)
                </button>
                <button
                  onClick={() => {
                    login('ai.concierge@helloworld007.io', 'playbeat123', 'AI GREETER');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1 rounded text-[11px] font-bold text-purple-300 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  🤖 AI Concierge (Greeter Bot)
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('/users');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-blue-400" /> User Profile & Team
                </button>
                <button
                  onClick={() => {
                    onNavigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" /> System Settings
                </button>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    logout();
                    onNavigate('/login');
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
