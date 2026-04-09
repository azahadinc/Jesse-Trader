import { Candle, BacktestResult } from '../types';

export const mockCandles: Candle[] = Array.from({ length: 100 }).map((_, i) => {
  const basePrice = 50000 + Math.sin(i / 10) * 2000 + Math.random() * 500;
  return {
    time: new Date(Date.now() - (100 - i) * 3600000).toISOString().slice(11, 16),
    open: basePrice,
    high: basePrice + Math.random() * 200,
    low: basePrice - Math.random() * 200,
    close: basePrice + (Math.random() - 0.5) * 300,
    volume: Math.random() * 100,
  };
});

export const mockBacktestResult: BacktestResult = {
  totalTrades: 142,
  winRate: 64.5,
  sharpeRatio: 2.1,
  profitFactor: 1.85,
  maxDrawdown: 12.4,
  netProfit: 42500,
  equityCurve: Array.from({ length: 50 }).map((_, i) => ({
    time: `Day ${i + 1}`,
    value: 100000 + i * 1000 + Math.random() * 2000 - 1000,
  })),
};

export const mockStrategies = [
  {
    id: '1',
    name: 'Golden Cross',
    description: 'A simple trend-following strategy using 8 EMA and 21 EMA.',
    code: `class GoldenCross(Strategy):
    def should_long(self):
        # Go long when the 8 EMA crosses above the 21 EMA
        short_ema = ta.ema(self.candles, 8)
        long_ema = ta.ema(self.candles, 21)
        return short_ema > long_ema

    def go_long(self):
        # Limit buy order at $10 below the current price
        entry_price = self.price - 10        
        
        # Risk management: spend only 5% of your total capital
        qty = utils.size_to_qty(self.balance * 0.05, entry_price) 
        
        # Submit entry order, take profit (20% up), and stop loss (10% down)
        self.buy = qty, entry_price                 
        self.take_profit = qty, entry_price * 1.2  
        self.stop_loss = qty, entry_price * 0.9`,
    lastRun: '2 hours ago',
  },
  {
    id: '2',
    name: 'RSI Mean Reversion',
    description: 'Buy when oversold (RSI < 30) and sell when overbought (RSI > 70).',
    code: `class RSIMeanReversion(Strategy):
    def should_long(self):
        rsi = ta.rsi(self.candles, 14)
        return rsi < 30

    def should_short(self):
        rsi = ta.rsi(self.candles, 14)
        return rsi > 70`,
    lastRun: 'Yesterday',
  }
];
