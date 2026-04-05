import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { AuthForm } from './components/AuthForm';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Appliances } from './pages/Appliances';
import { Weather } from './pages/Weather';
import { PeakHours } from './pages/PeakHours';
import { Family } from './pages/Family';
import { Settings } from './pages/Settings';

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useSettings(user?.id);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060d1f] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={signIn} onSignUp={signUp} />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const renderPage = () => {
    if (settingsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading...</div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userId={user.id} settings={settings} />;
      case 'appliances':
        return <Appliances userId={user.id} settings={settings} />;
      case 'weather':
        return <Weather userId={user.id} settings={settings} />;
      case 'peak-hours':
        return <PeakHours settings={settings} />;
      case 'family':
        return <Family userId={user.id} settings={settings} />;
      case 'settings':
        return <Settings settings={settings} onUpdate={updateSettings} />;
      default:
        return <Dashboard userId={user.id} settings={settings} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1f]">
      <div className="hidden md:block">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onSignOut={handleSignOut}
        />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a1628] border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-white">BillSense</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0">
            <Sidebar
              currentPage={currentPage}
              onNavigate={(page) => {
                setCurrentPage(page);
                setSidebarOpen(false);
              }}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      )}

      <div className="md:ml-64 p-6 pt-20 md:pt-6">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
