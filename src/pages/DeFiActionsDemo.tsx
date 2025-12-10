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
  { id: 0, title: 'Overview', subtitle: '' },
  { id: 1, title: 'Discovery', subtitle: 'The Gap' },
  { id: 2, title: 'Solution', subtitle: 'DeFi Actions Mode' },
  { id: 3, title: 'Design', subtitle: 'MVP Scope' },
  { id: 4, title: 'Development', subtitle: 'Epics' },
  { id: 5, title: 'Deployment', subtitle: 'Rollout' },
  { id: 6, title: 'Next Steps', subtitle: '' },
  { id: 7, title: 'Demo', subtitle: '' },
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
      if (idx === 7) {
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
              <div className="title-badge">Widget Product Iteration</div>
              <h1 className="main-title">
                DeFi Actions Mode
                <span className="subtitle-line">Productizing Composer</span>
              </h1>
              <p className="title-desc">Turning Composer from an infra capability into a simple, discoverable widget mode that unlocks new integrator segments.</p>
              <div className="overview-box">
                <div className="overview-item">
                  <span className="overview-label">Problem</span>
                  <span className="overview-value">Composer exists but isn't productized — integrators can't easily offer "deposit from any chain" flows</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Solution</span>
                  <span className="overview-value">New widget mode where integrators configure DeFi actions by ID, LI.FI handles orchestration</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Scope</span>
                  <span className="overview-value">MVP with 2-3 protocols (Morpho, Aave), 1 design partner, testable in 1-2 cycles</span>
                </div>
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
          <div className="slide slide-discovery">
            <div className="slide-header">
              <span className="slide-number">01</span>
              <h2>Discovery: The Gap</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="discovery-section">
                  <h3>What Composer Can Do</h3>
                  <ul className="compact-list">
                    <li>Bundle multiple on-chain calls into one tx (swap → bridge → deposit)</li>
                    <li>Execute via LI.FI's on-chain VM + eDSL</li>
                    <li>Supports Morpho, Aave v3, Euler, Pendle today</li>
                  </ul>
                </div>
                <div className="discovery-section">
                  <h3>What Integrators Have to Do Today</h3>
                  <ul className="compact-list numbered">
                    <li>Know vault token addresses, pass as <code>toToken</code></li>
                    <li>Enable Composer as a "tool" in routing config</li>
                    <li>Present flows as "swap to token X" (not "deposit into Morpho")</li>
                    <li>Build custom UX to explain what's actually happening</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="gap-card">
                  <h3>The Gap</h3>
                  <p>Composer is <strong>integrated but not productized</strong>.</p>
                  <div className="gap-points">
                    <div className="gap-point">
                      <span className="gap-icon">→</span>
                      <span>Widget is still a swap/bridge UI — DeFi actions aren't discoverable</span>
                    </div>
                    <div className="gap-point">
                      <span className="gap-icon">→</span>
                      <span>Integrators need LI.FI-internal knowledge to use Composer well</span>
                    </div>
                    <div className="gap-point">
                      <span className="gap-icon">→</span>
                      <span>No self-serve path for protocols/wallets wanting "deposit from any chain"</span>
                    </div>
                  </div>
                </div>
                <div className="opportunity-card-v2">
                  <h3>Opportunity</h3>
                  <p>Surface Composer flows as <strong>named actions</strong> in the widget. Integrators configure by action ID; LI.FI handles everything else.</p>
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
              <h2>Solution: DeFi Actions Mode</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="solution-section">
                  <h3>The Change</h3>
                  <p className="solution-desc">New widget mode where each <code>actionId</code> maps to a Composer flow maintained by LI.FI.</p>
                  <CodeBlock code={`<LiFiWidget
  mode="defiActions"
  actions={[
    { id: 'morpho-usdc-base' },
    { id: 'aave-usdc-op' }
  ]}
/>`} />
                </div>
                <div className="what-widget-does">
                  <h4>Widget handles:</h4>
                  <ul className="compact-list">
                    <li>Route retrieval via LI.FI API + Composer</li>
                    <li>Bridge → swap → deposit orchestration</li>
                    <li>Pre-tx simulation, error states</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="comparison-simple">
                  <div className="compare-row header">
                    <span></span>
                    <span>Today</span>
                    <span>With DeFi Actions</span>
                  </div>
                  <div className="compare-row">
                    <span>Integrator thinks in</span>
                    <span>Tokens + tools</span>
                    <span>User intents</span>
                  </div>
                  <div className="compare-row">
                    <span>Config required</span>
                    <span>Vault addresses, Composer flags</span>
                    <span>Action IDs only</span>
                  </div>
                  <div className="compare-row">
                    <span>UX work</span>
                    <span>Build from scratch</span>
                    <span>Out of the box</span>
                  </div>
                  <div className="compare-row">
                    <span>Maintenance</span>
                    <span>Each integrator</span>
                    <span>LI.FI centrally</span>
                  </div>
                </div>
                <div className="target-users-compact">
                  <h4>Target integrators:</h4>
                  <div className="user-tags">
                    <span className="user-tag">DeFi protocols</span>
                    <span className="user-tag">Wallets</span>
                    <span className="user-tag">Chains/ecosystems</span>
                    <span className="user-tag">Fintech apps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="slide slide-scope">
            <div className="slide-header">
              <span className="slide-number">03</span>
              <h2>Design: MVP Scope</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="scope-section">
                  <h3>In Scope</h3>
                  <ul className="scope-list">
                    <li><strong>Chains:</strong> EVM only (Composer constraint)</li>
                    <li><strong>Protocols:</strong> Morpho, Aave v3 — already supported by Composer</li>
                    <li><strong>Actions:</strong> Deposit, stake into vaults/pools</li>
                    <li><strong>Flow:</strong> Select action → configure amount/source → review route → sign 1 tx</li>
                  </ul>
                </div>
                <div className="scope-section">
                  <h3>Out of Scope (v1)</h3>
                  <ul className="scope-list muted">
                    <li>Withdraw, repay, or custom eDSL flows</li>
                    <li>Non-EVM chains</li>
                    <li>User-defined actions</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="behaviour-section">
                  <h3>User Flow</h3>
                  <div className="flow-steps">
                    <div className="flow-step-item"><span className="flow-n">1</span>User selects action (e.g. "Deposit into Morpho USDC on Base")</div>
                    <div className="flow-step-item"><span className="flow-n">2</span>Chooses amount and source chain/token</div>
                    <div className="flow-step-item"><span className="flow-n">3</span>Reviews combined route (bridge + swap + deposit)</div>
                    <div className="flow-step-item"><span className="flow-n">4</span>Signs single transaction</div>
                  </div>
                </div>
                <div className="safety-section">
                  <h3>Safety</h3>
                  <ul className="scope-list">
                    <li>All routes pre-simulated via Composer</li>
                    <li>Failures surface clear errors, no partial state</li>
                    <li>Actions curated/whitelisted by LI.FI</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="slide slide-development">
            <div className="slide-header">
              <span className="slide-number">04</span>
              <h2>Development: Epics</h2>
            </div>
            <div className="slide-body">
              <div className="team-context">
                <span><strong>Team:</strong> Tech lead + 2 engineers</span>
                <span><strong>Target:</strong> Testable MVP in 1-2 cycles with design partner</span>
              </div>
              <div className="epics-grid">
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E1</span>
                    <h4>Action Registry</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Backend: actionId → Composer definition mapping</li>
                    <li>Admin process for adding/updating actions</li>
                    <li>Ensure Composer enabled as tool for these routes</li>
                  </ul>
                </div>
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E2</span>
                    <h4>Widget Mode</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Implement <code>mode="defiActions"</code></li>
                    <li>Actions list, configuration, confirmation screens</li>
                    <li>Handle unsupported chains/assets gracefully</li>
                  </ul>
                </div>
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E3</span>
                    <h4>Routing + Simulation</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Ensure API returns appropriate routes via Composer</li>
                    <li>Integrate simulation results into widget UX</li>
                    <li>Error handling and recovery</li>
                  </ul>
                </div>
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E4</span>
                    <h4>Docs + Examples</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Integration guide for protocols/wallets</li>
                    <li>Example code snippets</li>
                    <li>Action catalogue documentation</li>
                  </ul>
                </div>
              </div>
              <div className="pm-role">
                <strong>PM role:</strong> Tight scope, connect eng to integrator expectations, coordinate with protocol partners (Morpho/Aave) on action definitions.
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="slide slide-deployment">
            <div className="slide-header">
              <span className="slide-number">05</span>
              <h2>Deployment: Rollout</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="rollout-section-v2">
                  <h3>Rollout Plan</h3>
                  <div className="rollout-steps">
                    <div className="rollout-step">
                      <span className="rollout-phase">Internal QA</span>
                      <p>E2E tests across major chains/tokens. Negative tests: invalid inputs, failed simulations.</p>
                    </div>
                    <div className="rollout-step">
                      <span className="rollout-phase">Design Partner Beta</span>
                      <p>1 protocol (Morpho or Aave) + 1 wallet. Validate integration effort, UX clarity, conversion.</p>
                    </div>
                    <div className="rollout-step">
                      <span className="rollout-phase">Public Launch</span>
                      <p>Docs update, changelog, announcement. BD/DevRel outreach to target segments.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="success-section">
                  <h3>Success Metrics</h3>
                  <ul className="metrics-list">
                    <li><span className="metric-label"># integrators</span> using <code>mode="defiActions"</code></li>
                    <li><span className="metric-label"># actions</span> defined and actively used</li>
                    <li><span className="metric-label">Volume</span> through DeFi Actions flows</li>
                    <li><span className="metric-label">Completion rate</span> vs comparable non-Composer flows</li>
                  </ul>
                </div>
                <div className="success-section">
                  <h3>Qualitative</h3>
                  <ul className="metrics-list">
                    <li>Reduction in custom zap integration work</li>
                    <li>Fewer "how do I build bridge+deposit" support tickets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="slide slide-strategy">
            <div className="slide-header">
              <span className="slide-number">06</span>
              <h2>Next Steps</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="strategy-section">
                  <h3>Why This Matters</h3>
                  <ul className="strategy-list">
                    <li><strong>Uses existing infra:</strong> Composer VM, eDSL, simulation — no new primitives required</li>
                    <li><strong>Expands widget positioning:</strong> From swap/bridge tool to DeFi orchestration layer</li>
                    <li><strong>Aligns with LI.FI narrative:</strong> Intent → execution, across chains, in one action</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="future-section">
                  <h3>After MVP</h3>
                  <ul className="future-list">
                    <li>More actions: withdraw, repay, restake</li>
                    <li>More protocols as Composer adds support</li>
                    <li>Non-EVM support when orchestration exists cross-VM</li>
                    <li>Deeper LI.FI 2.0 integration (solvers, interop standards)</li>
                    <li>Longer term: action marketplace for vetted protocols</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="cta-section">
              <button className="demo-cta" onClick={() => goToSlide(7)}>
                <span>See the prototype</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="slide slide-demo">
            <div className="slide-header">
              <span className="slide-number">07</span>
              <h2>Demo</h2>
            </div>
            <div className="slide-body demo-layout">
              <div className="demo-context">
                <h3>Prototype</h3>
                <p>Interactive mockup showing the proposed user flow:</p>
                <ul className="demo-features">
                  <li><span className="check">✓</span> Action selection</li>
                  <li><span className="check">✓</span> Source chain/token configuration</li>
                  <li><span className="check">✓</span> Route preview + fee breakdown</li>
                  <li><span className="check">✓</span> Single-tx execution</li>
                </ul>
                <div className="demo-note">
                  <span className="note-icon">ℹ️</span>
                  <span>UX prototype only — actual implementation would use live LI.FI routing.</span>
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
