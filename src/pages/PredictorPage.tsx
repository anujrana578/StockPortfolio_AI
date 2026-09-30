import React, { useState } from 'react';
import {
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Clock,
  Target,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { useEffect } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Holding, WatchlistItem } from '../types';
import { Plus, Eye } from 'lucide-react';
import { getStoredToken } from '../utils/apiClient';

const API_BASE = `${(import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')}/api`;

interface PredictorPageProps {
  selectedStockSymbol: string;
  onSelectStock: (symbol: string) => void;
  onAddHolding?: (holding: Holding) => void;
  onAddToWatchlist?: (item: WatchlistItem) => void;
}

export const PredictorPage: React.FC<PredictorPageProps> = ({
  selectedStockSymbol,
  onSelectStock,
  onAddHolding,
  onAddToWatchlist,
}) => {
  let stockKeys = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GSPC'];
  const currentSymbol = selectedStockSymbol || 'AAPL';
  if (!stockKeys.includes(currentSymbol)) {
    stockKeys = [...stockKeys, currentSymbol];
  }

  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [buySharesStr, setBuySharesStr] = useState('1');
  const [isBuying, setIsBuying] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [buySuccess, setBuySuccess] = useState('');

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellSharesStr, setSellSharesStr] = useState('1');
  const [isSelling, setIsSelling] = useState(false);
  const [sellError, setSellError] = useState('');
  const [sellSuccess, setSellSuccess] = useState('');

  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchPrediction();
    fetchBalance();
    fetchTransactions();
  }, [currentSymbol]);

  const fetchTransactions = async () => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_BASE}/transactions/${currentSymbol}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = getStoredToken();
      const res = await fetch(`${API_BASE}/portfolio/balance`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok && data.balance !== undefined) {
        setBalance(data.balance);
      }
    } catch (e) {
      console.error("Failed to fetch balance", e);
    }
  };

  const fetchPrediction = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = getStoredToken();

      const res = await fetch(`${API_BASE}/predictions/${encodeURIComponent(currentSymbol)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to load prediction');
      }
      setPrediction(data);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch prediction data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    fetchPrediction().finally(() => setIsSimulating(false));
  };

  const handleBuy = () => {
    setBuySharesStr('1');
    setBuyError('');
    setBuySuccess('');
    setIsBuyModalOpen(true);
  };

  const submitBuy = async () => {
    setBuyError('');
    const shares = parseFloat(buySharesStr);
    if (isNaN(shares) || shares <= 0) {
      setBuyError("Please enter a valid positive number for shares.");
      return;
    }

    if (balance !== null && shares * prediction.currentPrice > balance) {
      setBuyError("Current balance is not enough to complete this purchase.");
      return;
    }

    setIsBuying(true);
    try {
      const token = getStoredToken();

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          symbol: prediction.symbol,
          shares: shares,
          price: prediction.currentPrice
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete transaction.');
      }

      if (onAddHolding) {
        onAddHolding({
          id: `h-${Date.now()}`,
          symbol: data.holding.symbol,
          name: prediction.name,
          category: prediction.category || 'Tech',
          shares: data.holding.shares,
          avgBuyPrice: data.holding.avgBuyPrice,
          currentPrice: prediction.currentPrice,
          dailyChange: 0,
          dailyChangePercent: 0,
          allocationPercent: 1.5,
        });
      }

      setPrediction((prev: any) => ({ ...prev, shares_owned: data.holding.shares, avg_buy_price: data.holding.avgBuyPrice }));

      if (balance !== null) {
        setBalance(balance - shares * prediction.currentPrice);
      }

      setBuySuccess(`✓ ${prediction.symbol} added to your portfolio`);
      fetchTransactions();
      setTimeout(() => {
        setIsBuyModalOpen(false);
        setBuySuccess('');
      }, 1500);

    } catch (err: any) {
      setBuyError(err.message || "Unable to complete purchase.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleSell = () => {
    setSellSharesStr('1');
    setSellError('');
    setSellSuccess('');
    setIsSellModalOpen(true);
  };

  const submitSell = async () => {
    setSellError('');
    const shares = parseFloat(sellSharesStr);
    if (isNaN(shares) || shares <= 0) {
      setSellError("Please enter a valid positive number for shares.");
      return;
    }
    if (shares > (prediction.shares_owned || 0)) {
      setSellError(`You only own ${prediction.shares_owned || 0} shares.`);
      return;
    }

    setIsSelling(true);
    try {
      const token = getStoredToken();

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          symbol: prediction.symbol,
          shares: shares,
          price: prediction.currentPrice,
          type: 'SELL'
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete transaction.');
      }

      if (onAddHolding) {
        onAddHolding({
          id: `h-${Date.now()}`,
          symbol: data.holding.symbol,
          name: prediction.name,
          category: prediction.category || 'Tech',
          shares: data.holding.shares,
          avgBuyPrice: data.holding.avgBuyPrice,
          currentPrice: prediction.currentPrice,
          dailyChange: 0,
          dailyChangePercent: 0,
          allocationPercent: 1.5,
        });
      }

      setPrediction((prev: any) => ({ ...prev, shares_owned: data.holding.shares, avg_buy_price: data.holding.avgBuyPrice }));

      if (balance !== null) {
        setBalance(balance + shares * prediction.currentPrice);
      }

      setSellSuccess(`✓ ${prediction.symbol} sold successfully`);
      fetchTransactions();
      setTimeout(() => {
        setIsSellModalOpen(false);
        setSellSuccess('');
      }, 1500);

    } catch (err: any) {
      setSellError(err.message || "Unable to complete sale.");
    } finally {
      setIsSelling(false);
    }
  };

  const handleWatch = () => {
    if (onAddToWatchlist && prediction) {
      onAddToWatchlist({
        id: `w-${Date.now()}`,
        symbol: prediction.symbol,
        name: prediction.name,
        category: prediction.category || 'Tech',
        currentPrice: prediction.currentPrice,
        dailyChange: 0,
        dailyChangePercent: 0,
        week52High: prediction.currentPrice * 1.2,
        week52Low: prediction.currentPrice * 0.8,
        volume: '1M',
        marketCap: '$1B',
        peRatio: 25,
        sparkline: [prediction.currentPrice, prediction.currentPrice],
      });
      alert(`Added ${prediction.symbol} to watchlist`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Cpu className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p>Loading prediction...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-rose-400">
        <p>{error}</p>
        <button onClick={fetchPrediction} className="mt-4 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 text-white text-sm transition-colors cursor-pointer">Try Again</button>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="space-y-10 pb-12 text-[#F5F5F5] font-sans">
      {/* Top Banner & Stock Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.08)]">
        <div className="space-y-2">
          <h2 className="text-[28px] font-semibold text-[#F5F5F5] tracking-tight leading-none">
            {currentSymbol} Forecast
          </h2>
          <p className="text-[14px] text-[#A1A1A1]">
            AI Multi-Variable Price Forecasting
          </p>
        </div>

        {/* Stock Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {stockKeys.map((sym) => {
            const isSel = sym === currentSymbol;
            return (
              <button
                key={sym}
                onClick={() => onSelectStock(sym)}
                className={`px-3 py-1.5 rounded-[6px] text-[13px] font-medium transition-all cursor-pointer ${isSel
                    ? 'bg-[#F5F5F5] text-[#000000]'
                    : 'text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] border border-transparent'
                  }`}
              >
                {sym}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleWatch}
            className="px-4 py-2 rounded-[6px] text-[#A1A1A1] hover:text-[#F5F5F5] hover:bg-[rgba(255,255,255,0.05)] text-[13px] font-medium flex items-center gap-1 transition-all cursor-pointer border border-[rgba(255,255,255,0.1)]"
          >
            Watch
          </button>
        </div>
      </div>

      {/* Target Asset Overview */}
      <div className="flex flex-wrap items-baseline gap-x-12 gap-y-8 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Current Close</div>
          <div className="text-[28px] font-medium tracking-tight text-[#F5F5F5]">
            {formatCurrency(prediction.currentPrice)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">30-Day Target</div>
          <div className="text-[28px] font-medium tracking-tight text-[#F5F5F5]">
            {formatCurrency(prediction.predictedPrice30d)}
          </div>
          <div className="text-[13px] text-[#22C55E]">
            +{formatPercent(prediction.predictedChangePercent)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Prediction Interval</div>
          <div className="text-[24px] font-medium tracking-tight text-[#F5F5F5]">
            {formatCurrency(prediction.predictionInterval.lower)} – {formatCurrency(prediction.predictionInterval.upper)}
          </div>
        </div>

        <div>
          <div className="text-[13px] text-[#A1A1A1] mb-1">Model Performance</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] text-[#A1A1A1] mt-2">
            <div>MAE: <span className="text-[#F5F5F5]">{prediction.metrics.mae}</span></div>
            <div>RMSE: <span className="text-[#F5F5F5]">{prediction.metrics.rmse}</span></div>
            <div>R²: <span className="text-[#F5F5F5]">{prediction.metrics.r2}</span></div>
            <div>MAPE: <span className="text-[#F5F5F5]">{prediction.metrics.mape}%</span></div>
          </div>
        </div>
      </div>

      {/* Main Prediction Chart with Color Visuals */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Observed Price (Green) & AI Forecast Trajectory Corridor (Blue) ({currentSymbol})
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Historical pricing in solid emerald green; future 30-day forecast in bright blue corridor.
            </p>
          </div>

          <button
            onClick={handleSimulate}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Cpu className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-blue-400' : ''}`} />
            Re-run Monte Carlo
          </button>
        </div>

        <div className="h-64 w-full border-t border-[rgba(255,255,255,0.08)] pt-6 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prediction.forecast} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGreenObserved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.05} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#4A4A4A" fontSize={11} tickLine={false} />
              <YAxis stroke="#4A4A4A" fontSize={11} tickLine={false} domain={['auto', 'auto']} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.08)', fontSize: '12px', color: '#F5F5F5' }}
                formatter={(val: any, name: any) => [formatCurrency(Number(val)), name === 'actual' ? 'Observed' : name === 'predicted' ? 'Predicted' : name === 'upperBound' ? 'Upper Bound' : 'Lower Bound']}
              />
              <ReferenceLine x="Today" stroke="#6F6F6F" strokeDasharray="3 3" label={{ value: 'PRESENT', fill: '#A1A1A1', fontSize: 10 }} />

              <Area type="monotone" dataKey="upperBound" stroke="#6F6F6F" strokeDasharray="2 2" strokeWidth={1} fill="none" />
              <Area type="monotone" dataKey="lowerBound" stroke="#6F6F6F" strokeDasharray="2 2" strokeWidth={1} fill="none" />
              <Area type="monotone" dataKey="actual" stroke="#22C55E" strokeWidth={1.5} fillOpacity={1} fill="url(#colorGreenObserved)" />
              <Area type="monotone" dataKey="predicted" stroke="#A1A1A1" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Drivers & Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4 border-t border-[rgba(255,255,255,0.08)]">
        <div>
          <h3 className="text-[14px] font-semibold text-[#F5F5F5] mb-4">
            Catalysts & Drivers
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="text-[#6F6F6F] font-mono text-[12px]">01</div>
              <p className="text-[13px] text-[#A1A1A1]">XGBoost Regression Non-Linear Modeling</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-[#6F6F6F] font-mono text-[12px]">02</div>
              <p className="text-[13px] text-[#A1A1A1]">Multi-dimensional Technical Indicator Extraction</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-[#6F6F6F] font-mono text-[12px]">03</div>
              <p className="text-[13px] text-[#A1A1A1]">Chronological Time-Series Evaluation Strategy</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold text-[#F5F5F5] mb-4">
            Technical Matrices
          </h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="text-[12px] text-[#6F6F6F] block">RSI (14)</span>
              <div className="text-[14px] font-medium text-[#F5F5F5] mt-0.5">{prediction.technicalIndicators.rsi}</div>
            </div>
            <div>
              <span className="text-[12px] text-[#6F6F6F] block">MACD</span>
              <div className="text-[14px] font-medium text-[#F5F5F5] mt-0.5">{prediction.technicalIndicators.macd}</div>
            </div>
            <div>
              <span className="text-[12px] text-[#6F6F6F] block">MACD Signal</span>
              <div className="text-[14px] font-medium text-[#F5F5F5] mt-0.5">{prediction.technicalIndicators.macdSignal}</div>
            </div>
            <div>
              <span className="text-[12px] text-[#6F6F6F] block">Volatility</span>
              <div className="text-[14px] font-medium text-[#F5F5F5] mt-0.5">{prediction.technicalIndicators.volatility}</div>
            </div>
          </div>
        </div>
      </div>



      {/* Financial Disclaimer */}
      <div className="pt-8 text-left">
        <p className="text-[11px] text-[#6F6F6F] max-w-2xl leading-relaxed">
          Disclaimer: Predictions are estimates generated by a machine-learning model and are not financial advice. Actual market prices may differ significantly.
        </p>
      </div>

      {/* Buy Modal */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.08)] rounded-[8px] p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold text-[#F5F5F5] tracking-tight">Buy {prediction.symbol}</h3>
              <button onClick={() => setIsBuyModalOpen(false)} className="text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors cursor-pointer" disabled={isBuying}>
                <span className="text-xl">&times;</span>
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.04)]">
                <span className="text-[13px] text-[#A1A1A1]">Current Price</span>
                <div className="text-[14px] font-medium text-[#F5F5F5]">{formatCurrency(prediction.currentPrice)}</div>
              </div>

              <div>
                <span className="text-[13px] text-[#A1A1A1] block mb-2">Number of Shares</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={buySharesStr}
                  onChange={(e) => setBuySharesStr(e.target.value)}
                  disabled={isBuying}
                  className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                />
              </div>

              <div className="pt-3 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-center">
                <span className="text-[13px] text-[#A1A1A1]">Estimated Total</span>
                <div className="text-[18px] font-semibold text-[#F5F5F5]">
                  {formatCurrency((parseFloat(buySharesStr) || 0) * prediction.currentPrice)}
                </div>
              </div>

              {buyError && <div className="text-[13px] text-[#EF4444]">{buyError}</div>}
              {buySuccess && <div className="text-[13px] text-[#22C55E]">{buySuccess}</div>}

              <div className="flex items-center gap-3 mt-6 pt-2">
                <button
                  onClick={() => setIsBuyModalOpen(false)}
                  disabled={isBuying}
                  className="flex-1 py-2 rounded-[6px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-[#F5F5F5] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBuy}
                  disabled={isBuying || (parseFloat(buySharesStr) || 0) <= 0}
                  className="flex-1 py-2 rounded-[6px] bg-[#F5F5F5] hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-[#000000] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  {isBuying ? 'Buying...' : 'Confirm Buy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {isSellModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.08)] rounded-[8px] p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold text-[#F5F5F5] tracking-tight">Sell {prediction.symbol}</h3>
              <button onClick={() => setIsSellModalOpen(false)} className="text-[#A1A1A1] hover:text-[#F5F5F5] transition-colors cursor-pointer" disabled={isSelling}>
                <span className="text-xl">&times;</span>
              </button>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.04)]">
                <span className="text-[13px] text-[#A1A1A1]">Current Price</span>
                <div className="text-[14px] font-medium text-[#F5F5F5]">{formatCurrency(prediction.currentPrice)}</div>
              </div>

              <div>
                <span className="text-[13px] text-[#A1A1A1] block mb-2">Number of Shares</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={sellSharesStr}
                  onChange={(e) => setSellSharesStr(e.target.value)}
                  disabled={isSelling}
                  className="w-full bg-[#0D0D0D] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2 text-[14px] text-[#F5F5F5] focus:outline-none focus:border-[rgba(255,255,255,0.2)] transition-all"
                />
              </div>

              <div className="pt-3 border-t border-[rgba(255,255,255,0.04)] flex justify-between items-center">
                <span className="text-[13px] text-[#A1A1A1]">Estimated Total</span>
                <div className="text-[18px] font-semibold text-[#F5F5F5]">
                  {formatCurrency((parseFloat(sellSharesStr) || 0) * prediction.currentPrice)}
                </div>
              </div>

              {sellError && <div className="text-[13px] text-[#EF4444]">{sellError}</div>}
              {sellSuccess && <div className="text-[13px] text-[#22C55E]">{sellSuccess}</div>}

              <div className="flex items-center gap-3 mt-6 pt-2">
                <button
                  onClick={() => setIsSellModalOpen(false)}
                  disabled={isSelling}
                  className="flex-1 py-2 rounded-[6px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-[#F5F5F5] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={submitSell}
                  disabled={isSelling || (parseFloat(sellSharesStr) || 0) <= 0}
                  className="flex-1 py-2 rounded-[6px] bg-[#EF4444] hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#000000] font-medium text-[13px] transition-colors cursor-pointer"
                >
                  {isSelling ? 'Selling...' : 'Confirm Sell'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
