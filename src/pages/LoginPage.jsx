import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingDown, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2,
  Zap,
  Server
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register, quickLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('admin@costiq.io');
  const [password, setPassword] = useState('costiq123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('FinOps Lead');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password, role);
        if (!res.success) {
          setError(res.error || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (type) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(type);
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -left-24 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <TrendingDown className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Cost<span className="text-blue-600">IQ</span>
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Cloud + AI Cost Intelligence
        </h1>
        <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
          Cloud & AI Cost Optimization Platform
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-900/5 sm:rounded-3xl border border-slate-200">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2.5 text-red-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@costiq.io"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Organizational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
                >
                  <option value="Lead FinOps Architect">Lead FinOps Architect</option>
                  <option value="Cloud Infrastructure Engineer">Cloud Infrastructure Engineer</option>
                  <option value="DevOps & SRE Lead">DevOps & SRE Lead</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="Finance Director">Finance Director</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all duration-150 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Secure Account' : 'Authenticate with JWT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
              ⚡ 1-Click Demo Profiles
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-all group"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    A
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-700">
                    FinOps Lead
                  </span>
                </div>
                <span className="block text-[11px] font-medium text-slate-500">
                  admin@costiq.io
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('engineer')}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all group"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    E
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-700">
                    Cloud Engineer
                  </span>
                </div>
                <span className="block text-[11px] font-medium text-slate-500">
                  engineer@costiq.io
                </span>
              </button>
            </div>

            <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-600">
                Default password: <strong className="text-slate-900 font-bold">costiq123</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Security / Compliance Badges */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Authentication</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Verified Database</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
