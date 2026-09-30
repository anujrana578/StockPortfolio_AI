import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PredictorPage } from './pages/PredictorPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { MarketPage } from './pages/MarketPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { DatabaseViewerModal } from './components/DatabaseViewerModal';
import { 
  mockHoldings as initialHoldings, 
  mockTransactions as initialTransactions, 
  mockPerformanceHistory, 
  mockWatchlist as initialWatchlist 
} from './data/mockData';
import { Holding, WatchlistItem, Transaction } from './types';
import { 
  getCurrentUserFromFlask, 
  logoutWithFlask, 
  fetchHoldingsFromFlask 
} from './utils/apiClient';

export function App() {
  const [currentUserProfile, setCurrentUserProfile] = useState<{ id?: string; name: string; email: string; auth_provider?: string }>(() => {
    try {
      const savedAuth = localStorage.getItem('finsight_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        return {
          id: parsed.id || 'usr_1',
          name: parsed.name || parsed.user || 'Arpit Sharma',
          email: parsed.email || 'arpit.finquant@finsight.io',
          auth_provider: parsed.auth_provider || 'local'
        };
      }
    } catch (e) {
      console.error(e);
    }
    return { name: 'Arpit Sharma', email: 'arpit.finquant@finsight.io', auth_provider: 'local' };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = localStorage.getItem('finsight_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        return parsed.authenticated === true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const [activeTab, setActiveTab] = useState<string>('predictor');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(initialWatchlist);
  const [selectedStockForPredictor, setSelectedStockForPredictor] = useState<string>('AAPL');

  // Verify backend session on mount
  useEffect(() => {
    async function verifySession() {
      const backendUser = await getCurrentUserFromFlask();
      if (backendUser && backendUser.authenticated) {
        setCurrentUserProfile({
          id: backendUser.user.id,
          name: backendUser.user.username,
          email: backendUser.user.email,
          auth_provider: backendUser.user.auth_provider
        });
        setIsAuthenticated(true);
      }
    }
    if (isAuthenticated) {
      verifySession();
    }
  }, []);

  // Compute live portfolio NAV
  const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const dailyChange = holdings.reduce((sum, h) => sum + (h.dailyChange * h.shares), 0);
  const dailyChangePercent = (dailyChange / (totalPortfolioValue - dailyChange)) * 100;

  const handleLoginSuccess = (profile?: { id?: string; name: string; email: string; auth_provider?: string }) => {
    if (profile) {
      setCurrentUserProfile(profile);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logoutWithFlask();
    localStorage.removeItem('finsight_auth');
    setIsAuthenticated(false);
  };

  const handleNavigateToPredictor = (symbol: string) => {
    setSelectedStockForPredictor(symbol);
    setActiveTab('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter((item) => item.id !== id));
  };

  const handleAddToWatchlist = (item: WatchlistItem) => {
    setWatchlist([item, ...watchlist]);
  };

  const handleAddHolding = (holding: Holding) => {
    setHoldings(prev => {
      const exists = prev.find(h => h.symbol === holding.symbol);
      if (exists) {
        return prev.map(h => h.symbol === holding.symbol ? { ...h, ...holding } : h);
      } else {
        return [holding, ...prev];
      }
    });
  };

  // Protected Route Check: If not authenticated, render Login/Register UI
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex font-sans selection:bg-white selection:text-black">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        onLogout={handleLogout}
        portfolioCount={holdings.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 bg-black">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeTab={activeTab}
          totalPortfolioValue={totalPortfolioValue}
          dailyChange={dailyChange}
          dailyChangePercent={dailyChangePercent}
          onSearchSelect={(sym) => handleNavigateToPredictor(sym)}
          onNavigateToProfile={() => setActiveTab('profile')}
          onOpenDatabase={() => setIsDbModalOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'predictor' && (
            <PredictorPage
              selectedStockSymbol={selectedStockForPredictor}
              onSelectStock={setSelectedStockForPredictor}
              onAddHolding={handleAddHolding}
              onAddToWatchlist={handleAddToWatchlist}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistPage
              watchlist={watchlist}
              onNavigateToPredictor={handleNavigateToPredictor}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onAddToWatchlist={handleAddToWatchlist}
            />
          )}

          {activeTab === 'market' && (
            <MarketPage
              onNavigateToPredictor={handleNavigateToPredictor}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              totalPortfolioValue={totalPortfolioValue}
              userProfile={currentUserProfile}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      <DatabaseViewerModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </div>
  );
}

export default App;
