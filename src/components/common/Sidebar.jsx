import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Sparkles,
  AlertTriangle,
  Workflow,
  Settings,
  User,
  TrendingDown,
  X,
  LogOut,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const { logout } = useAuth();

  const [pendingOppsCount, setPendingOppsCount] = useState(() => {
    try {
      const optimized = JSON.parse(localStorage.getItem('costiq_optimized_opps') || '[]');
      return Math.max(0, 7 - optimized.length);
    } catch (e) {
      return 7;
    }
  });

  const [activeAnomaliesCount, setActiveAnomaliesCount] = useState(() => {
    try {
      const resolved = JSON.parse(localStorage.getItem('costiq_resolved_anomalies') || '[]');
      return Math.max(0, 6 - resolved.length);
    } catch (e) {
      return 6;
    }
  });

  useEffect(() => {
    const updateOppsCount = () => {
      try {
        const optimized = JSON.parse(localStorage.getItem('costiq_optimized_opps') || '[]');
        setPendingOppsCount(Math.max(0, 7 - optimized.length));
      } catch (e) {
        setPendingOppsCount(7);
      }
    };

    const updateAnomaliesCount = () => {
      try {
        const resolved = JSON.parse(localStorage.getItem('costiq_resolved_anomalies') || '[]');
        setActiveAnomaliesCount(Math.max(0, 6 - resolved.length));
      } catch (e) {
        setActiveAnomaliesCount(6);
      }
    };

    window.addEventListener('costiq_opportunities_updated', updateOppsCount);
    window.addEventListener('costiq_anomalies_updated', updateAnomaliesCount);
    window.addEventListener('storage', updateOppsCount);
    window.addEventListener('storage', updateAnomaliesCount);

    return () => {
      window.removeEventListener('costiq_opportunities_updated', updateOppsCount);
      window.removeEventListener('costiq_anomalies_updated', updateAnomaliesCount);
      window.removeEventListener('storage', updateOppsCount);
      window.removeEventListener('storage', updateAnomaliesCount);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: Sparkles,
      badge: String(pendingOppsCount),
      badgeColor: pendingOppsCount === 0
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'anomalies',
      label: 'Anomalies',
      icon: AlertTriangle,
      badge: String(activeAnomaliesCount),
      badgeColor: activeAnomaliesCount === 0
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200'
    },
    { id: 'analysis', label: 'Analysis', icon: Workflow },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Clean, Crisp & Modern */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-[#0B1320] text-slate-900 dark:text-white
        border-r border-slate-200/90 dark:border-slate-800
        flex flex-col justify-between shadow-lg lg:shadow-none
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Logo Section */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                    Cost<span className="text-blue-600 dark:text-blue-400">IQ</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/40">
                    AI
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-sans tracking-wider uppercase font-semibold">
                  Cost Optimization
                </span>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 pt-2 pb-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Core Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
                    transition-all duration-150 group
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2.5">
                    {isActive ? (
                      <span className="w-1 h-3.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    ) : (
                      <span className="w-1 h-3.5 opacity-0" />
                    )}
                    <Icon className={`w-4 h-4 transition-colors ${isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200'
                      }`} />
                    <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`
                      text-[11px] font-sans font-bold px-2 py-0.5 rounded-full border
                      ${item.badgeColor || (isActive ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-600 border-slate-200')}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Configuration & Telemetry Section */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <div className="px-3 pt-1 pb-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Configuration
          </div>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold
                  transition-all duration-150
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                  }
                `}
              >
                {isActive ? (
                  <span className="w-1 h-3.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                ) : (
                  <span className="w-1 h-3.5 opacity-0" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
              </button>
            );
          })}

          {/* Sign Out Button */}
          {logout && (
            <button
              onClick={logout}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-150 mt-1"
            >
              <span className="w-1 h-3.5 opacity-0" />
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              <span>Sign Out</span>
            </button>
          )}

          {/* Connected System Status - Clean Card */}
          <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900/50 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  System Status
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-200">
                Live
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
              PostgreSQL • Host Telemetry Stream
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
