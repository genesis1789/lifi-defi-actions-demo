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
  { id: 0, title: 'DeFi Actions Mode', subtitle: 'Feature Proposal' },
  { id: 1, title: 'Discovery', subtitle: 'Problem Definition' },
  { id: 2, title: 'Discovery', subtitle: 'Opportunity & Validation' },
  { id: 3, title: 'Design', subtitle: 'PRD Summary' },
  { id: 4, title: 'Design', subtitle: 'Flows & Configuration' },
  { id: 5, title: 'Development', subtitle: 'Epics & PM Role' },
  { id: 6, title: 'Deployment', subtitle: 'Rollout & Success' },
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
              <div className="title-badge">LI.FI Widget – Feature Proposal</div>
              <h1 className="main-title">
                DeFi Actions Mode
                <span className="subtitle-line">Composer-Powered</span>
              </h1>
              <p className="title-desc">Product iteration to make LI.FI Composer a first-class widget capability and grow adoption across protocols, wallets, and chains.</p>
              <div className="emphasis-callout">
                <span className="emphasis-icon">📋</span>
                <span className="emphasis-text">This presentation emphasizes <strong>Discovery</strong> and <strong>Design</strong></span>
              </div>
              <div className="overview-box">
                <div className="overview-item">
                  <span className="overview-label">Context</span>
                  <span className="overview-value">Composer delivers one-click multi-step DeFi flows via an on-chain VM. Today it's powerful but not productized in the widget.</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Proposal</span>
                  <span className="overview-value">Turn Composer into a simple, discoverable product surface: integrators configure actions by ID, LI.FI handles orchestration.</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Scope</span>
                  <span className="overview-value">MVP: EVM only, Morpho + Aave v3, deposit/stake actions, 1 design partner, testable in 1-2 cycles.</span>
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
              <h2>Discovery: Problem Definition</h2>
              <span className="phase-badge emphasized">Emphasized</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="blueprint-section">
                  <h3><span className="section-icon">❌</span> Where the Widget Falls Short</h3>
                  <p className="section-lead">Composer is technically integrated, but not productized:</p>
                  <ul className="compact-list">
                    <li>Widget remains primarily a swap/bridge UI</li>
                    <li>DeFi "zaps" (deposit, stake) are invisible or hard to discover</li>
                    <li>Integrators need internal LI.FI knowledge to use Composer well</li>
                  </ul>
                </div>
                <div className="blueprint-section">
                  <h3><span className="section-icon">👥</span> Who Is Affected</h3>
                  <ul className="compact-list">
                    <li><strong>DeFi protocols</strong> wanting "deposit into our vault from any chain"</li>
                    <li><strong>Wallets</strong> wanting to offer stake/deposit as part of their UX</li>
                    <li><strong>Chains</strong> wanting "bridge + deposit into flagship protocol" onboarding</li>
                    <li><strong>Fintech apps</strong> wanting yield features with minimal crypto infra</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="blueprint-section evidence">
                  <h3><span className="section-icon">📊</span> Evidence</h3>
                  <div className="evidence-grid">
                    <div className="evidence-item">
                      <span className="evidence-type">Partner signals</span>
                      <span className="evidence-detail">Protocols asking for zap/deposit flows (BD/DevRel calls)</span>
                    </div>
                    <div className="evidence-item">
                      <span className="evidence-type">Support tickets</span>
                      <span className="evidence-detail">Workarounds for vault token routing; "how do I bridge+deposit?"</span>
                    </div>
                    <div className="evidence-item">
                      <span className="evidence-type">Ecosystem trends</span>
                      <span className="evidence-detail">DeFi vault integrations becoming standard; protocols expect this</span>
                    </div>
                  </div>
                </div>
                <div className="blueprint-section widget-native">
                  <h3><span className="section-icon">✓</span> Why Widget-Native</h3>
                  <p>This is an <strong>end-user UX concern</strong>, not SDK/API-level. Users need to see and understand what action they're taking. The widget is the right surface to make DeFi actions discoverable and safe.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="slide slide-discovery">
            <div className="slide-header">
              <span className="slide-number">02</span>
              <h2>Discovery: Opportunity & Validation</h2>
              <span className="phase-badge emphasized">Emphasized</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="blueprint-section">
                  <h3><span className="section-icon">📈</span> Opportunity Sizing</h3>
                  <div className="sizing-grid">
                    <div className="sizing-item">
                      <span className="sizing-label">Partners impacted</span>
                      <span className="sizing-value">DeFi protocols, wallets, chains, fintech apps — broad reach</span>
                    </div>
                    <div className="sizing-item">
                      <span className="sizing-label">Flows involved</span>
                      <span className="sizing-value">Deposit, stake into vaults/pools — high-volume DeFi primitives</span>
                    </div>
                    <div className="sizing-item">
                      <span className="sizing-label">Volume at stake</span>
                      <span className="sizing-value">Multi-step flows that currently require custom integrations</span>
                    </div>
                  </div>
                </div>
                <div className="blueprint-section">
                  <h3><span className="section-icon">✓</span> Demand Validation</h3>
                  <ul className="compact-list numbered">
                    <li>3-5 partner conversations: Morpho, Aave, 1-2 wallets</li>
                    <li>Tech lead confirms Composer already supports required flows</li>
                    <li>Data check: support tickets and workarounds validate the gap</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="blueprint-section">
                  <h3><span className="section-icon">⚖️</span> Prioritization Rationale</h3>
                  <div className="priority-matrix">
                    <div className="priority-item high">
                      <span className="priority-factor">Impact</span>
                      <span className="priority-rating">High</span>
                      <span className="priority-reason">Unlocks new integrator segments</span>
                    </div>
                    <div className="priority-item high">
                      <span className="priority-factor">Confidence</span>
                      <span className="priority-rating">High</span>
                      <span className="priority-reason">Composer infra exists; validated demand</span>
                    </div>
                    <div className="priority-item medium">
                      <span className="priority-factor">Effort</span>
                      <span className="priority-rating">Medium</span>
                      <span className="priority-reason">Widget mode + action registry</span>
                    </div>
                  </div>
                  <p className="priority-summary">Extra weight: <strong>widely reusable</strong> across multiple strategic partners.</p>
                </div>
                <div className="blueprint-section proposal">
                  <h3><span className="section-icon">💡</span> Proposed Iteration</h3>
                  <p className="proposal-text">Introduce a <strong>DeFi Actions Mode</strong> where Composer flows are surfaced as <strong>named actions</strong>, not token destinations. Integrators think in user intents; LI.FI handles orchestration.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="slide slide-design">
            <div className="slide-header">
              <span className="slide-number">03</span>
              <h2>Design: PRD Summary</h2>
              <span className="phase-badge emphasized">Emphasized</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="prd-section">
                  <h3><span className="section-icon">🎯</span> Objective</h3>
                  <p className="prd-objective">Enable integrators to offer named DeFi actions via a simple widget configuration. LI.FI handles routing, orchestration, and safety.</p>
                </div>
                <div className="prd-section">
                  <h3><span className="section-icon">📏</span> Success Criteria</h3>
                  <ul className="success-criteria">
                    <li><span className="criteria-metric"># integrators</span> using <code>mode="defiActions"</code></li>
                    <li><span className="criteria-metric"># actions</span> defined and actively used</li>
                    <li><span className="criteria-metric">Volume</span> through DeFi Actions flows</li>
                    <li><span className="criteria-metric">Completion rate</span> vs comparable non-Composer flows</li>
                  </ul>
                </div>
                <div className="prd-section">
                  <h3><span className="section-icon">🚫</span> Non-Goals (v1)</h3>
                  <ul className="non-goals">
                    <li>Withdraw, repay, or custom eDSL flows</li>
                    <li>Non-EVM chains</li>
                    <li>User-defined or arbitrary actions</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="prd-section">
                  <h3><span className="section-icon">👤</span> Personas & JTBD</h3>
                  <div className="personas-grid">
                    <div className="persona-item">
                      <span className="persona-name">Protocol Teams</span>
                      <span className="persona-jtbd">"Help users deposit into our vault from any chain in one click"</span>
                    </div>
                    <div className="persona-item">
                      <span className="persona-name">Wallet Devs</span>
                      <span className="persona-jtbd">"Offer richer DeFi actions without building orchestration"</span>
                    </div>
                    <div className="persona-item">
                      <span className="persona-name">Chain Ecosystems</span>
                      <span className="persona-jtbd">"Onboarding: bridge + deposit into flagship protocol"</span>
                    </div>
                    <div className="persona-item">
                      <span className="persona-name">Fintech Apps</span>
                      <span className="persona-jtbd">"Yield/staking features with minimal crypto infra"</span>
                    </div>
                  </div>
                </div>
                <div className="prd-section solution-box">
                  <h3><span className="section-icon">💡</span> Solution Outline</h3>
                  <p className="solution-summary">New <code>mode="defiActions"</code> where each <code>actionId</code> maps to a Composer definition maintained by LI.FI + protocol partners.</p>
                  <div className="solution-capabilities">
                    <span className="capability">Route retrieval via API</span>
                    <span className="capability">Bridge + swap + deposit orchestration</span>
                    <span className="capability">Pre-execution simulation</span>
                    <span className="capability">Error handling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="slide slide-design">
            <div className="slide-header">
              <span className="slide-number">04</span>
              <h2>Design: Flows & Configuration</h2>
              <span className="phase-badge emphasized">Emphasized</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="prd-section">
                  <h3><span className="section-icon">🔄</span> User Flow</h3>
                  <div className="flow-steps">
                    <div className="flow-step-item"><span className="flow-n">1</span>User sees "Actions" view with available options</div>
                    <div className="flow-step-item"><span className="flow-n">2</span>Selects action (e.g. "Deposit into Morpho USDC on Base")</div>
                    <div className="flow-step-item"><span className="flow-n">3</span>Confirms amount and source chain/token</div>
                    <div className="flow-step-item"><span className="flow-n">4</span>Reviews combined route (bridge + swap + deposit)</div>
                    <div className="flow-step-item"><span className="flow-n">5</span>Signs single transaction orchestrated by LI.FI</div>
                  </div>
                </div>
                <div className="prd-section">
                  <h3><span className="section-icon">🛡️</span> Safety & Error Handling</h3>
                  <ul className="compact-list">
                    <li>All flows pre-simulated using Composer's simulation</li>
                    <li>Failures lead to clear messaging, no partial state on-chain</li>
                    <li>Actions curated/whitelisted by LI.FI</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="prd-section config-section">
                  <h3><span className="section-icon">⚙️</span> WidgetConfig Example</h3>
                  <CodeBlock code={`<LiFiWidget
  mode="defiActions"
  actions={[
    { id: 'morpho-usdc-base',
      label: 'Deposit into Morpho USDC' },
    { id: 'aave-usdc-op',
      label: 'Deposit into Aave USDC' }
  ]}
/>`} />
                </div>
                <div className="prd-section">
                  <h3><span className="section-icon">📱</span> Key Widget States</h3>
                  <div className="widget-states">
                    <div className="state-item"><span className="state-name">Action List</span><span className="state-desc">Available actions with APY, TVL</span></div>
                    <div className="state-item"><span className="state-name">Configuration</span><span className="state-desc">Amount, source chain/token selection</span></div>
                    <div className="state-item"><span className="state-name">Route Preview</span><span className="state-desc">Steps, fees, estimated time</span></div>
                    <div className="state-item"><span className="state-name">Success/Error</span><span className="state-desc">Clear outcome messaging</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="slide slide-development">
            <div className="slide-header">
              <span className="slide-number">05</span>
              <h2>Development: Epics & PM Role</h2>
            </div>
            <div className="slide-body">
              <div className="team-context">
                <span><strong>Team:</strong> Tech lead + 2 engineers</span>
                <span><strong>Target:</strong> Testable MVP in 1-2 cycles with 1 design partner</span>
              </div>
              <div className="epics-grid">
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E1</span>
                    <h4>Action Registry & Backend</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Backend representation: actionId → Composer definition</li>
                    <li>Admin/internal process for adding/removing actions</li>
                    <li>Ensure Composer enabled as "tool" for these routes</li>
                  </ul>
                </div>
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E2</span>
                    <h4>Widget Mode & UX</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Implement <code>mode="defiActions"</code></li>
                    <li>Actions list, details/confirmation screens</li>
                    <li>Handle unsupported chains/assets gracefully</li>
                  </ul>
                </div>
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E3</span>
                    <h4>Routing & Simulation</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Ensure API uses appropriate routes via Composer</li>
                    <li>Integrate simulation results into widget UX</li>
                    <li>Error handling and recovery flows</li>
                  </ul>
                </div>
                <div className="epic-card">
                  <div className="epic-header">
                    <span className="epic-num">E4</span>
                    <h4>Docs & Examples</h4>
                  </div>
                  <ul className="epic-tasks">
                    <li>Integration docs for wallets/protocols</li>
                    <li>Example minimal code snippets</li>
                    <li>Action catalogue documentation</li>
                  </ul>
                </div>
              </div>
              <div className="pm-involvement-section">
                <h4><span className="section-icon">📋</span> PM Involvement (per Blueprint)</h4>
                <div className="pm-tasks">
                  <div className="pm-task"><span className="pm-task-icon">→</span>Ensure MVP scope is tight and realistic</div>
                  <div className="pm-task"><span className="pm-task-icon">→</span>Connect implementation with integrator expectations</div>
                  <div className="pm-task"><span className="pm-task-icon">→</span>Coordinate with protocol partners (Morpho/Aave) on action definitions</div>
                  <div className="pm-task"><span className="pm-task-icon">→</span>Review early slices in staging with real wallets/chains</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="slide slide-deployment">
            <div className="slide-header">
              <span className="slide-number">06</span>
              <h2>Deployment: Rollout & Success</h2>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="deploy-section">
                  <h3><span className="section-icon">🚀</span> Release Process</h3>
                  <div className="release-phases">
                    <div className="release-phase">
                      <span className="phase-num">1</span>
                      <div className="phase-content">
                        <strong>Testing & QA</strong>
                        <p>E2E tests across chains, wallets, frameworks. Negative tests: invalid inputs, failed simulations, disabled actions.</p>
                      </div>
                    </div>
                    <div className="release-phase">
                      <span className="phase-num">2</span>
                      <div className="phase-content">
                        <strong>Beta Rollout</strong>
                        <p>Behind <code>config flag</code> to 1 DeFi protocol (Morpho or Aave) + 1 wallet partner. Track integration effort, completion rate, errors.</p>
                      </div>
                    </div>
                    <div className="release-phase">
                      <span className="phase-num">3</span>
                      <div className="phase-content">
                        <strong>General Release</strong>
                        <p>Updated docs, <code>Playground preset</code>, clear changelog, BD/DevRel outreach to target segments.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="deploy-section">
                  <h3><span className="section-icon">📊</span> Success Criteria</h3>
                  <ul className="success-metrics">
                    <li><span className="metric-label"># integrators</span> using <code>mode="defiActions"</code></li>
                    <li><span className="metric-label"># actions</span> defined and actively used</li>
                    <li><span className="metric-label">Volume & tx count</span> through these actions</li>
                    <li><span className="metric-label">Completion rate</span> vs non-Composer flows</li>
                    <li><span className="metric-label">Reduction in</span> custom zap work, support tickets</li>
                  </ul>
                </div>
                <div className="deploy-section future">
                  <h3><span className="section-icon">🔮</span> Future Iterations</h3>
                  <ul className="future-items">
                    <li>Expand: withdraw, repay, restake</li>
                    <li>More protocols as Composer adds support</li>
                    <li>Non-EVM when cross-VM orchestration exists</li>
                    <li>LI.FI 2.0: solvers, interop token standards</li>
                    <li>Longer term: action marketplace</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="cta-section">
              <button className="demo-cta" onClick={() => goToSlide(7)}>
                <span>See the Prototype</span>
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
              <h2>Interactive Prototype</h2>
            </div>
            <div className="slide-body demo-layout">
              <div className="demo-context">
                <h3>Validating the Design</h3>
                <p>This prototype demonstrates the UX decisions from the Design phase:</p>
                <ul className="demo-features">
                  <li><span className="check">✓</span> Action selection — named intents, not token addresses</li>
                  <li><span className="check">✓</span> Configuration — source chain/token, amount</li>
                  <li><span className="check">✓</span> Route preview — transparent multi-step flow</li>
                  <li><span className="check">✓</span> Single-tx execution — all complexity hidden</li>
                </ul>
                <div className="demo-note">
                  <span className="note-icon">💡</span>
                  <span>Prototype only — production would use live LI.FI API + Composer simulation.</span>
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
