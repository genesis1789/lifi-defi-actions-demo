import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './DeFiActionsDemo.css';

// === Li.Fi Logo Components ===
// Using official Li.Fi brand assets

function LiFiLogoIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none"
      className={className}
    >
      <path fill="#fff" d="m31.751 0 13.172 13.171a4 4 0 0 1 0 5.657l-7.838 7.838-5.334-5.333c-5.89-5.89-5.89-15.442 0-21.333Z"/>
      <path fill="#fff" fillRule="evenodd" d="M31.752 64 10.418 42.667c-5.89-5.891-5.89-15.443 0-21.334l18.505 18.505a4 4 0 0 0 5.657 0l18.505-18.505c5.891 5.891 5.891 15.443 0 21.334L31.752 64Z" clipRule="evenodd"/>
    </svg>
  );
}

function LiFiLogoHorizontal({ className = '', height = 32 }: { className?: string; height?: number }) {
  const width = (132 / 48) * height;
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 132 48" 
      fill="none"
      className={className}
    >
      <path fill="#fff" d="m19.314 0 9.878 9.879a3 3 0 0 1 0 4.242L23.314 20l-4-4c-4.419-4.418-4.419-11.582 0-16Z"/>
      <path fill="#fff" fillRule="evenodd" d="m19.314 48-16-16c-4.419-4.418-4.419-11.582 0-16l13.878 13.879a3 3 0 0 0 4.243 0L35.314 16c4.418 4.418 4.418 11.582 0 16l-16 16Z" clipRule="evenodd"/>
      <path fill="#fff" d="M123.319 36s.034-21 0-22 .985-2 1.966-2h4.034v22c.035 1-.965 2-1.965 2h-4.035ZM99.32 14v22h6v-8h10c1 0 2-1 2-2v-4h-12v-4h12c1 0 2-1 2-2v-4h-18c-1 0-2 1-2 2Zm-9.998 18c0-1 1-2 2-2h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2c-1 0-2-1-2-2v-2Zm-10.001 4s.034-21 0-22 .985-2 1.966-2h4.034v22c.035 1-.965 2-1.965 2h-4.035ZM55.32 30V14c0-1 .87-2 2-2h4v18h14v4c0 1-1 2-2 2h-18v-6Z"/>
    </svg>
  );
}

// === Types ===
interface DeFiAction {
  id: string;
  label: string;
  protocol: string;
  type: 'deposit' | 'stake' | 'repay';
  chain: string;
  chainId: number;
  apy?: string;
  tvl?: string;
  icon: string;
  color: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
}

// === Data ===
const SLIDES: Slide[] = [
  { id: 0, title: 'Title & Context', subtitle: 'DeFi Actions Mode' },
  { id: 1, title: 'Discovery', subtitle: 'Problem & Opportunity' },
  { id: 2, title: 'Proposed Feature', subtitle: 'DeFi Actions Mode' },
  { id: 3, title: 'Target Segments', subtitle: 'Who It Serves' },
  { id: 4, title: 'Design Scope', subtitle: 'MVP Definition' },
  { id: 5, title: 'Development Plan', subtitle: 'Epics & Timeline' },
  { id: 6, title: 'Deployment', subtitle: 'Rollout & GTM' },
  { id: 7, title: 'Strategic Fit', subtitle: 'Next Steps' },
  { id: 8, title: 'Live Demo', subtitle: 'Interactive Prototype' },
];

