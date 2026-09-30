import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Plus, 
  Sparkles,
  X
} from 'lucide-react';
import { Holding } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface PortfolioPageProps {
  holdings: Holding[];
  onNavigateToPredictor: (symbol: string) => void;
  onAddHolding: (holding: Holding) => void;
}

type SortField = 'symbol' | 'shares' | 'avgBuyPrice' | 'currentPrice' | 'value' | 'profitLoss' | 'profitLossPercent';
type SortOrder = 'asc' | 'desc';

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  holdings,
  onNavigateToPredictor,
  onAddHolding
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Tech' | 'Finance' | 'Healthcare' | 'Consumer' | 'Energy' | 'Crypto' | 'Automotive'>('Tech');
  const [newShares, setNewShares] = useState('');
  const [newBuyPrice, setNewBuyPrice] = useState('');
  const [newCurrentPrice, setNewCurrentPrice] = useState('');

  const categories = ['All', 'Tech', 'Finance', 'Healthcare', 'Consumer', 'Energy', 'Automotive'];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedHoldings = useMemo(() => {
    return holdings
      .filter((h) => {
        const matchesSearch = 
          h.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aVal = a.shares * a.currentPrice;
        const bVal = b.shares * b.currentPrice;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
  }, [holdings, searchQuery, selectedCategory, sortOrder]);

  const handleAddNewHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol || !newShares || !newBuyPrice) return;

    const sharesNum = parseFloat(newShares);
    const buyPriceNum = parseFloat(newBuyPrice);
    const currPriceNum = newCurrentPrice ? parseFloat(newCurrentPrice) : buyPriceNum;

    const newEntry: Holding = {
      id: `h-${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      name: newName || `${newSymbol.toUpperCase()} Corp`,
      category: newCategory,
      shares: sharesNum,
      avgBuyPrice: buyPriceNum,
      currentPrice: currPriceNum,
      dailyChange: 0,
      dailyChangePercent: 0,
      allocationPercent: 2.5,
    };

    onAddHolding(newEntry);
    setIsModalOpen(false);
    setNewSymbol('');
    setNewName('');
    setNewShares('');
    setNewBuyPrice('');
    setNewCurrentPrice('');
  };

  const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = (totalPL / totalCost) * 100;

  return (
    <div className="space-y-10 pb-12 text-[#F5F5F5] font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="space-y-2">
          <h2 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight leading-none">
            {holdings.length} Assets
          </h2>
          <p className="text-[14px] text-[#A1A1A1]">
            Active portfolio holdings
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#F5F5F5] hover:bg-white text-[#000000] font-medium text-[14px] flex items-center gap-2 transition-all cursor-pointer rounded-[6px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Summary Metric Row */}
      <div className="flex flex-wrap items-baseline gap-x-12 gap-y-8 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Total Valuation</div>
          <div className="text-[28px] font-medium tracking-tight text-[#F5F5F5]">
            {formatCurrency(totalValue)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Cost Basis</div>
          <div className="text-[28px] font-medium tracking-tight text-[#F5F5F5]">
            {formatCurrency(totalCost)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Total P&L</div>
          <div className="text-[28px] font-medium tracking-tight text-[#22C55E]">
            +{formatCurrency(totalPL)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Return Rate</div>
          <div className="text-[28px] font-medium tracking-tight text-[#22C55E]">
            +{formatPercent(totalPLPercent)}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="py-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6F6F6F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ticker or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-[6px] text-[13px] text-[#F5F5F5] placeholder-[#6F6F6F] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#F5F5F5] text-[#000000]'
                  : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px] text-[#A1A1A1]">
          <thead className="text-[#6F6F6F] font-medium border-b border-[rgba(255,255,255,0.08)]">
            <tr>
              <th className="py-3 px-4 cursor-pointer hover:text-[#F5F5F5] font-medium" onClick={() => handleSort('symbol')}>
                <div className="flex items-center gap-1.5">
                  Asset
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right font-medium">Shares</th>
              <th className="py-3 px-4 text-right font-medium">Avg Price</th>
              <th className="py-3 px-4 text-right font-medium">Close Price</th>
              <th className="py-3 px-4 text-right font-medium">Market Value</th>
              <th className="py-3 px-4 text-right font-medium">Weight</th>
              <th className="py-3 px-4 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
            {filteredAndSortedHoldings.map((h) => {
              const marketValue = h.shares * h.currentPrice;
              return (
                <tr 
                  key={h.id} 
                  className="hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group"
                  onClick={() => onNavigateToPredictor(h.symbol)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[32px] font-medium text-[13px] text-[#A1A1A1]">
                        {h.symbol}
                      </div>
                      <div>
                        <div className="font-medium text-[#F5F5F5] text-[14px]">
                          {h.name}
                        </div>
                        <div className="text-[#6F6F6F] text-[12px]">{h.category}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right text-[#F5F5F5]">
                    {h.shares}
                  </td>

                  <td className="py-3 px-4 text-right text-[#A1A1A1]">
                    {formatCurrency(h.avgBuyPrice)}
                  </td>

                  <td className="py-3 px-4 text-right text-[#F5F5F5]">
                    {formatCurrency(h.currentPrice)}
                  </td>

                  <td className="py-3 px-4 text-right text-[#F5F5F5]">
                    {formatCurrency(marketValue)}
                  </td>

                  <td className="py-3 px-4 text-right text-[#A1A1A1]">
                    {h.allocationPercent}%
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToPredictor(h.symbol);
                      }}
                      className="px-3 py-1.5 rounded-[6px] text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[12px] inline-flex items-center gap-1.5 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <span>Forecast</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Position Modal */}
      {/* Add Position Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.08)] rounded-[8px] w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-[18px] font-semibold text-[#F5F5F5] tracking-tight">Add Position</h3>
            </div>

            <form onSubmit={handleAddNewHolding} className="space-y-4">
              <div>
                <label className="block text-[13px] text-[#A1A1A1] mb-1">
                  Ticker Symbol
                </label>
                <input
                  type="text"
                  required
                  placeholder="AAPL"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] text-[#A1A1A1] mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Apple Inc."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-[#A1A1A1] mb-1">
                    Shares
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="10"
                    value={newShares}
                    onChange={(e) => setNewShares(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] text-[#A1A1A1] mb-1">
                    Buy Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="150.00"
                    value={newBuyPrice}
                    onChange={(e) => setNewBuyPrice(e.target.value)}
                    className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-[rgba(255,255,255,0.04)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-[6px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-[#F5F5F5] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[6px] bg-[#F5F5F5] hover:bg-white text-[#000000] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  Add Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
