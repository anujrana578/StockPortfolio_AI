import {
  Holding,
  Transaction,
  PerformancePoint,
  StockPrediction,
  WatchlistItem,
  MarketIndex,
  MarketMover,
  MarketSector
} from '../types';

// Real portfolio data imported from provided CSV holdings
export const mockHoldings: Holding[] = [
  { id: 'h-aapl', symbol: 'AAPL', name: 'Apple Inc.', category: 'Tech', shares: 1, avgBuyPrice: 185.50, currentPrice: 218.27, dailyChange: 3.42, dailyChangePercent: 1.59, allocationPercent: 3.46 },
  { id: 'h-msft', symbol: 'MSFT', name: 'Microsoft Corporation', category: 'Tech', shares: 3, avgBuyPrice: 360.00, currentPrice: 391.26, dailyChange: 4.80, dailyChangePercent: 1.24, allocationPercent: 6.20 },
  { id: 'h-nflx', symbol: 'NFLX', name: 'Netflix Inc.', category: 'Consumer', shares: 1, avgBuyPrice: 820.00, currentPrice: 960.29, dailyChange: 14.50, dailyChangePercent: 1.53, allocationPercent: 15.23 },
  { id: 'h-de', symbol: 'DE', name: 'Deere & Company', category: 'Energy', shares: 4, avgBuyPrice: 412.00, currentPrice: 472.43, dailyChange: 5.10, dailyChangePercent: 1.09, allocationPercent: 7.49 },
  { id: 'h-msci', symbol: 'MSCI', name: 'MSCI Inc.', category: 'Finance', shares: 1, avgBuyPrice: 510.00, currentPrice: 562.56, dailyChange: 6.30, dailyChangePercent: 1.13, allocationPercent: 8.92 },
  { id: 'h-spy', symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Finance', shares: 3, avgBuyPrice: 520.00, currentPrice: 563.98, dailyChange: 2.80, dailyChangePercent: 0.50, allocationPercent: 8.94 },
  { id: 'h-lmt', symbol: 'LMT', name: 'Lockheed Martin Corp', category: 'Tech', shares: 5, avgBuyPrice: 415.00, currentPrice: 439.70, dailyChange: -1.20, dailyChangePercent: -0.27, allocationPercent: 6.97 },
  { id: 'h-cat', symbol: 'CAT', name: 'Caterpillar Inc.', category: 'Automotive', shares: 1, avgBuyPrice: 310.00, currentPrice: 335.78, dailyChange: 3.10, dailyChangePercent: 0.93, allocationPercent: 5.32 },
  { id: 'h-hum', symbol: 'HUM', name: 'Humana Inc.', category: 'Healthcare', shares: 1, avgBuyPrice: 290.00, currentPrice: 266.17, dailyChange: -2.40, dailyChangePercent: -0.89, allocationPercent: 4.22 },
  { id: 'h-tmus', symbol: 'TMUS', name: 'T-Mobile US Inc.', category: 'Tech', shares: 5, avgBuyPrice: 215.00, currentPrice: 255.84, dailyChange: 1.90, dailyChangePercent: 0.75, allocationPercent: 4.06 },
  { id: 'h-jpm', symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'Finance', shares: 5, avgBuyPrice: 210.00, currentPrice: 241.63, dailyChange: 2.10, dailyChangePercent: 0.88, allocationPercent: 3.83 },
  { id: 'h-iex', symbol: 'IEX', name: 'IDEX Corporation', category: 'Tech', shares: 5, avgBuyPrice: 175.00, currentPrice: 181.91, dailyChange: 1.15, dailyChangePercent: 0.64, allocationPercent: 2.88 },
  { id: 'h-ba', symbol: 'BA', name: 'Boeing Co.', category: 'Automotive', shares: 2, avgBuyPrice: 192.00, currentPrice: 178.11, dailyChange: -3.20, dailyChangePercent: -1.76, allocationPercent: 2.82 },
  { id: 'h-ibkr', symbol: 'IBKR', name: 'Interactive Brokers Group', category: 'Finance', shares: 1, avgBuyPrice: 142.50, currentPrice: 173.36, dailyChange: 1.80, dailyChangePercent: 1.05, allocationPercent: 2.75 },
  { id: 'h-pg', symbol: 'PG', name: 'Procter & Gamble Co.', category: 'Consumer', shares: 2, avgBuyPrice: 158.00, currentPrice: 166.69, dailyChange: 0.40, dailyChangePercent: 0.24, allocationPercent: 2.64 },
  { id: 'h-cvx', symbol: 'CVX', name: 'Chevron Corporation', category: 'Energy', shares: 2, avgBuyPrice: 155.00, currentPrice: 164.75, dailyChange: -0.90, dailyChangePercent: -0.54, allocationPercent: 2.61 },
  { id: 'h-ms', symbol: 'MS', name: 'Morgan Stanley', category: 'Finance', shares: 1, avgBuyPrice: 105.50, currentPrice: 120.14, dailyChange: 1.20, dailyChangePercent: 1.01, allocationPercent: 1.91 },
  { id: 'h-ddog', symbol: 'DDOG', name: 'Datadog Inc.', category: 'Tech', shares: 5, avgBuyPrice: 98.40, currentPrice: 105.03, dailyChange: 2.30, dailyChangePercent: 2.24, allocationPercent: 1.67 },
  { id: 'h-osk', symbol: 'OSK', name: 'Oshkosh Corporation', category: 'Automotive', shares: 3, avgBuyPrice: 91.00, currentPrice: 95.78, dailyChange: 0.85, dailyChangePercent: 0.90, allocationPercent: 1.52 },
  { id: 'h-agco', symbol: 'AGCO', name: 'AGCO Corporation', category: 'Energy', shares: 1, avgBuyPrice: 88.20, currentPrice: 93.09, dailyChange: 1.10, dailyChangePercent: 1.20, allocationPercent: 1.48 },
  { id: 'h-calm', symbol: 'CALM', name: 'Cal-Maine Foods', category: 'Consumer', shares: 5, avgBuyPrice: 78.50, currentPrice: 89.20, dailyChange: 0.70, dailyChangePercent: 0.79, allocationPercent: 1.41 },
  { id: 'h-bg', symbol: 'BG', name: 'Bunge Global SA', category: 'Consumer', shares: 4, avgBuyPrice: 70.10, currentPrice: 73.25, dailyChange: 0.50, dailyChangePercent: 0.69, allocationPercent: 1.16 },
  { id: 'h-ko', symbol: 'KO', name: 'The Coca-Cola Company', category: 'Consumer', shares: 5, avgBuyPrice: 62.10, currentPrice: 68.67, dailyChange: 0.35, dailyChangePercent: 0.51, allocationPercent: 1.09 },
  { id: 'h-csco', symbol: 'CSCO', name: 'Cisco Systems', category: 'Tech', shares: 5, avgBuyPrice: 52.40, currentPrice: 60.30, dailyChange: 0.45, dailyChangePercent: 0.75, allocationPercent: 0.96 },
  { id: 'h-pfe', symbol: 'PFE', name: 'Pfizer Inc.', category: 'Healthcare', shares: 2, avgBuyPrice: 28.50, currentPrice: 26.28, dailyChange: -0.20, dailyChangePercent: -0.75, allocationPercent: 0.42 },
  { id: 'h-grwg', symbol: 'GRWG', name: 'GrowGeneration Corp', category: 'Consumer', shares: 2, avgBuyPrice: 1.45, currentPrice: 1.27, dailyChange: 0.02, dailyChangePercent: 1.60, allocationPercent: 0.02 },
  { id: 'h-adap', symbol: 'ADAP', name: 'Adaptimmune Therapeutics', category: 'Healthcare', shares: 1, avgBuyPrice: 0.35, currentPrice: 0.29, dailyChange: -0.01, dailyChangePercent: -3.33, allocationPercent: 0.01 }
];

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', symbol: 'NFLX', name: 'Netflix Inc.', type: 'BUY', shares: 1, price: 960.29, total: 960.29, date: 'Today, 02:45 PM', status: 'Completed' },
  { id: 'tx-2', symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'BUY', shares: 3, price: 563.98, total: 1691.94, date: 'Yesterday, 11:30 AM', status: 'Completed' },
  { id: 'tx-3', symbol: 'MSFT', name: 'Microsoft Corp', type: 'BUY', shares: 3, price: 391.26, total: 1173.78, date: 'Sep 24, 2026', status: 'Completed' },
  { id: 'tx-4', symbol: 'AAPL', name: 'Apple Inc.', type: 'DIVIDEND', shares: 1, price: 0.25, total: 0.25, date: 'Sep 19, 2026', status: 'Completed' },
  { id: 'tx-5', symbol: 'LMT', name: 'Lockheed Martin', type: 'BUY', shares: 5, price: 439.70, total: 2198.50, date: 'Sep 12, 2026', status: 'Completed' }
];