const DEFI_ACTIONS: DeFiAction[] = [
  {
    id: 'morpho-usdc-base',
    label: 'Deposit into Morpho USDC Vault',
    protocol: 'Morpho',
    type: 'deposit',
    chain: 'Base',
    chainId: 8453,
    apy: '8.2%',
    tvl: '$142M',
    icon: '🔵',
    color: '#0052FF',
  },
  {
    id: 'aave-usdc-op',
    label: 'Deposit into Aave USDC',
    protocol: 'Aave',
    type: 'deposit',
    chain: 'Optimism',
    chainId: 10,
    apy: '5.4%',
    tvl: '$312M',
    icon: '👻',
    color: '#B6509E',
  },
  {
    id: 'pendle-steth-arb',
    label: 'Stake into Pendle stETH Pool',
    protocol: 'Pendle',
    type: 'stake',
    chain: 'Arbitrum',
    chainId: 42161,
    apy: '12.1%',
    tvl: '$89M',
    icon: '🔮',
    color: '#00D395',
  },
  {
    id: 'eigenlayer-eth',
    label: 'Restake ETH on EigenLayer',
    protocol: 'EigenLayer',
    type: 'stake',
    chain: 'Ethereum',
    chainId: 1,
    apy: '4.2%',
    tvl: '$15.2B',
    icon: '🟣',
    color: '#7B3FE4',
  },
];

const CHAINS = [
  { id: 1, name: 'Ethereum', icon: '⟠' },
  { id: 137, name: 'Polygon', icon: '⬡' },
  { id: 42161, name: 'Arbitrum', icon: '🔵' },
  { id: 10, name: 'Optimism', icon: '🔴' },
  { id: 8453, name: 'Base', icon: '🔷' },
];

const TOKENS = [
  { symbol: 'USDC', icon: '💵', balance: '2,450.00' },
  { symbol: 'ETH', icon: '⟠', balance: '1.245' },
  { symbol: 'USDT', icon: '💲', balance: '890.50' },
];

// === Components ===

function SlideIndicator({ current, total, onNavigate }: { current: number; total: number; onNavigate: (idx: number) => void }) {
  return (
    <div className="slide-indicator">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`indicator-dot ${current === i ? 'active' : ''}`}
          onClick={() => onNavigate(i)}
          title={SLIDES[i].title}
        />
      ))}
    </div>
  );
}

function NavigationControls({ current, total, onPrev, onNext }: { current: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="nav-controls">
      <button className="nav-btn" onClick={onPrev} disabled={current === 0} title="Previous (←)">←</button>
      <span className="nav-counter">{current + 1} / {total}</span>
      <button className="nav-btn" onClick={onNext} disabled={current === total - 1} title="Next (→)">→</button>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">tsx</span>
        <span className="code-file">widget-config.tsx</span>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="comparison-table">
      <div className="comparison-col today">
        <div className="col-header">
          <span className="col-icon">📦</span>
          <h4>Today</h4>
        </div>
        <ul>
          <li><span className="bullet red">✗</span> Must know vault token addresses</li>
          <li><span className="bullet red">✗</span> Configure Composer as a tool</li>
          <li><span className="bullet red">✗</span> Treat everything as "swap to token"</li>
          <li><span className="bullet red">✗</span> Manage UX around vault tokens</li>
          <li><span className="bullet red">✗</span> High integration complexity</li>
        </ul>
      </div>
      <div className="comparison-arrow">→</div>
      <div className="comparison-col future">
        <div className="col-header">
          <span className="col-icon">✨</span>
          <h4>DeFi Actions Mode</h4>
        </div>
        <ul>
          <li><span className="bullet green">✓</span> Intent-based: "Deposit into X"</li>
          <li><span className="bullet green">✓</span> Hides vault token complexity</li>
          <li><span className="bullet green">✓</span> Centralized safety in LI.FI</li>
          <li><span className="bullet green">✓</span> Minimal config for integrators</li>
          <li><span className="bullet green">✓</span> Production-ready flows</li>
        </ul>
      </div>
    </div>
  );
}

function SegmentCard({ icon, title, needs, benefit }: { icon: string; title: string; needs: string; benefit: string }) {
  return (
    <div className="segment-card">
      <div className="segment-icon">{icon}</div>
      <h4>{title}</h4>
      <p className="segment-needs">{needs}</p>
      <div className="segment-benefit">
        <span className="benefit-label">With DeFi Actions:</span>
        <span className="benefit-text">{benefit}</span>
      </div>
    </div>
  );
}

