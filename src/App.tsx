import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Play, 
  Code2, 
  BrainCircuit, 
  Settings, 
  LayoutDashboard, 
  ChevronRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Zap,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { TradingChart } from './components/TradingChart';
import { StrategyEditor } from './components/StrategyEditor';
import { mockCandles, mockBacktestResult, mockStrategies } from './lib/mockData';
import { askJesseGPT } from './services/geminiService';
import { cn } from '@/lib/utils';

type View = 'dashboard' | 'backtest' | 'strategies' | 'ai-lab';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedStrategy, setSelectedStrategy] = useState(mockStrategies[0]);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hello! I am JesseGPT. How can I help you with your trading strategies today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', content: userInput } as const];
    setChatMessages(newMessages);
    setUserInput('');
    setIsChatLoading(true);

    const response = await askJesseGPT(userInput, selectedStrategy.code);
    setChatMessages([...newMessages, { role: 'ai', content: response }]);
    setIsChatLoading(false);
  };

  const runBacktest = () => {
    setIsBacktesting(true);
    setTimeout(() => setIsBacktesting(false), 2000);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-zinc-950 fill-current" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Jesse AI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard className="w-4 h-4" />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem 
            icon={<Play className="w-4 h-4" />} 
            label="Backtest" 
            active={currentView === 'backtest'} 
            onClick={() => setCurrentView('backtest')}
          />
          <NavItem 
            icon={<Code2 className="w-4 h-4" />} 
            label="Strategies" 
            active={currentView === 'strategies'} 
            onClick={() => setCurrentView('strategies')}
          />
          <NavItem 
            icon={<BrainCircuit className="w-4 h-4" />} 
            label="AI Lab" 
            active={currentView === 'ai-lab'} 
            onClick={() => setCurrentView('ai-lab')}
          />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono">AZ</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">azahadinc@gmail.com</p>
              <p className="text-[10px] text-zinc-500">Pro Account</p>
            </div>
            <Settings className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-zinc-400 capitalize">{currentView}</h2>
            <ChevronRight className="w-3 h-3 text-zinc-600" />
            <span className="text-sm font-semibold">{selectedStrategy.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Market Connected
            </Badge>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-6">
              Deploy Strategy
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {currentView === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Net Profit" value="$42,500.00" change="+12.4%" icon={<TrendingUp className="text-emerald-500" />} />
                    <StatCard title="Win Rate" value="64.5%" change="+2.1%" icon={<Activity className="text-blue-500" />} />
                    <StatCard title="Sharpe Ratio" value="2.10" change="Optimal" icon={<ShieldCheck className="text-purple-500" />} />
                    <StatCard title="Active Trades" value="3" change="2 Long, 1 Short" icon={<Zap className="text-yellow-500" />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Market Performance</CardTitle>
                          <CardDescription>BTC/USDT - 1h Timeframe</CardDescription>
                        </div>
                        <Tabs defaultValue="1h">
                          <TabsList className="bg-zinc-950 border border-zinc-800">
                            <TabsTrigger value="15m" className="text-xs">15m</TabsTrigger>
                            <TabsTrigger value="1h" className="text-xs">1h</TabsTrigger>
                            <TabsTrigger value="4h" className="text-xs">4h</TabsTrigger>
                            <TabsTrigger value="1d" className="text-xs">1d</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </CardHeader>
                      <CardContent>
                        <TradingChart data={mockCandles} type="price" />
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Active Strategy</CardTitle>
                        <CardDescription>Current logic being executed</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800">
                          <h4 className="font-bold text-emerald-500 mb-1">{selectedStrategy.name}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">{selectedStrategy.description}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Last Execution</span>
                            <span className="text-zinc-300">{selectedStrategy.lastRun}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-zinc-500">Risk Level</span>
                            <Badge variant="outline" className="text-[10px] py-0 h-4 border-yellow-500/50 text-yellow-500">Medium</Badge>
                          </div>
                        </div>
                        <Separator className="bg-zinc-800" />
                        <Button variant="outline" className="w-full border-zinc-800 hover:bg-zinc-800" onClick={() => setCurrentView('strategies')}>
                          Edit Strategy
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {currentView === 'backtest' && (
                <motion.div 
                  key="backtest"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Backtest Engine</h3>
                      <p className="text-zinc-400 text-sm">Simulate your strategy on historical data</p>
                    </div>
                    <Button 
                      onClick={runBacktest} 
                      disabled={isBacktesting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold"
                    >
                      {isBacktesting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isBacktesting ? 'Running Simulation...' : 'Start Backtest'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800">
                      <CardHeader>
                        <CardTitle>Equity Curve</CardTitle>
                        <CardDescription>Portfolio value over time during backtest</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <TradingChart data={mockBacktestResult.equityCurve} type="equity" color="#3b82f6" />
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <MetricRow label="Total Trades" value={mockBacktestResult.totalTrades.toString()} />
                        <MetricRow label="Win Rate" value={`${mockBacktestResult.winRate}%`} />
                        <MetricRow label="Profit Factor" value={mockBacktestResult.profitFactor.toString()} />
                        <MetricRow label="Max Drawdown" value={`${mockBacktestResult.maxDrawdown}%`} color="text-red-500" />
                        <MetricRow label="Sharpe Ratio" value={mockBacktestResult.sharpeRatio.toString()} color="text-emerald-500" />
                        <Separator className="bg-zinc-800" />
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Monte Carlo Analysis</span>
                          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[85%]" />
                          </div>
                          <span className="text-[10px] text-zinc-400">85% Confidence Interval - Strategy is robust</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {currentView === 'strategies' && (
                <motion.div 
                  key="strategies"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-[calc(100vh-12rem)] flex gap-8"
                >
                  <div className="w-80 space-y-4">
                    <h3 className="text-xl font-bold">My Strategies</h3>
                    <div className="space-y-2">
                      {mockStrategies.map(s => (
                        <div 
                          key={s.id}
                          onClick={() => setSelectedStrategy(s)}
                          className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all",
                            selectedStrategy.id === s.id 
                              ? "bg-emerald-500/10 border-emerald-500/50" 
                              : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                          )}
                        >
                          <h4 className={cn("font-bold text-sm", selectedStrategy.id === s.id ? "text-emerald-500" : "text-zinc-200")}>{s.name}</h4>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{s.description}</p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full border-dashed border-zinc-700 hover:bg-zinc-900">
                      + Create New Strategy
                    </Button>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">Python</Badge>
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">Jesse Framework</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-zinc-800">Reset</Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold">Save Changes</Button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <StrategyEditor code={selectedStrategy.code} />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentView === 'ai-lab' && (
                <motion.div 
                  key="ai-lab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-[calc(100vh-12rem)] grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuit className="w-5 h-5 text-purple-500" />
                          ML Pipeline
                        </CardTitle>
                        <CardDescription>Train predictive models using scikit-learn integration</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <MLStep number="01" title="Gather Data" status="Complete" />
                          <MLStep number="02" title="Train Model" status="Ready" active />
                          <MLStep number="03" title="Deploy" status="Pending" />
                        </div>
                        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">Model Confidence</span>
                            <span className="text-sm font-mono text-emerald-500">82.4%</span>
                          </div>
                          <div className="h-4 bg-zinc-900 rounded-full overflow-hidden p-1">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '82.4%' }}
                              className="h-full bg-emerald-500 rounded-full" 
                            />
                          </div>
                          <p className="text-xs text-zinc-500 italic">"The model predicts a 65% probability of a bullish trend reversal in the next 4 hours based on current RSI and Volume patterns."</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800 flex-1">
                      <CardHeader>
                        <CardTitle>Hyperparameter Optimization</CardTitle>
                        <CardDescription>AI-driven search for optimal strategy parameters</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">slow_sma_period</span>
                              <span className="text-[10px] text-zinc-500">Range: 150 - 210</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-mono text-emerald-500">184</span>
                              <p className="text-[10px] text-zinc-500">Optimal Value</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">rsi_threshold</span>
                              <span className="text-[10px] text-zinc-500">Range: 20 - 40</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-mono text-emerald-500">28</span>
                              <p className="text-[10px] text-zinc-500">Optimal Value</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* JesseGPT Chat */}
                  <Card className="bg-zinc-900/50 border-zinc-800 flex flex-col overflow-hidden">
                    <CardHeader className="border-b border-zinc-800 bg-zinc-900/80">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        JesseGPT
                      </CardTitle>
                      <CardDescription className="text-[10px]">Your AI Quantitative Developer</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {chatMessages.map((m, i) => (
                            <div key={i} className={cn(
                              "flex flex-col max-w-[85%] gap-1",
                              m.role === 'user' ? "ml-auto items-end" : "items-start"
                            )}>
                              <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                m.role === 'user' 
                                  ? "bg-emerald-600 text-zinc-950 font-medium rounded-tr-none" 
                                  : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                              )}>
                                {m.content}
                              </div>
                              <span className="text-[10px] text-zinc-600 uppercase tracking-tighter">
                                {m.role === 'user' ? 'You' : 'JesseGPT'}
                              </span>
                            </div>
                          ))}
                          {isChatLoading && (
                            <div className="flex items-center gap-2 text-zinc-500 text-xs italic">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              JesseGPT is thinking...
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      <div className="p-4 bg-zinc-900/80 border-t border-zinc-800">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Ask about your strategy..." 
                            className="bg-zinc-950 border-zinc-800 text-sm"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button size="icon" className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950" onClick={handleSendMessage}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
        active 
          ? "bg-emerald-500/10 text-emerald-500" 
          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
      )}
    >
      <span className={cn("transition-colors", active ? "text-emerald-500" : "text-zinc-500 group-hover:text-zinc-300")}>
        {icon}
      </span>
      {label}
      {active && <motion.div layoutId="active-nav" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
    </button>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm hover:border-zinc-700 transition-colors cursor-default group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</span>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded",
            change.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-400"
          )}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, color = "text-zinc-200" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={cn("text-sm font-mono font-bold", color)}>{value}</span>
    </div>
  );
}

function MLStep({ number, title, status, active }: { number: string, title: string, status: string, active?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-xl border flex flex-col gap-2 transition-all",
      active ? "bg-purple-500/10 border-purple-500/50" : "bg-zinc-950 border-zinc-800 opacity-50"
    )}>
      <span className={cn("text-[10px] font-mono", active ? "text-purple-500" : "text-zinc-600")}>{number}</span>
      <span className="text-xs font-bold">{title}</span>
      <Badge variant="outline" className={cn(
        "text-[8px] py-0 h-4 w-fit",
        status === 'Complete' ? "border-emerald-500/50 text-emerald-500" : 
        status === 'Ready' ? "border-purple-500/50 text-purple-500" : "border-zinc-700 text-zinc-500"
      )}>
        {status}
      </Badge>
    </div>
  );
}