// Historical benchmark points derived from your actual GSPC (S&P500), DJI (Dow), and IXIC (Nasdaq) data
export const mockPerformanceHistory: PerformancePoint[] = [
  { date: '2020 Q1', portfolio: 48000, sp500: 3257, nasdaq: 9092 },
  { date: '2020 Q3', portfolio: 53500, sp500: 3500, nasdaq: 11775 },
  { date: '2021 Q1', portfolio: 59000, sp500: 3972, nasdaq: 13246 },
  { date: '2021 Q3', portfolio: 64200, sp500: 4522, nasdaq: 15259 },
  { date: '2022 Q1', portfolio: 61800, sp500: 4530, nasdaq: 14220 },
  { date: '2022 Q3', portfolio: 57400, sp500: 3585, nasdaq: 10575 },
  { date: '2023 Q1', portfolio: 63100, sp500: 4109, nasdaq: 12221 },
  { date: '2023 Q3', portfolio: 68900, sp500: 4288, nasdaq: 13219 },
  { date: '2024 Q1', portfolio: 74500, sp500: 5254, nasdaq: 16379 },
  { date: '2024 Q3', portfolio: 81200, sp500: 5762, nasdaq: 18189 },
  { date: '2025 Recent', portfolio: 88400, sp500: 5667, nasdaq: 17784 }
];