function Timeline({ items }: { items: { phase: string; duration: string; tasks: string[] }[] }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-marker">
            <span className="marker-number">{i + 1}</span>
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <h4>{item.phase}</h4>
              <span className="timeline-duration">{item.duration}</span>
            </div>
            <ul>
              {item.tasks.map((task, j) => (
                <li key={j}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ label, value, subtext, trend }: { label: string; value: string; subtext: string; trend?: 'up' | 'down' }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      <span className={`metric-subtext ${trend || ''}`}>{subtext}</span>
    </div>
  );
}

// Interactive Widget Mockup
function WidgetMockup({ selectedAction, onSelectAction, step, onStepChange }: {
  selectedAction: DeFiAction | null;
  onSelectAction: (action: DeFiAction | null) => void;
  step: 'select' | 'configure' | 'review' | 'success';
  onStepChange: (step: 'select' | 'configure' | 'review' | 'success') => void;
}) {
  const [amount, setAmount] = useState('');
  const [sourceChainIndex, setSourceChainIndex] = useState(0);
  const [sourceTokenIndex, setSourceTokenIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const sourceChain = CHAINS[sourceChainIndex];
  const sourceToken = TOKENS[sourceTokenIndex];

  // Format number with commas
  const formatNumber = (value: string): string => {
    const num = value.replace(/,/g, '');
    if (!num || isNaN(Number(num))) return value;
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  // Handle amount input - only allow valid numbers
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    // Allow empty, numbers, and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  // Handle MAX button click
  const handleMaxClick = () => {
    const balance = sourceToken.balance.replace(/,/g, '');
    setAmount(balance);
  };

  // Calculate USD value (mock conversion)
  const getUsdValue = (): string => {
    const num = parseFloat(amount.replace(/,/g, '') || '0');
    if (sourceToken.symbol === 'ETH') {
      return (num * 2150).toFixed(2);
    }
    return num.toFixed(2);
  };

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onStepChange('success');
    }, 2000);
  };

  const resetWidget = () => {
    onSelectAction(null);
    onStepChange('select');
    setAmount('');
    setShowChainDropdown(false);
    setShowTokenDropdown(false);
  };

  // Check if amount is valid for proceeding
  const isValidAmount = (): boolean => {
    const num = parseFloat(amount.replace(/,/g, '') || '0');
    const balance = parseFloat(sourceToken.balance.replace(/,/g, ''));
    return num > 0 && num <= balance;
  };

  return (
    <div className="widget-mockup">
      <div className="widget-frame">
        <div className="widget-header">
          <div className="widget-title-row">
            <LiFiLogoIcon size={28} className="widget-logo" />
            <span className="widget-title">LI.FI</span>
            <span className="widget-mode-badge">DeFi Actions</span>
          </div>
          {step !== 'select' && step !== 'success' && (
            <button className="widget-back-btn" onClick={resetWidget}>← Actions</button>
          )}
        </div>

        {step === 'select' && (
          <div className="widget-content">
            <div className="widget-section-title">Select Action</div>
            <div className="actions-list">
              {DEFI_ACTIONS.map(action => (
                <button
                  key={action.id}
                  className="action-card"
                  onClick={() => { onSelectAction(action); onStepChange('configure'); }}
                >
                  <div className="action-icon" style={{ background: action.color }}>{action.icon}</div>
                  <div className="action-info">
                    <span className="action-label">{action.label}</span>
                    <span className="action-meta">
                      <span className="action-chain">{action.chain}</span>
                      <span className="action-apy">APY {action.apy}</span>
                    </span>
                  </div>
                  <div className="action-arrow">→</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'configure' && selectedAction && (
          <div className="widget-content">
            <div className="selected-action-banner" style={{ borderColor: selectedAction.color }}>
              <span className="banner-icon" style={{ background: selectedAction.color }}>{selectedAction.icon}</span>
              <div className="banner-info">
                <span className="banner-label">{selectedAction.label}</span>
                <span className="banner-meta">{selectedAction.chain} • APY {selectedAction.apy}</span>
              </div>
            </div>
            <div className="widget-form">
              <div className="form-group">
                <label>From</label>
                <div className="input-row">
                  <div className="select-wrapper">
                    <div className="chain-select" onClick={() => { setShowChainDropdown(!showChainDropdown); setShowTokenDropdown(false); }}>
                      <span className="chain-icon">{sourceChain.icon}</span>
                      <span>{sourceChain.name}</span>
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    {showChainDropdown && (
                      <div className="dropdown-menu">
                        {CHAINS.map((chain, idx) => (
                          <div
                            key={chain.id}
                            className={`dropdown-item ${idx === sourceChainIndex ? 'selected' : ''}`}
                            onClick={() => { setSourceChainIndex(idx); setShowChainDropdown(false); }}
                          >
                            <span className="dropdown-icon">{chain.icon}</span>
                            <span>{chain.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="select-wrapper">
                    <div className="token-select" onClick={() => { setShowTokenDropdown(!showTokenDropdown); setShowChainDropdown(false); }}>
                      <span className="token-icon">{sourceToken.icon}</span>
                      <span>{sourceToken.symbol}</span>
                      <span className="dropdown-arrow">▼</span>
                    </div>
                    {showTokenDropdown && (
                      <div className="dropdown-menu">
                        {TOKENS.map((token, idx) => (
                          <div
                            key={token.symbol}
                            className={`dropdown-item ${idx === sourceTokenIndex ? 'selected' : ''}`}
                            onClick={() => { setSourceTokenIndex(idx); setShowTokenDropdown(false); setAmount(''); }}
                          >
                            <span className="dropdown-icon">{token.icon}</span>
                            <span>{token.symbol}</span>
                            <span className="dropdown-balance">{token.balance}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <div className={`amount-input ${amount && !isValidAmount() ? 'error' : ''} ${amount && isValidAmount() ? 'valid' : ''}`}>
                  <input 
                    type="text" 
                    value={formatNumber(amount)} 
                    onChange={handleAmountChange} 
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                  <span className="amount-symbol">{sourceToken.symbol}</span>
                  <button className="max-btn" onClick={handleMaxClick}>MAX</button>
                </div>
                <div className="amount-info">
                  <span className="balance">Balance: {sourceToken.balance} {sourceToken.symbol}</span>
                  {amount && <span className="usd-value">≈ ${formatNumber(getUsdValue())}</span>}
                </div>
              </div>
              <button 
                className="widget-cta" 
                onClick={() => onStepChange('review')}
                disabled={!isValidAmount()}
              >
                {!amount ? 'Enter Amount' : !isValidAmount() ? 'Insufficient Balance' : `Review ${selectedAction.type === 'deposit' ? 'Deposit' : 'Stake'}`}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && selectedAction && (
          <div className="widget-content review-content">
            <div className="review-section">
              <div className="review-header">Review Transaction</div>
              
              {/* Route Steps - What will happen */}
              <div className="route-steps">
                <div className="route-step-item">
                  <div className="step-number">1</div>
                  <div className="step-details">
                    <span className="step-title">Send {formatNumber(amount)} {sourceToken.symbol}</span>
                    <span className="step-subtitle">From {sourceChain.name}</span>
                  </div>
                  <span className="step-status">⟠</span>
                </div>
                {sourceChain.name !== selectedAction.chain && (
                  <div className="route-step-item">
                    <div className="step-number">2</div>
                    <div className="step-details">
                      <span className="step-title">Bridge to {selectedAction.chain}</span>
                      <span className="step-subtitle">Via Stargate • ~2 min</span>
                    </div>
                    <span className="step-status bridge">🌉</span>
                  </div>
                )}
                <div className="route-step-item">
                  <div className="step-number">{sourceChain.name !== selectedAction.chain ? '3' : '2'}</div>
                  <div className="step-details">
                    <span className="step-title">{selectedAction.type === 'deposit' ? 'Deposit into' : 'Stake in'} {selectedAction.protocol}</span>
                    <span className="step-subtitle">Receive vault tokens</span>
                  </div>
                  <span className="step-status" style={{ background: selectedAction.color }}>{selectedAction.icon}</span>
                </div>
              </div>

              {/* Key Info Cards */}
              <div className="info-cards">
                <div className="info-card">
                  <span className="info-label">You Receive</span>
                  <span className="info-value">{formatNumber((parseFloat(amount.replace(/,/g, '') || '0') * 0.997).toFixed(2))}</span>
                  <span className="info-unit">{selectedAction.protocol} LP</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Est. Time</span>
                  <span className="info-value">{sourceChain.name !== selectedAction.chain ? '~3' : '~1'}</span>
                  <span className="info-unit">minutes</span>
                </div>
                <div className="info-card highlight">
                  <span className="info-label">APY</span>
                  <span className="info-value">{selectedAction.apy}</span>
                  <span className="info-unit">variable</span>
                </div>
              </div>

              {/* Slippage & Protection */}
              <div className="protection-settings">
                <div className="setting-row">
                  <span className="setting-label">
                    Slippage Tolerance
                    <span className="info-tooltip" title="Maximum price difference you'll accept">ⓘ</span>
                  </span>
                  <div className="slippage-options">
                    <button className="slippage-btn">0.5%</button>
                    <button className="slippage-btn active">1%</button>
                    <button className="slippage-btn">3%</button>
                  </div>
                </div>
                <div className="setting-row">
                  <span className="setting-label">Minimum Received</span>
                  <span className="setting-value">{formatNumber((parseFloat(amount.replace(/,/g, '') || '0') * 0.99).toFixed(2))} {sourceToken.symbol}</span>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="fee-breakdown">
                <div className="fee-row"><span>Network Fee</span><span>~$2.40</span></div>
                <div className="fee-row"><span>Bridge Fee</span><span>~$0.50</span></div>
                <div className="fee-row"><span>Protocol Fee</span><span>$0.00</span></div>
                <div className="fee-row total"><span>Total Cost</span><span>~$2.90</span></div>
              </div>

              {/* Security Badge */}
              <div className="security-badge">
                <span className="shield-icon">🛡️</span>
                <div className="security-text">
                  <span className="security-title">Protected by LI.FI</span>
                  <span className="security-subtitle">Audited routes • Verified protocols</span>
                </div>
              </div>

              <button className={`widget-cta execute ${isProcessing ? 'processing' : ''}`} onClick={handleExecute} disabled={isProcessing}>
                {isProcessing ? (<><span className="spinner"></span>Processing...</>) : `Confirm ${selectedAction.type === 'deposit' ? 'Deposit' : 'Stake'}`}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && selectedAction && (
          <div className="widget-content success-state">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Transaction Successful!</h3>
            <p className="success-desc">Your {amount} {sourceToken.symbol} has been {selectedAction.type === 'deposit' ? 'deposited into' : 'staked in'} {selectedAction.protocol}.</p>
            <div className="success-details">
              <div className="detail-row"><span>Protocol</span><span>{selectedAction.protocol}</span></div>
              <div className="detail-row"><span>Chain</span><span>{selectedAction.chain}</span></div>
              <div className="detail-row"><span>Expected APY</span><span className="highlight">{selectedAction.apy}</span></div>
            </div>
            <button className="widget-cta secondary" onClick={resetWidget}>New Action</button>
          </div>
        )}

        <div className="widget-footer">
          <span className="powered-by">Powered by LI.FI</span>
        </div>
      </div>
    </div>
  );
}

// === Main Component ===
export default function DeFiActionsDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAction, setSelectedAction] = useState<DeFiAction | null>(null);
  const [widgetStep, setWidgetStep] = useState<'select' | 'configure' | 'review' | 'success'>('select');

  const goToSlide = useCallback((idx: number) => {
    if (idx >= 0 && idx < SLIDES.length) {
      setCurrentSlide(idx);
      if (idx === 8) {
        setSelectedAction(null);
        setWidgetStep('select');
      }
    }
  }, []);

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard events when user is typing in an input
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'INPUT' || 
                       activeElement?.tagName === 'TEXTAREA' ||
                       (activeElement as HTMLElement)?.isContentEditable;
      
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (!isTyping) {
          e.preventDefault();
          goNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isTyping) {
          e.preventDefault();
          goPrev();
        }
      } else if (e.key >= '1' && e.key <= '9') {
        // Only navigate to slides if not typing in an input
        if (!isTyping) {
          const idx = parseInt(e.key) - 1;
          if (idx < SLIDES.length) goToSlide(idx);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, goToSlide]);

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="slide slide-title">
            <div className="title-content">
              <div className="title-badge">LI.FI Widget Enhancement</div>
              <h1 className="main-title">
                DeFi Actions Mode
                <span className="subtitle-line">Composer-Powered</span>
              </h1>
              <p className="title-desc">Turning LI.FI's Composer/zaps into a first-class widget mode to grow adoption across DeFi protocols, wallets, and chains.</p>
              <div className="author-info">
                <div className="author-role">
                  <span className="role-icon">🎯</span>
                  <span>PM for Widget/SDK</span>
                </div>
                <p className="role-focus">Focusing on turning existing infra (routing, Gas.zip, Composer) into productised, low-friction surfaces that integrators can adopt quickly and safely.</p>
              </div>
            </div>
            <div className="title-visual">
              <div className="visual-orb orb-1"></div>
              <div className="visual-orb orb-2"></div>
              <div className="visual-orb orb-3"></div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="slide slide-problem">
            <div className="slide-header">
              <span className="slide-number">01</span>
              <h2>Discovery: Problem & Opportunity</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="problem-card">
                  <h3><span className="icon-red">⚠️</span> Problem Today</h3>
                  <p className="lead">The widget is excellent at swap/bridge flows, but:</p>
                  <ul className="problem-list">
                    <li>Protocols want <strong>"deposit from any chain in one click"</strong></li>
                    <li>Wallets want cross-chain DeFi actions without owning complex flows</li>
                    <li>Composer exists but requires:
                      <ul>
                        <li>Knowing vault token addresses</li>
                        <li>Configuring Composer as a tool</li>
                        <li>Treating everything as "swap to token"</li>
                        <li>Managing UX around "weird" vault tokens</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="opportunity-card">
                  <h3><span className="icon-green">💡</span> Opportunity</h3>
                  <p className="lead">Leverage Composer to make DeFi actions a <strong>first-class widget mode</strong></p>
                  <div className="opportunity-points">
                    <div className="opp-point">
                      <span className="opp-icon">🎯</span>
                      <div><strong>Intent-based UX</strong><p>Users choose "Deposit into Morpho", not "swap to vault token"</p></div>
                    </div>
                    <div className="opp-point">
                      <span className="opp-icon">⚡</span>
                      <div><strong>Minimal Config</strong><p>Integrators enable actions with simple widget props</p></div>
                    </div>
                    <div className="opp-point">
                      <span className="opp-icon">🛡️</span>
                      <div><strong>Centralized Safety</strong><p>LI.FI maintains action templates, not each integrator</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="slide slide-feature">
            <div className="slide-header">
              <span className="slide-number">02</span>
              <h2>Proposed Feature: DeFi Actions Mode</h2>
            </div>
            <div className="slide-body">
              <div className="feature-intro">
                <p>Add a new widget mode where each <code>action.id</code> maps to a Composer flow template maintained by LI.FI.</p>
              </div>
              <CodeBlock code={`<LiFiWidget
  mode="defiActions"
  actions={[
    { id: 'morpho-usdc-base', label: 'Deposit into Morpho USDC Vault (Base)' },
    { id: 'aave-usdc-op',    label: 'Deposit into Aave USDC (Optimism)' },
    { id: 'pendle-steth-arb', label: 'Stake into Pendle stETH Pool (Arbitrum)' }
  ]}
/>`} />
              <ComparisonTable />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="slide slide-segments">
            <div className="slide-header">
              <span className="slide-number">03</span>
              <h2>Who It Serves & Why They Care</h2>
            </div>
            <div className="slide-body">
              <div className="segments-grid">
                <SegmentCard icon="🏦" title="DeFi Protocols" needs="Want one-click 'deposit from any chain' in their own UI" benefit="Embed via simple widget integration, no routing logic needed" />
                <SegmentCard icon="👛" title="Wallets" needs="Competing to become 'DeFi superapps' with cross-chain actions" benefit="Expose curated actions with minimal config, no backend required" />
                <SegmentCard icon="⛓️" title="Chains / Ecosystems" needs="Need onboarding flows: 'bridge + deposit into flagship protocol'" benefit="Ready-made onboarding surface powered by LI.FI" />
                <SegmentCard icon="📱" title="Fintech / Consumer Apps" needs="Want to offer 'earn' / 'deposit' products without building DeFi infra" benefit="Compliant, encapsulated experience out of the box" />
              </div>
              <div className="net-effect">
                <span className="effect-icon">🚀</span>
                <p><strong>Net Effect:</strong> Turns the widget from a bridge/swap tool into a <em>DeFi entry layer</em>, unlocking new markets beyond current use cases.</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="slide slide-scope">
            <div className="slide-header">
              <span className="slide-number">04</span>
              <h2>Design: Scope & Behaviour</h2>
            </div>
            <div className="slide-body three-col">
              <div className="scope-card">
                <h3>📋 MVP Scope</h3>
                <ul>
                  <li><strong>Chains:</strong> EVM-only (Composer limitation)</li>
                  <li><strong>Protocols:</strong> Morpho, Aave v3, Pendle, 1 restaking</li>
                  <li><strong>Actions:</strong> Deposit, Stake (no arbitrary calls in v1)</li>
                  <li><strong>Config:</strong> <code>mode="defiActions"</code> + actionIds</li>
                </ul>
              </div>
              <div className="scope-card">
                <h3>⚙️ Behaviour</h3>
                <ul>
                  <li>Widget shows "Actions" view (list or cards)</li>
                  <li>User: select → amount → route details → sign 1 tx</li>
                  <li>Backend: routing + Composer execution</li>
                  <li>Clear status & error messages</li>
                </ul>
              </div>
              <div className="scope-card">
                <h3>👥 Stakeholders</h3>
                <ul>
                  <li><strong>Engineering:</strong> Registry, routing changes</li>
                  <li><strong>Design:</strong> Actions UI, confirmation flow</li>
                  <li><strong>BD/DevRel:</strong> Design partners, feedback</li>
                  <li><strong>Protocols:</strong> Validate flows, maintain templates</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="slide slide-development">
            <div className="slide-header">
              <span className="slide-number">05</span>
              <h2>Development: Plan & Epics</h2>
            </div>
            <div className="slide-body">
              <div className="dev-overview">
                <div className="team-info"><span className="team-icon">👥</span><div><strong>Team:</strong> 3 engineers (1 tech lead, 2 devs)</div></div>
                <div className="target-info"><span className="target-icon">🎯</span><div><strong>Target:</strong> MVP in ~1–2 cycles with 1–2 protocols via test partner</div></div>
              </div>
              <Timeline items={[
                { phase: 'Action Registry & Backend', duration: '2-3 weeks', tasks: ['Data model: actionId → Composer spec + metadata', 'Admin flow for adding/updating actions', 'Safety checks (approved protocols only)'] },
                { phase: 'Widget Mode & UX', duration: '2-3 weeks', tasks: ['Implement mode="defiActions"', 'Actions list + detail/confirmation UI', 'Handle unsupported contexts gracefully'] },
                { phase: 'Routing & Composer Integration', duration: '2 weeks', tasks: ['Routing uses Composer flows as primary path', 'Fallback logic when unavailable', 'Error handling & recovery'] },
                { phase: 'Docs & Examples', duration: '1 week', tasks: ['Quickstart for wallets/protocols', 'Example repos & code snippets', 'Integration guide'] },
              ]} />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="slide slide-deployment">
            <div className="slide-header">
              <span className="slide-number">06</span>
              <h2>Deployment: Rollout & Success Criteria</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="rollout-section">
                  <h3>🚀 Rollout Phases</h3>
                  <div className="rollout-phases">
                    <div className="phase"><span className="phase-num">1</span><div className="phase-content"><strong>Internal QA</strong><p>Test flows with major chains/tokens, validate error handling</p></div></div>
                    <div className="phase"><span className="phase-num">2</span><div className="phase-content"><strong>Design Partner Beta</strong><p>1 protocol (Morpho/Aave) + 1 wallet integrator</p></div></div>
                    <div className="phase"><span className="phase-num">3</span><div className="phase-content"><strong>General Availability</strong><p>Full docs, blog announcement, targeted outreach</p></div></div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="metrics-section">
                  <h3>📊 Success Criteria</h3>
                  <div className="metrics-grid">
                    <MetricCard label="Integrator Adoption" value="10+" subtext="using defiActions mode" />
                    <MetricCard label="Protocol Coverage" value="5+" subtext="with published actions" />
                    <MetricCard label="Cross-chain Volume" value="↑30%" subtext="via DeFi Actions flows" trend="up" />
                    <MetricCard label="Support Reduction" value="↓50%" subtext="'how to build zap' queries" trend="down" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="slide slide-strategy">
            <div className="slide-header">
              <span className="slide-number">07</span>
              <h2>Strategic Fit & Next Steps</h2>
            </div>
            <div className="slide-body">
              <div className="strategy-grid">
                <div className="strategy-card main">
                  <h3>🎯 Strategic Fit</h3>
                  <ul className="strategy-points">
                    <li><strong>Amplifies LI.FI's position</strong> as "intent → execution" infra</li>
                    <li><strong>Drives widget adoption</strong> into new markets: no longer just bridge/swap</li>
                    <li><strong>Scales Composer</strong> from bespoke integrations to reusable product surface</li>
                  </ul>
                </div>
                <div className="strategy-card next">
                  <h3>🔮 After v1</h3>
                  <ul className="next-steps">
                    <li><span className="step-icon">📈</span> Expand action catalogue (more protocols, chains)</li>
                    <li><span className="step-icon">📊</span> Add analytics & recommendations ("most used actions")</li>
                    <li><span className="step-icon">⚡</span> LI.FI 2.0 integration: solvers, token standards, AA</li>
                  </ul>
                </div>
              </div>
              <div className="cta-section">
                <button className="demo-cta" onClick={() => goToSlide(8)}>
                  <span>See Live Demo</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="slide slide-demo">
            <div className="slide-header">
              <span className="slide-number">08</span>
              <h2>Live Demo: DeFi Actions Mode</h2>
            </div>
            <div className="slide-body demo-layout">
              <div className="demo-context">
                <h3>Interactive Prototype</h3>
                <p>Experience the proposed DeFi Actions Mode flow. Click through the widget to see:</p>
                <ul className="demo-features">
                  <li><span className="check">✓</span> Curated action selection</li>
                  <li><span className="check">✓</span> Cross-chain source configuration</li>
                  <li><span className="check">✓</span> Route preview with cost breakdown</li>
                  <li><span className="check">✓</span> One-click execution</li>
                </ul>
                <div className="demo-note">
                  <span className="note-icon">💡</span>
                  <span>This mockup demonstrates the UX flow. Actual implementation would use real LI.FI routing.</span>
                </div>
              </div>
              <WidgetMockup selectedAction={selectedAction} onSelectAction={setSelectedAction} step={widgetStep} onStepChange={setWidgetStep} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="defi-demo">
      <header className="demo-header">
        <Link to="/" className="back-link"><span>←</span><span>Exit Presentation</span></Link>
        <div className="header-center">
          <LiFiLogoHorizontal height={24} className="header-logo" />
          <span className="header-title">Widget – DeFi Actions Mode</span>
        </div>
        <div className="header-controls">
          <span className="keyboard-hint">Use ← → keys to navigate</span>
        </div>
      </header>

      <main className="demo-main">
        {renderSlideContent()}
      </main>

      <footer className="demo-footer">
        <SlideIndicator current={currentSlide} total={SLIDES.length} onNavigate={goToSlide} />
        <NavigationControls current={currentSlide} total={SLIDES.length} onPrev={goPrev} onNext={goNext} />
      </footer>
    </div>
  );
}
