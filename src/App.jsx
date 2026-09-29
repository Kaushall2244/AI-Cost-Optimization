import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';

import DashboardPage from './pages/DashboardPage';
import CostsPage from './pages/CostsPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import AnomaliesPage from './pages/AnomaliesPage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function MainLayout() {
  const { isAuthenticated, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('costiq_theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('costiq_theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('costiq_theme', 'light'); } catch (e) {}
    }
  }, [theme]);

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1);
  };

  // If auth is still checking storage
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading CostIQ...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, display executive Login Page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const getPageDetails = () => {
    switch (activePage) {
      case 'dashboard':
        return {
          title: "Cost Intelligence",
          subtitle: "Understand your cloud and AI spending and identify opportunities to reduce unnecessary costs."
        };
      case 'costs':
        return {
          title: "Cloud & AI Cost Analysis",
          subtitle: "Analyze expenditure trends, service distributions, and top infrastructure costs across providers."
        };
      case 'opportunities':
        return {
          title: "Optimization Opportunities",
          subtitle: "Actionable recommendations with evidence metrics, mathematical proofs, and AI explanations."
        };
      case 'anomalies':
        return {
          title: "Cost Anomalies",
          subtitle: "Detected statistical billing spikes and unusual infrastructure spending behavior."
        };
      case 'analysis':
        return {
          title: "System Architecture & Analysis",
          subtitle: "Transparent workflow detailing telemetry ingestion, deterministic Python math, and Gemini AI narrative."
        };
      case 'settings':
        return {
          title: "Settings",
          subtitle: "System thresholds, REST API integration, and currency preferences."
        };
      case 'profile':
        return {
          title: "User Profile",
          subtitle: "Admin account, role permissions, and access credentials."
        };
      default:
        return {
          title: "Cost Intelligence",
          subtitle: "Understand your cloud and AI spending and identify opportunities to reduce unnecessary costs."
        };
    }
  };

  const pageDetails = getPageDetails();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key={refreshKey} />;
      case 'costs':
        return <CostsPage key={refreshKey} />;
      case 'opportunities':
        return <OpportunitiesPage key={refreshKey} />;
      case 'anomalies':
        return <AnomaliesPage key={refreshKey} />;
      case 'analysis':
        return <AnalysisPage key={refreshKey} />;
      case 'settings':
        return <SettingsPage key={refreshKey} />;
      case 'profile':
        return <ProfilePage key={refreshKey} />;
      default:
        return <DashboardPage key={refreshKey} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8FAFC] dark:bg-[#070D18] transition-colors duration-200">
        <Header
          title={pageDetails.title}
          subtitle={pageDetails.subtitle}
          onRefresh={handleRefresh}
          setIsSidebarOpen={setIsSidebarOpen}
          theme={theme}
          setTheme={setTheme}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