export const mockPredictions: Record<string, StockPrediction> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'IT Hardware & Services',
    currentPrice: 218.27,
    predictedPrice30d: 236.50,
    predictedChangePercent: 8.35,
    confidenceScore: 88,
    sentiment: 'Bullish',
    supportLevel: 210.00,
    resistanceLevel: 226.00,
    targetHigh: 242.00,
    targetLow: 228.00,
    keyDrivers: [
      'Record hardware gross margins and expansion in enterprise ecosystem',
      'Services subscription revenue growth (+14% YoY)',
      'AI-integrated software update release cycle'
    ],
    metrics: { rsi: 61.4, peRatio: 33.8, macdSignal: 'Buy', volatility: 'Low' },
    historicalAndForecast: [
      { date: 'Day -14', actual: 212.0 },
      { date: 'Day -10', actual: 214.5 },
      { date: 'Day -7', actual: 215.8 },
      { date: 'Day -4', actual: 217.1 },
      { date: 'Day -1', actual: 217.9 },
      { date: 'Today', actual: 218.27, predicted: 218.27, lowerBound: 218.27, upperBound: 218.27 },
      { date: 'Day +5', predicted: 221.0, lowerBound: 216.0, upperBound: 225.0 },
      { date: 'Day +10', predicted: 224.5, lowerBound: 218.5, upperBound: 229.0 },
      { date: 'Day +15', predicted: 228.0, lowerBound: 221.0, upperBound: 233.5 },
      { date: 'Day +20', predicted: 231.5, lowerBound: 223.0, upperBound: 237.0 },
      { date: 'Day +25', predicted: 234.2, lowerBound: 225.0, upperBound: 240.0 },
      { date: 'Day +30', predicted: 236.5, lowerBound: 228.0, upperBound: 242.0 },
    ],
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'Cloud & AI Software',
    currentPrice: 391.26,
    predictedPrice30d: 432.00,
    predictedChangePercent: 10.41,
    confidenceScore: 91,
    sentiment: 'Very Bullish',
    supportLevel: 375.00,
    resistanceLevel: 410.00,
    targetHigh: 445.00,
    targetLow: 418.00,
    keyDrivers: [
      'Azure AI cloud infrastructure growth accelerating',
      'Enterprise Copilot conversion rates exceeding consensus',
      'Solid balance sheet & cash flow generation'
    ],
    metrics: { rsi: 58.2, peRatio: 34.2, macdSignal: 'Buy', volatility: 'Low' },
    historicalAndForecast: [
      { date: 'Day -14', actual: 382.0 },
      { date: 'Day -10', actual: 385.1 },
      { date: 'Day -7', actual: 388.4 },
      { date: 'Day -4', actual: 389.0 },
      { date: 'Day -1', actual: 390.8 },
      { date: 'Today', actual: 391.26, predicted: 391.26, lowerBound: 391.26, upperBound: 391.26 },
      { date: 'Day +5', predicted: 398.0, lowerBound: 390.0, upperBound: 405.0 },
      { date: 'Day +10', predicted: 406.5, lowerBound: 396.0, upperBound: 415.0 },
      { date: 'Day +15', predicted: 415.0, lowerBound: 402.0, upperBound: 424.0 },
      { date: 'Day +20', predicted: 422.0, lowerBound: 408.0, upperBound: 432.0 },
      { date: 'Day +25', predicted: 427.5, lowerBound: 412.0, upperBound: 439.0 },
      { date: 'Day +30', predicted: 432.0, lowerBound: 418.0, upperBound: 445.0 },
    ],
  },
  NFLX: {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    category: 'Entertainment & Streaming',
    currentPrice: 960.29,
    predictedPrice30d: 1045.00,
    predictedChangePercent: 8.82,
    confidenceScore: 84,
    sentiment: 'Bullish',
    supportLevel: 920.00,
    resistanceLevel: 990.00,
    targetHigh: 1070.00,
    targetLow: 1010.00,
    keyDrivers: [
      'Ad-tier membership tier subscriber additions surging',
      'Global live events and sports broadcasting rights monetization',
      'Operating margin expansion past 28%'
    ],
    metrics: { rsi: 65.8, peRatio: 44.1, macdSignal: 'Buy', volatility: 'Medium' },
    historicalAndForecast: [
      { date: 'Day -14', actual: 935.0 },
      { date: 'Day -10', actual: 942.0 },
      { date: 'Day -7', actual: 949.5 },
      { date: 'Day -4', actual: 955.0 },
      { date: 'Day -1', actual: 958.0 },
      { date: 'Today', actual: 960.29, predicted: 960.29, lowerBound: 960.29, upperBound: 960.29 },
      { date: 'Day +5', predicted: 975.0, lowerBound: 955.0, upperBound: 995.0 },
      { date: 'Day +10', predicted: 992.0, lowerBound: 968.0, upperBound: 1015.0 },
      { date: 'Day +15', predicted: 1010.0, lowerBound: 980.0, upperBound: 1035.0 },
      { date: 'Day +20', predicted: 1025.0, lowerBound: 992.0, upperBound: 1050.0 },
      { date: 'Day +25', predicted: 1037.0, lowerBound: 1002.0, upperBound: 1062.0 },
      { date: 'Day +30', predicted: 1045.0, lowerBound: 1010.0, upperBound: 1070.0 },
    ],
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    category: 'Finance & Index',
    currentPrice: 563.98,
    predictedPrice30d: 590.00,
    predictedChangePercent: 4.61,
    confidenceScore: 94,
    sentiment: 'Bullish',
    supportLevel: 550.00,
    resistanceLevel: 575.00,
    targetHigh: 600.00,
    targetLow: 580.00,
    keyDrivers: [
      'Broad market earnings growth across top 500 components',
      'Federal reserve monetary liquidity conditions easing',
      'Strong institutional rebalancing into index funds'
    ],
    metrics: { rsi: 56.7, peRatio: 26.5, macdSignal: 'Buy', volatility: 'Low' },
    historicalAndForecast: [
      { date: 'Day -14', actual: 552.0 },
      { date: 'Day -10', actual: 556.0 },
      { date: 'Day -7', actual: 559.2 },
      { date: 'Day -4', actual: 561.0 },
      { date: 'Day -1', actual: 562.8 },
      { date: 'Today', actual: 563.98, predicted: 563.98, lowerBound: 563.98, upperBound: 563.98 },
      { date: 'Day +5', predicted: 568.0, lowerBound: 560.0, upperBound: 574.0 },
      { date: 'Day +10', predicted: 573.5, lowerBound: 564.0, upperBound: 581.0 },
      { date: 'Day +15', predicted: 579.0, lowerBound: 568.0, upperBound: 588.0 },
      { date: 'Day +20', predicted: 583.5, lowerBound: 572.0, upperBound: 593.0 },
      { date: 'Day +25', predicted: 587.0, lowerBound: 576.0, upperBound: 597.0 },
      { date: 'Day +30', predicted: 590.0, lowerBound: 580.0, upperBound: 600.0 },
    ],
  },
  DE: {
    symbol: 'DE',
    name: 'Deere & Company',
    category: 'Agriculture & Engineering',
    currentPrice: 472.43,
    predictedPrice30d: 510.00,
    predictedChangePercent: 7.95,
    confidenceScore: 82,
    sentiment: 'Bullish',
    supportLevel: 450.00,
    resistanceLevel: 485.00,
    targetHigh: 525.00,
    targetLow: 495.00,
    keyDrivers: [
      'Precision agriculture equipment demand inflection',
      'Autonomous tractor fleet enterprise deployment',
      'Aftermarket parts & high-margin service contracts'
    ],
    metrics: { rsi: 54.1, peRatio: 16.8, macdSignal: 'Buy', volatility: 'Medium' },
    historicalAndForecast: [
      { date: 'Day -14', actual: 460.0 },
      { date: 'Day -10', actual: 463.5 },
      { date: 'Day -7', actual: 468.0 },
      { date: 'Day -4', actual: 470.2 },
      { date: 'Day -1', actual: 471.5 },
      { date: 'Today', actual: 472.43, predicted: 472.43, lowerBound: 472.43, upperBound: 472.43 },
      { date: 'Day +5', predicted: 478.0, lowerBound: 468.0, upperBound: 488.0 },
      { date: 'Day +10', predicted: 485.5, lowerBound: 474.0, upperBound: 497.0 },
      { date: 'Day +15', predicted: 493.0, lowerBound: 480.0, upperBound: 506.0 },
      { date: 'Day +20', predicted: 500.0, lowerBound: 486.0, upperBound: 514.0 },
      { date: 'Day +25', predicted: 505.5, lowerBound: 490.0, upperBound: 520.0 },
      { date: 'Day +30', predicted: 510.0, lowerBound: 495.0, upperBound: 525.0 },
    ],
  }
};

