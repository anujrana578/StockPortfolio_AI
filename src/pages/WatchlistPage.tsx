import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { WatchlistItem } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { ASSET_PALETTE } from './DashboardPage';

interface WatchlistPageProps {
  watchlist: WatchlistItem[];
  onNavigateToPredictor: (symbol: string) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onAddToWatchlist: (item: WatchlistItem) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  watchlist,
  onNavigateToPredictor,
  onRemoveFromWatchlist,
  onAddToWatchlist,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Tech');

  const filteredWatchlist = watchlist.filter(
    (w) =>
      w.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWatchItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newPrice) return;

    const priceNum = parseFloat(newPrice);
    const item: WatchlistItem = {
      id: `w-${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      name: newName || `${newSymbol.toUpperCase()} Inc`,
      category: newCategory,
      currentPrice: priceNum,
      dailyChange: 1.25,
      dailyChangePercent: 1.15,
      week52High: priceNum * 1.2,
      week52Low: priceNum * 0.8,
      volume: '12.4M',
      marketCap: '$150.0B',
      peRatio: 28.5,
      sparkline: [priceNum * 0.95, priceNum * 0.97, priceNum * 0.96, priceNum * 0.99, priceNum],
    };

    onAddToWatchlist(item);
    setIsAddModalOpen(false);
    setNewSymbol('');
    setNewName('');
    setNewPrice('');
  };

  return (
    <div className="space-y-10 pb-12 text-[#F5F5F5] font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="space-y-2">
          <h2 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight leading-none">
            Watchlist
          </h2>
          <p className="text-[14px] text-[#A1A1A1]">
            Track assets of interest
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#F5F5F5] hover:bg-white text-[#000000] font-medium text-[14px] flex items-center gap-2 transition-all cursor-pointer rounded-[6px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="py-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6F6F6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-[13px] text-[#F5F5F5] placeholder-[#6F6F6F] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
          />
        </div>

        <span className="text-[13px] text-[#A1A1A1]">
          {filteredWatchlist.length} assets
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlist.map((item, index) => {
          const chartData = item.sparkline.map((val, idx) => ({ val, index: idx }));
          const isPos = item.dailyChangePercent >= 0;

          return (
            <div 
              key={item.id}
              onClick={() => onNavigateToPredictor(item.symbol)}
              className="py-4 border-b border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.02)] transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-[32px] font-medium text-[13px] text-[#A1A1A1]">
                      {item.symbol}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F5F5F5] text-[14px]">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(item.id);
                    }}
                    className="text-[#A1A1A1] hover:text-[#EF4444] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>


                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[20px] font-medium text-[#F5F5F5] tracking-tight">
                      {formatCurrency(item.currentPrice)}
                    </div>
                    <div className={`text-[13px] mt-0.5 flex items-center gap-1 ${isPos ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {isPos ? '+' : ''}{formatPercent(item.dailyChangePercent)}
                    </div>
                  </div>

                  <div className="w-24 h-10 opacity-60 mix-blend-screen">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line type="monotone" dataKey="val" stroke={isPos ? '#22C55E' : '#EF4444'} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-2 gap-y-4 pt-4 border-t border-[rgba(255,255,255,0.04)] text-[12px]">
                  <div>
                    <span className="text-[#6F6F6F] block mb-0.5">Cap</span>
                    <span className="text-[#F5F5F5]">{item.marketCap}</span>
                  </div>
                  <div>
                    <span className="text-[#6F6F6F] block mb-0.5">52W High</span>
                    <span className="text-[#F5F5F5]">${item.week52High}</span>
                  </div>
                  <div>
                    <span className="text-[#6F6F6F] block mb-0.5">P/E</span>
                    <span className="text-[#F5F5F5]">{item.peRatio}x</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.08)] rounded-[8px] w-full max-w-sm p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-[18px] font-semibold text-[#F5F5F5] tracking-tight">Add Watchlist Ticker</h3>
            </div>

            <form onSubmit={handleCreateWatchItem} className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#A1A1A1] mb-1">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  required
                  placeholder="AMD"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] text-[#A1A1A1] mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="150.00"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                />
              </div>

              <div className="pt-6 border-t border-[rgba(255,255,255,0.04)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-[#F5F5F5] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[6px] bg-[#F5F5F5] hover:bg-white text-[#000000] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
