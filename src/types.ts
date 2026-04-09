export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BacktestResult {
  totalTrades: number;
  winRate: number;
  sharpeRatio: number;
  profitFactor: number;
  maxDrawdown: number;
  netProfit: number;
  equityCurve: { time: string; value: number }[];
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  code: string;
  lastRun?: string;
}