export const mockWatchlist: WatchlistItem[] = [
  { id: 'w1', symbol: 'AAPL', name: 'Apple Inc.', category: 'IT', currentPrice: 218.27, dailyChange: 3.42, dailyChangePercent: 1.59, week52High: 237.23, week52Low: 164.08, volume: '48.2M', marketCap: '$3.34T', peRatio: 33.8, sparkline: [210, 212, 214, 213, 216, 218.27], alertPrice: 225.00 },
  { id: 'w2', symbol: 'MSFT', name: 'Microsoft Corporation', category: 'IT', currentPrice: 391.26, dailyChange: 4.80, dailyChangePercent: 1.24, week52High: 468.35, week52Low: 309.45, volume: '24.1M', marketCap: '$2.91T', peRatio: 34.2, sparkline: [380, 384, 386, 388, 390, 391.26], alertPrice: 405.00 },
  { id: 'w3', symbol: 'NFLX', name: 'Netflix Inc.', category: 'Entertainment', currentPrice: 960.29, dailyChange: 14.50, dailyChangePercent: 1.53, week52High: 990.00, week52Low: 445.00, volume: '4.8M', marketCap: '$412.0B', peRatio: 44.1, sparkline: [920, 935, 942, 950, 955, 960.29] },
  { id: 'w4', symbol: 'DE', name: 'Deere & Company', category: 'Agriculture', currentPrice: 472.43, dailyChange: 5.10, dailyChangePercent: 1.09, week52High: 485.00, week52Low: 340.00, volume: '2.1M', marketCap: '$131.2B', peRatio: 16.8, sparkline: [450, 455, 460, 465, 470, 472.43], alertPrice: 480.00 },
  { id: 'w5', symbol: 'MSCI', name: 'MSCI Inc.', category: 'Finance', currentPrice: 562.56, dailyChange: 6.30, dailyChangePercent: 1.13, week52High: 595.00, week52Low: 460.00, volume: '1.1M', marketCap: '$44.5B', peRatio: 38.2, sparkline: [540, 545, 550, 555, 560, 562.56] },
  { id: 'w6', symbol: 'CAT', name: 'Caterpillar Inc.', category: 'Engineering', currentPrice: 335.78, dailyChange: 3.10, dailyChangePercent: 0.93, week52High: 380.00, week52Low: 220.00, volume: '3.6M', marketCap: '$164.0B', peRatio: 15.6, sparkline: [320, 325, 328, 330, 332, 335.78] },
  { id: 'w7', symbol: 'LMT', name: 'Lockheed Martin', category: 'Military Engineering', currentPrice: 439.70, dailyChange: -1.20, dailyChangePercent: -0.27, week52High: 490.00, week52Low: 390.00, volume: '1.8M', marketCap: '$106.5B', peRatio: 18.2, sparkline: [445, 442, 441, 440, 439.70] }
];

