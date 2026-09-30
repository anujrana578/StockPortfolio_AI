import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ArrowUpRight, 
  Sparkles, 
  PieChart as PieChartIcon, 
  Activity, 
  Layers, 
  ChevronRight 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Holding, Transaction, PerformancePoint } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface DashboardPageProps {
  holdings: Holding[];
  transactions: Transaction[];
  performance: PerformancePoint[];
  onNavigateToPredictor: (symbol: string) => void;
  onNavigateToPortfolio: () => void;
}

export const ASSET_PALETTE = [
  '#F5F5F5',
  '#A1A1A1',
  '#6F6F6F',
  '#4A4A4A',
  '#333333',
  '#22C55E', // Muted green accent
  '#FFFFFF',
  '#BBBBBB',
  '#888888',
];

export const DashboardPage: React.FC<DashboardPageProps> = ({
  holdings,
  transactions,
  performance,
  onNavigateToPredictor,
  onNavigateToPortfolio
}) => {
  const [timeRange, setTimeRange] = useState<'1M' | '6M' | 'YTD' | '1Y' | 'ALL'>('YTD');

  const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalInvested = holdings.reduce((sum, h) => sum + (h.shares * h.avgBuyPrice), 0);
  const totalProfitLoss = totalValue - totalInvested;
  const totalReturnPercent = (totalProfitLoss / totalInvested) * 100;
  
  const dailyGainLoss = holdings.reduce((sum, h) => sum + (h.dailyChange * h.shares), 0);
  const dailyGainLossPercent = (dailyGainLoss / (totalValue - dailyGainLoss)) * 100;

  // Top 8 holdings with distinct coloring
  const allocationData = holdings.slice(0, 8).map((h) => ({
    name: h.symbol,
    fullName: h.name,
    value: Number((h.shares * h.currentPrice).toFixed(2)),
    percent: h.allocationPercent
  }));

  const topHoldings = [...holdings].sort((a, b) => (b.shares * b.currentPrice) - (a.shares * a.currentPrice)).slice(0, 5);

  return (
    <div className="space-y-10 pb-12 text-[#F5F5F5] font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="space-y-2">
          <h2 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight leading-none">
            {holdings.length} Assets
          </h2>
          <p className="text-[14px] text-[#A1A1A1]">
            Active portfolio positions
          </p>
        </div>
        <button 
          onClick={() => onNavigateToPredictor('AAPL')}
          className="px-4 py-2 bg-[#F5F5F5] hover:bg-white text-[#000000] font-medium text-[14px] flex items-center gap-2 transition-all cursor-pointer rounded-[6px]"
        >
          <span>Run AI Model →</span>
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
            {formatCurrency(totalInvested)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Unrealized P&L</div>
          <div className="text-[28px] font-medium tracking-tight text-[#22C55E]">
            +{formatCurrency(totalProfitLoss)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">ROI</div>
          <div className="text-[28px] font-medium tracking-tight text-[#22C55E]">
            +{formatPercent(totalReturnPercent)}
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Benchmark Chart */}
        <div className="lg:col-span-2 py-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-[14px] font-semibold text-[#F5F5F5]">
              Portfolio Performance
            </h3>
            
            <div className="flex gap-2">
              {['1M', '6M', 'YTD', '1Y', 'ALL'].map(range => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-3 py-1 text-[12px] rounded-[4px] font-medium transition-colors cursor-pointer ${
                    timeRange === range ? 'bg-[#F5F5F5] text-[#000000]' : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortfolioGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4A4A4A" fontSize={11} tickLine={false} />
                <YAxis stroke="#4A4A4A" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0A0A',
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '4px',
                    color: '#F5F5F5',
                    fontSize: '12px'
                  }}
                  formatter={(val: any, name: any) => [
                    formatCurrency(Number(val)), 
                    name === 'portfolio' ? 'Portfolio' : name === 'sp500' ? 'S&P 500' : 'NASDAQ'
                  ]}
                />
                <Area type="monotone" dataKey="portfolio" stroke="#22C55E" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPortfolioGlow)" />
                <Area type="monotone" dataKey="sp500" stroke="#6F6F6F" strokeWidth={1} strokeDasharray="4 4" fillOpacity={0} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distinct Multi-Colored Asset Allocation Donut */}
        <div className="py-4 border-t border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#F5F5F5]">
                Asset Allocation
              </h3>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={allocationData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={65} 
                    outerRadius={80} 
                    paddingAngle={2} 
                    dataKey="value"
                    stroke="none"
                  >
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={ASSET_PALETTE[index % ASSET_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', fontSize: '12px', color: '#fff' }}
                    formatter={(val: any) => formatCurrency(Number(val))}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-[#A1A1A1] font-medium">Total</span>
                <span className="text-[16px] font-medium text-[#F5F5F5]">{formatCurrency(totalValue, 0)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-[rgba(255,255,255,0.08)] max-h-40 overflow-y-auto">
            {allocationData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: ASSET_PALETTE[idx % ASSET_PALETTE.length] }} 
                  />
                  <span className="font-medium text-[#F5F5F5]">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[#A1A1A1]">
                  <span>{item.percent}%</span>
                  <span className="text-[#F5F5F5]">{formatCurrency(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Holdings Table */}
      <div className="py-4 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-semibold text-[#F5F5F5]">Top Holdings</h3>
          </div>
          <button 
            onClick={onNavigateToPortfolio}
            className="text-[13px] text-[#A1A1A1] hover:text-[#F5F5F5] flex items-center gap-1 cursor-pointer transition-colors"
          >
            View all
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col">
          {topHoldings.map((h, index) => {
            const holdingVal = h.shares * h.currentPrice;
            return (
              <div 
                key={h.id}
                onClick={() => onNavigateToPredictor(h.symbol)}
                className="py-3 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[32px] font-medium text-[13px] text-[#A1A1A1]">
                    {h.symbol}
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-[#F5F5F5]">
                      {h.name}
                    </div>
                    <div className="text-[13px] text-[#6F6F6F]">
                      {h.shares} shares
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[14px] font-medium text-[#F5F5F5]">{formatCurrency(holdingVal)}</div>
                  <div className="text-[13px] text-[#A1A1A1]">
                    {h.allocationPercent}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
