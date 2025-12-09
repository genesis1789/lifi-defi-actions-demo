import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// --- Mock Data ---
const MOCK_DATA = {
  totalVolume: 1247832,
  transactions: 12847,
  successRate: 94.2,
  feeRevenue: 3842,
  volumeChange: 23,
  txToday: 156,
  successChange: 2.1,
  revenueToday: 127,
  
  volumeHistory: [
    { date: 'Mon', value: 145000 },
    { date: 'Tue', value: 189000 },
    { date: 'Wed', value: 167000 },
    { date: 'Thu', value: 212000 },
    { date: 'Fri', value: 198000 },
    { date: 'Sat', value: 156000 },
    { date: 'Sun', value: 180000 },
  ],
  
  topRoutes: [
    { from: 'ETH', to: 'ARB', percentage: 34, volume: 424263 },
    { from: 'POL', to: 'ETH', percentage: 28, volume: 349393 },
    { from: 'ARB', to: 'OPT', percentage: 18, volume: 224609 },
    { from: 'BASE', to: 'ETH', percentage: 12, volume: 149739 },
    { from: 'OTH', to: '---', percentage: 8, volume: 99826 },
  ],
  
  funnel: [
    { stage: 'Widget Loaded', count: 31250, percentage: 100 },
    { stage: 'Token Selected', count: 22500, percentage: 72 },
    { stage: 'Amount Entered', count: 20312, percentage: 65 },
    { stage: 'Wallet Connected', count: 15000, percentage: 48 },
    { stage: 'Transaction Started', count: 13750, percentage: 44 },
    { stage: 'Completed', count: 12847, percentage: 41 },
  ],
  
  insights: [
    { 
      type: 'opportunity',
      title: 'Chain Expansion',
      description: 'Base represents 18% of global volume. Adding support could increase transactions by ~12%.',
      metric: '+12% vol'
    },
    { 
      type: 'warning',
      title: 'Funnel Optimization',
      description: '24% drop-off at wallet connection. Consider enabling "Connect Wallet" earlier in the flow.',
      metric: '-24% conv'
    },
    { 
      type: 'info',
      title: 'Fee Strategy',
      description: 'Current fee: 0.25%. Market average: 0.35%. adjusting could increase revenue without volume loss.',
      metric: '+$1.2k/mo'
    },
  ],

  recentTransactions: [
    { id: '0x1a...3c4d', from: 'ETH', to: 'ARB', amount: 2450, status: 'completed', time: '2m ago' },
    { id: '0x5e...7g8h', from: 'POL', to: 'ETH', amount: 1890, status: 'completed', time: '5m ago' },
    { id: '0x9i...1k2l', from: 'ARB', to: 'OPT', amount: 3200, status: 'pending', time: '8m ago' },
    { id: '0x3m...5o6p', from: 'ETH', to: 'BASE', amount: 890, status: 'completed', time: '12m ago' },
    { id: '0x7q...9s0t', from: 'OPT', to: 'ETH', amount: 5670, status: 'failed', time: '15m ago' },
  ],
};

// --- Icons ---
const Icons = {
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
  ArrowUpRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>,
  Wallet: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  Activity: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  DollarSign: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Lightbulb: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5 0-2.2-1.8-4-4-4-2.2 0-4 1.8-4 4 0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  AlertTriangle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  TrendingUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  CheckCircle2: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  XCircle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>,
};

// --- Helper Functions ---
function useAnimatedCounter(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * target));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  return count;
}