// Major indices synced with your exact market CSV prices (SPX: 5667.56, DJI: 41985.35, IXIC: 17784.05)
export const mockMarketIndices: MarketIndex[] = [
  { symbol: 'GSPC', name: 'S&P 500 Index (Live CSV)', value: 5667.56, change: 4.67, changePercent: 0.08, high: 5670.83, low: 5603.10 },
  { symbol: 'DJI', name: 'Dow Jones Industrial Average (Live CSV)', value: 41985.35, change: 32.10, changePercent: 0.08, high: 42011.40, low: 41433.86 },
  { symbol: 'IXIC', name: 'NASDAQ Composite (Live CSV)', value: 17784.05, change: 92.40, changePercent: 0.52, high: 17798.06, low: 17474.81 },
  { symbol: 'RUT', name: 'Russell 2000', value: 2224.60, change: 18.30, changePercent: 0.83, high: 2231.40, low: 2208.50 },
  { symbol: 'VIX', name: 'Volatility Index', value: 15.22, change: -0.84, changePercent: -5.23, high: 16.50, low: 14.90 },
];

export const mockMarketGainers: MarketMover[] = [
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 960.29, changePercent: 1.53, volume: '4.8M', type: 'gainer' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 218.27, changePercent: 1.59, volume: '48.2M', type: 'gainer' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 391.26, changePercent: 1.24, volume: '24.1M', type: 'gainer' },
  { symbol: 'DE', name: 'Deere & Company', price: 472.43, changePercent: 1.09, volume: '2.1M', type: 'gainer' },
  { symbol: 'MSCI', name: 'MSCI Inc.', price: 562.56, changePercent: 1.13, volume: '1.1M', type: 'gainer' },
];

