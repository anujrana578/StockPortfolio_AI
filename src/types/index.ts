export interface Holding {
  id: string;
  symbol: string;
  name: string;
  category: 'Tech' | 'Finance' | 'Healthcare' | 'Consumer' | 'Energy' | 'Crypto' | 'Automotive';
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  allocationPercent: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  shares: number;
  price: number;
  total: number;
  date: string;
  status: 'Completed' | 'Pending';
}

export interface PerformancePoint {
  date: string;
  portfolio: number;
  sp500: number;
  nasdaq: number;
}

export interface StockPrediction {
  symbol: string;
  name: string;
  category: string;
  currentPrice: number;
  predictedPrice30d: number;
  predictedChangePercent: number;
  confidenceScore: number; // 0 - 100
  sentiment: 'Bullish' | 'Very Bullish' | 'Neutral' | 'Bearish';
  supportLevel: number;
  resistanceLevel: number;
  targetHigh: number;
  targetLow: number;
  historicalAndForecast: {
    date: string;
    actual?: number;
    predicted?: number;
    lowerBound?: number;
    upperBound?: number;
  }[];
  keyDrivers: string[];
  metrics: {
    rsi: number;
    peRatio: number;
    macdSignal: 'Buy' | 'Hold' | 'Sell';
    volatility: 'Low' | 'Medium' | 'High';
  };
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  category: string;
  currentPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  week52High: number;
  week52Low: number;
  volume: string;
  marketCap: string;
  peRatio: number;
  sparkline: number[];
  alertPrice?: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

export interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  volume: string;
  type: 'gainer' | 'loser' | 'trending';
}

export interface MarketSector {
  name: string;
  performance: number;
  marketWeight: string;
}
