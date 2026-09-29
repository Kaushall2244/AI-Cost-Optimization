import React from 'react';
import { ShieldCheck, Mail, Building, Key, Award, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, logout } = useAuth();

  const userInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'IQ';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xl font-black text-white shadow-md shadow-blue-600/25 shrink-0 ring-4 ring-blue-50 dark:ring-blue-900/40">
            {userInitials}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {user?.name || "Admin User"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                Session Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.role || "Lead FinOps Architect"} • {user?.department || "FinOps & Cloud Governance"}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Full Financial Audit & Optimization Access</span>
              </span>
            </div>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all shadow-sm self-start sm:self-center"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Email Address</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {user?.email || "admin@costiq.io"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Department & Unit</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {user?.department || "FinOps & Cloud Governance"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Role Permissions</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {user?.role || "Lead FinOps Architect"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Key className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Connected Database</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            PostgreSQL Database (720 Records Active)
          </p>
        </div>
      </div>
    </div>
  );

};

export default ProfilePage;
