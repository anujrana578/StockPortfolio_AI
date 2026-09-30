import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  RefreshCw, 
  Wallet, 
  LogOut, 
  Database 
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeTab: string;
  totalPortfolioValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  onSearchSelect?: (symbol: string) => void;
  onNavigateToProfile?: () => void;
  onOpenDatabase?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeTab,
  totalPortfolioValue,
  onSearchSelect,
  onNavigateToProfile,
  onOpenDatabase,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchableStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 218.27, change: '+1.59%' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 391.26, change: '+1.24%' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 960.29, change: '+1.53%' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 563.98, change: '+0.50%' },
    { symbol: 'DE', name: 'Deere & Company', price: 472.43, change: '+1.09%' },
    { symbol: 'LMT', name: 'Lockheed Martin', price: 439.70, change: '-0.27%' },
  ];

  const filteredStocks = searchableStocks.filter(
    s => s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Overview';
      case 'portfolio': return 'Holdings & Allocation';
      case 'predictor': return 'AI Price Forecaster';
      case 'watchlist': return 'Watchlist';
      case 'market': return 'Global Markets';
      case 'profile': return 'Investor Profile';
      case 'settings': return 'Settings';
      default: return 'FinSight Hub';
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#000000] border-b border-[rgba(255,255,255,0.08)] px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] border border-transparent cursor-pointer"
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Toggle navigation</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Logged in as <strong className="text-white">arpit</strong> (Arpit Sharma)
            </p>
          </div>
        </div>

        {/* Center / Search bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#A1A1A1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ticker or asset..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowQuickSearch(true);
              }}
              onFocus={() => setShowQuickSearch(true)}
              onBlur={() => setTimeout(() => setShowQuickSearch(false), 250)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-[13px] text-[#F5F5F5] placeholder-[#777777] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
            />
          </div>

          {showQuickSearch && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                Tickers Matching "{searchQuery}"
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-900">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      onClick={() => {
                        if (onSearchSelect) onSearchSelect(stock.symbol);
                        setShowQuickSearch(false);
                        setSearchQuery('');
                      }}
                      className="px-3 py-2.5 hover:bg-neutral-900 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {stock.symbol}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {stock.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-neutral-200">${stock.price.toFixed(2)}</div>
                        <div className="text-xs text-neutral-400 font-mono">
                          {stock.change}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-400">
                    No matching stocks found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {onOpenDatabase && (
            <button
              onClick={onOpenDatabase}
              className="px-2 py-1.5 rounded-[6px] text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] text-[13px] font-medium flex items-center gap-1.5 transition-all cursor-pointer border border-transparent"
              title="Inspect SQL Database Tables"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SQL DB</span>
            </button>
          )}




          <div className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.08)]">
            <button
              onClick={onNavigateToProfile}
              title="Open Investor Profile"
              className="w-7 h-7 rounded-full bg-[#F5F5F5] text-[#000000] flex items-center justify-center font-bold text-[11px] cursor-pointer"
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
