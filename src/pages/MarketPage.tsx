import React, { useState } from 'react';
import { 
  Flame, 
  Globe, 
  Activity, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { 
  mockMarketIndices, 
  mockMarketGainers, 
  mockMarketLosers, 
  mockMarketTrending,
  mockSectors 
} from '../data/mockData';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface MarketPageProps {
  onNavigateToPredictor: (symbol: string) => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({ onNavigateToPredictor }) => {
  const [activeMoverTab, setActiveMoverTab] = useState<'trending' | 'gainers' | 'losers'>('trending');

  const getMoversList = () => {
    switch (activeMoverTab) {
      case 'trending': return mockMarketTrending;
      case 'gainers': return mockMarketGainers;
      case 'losers': return mockMarketLosers;
    }
  };

  return (
    <div className="space-y-6 pb-12 text-neutral-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-950 border border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5 text-white" />
            Live Market Index Feeds
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
            Financial Markets & Sector Breakdown
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time equity index benchmarks (S&P 500, Dow Jones, NASDAQ) and volume leaders.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-neutral-500">Market Status</span>
          <div className="text-sm font-bold text-white">Active Session</div>
        </div>
      </div>

      {/* Movers & Sector Rotation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-950 border border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-white" />
                Market Movers
              </h3>
              <p className="text-xs text-neutral-400">High volume equity participants</p>
            </div>

            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setActiveMoverTab('trending')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMoverTab === 'trending' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveMoverTab('gainers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMoverTab === 'gainers' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Gainers
              </button>
              <button
                onClick={() => setActiveMoverTab('losers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMoverTab === 'losers' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Losers
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-900 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">24h Change</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-center">AI Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {getMoversList().map((mover) => (
                  <tr 
                    key={mover.symbol} 
                    className="hover:bg-neutral-900/40 cursor-pointer"
                    onClick={() => onNavigateToPredictor(mover.symbol)}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      {mover.symbol} <span className="text-xs text-neutral-400 font-normal">({mover.name})</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">
                      {formatCurrency(mover.price)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white font-mono">
                      {formatPercent(mover.changePercent)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400">
                      {mover.volume}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToPredictor(mover.symbol);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-white hover:text-black text-white text-xs font-semibold border border-neutral-700 transition-all cursor-pointer"
                      >
                        Forecast
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Breakdown */}
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
            <PieChart className="w-4 h-4 text-white" />
            Sector Performance
          </h3>
          <p className="text-xs text-neutral-400 mb-4">Capital flow by sector</p>

          <div className="space-y-3">
            {mockSectors.map((sector) => (
              <div key={sector.name} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">{sector.name}</span>
                  <span className="font-bold text-white font-mono">{formatPercent(sector.performance)}</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(Math.abs(sector.performance) * 30, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Major Indices */}
      <div>
        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          Major Indices (Sourced from Datasets)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {mockMarketIndices.map((idx) => {
            return (
              <div 
                key={idx.symbol}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">{idx.symbol}</span>
                  <span className="text-xs font-semibold text-neutral-300 font-mono">
                    {formatPercent(idx.changePercent)}
                  </span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  {idx.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 truncate">
                  {idx.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
