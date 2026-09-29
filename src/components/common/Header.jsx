import React, { useState } from 'react';
import { RefreshCw, Menu, Clock, Sun, Moon, Database, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({
  title,
  subtitle,
  onRefresh,
  setIsSidebarOpen,
  theme = 'light',
  setTheme
}) => {
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('10 seconds ago');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated('Just now');
    }, 600);
  };

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'IQ';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B1320]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Left Title & Subtitle */}
        <div className="flex items-start space-x-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm mt-0.5"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {title || "Cost Intelligence"}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60">
                Live Overview
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl font-normal">
              {subtitle || "Understand your cloud and AI spending and identify opportunities to reduce unnecessary costs."}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {/* Live Telemetry subtle status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-500 dark:text-slate-400">Analysis updated:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{lastUpdated}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>

          {/* Theme Toggle Button */}
          {setTheme && (
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 shadow-sm transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-navy-900 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm ring-2 ring-blue-100 dark:ring-blue-900/50">
                {userInitials}
              </div>
              <div className="hidden xl:block text-left">
                <span className="block text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                  {user?.name || "Admin User"}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  {user?.role || "FinOps Lead"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">{user?.name || "Admin"}</span>
                  <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{user?.email || "admin@costiq.io"}</span>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    {user?.role || "Lead Architect"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (logout) logout();
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;