function formatCurrency(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// --- Components ---

const KPICard = ({ title, value, change, subtext, icon: Icon, isCurrency = false }: any) => (
  <div className="kpi-card">
    <div className="kpi-top">
      <span className="kpi-title">{title}</span>
      <div className="kpi-icon-wrapper"><Icon /></div>
    </div>
    <div className="kpi-value">{isCurrency ? formatCurrency(value) : (title === 'Success Rate' ? `${value}%` : formatNumber(value))}</div>
    <div className="kpi-bottom">
      <div className="kpi-change positive">
        <Icons.TrendingUp />
        <span>{change}</span>
      </div>
      <span className="kpi-subtext">{subtext}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const volume = useAnimatedCounter(MOCK_DATA.totalVolume);
  const transactions = useAnimatedCounter(MOCK_DATA.transactions);
  const revenue = useAnimatedCounter(MOCK_DATA.feeRevenue);
  const maxVolume = Math.max(...MOCK_DATA.volumeHistory.map(d => d.value));

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="back-button">
              <Icons.ArrowLeft />
              Back
            </Link>
            <div className="header-title-group">
              <h1>Analytics</h1>
              <span className="beta-badge">BETA</span>
            </div>
          </div>
          <div className="header-actions">
            <div className="date-picker">
              <span>Last 7 Days</span>
              <Icons.ChevronDown />
            </div>
            <button className="btn-primary">
              <Icons.Download />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* KPI Grid */}
        <div className="kpi-grid">
          <KPICard 
            title="Total Volume" 
            value={volume} 
            change="+23%" 
            subtext="vs last period" 
            icon={Icons.Activity} 
            isCurrency={true} 
          />
          <KPICard 
            title="Transactions" 
            value={transactions} 
            change="+156" 
            subtext="requests today" 
            icon={Icons.Zap} 
          />
          <KPICard 
            title="Success Rate" 
            value={MOCK_DATA.successRate} 
            change="+2.1%" 
            subtext="above avg" 
            icon={Icons.CheckCircle2} 
          />
          <KPICard 
            title="Revenue" 
            value={revenue} 
            change={`+$${MOCK_DATA.revenueToday}`} 
            subtext="fees earned" 
            icon={Icons.DollarSign} 
            isCurrency={true} 
          />
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-col-main">
            {/* Volume Chart */}
            <div className="panel chart-panel">
              <div className="panel-header">
                <h3>Volume Overview</h3>
                <div className="chart-actions">
                  <span className="active">Volume</span>
                  <span>Tx Count</span>
                </div>
              </div>
              <div className="chart-body">
                <div className="bar-chart-container">
                  {MOCK_DATA.volumeHistory.map((day, i) => (
                    <div key={day.date} className="chart-col">
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ height: `${(day.value / maxVolume) * 100}%` }}
                        />
                      </div>
                      <span className="x-label">{day.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Funnel */}
            <div className="panel funnel-panel">
              <div className="panel-header">
                <h3>Conversion Funnel</h3>
              </div>
              <div className="funnel-rows">
                {MOCK_DATA.funnel.map((stage, i) => (
                  <div key={stage.stage} className="funnel-row">
                    <div className="funnel-label-col">
                      <span className="funnel-label">{stage.stage}</span>
                    </div>
                    <div className="funnel-bar-col">
                      <div className="funnel-bar-bg">
                        <div 
                          className={`funnel-bar-fill ${i === 1 || i === 3 ? 'warning' : ''}`}
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="funnel-stat-col">
                      <span className="stat-count">{formatNumber(stage.count)}</span>
                      <span className="stat-pct">{stage.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tx */}
            <div className="panel tx-panel">
              <div className="panel-header">
                <h3>Recent Transactions</h3>
                <Link to="#" className="link-muted">View all</Link>
              </div>
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Hash</th>
                    <th>Route</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_DATA.recentTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td className="font-mono">{tx.id}</td>
                      <td>
                        <div className="route-badge">
                          <span>{tx.from}</span>
                          <Icons.ArrowUpRight />
                          <span>{tx.to}</span>
                        </div>
                      </td>
                      <td className="font-medium">${tx.amount.toLocaleString()}</td>
                      <td>
                        <span className={`status-pill ${tx.status}`}>
                          {tx.status === 'completed' && <Icons.CheckCircle2 />}
                          {tx.status === 'pending' && <Icons.Clock />}
                          {tx.status === 'failed' && <Icons.XCircle />}
                          {tx.status}
                        </span>
                      </td>
                      <td className="text-muted">{tx.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-col-side">
            {/* Top Routes */}
            <div className="panel">
              <div className="panel-header">
                <h3>Top Routes</h3>
              </div>
              <div className="route-list">
                {MOCK_DATA.topRoutes.map((route, i) => (
                  <div key={i} className="route-row">
                    <div className="route-details">
                      <div className="route-pair">
                        <span className="token">{route.from}</span>
                        <span className="arrow">→</span>
                        <span className="token">{route.to}</span>
                      </div>
                      <span className="route-vol">${(route.volume / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="progress-mini">
                      <div className="progress-fill" style={{ width: `${route.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="panel insights-panel">
              <div className="panel-header">
                <h3>Optimization</h3>
              </div>
              <div className="insights-list">
                {MOCK_DATA.insights.map((item, i) => (
                  <div key={i} className={`insight-card ${item.type}`}>
                    <div className="insight-top">
                      {item.type === 'opportunity' && <Icons.TrendingUp />}
                      {item.type === 'warning' && <Icons.AlertTriangle />}
                      {item.type === 'info' && <Icons.Lightbulb />}
                      <span className="insight-title">{item.title}</span>
                    </div>
                    <p className="insight-desc">{item.description}</p>
                    <div className="insight-metric">
                      <span>Potential Impact:</span>
                      <strong>{item.metric}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