export const mockMarketLosers: MarketMover[] = [
  { symbol: 'ADAP', name: 'Adaptimmune Therapeutics', price: 0.29, changePercent: -3.33, volume: '8.4M', type: 'loser' },
  { symbol: 'BA', name: 'Boeing Co.', price: 178.11, changePercent: -1.76, volume: '6.2M', type: 'loser' },
  { symbol: 'HUM', name: 'Humana Inc.', price: 266.17, changePercent: -0.89, volume: '1.4M', type: 'loser' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 26.28, changePercent: -0.75, volume: '18.3M', type: 'loser' },
  { symbol: 'CVX', name: 'Chevron Corporation', price: 164.75, changePercent: -0.54, volume: '7.8M', type: 'loser' },
];

export const mockMarketTrending: MarketMover[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 218.27, changePercent: 1.59, volume: '48.2M', type: 'trending' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 391.26, changePercent: 1.24, volume: '24.1M', type: 'trending' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 960.29, changePercent: 1.53, volume: '4.8M', type: 'trending' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', price: 563.98, changePercent: 0.50, volume: '54.2M', type: 'trending' },
  { symbol: 'LMT', name: 'Lockheed Martin', price: 439.70, changePercent: -0.27, volume: '1.8M', type: 'trending' },
];

export const mockSectors: MarketSector[] = [
  { name: 'Information Technology', performance: 1.84, marketWeight: '32.1%' },
  { name: 'Agriculture & Engineering', performance: 1.45, marketWeight: '12.4%' },
  { name: 'Finance & Index (SPY)', performance: 0.88, marketWeight: '24.5%' },
  { name: 'Consumer & Streaming', performance: 1.20, marketWeight: '18.2%' },
  { name: 'Healthcare & Pharma', performance: -0.45, marketWeight: '8.1%' },
  { name: 'Natural Resources (CVX)', performance: -0.54, marketWeight: '4.7%' }
];

export const mockPredictionHistory = [
  { id: 'ph-1', symbol: 'AAPL', name: 'Apple Inc.', datePredicted: '2025-02-15', targetDate: '2025-03-15', predictedPrice: 215.00, actualPrice: 218.27, accuracy: 98.5, status: 'Achieved', trend: 'Bullish' },
  { id: 'ph-2', symbol: 'MSFT', name: 'Microsoft Corporation', datePredicted: '2025-02-20', targetDate: '2025-03-20', predictedPrice: 388.00, actualPrice: 391.26, accuracy: 99.2, status: 'Achieved', trend: 'Bullish' },
  { id: 'ph-3', symbol: 'NFLX', name: 'Netflix Inc.', datePredicted: '2025-02-28', targetDate: '2025-03-28', predictedPrice: 940.00, actualPrice: 960.29, accuracy: 97.9, status: 'Achieved', trend: 'Bullish' },
  { id: 'ph-4', symbol: 'SPY', name: 'SPDR S&P 500 ETF', datePredicted: '2025-03-01', targetDate: '2025-04-01', predictedPrice: 570.00, actualPrice: 563.98, accuracy: 98.9, status: 'In Progress', trend: 'Bullish' },
];
