import React from 'react';
import { 
  LayoutDashboard, 
  PieChart, 
  Sparkles, 
  Bookmark, 
  TrendingUp, 
  Settings,
  User,
  ShieldCheck,
  Zap,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  portfolioCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  onLogout,
  portfolioCount
}) => {
  const menuItems = [
    { id: 'predictor', label: 'AI Predictor', icon: Sparkles, badge: 'AI' },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: '7' },
    { id: 'market', label: 'Market Overview', icon: TrendingUp, badge: 'LIVE' },
    { id: 'profile', label: 'Investor Profile', icon: User, badge: 'ID' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0A0A0A]
        border-r border-[rgba(255,255,255,0.08)] flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-3">
              <div>
                <span className="font-semibold text-[17px] tracking-tight text-[#F5F5F5]">
                  FinSight
                </span>
                <span className="block text-[11px] text-[#A1A1A1]">
                  Portfolio & AI
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-6">
            <p className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Menu
            </p>
            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[14px] transition-all duration-200 group cursor-pointer
                      ${isActive 
                        ? 'bg-[rgba(255,255,255,0.05)] text-[#F5F5F5]' 
                        : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.03)] border border-transparent'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-[16px] h-[16px] ${isActive ? 'text-[#F5F5F5]' : 'text-[#A1A1A1] group-hover:text-[#F5F5F5]'} transition-colors`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`
                        text-[10px] px-1.5 py-0.5 rounded-[4px]
                        ${isActive ? 'text-[#F5F5F5]' : 'text-[#6F6F6F]'}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Status & Logout */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.08)]">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col justify-center">
              <p className="text-[13px] font-medium text-[#F5F5F5] leading-none">Arpit Sharma</p>
              <p className="text-[11px] text-[#6F6F6F] mt-1">Verified Manager</p>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 mt-2 text-[#A1A1A1] hover:text-[#EF4444] transition-colors text-[12px] py-1 cursor-pointer w-full text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
