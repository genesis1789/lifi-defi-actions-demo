import { useState, useEffect, useCallback } from 'react';
import './DeFiActionsDemo.css';

// === Li.Fi Logo Components ===
function LiFiLogoIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path fill="#fff" d="m31.751 0 13.172 13.171a4 4 0 0 1 0 5.657l-7.838 7.838-5.334-5.333c-5.89-5.89-5.89-15.442 0-21.333Z"/>
      <path fill="#fff" fillRule="evenodd" d="M31.752 64 10.418 42.667c-5.89-5.891-5.89-15.443 0-21.334l18.505 18.505a4 4 0 0 0 5.657 0l18.505-18.505c5.891 5.891 5.891 15.443 0 21.334L31.752 64Z" clipRule="evenodd"/>
    </svg>
  );
}

function LiFiLogoHorizontal({ className = '', height = 32 }: { className?: string; height?: number }) {
  const width = (132 / 48) * height;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 132 48" fill="none" className={className}>
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
  phase?: string;
}

// === Data ===
const SLIDES: Slide[] = [
  { id: 0, title: 'DeFi Actions Mode', subtitle: 'Composer-Powered', phase: 'title' },
  { id: 1, title: 'Discovery', subtitle: 'The Real Problem', phase: 'discovery' },
  { id: 2, title: 'Discovery', subtitle: 'Commercial Impact', phase: 'discovery' },
  { id: 3, title: 'Solution', subtitle: 'DeFi Actions Mode', phase: 'solution' },
  { id: 4, title: 'Analysis', subtitle: 'Why The Gap Exists', phase: 'analysis' },
  { id: 5, title: 'Design', subtitle: 'PRD Snapshot', phase: 'design' },
  { id: 6, title: 'Development', subtitle: 'Epics & Plan', phase: 'development' },
  { id: 7, title: 'Deployment', subtitle: 'Testing & Rollout', phase: 'deployment' },
  { id: 8, title: 'Success', subtitle: 'Metrics & Criteria', phase: 'success' },
  { id: 9, title: 'Strategy', subtitle: 'Future & Fit', phase: 'strategy' },
];

const DEFI_ACTIONS: DeFiAction[] = [
  { id: 'morpho-usdc-base', label: 'Deposit into Morpho USDC Vault', protocol: 'Morpho', type: 'deposit', chain: 'Base', chainId: 8453, apy: '8.2%', tvl: '$142M', icon: '🔵', color: '#0052FF' },
  { id: 'aave-usdc-op', label: 'Deposit into Aave USDC', protocol: 'Aave', type: 'deposit', chain: 'Optimism', chainId: 10, apy: '5.4%', tvl: '$312M', icon: '👻', color: '#B6509E' },
  { id: 'pendle-steth-arb', label: 'Stake into Pendle PT-eETH', protocol: 'Pendle', type: 'stake', chain: 'Arbitrum', chainId: 42161, apy: '12.1%', tvl: '$89M', icon: '🔮', color: '#00D395' },
  { id: 'eigenlayer-eth', label: 'Restake ETH on EigenLayer', protocol: 'EigenLayer', type: 'stake', chain: 'Ethereum', chainId: 1, apy: '4.2%', tvl: '$15.2B', icon: '🟣', color: '#7B3FE4' },
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
          title={`${SLIDES[i].title}${SLIDES[i].subtitle ? ': ' + SLIDES[i].subtitle : ''}`}
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

function CodeBlock({ code, filename = 'widget-config.tsx' }: { code: string; filename?: string }) {
  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">tsx</span>
        <span className="code-file">{filename}</span>
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

  const formatNumber = (value: string): string => {
    const num = value.replace(/,/g, '');
    if (!num || isNaN(Number(num))) return value;
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    const balance = sourceToken.balance.replace(/,/g, '');
    setAmount(balance);
  };

  const getUsdValue = (): string => {
    const num = parseFloat(amount.replace(/,/g, '') || '0');
    if (sourceToken.symbol === 'ETH') return (num * 2150).toFixed(2);
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
                <button key={action.id} className="action-card" onClick={() => { onSelectAction(action); onStepChange('configure'); }}>
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
                          <div key={chain.id} className={`dropdown-item ${idx === sourceChainIndex ? 'selected' : ''}`} onClick={() => { setSourceChainIndex(idx); setShowChainDropdown(false); }}>
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
                          <div key={token.symbol} className={`dropdown-item ${idx === sourceTokenIndex ? 'selected' : ''}`} onClick={() => { setSourceTokenIndex(idx); setShowTokenDropdown(false); setAmount(''); }}>
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
                  <input type="text" value={formatNumber(amount)} onChange={handleAmountChange} placeholder="0.00" inputMode="decimal" />
                  <span className="amount-symbol">{sourceToken.symbol}</span>
                  <button className="max-btn" onClick={handleMaxClick}>MAX</button>
                </div>
                <div className="amount-info">
                  <span className="balance">Balance: {sourceToken.balance} {sourceToken.symbol}</span>
                  {amount && <span className="usd-value">≈ ${formatNumber(getUsdValue())}</span>}
                </div>
              </div>
              <button className="widget-cta" onClick={() => onStepChange('review')} disabled={!isValidAmount()}>
                {!amount ? 'Enter Amount' : !isValidAmount() ? 'Insufficient Balance' : `Review ${selectedAction.type === 'deposit' ? 'Deposit' : 'Stake'}`}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && selectedAction && (
          <div className="widget-content review-content">
            <div className="review-section">
              <div className="review-header">Review Transaction</div>
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
              <div className="security-badge">
                <span className="shield-icon">🛡️</span>
                <div className="security-text">
                  <span className="security-title">Protected by LI.FI</span>
                  <span className="security-subtitle">Audited routes • Pre-simulated execution</span>
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
          <span className="powered-by">Powered by LI.FI Composer</span>
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
      if (idx === 9) {
        setSelectedAction(null);
        setWidgetStep('select');
      }
    }
  }, []);

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || (activeElement as HTMLElement)?.isContentEditable;
      
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (!isTyping) { e.preventDefault(); goNext(); }
      } else if (e.key === 'ArrowLeft') {
        if (!isTyping) { e.preventDefault(); goPrev(); }
      } else if (e.key >= '1' && e.key <= '9') {
        if (!isTyping) {
          const idx = parseInt(e.key) - 1;
          if (idx < SLIDES.length) goToSlide(idx);
        }
      } else if (e.key === '0') {
        if (!isTyping) goToSlide(9);
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
              <p className="title-desc">Turning complex DeFi workflows into first-class, integrator-friendly "actions."</p>
              
              <div className="role-context">
                <div className="role-header">
                  <span className="role-icon">👤</span>
                  <span className="role-title">My Role</span>
                </div>
                <p className="role-desc">Product Manager for LI.FI Widget & SDK — responsible for adoption, integrator UX, reducing integration effort, and aligning widget capabilities with LI.FI's broader intent strategy.</p>
              </div>

              <div className="goal-box">
                <span className="goal-label">Goal of this iteration</span>
                <p className="goal-text">Grow widget adoption by enabling new markets and use cases—specifically, protocol-level onboarding and cross-chain DeFi flows that today require custom engineering.</p>
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
              <h2>Discovery: The Real Problem</h2>
              <span className="phase-badge discovery">Discovery</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="fact-box">
                  <span className="fact-label">Fact</span>
                  <p>The LI.FI Widget today optimizes for <strong>liquidity routing</strong>:</p>
                  <div className="quote-block">"Go from token A on chain X to token B on chain Y."</div>
                  <p className="fact-contrast">But DeFi protocols don't want <em>token routing</em>. They want <strong>action routing</strong>.</p>
                </div>

                <div className="requests-section">
                  <h3>Common Partner Requests</h3>
                  <div className="request-list">
                    <div className="request-item">
                      <span className="request-icon">🏦</span>
                      <span>"Let users <strong>deposit into our vault</strong> from any chain."</span>
                    </div>
                    <div className="request-item">
                      <span className="request-icon">🎯</span>
                      <span>"Let users <strong>stake into our pool</strong> in one click."</span>
                    </div>
                    <div className="request-item">
                      <span className="request-icon">📈</span>
                      <span>"Let users <strong>open a leveraged position</strong> cross-chain."</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="composer-box">
                  <h3>What Exists Today: Composer</h3>
                  <p>Composer already provides powerful multi-step, on-chain orchestrated flows <code>(swap→bridge→deposit)</code>.</p>
                  <div className="but-section">
                    <span className="but-label">But:</span>
                    <ul className="limitation-list">
                      <li>It's treated as an <strong>advanced tool</strong>, not a productized widget feature</li>
                      <li>Integrators must know vault token addresses</li>
                      <li>Integrators must manually whitelist Composer</li>
                      <li>Integrators must understand zap semantics</li>
                      <li>Integrators must map flows to UX themselves</li>
                    </ul>
                  </div>
                </div>

                <div className="gap-highlight">
                  <span className="gap-emoji">🔹</span>
                  <div className="gap-text">
                    <p>LI.FI has the infra for one-click DeFi actions…</p>
                    <p className="gap-contrast">…but not the product surface that exposes it scalably.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="slide slide-commercial">
            <div className="slide-header">
              <span className="slide-number">02</span>
              <h2>Discovery: Why This Matters Commercially</h2>
              <span className="phase-badge discovery">Discovery</span>
            </div>
            <div className="slide-body">
              <div className="segments-section">
                <h3>Target Segments Affected</h3>
                <div className="segments-grid-v3">
                  <div className="segment-card-v3">
                    <div className="segment-header-v3">
                      <span className="segment-icon-v3">🏦</span>
                      <h4>Protocols</h4>
                      <span className="segment-examples">Morpho, Aave, Pendle, LRTs, RWAs</span>
                    </div>
                    <p className="segment-want">Want frictionless cross-chain onboarding</p>
                    <p className="segment-pain">Lose users today due to multi-step flows</p>
                  </div>
                  <div className="segment-card-v3">
                    <div className="segment-header-v3">
                      <span className="segment-icon-v3">📱</span>
                      <h4>Wallets & Superapps</h4>
                    </div>
                    <p className="segment-want">Want to deepen UX and improve retention</p>
                    <p className="segment-pain">Prefer config-based features over custom orchestration</p>
                  </div>
                  <div className="segment-card-v3">
                    <div className="segment-header-v3">
                      <span className="segment-icon-v3">⛓️</span>
                      <h4>Chains / Appchains</h4>
                    </div>
                    <p className="segment-want">Want Day-1 onboarding flows using LI.FI infra</p>
                    <p className="segment-pain">Composer-powered flows are a strong selling point</p>
                  </div>
                </div>
              </div>

              <div className="opportunity-strategy">
                <div className="opportunity-box">
                  <h3>🎯 Opportunity</h3>
                  <p>Create a <strong>generalizable, low-effort way</strong> to onboard users into any protocol across chains.</p>
                </div>
                <div className="strategy-box">
                  <h3>Strategic Alignment with LI.FI 2.0</h3>
                  <div className="strategy-flow">
                    <span className="flow-step">Routing</span>
                    <span className="flow-arrow">→</span>
                    <span className="flow-step highlight">Orchestration (Composer)</span>
                    <span className="flow-arrow">→</span>
                    <span className="flow-step">Intents (Catalyst)</span>
                  </div>
                  <p className="strategy-conclusion">DeFi Actions Mode is the <strong>first integrator-facing expression</strong> of LI.FI's intent stack.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="slide slide-solution">
            <div className="slide-header">
              <span className="slide-number">03</span>
              <h2>Proposed Iteration: DeFi Actions Mode</h2>
              <span className="phase-badge solution">Solution</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="what-section">
                  <h3>What It Is</h3>
                  <p className="what-desc">A new widget mode that exposes Composer flows as <strong>predefined, named actions</strong> instead of "swap to token."</p>
                  
                  <div className="examples-list">
                    <div className="example-item"><span className="example-bullet">●</span>Deposit into Morpho USDC Vault (Base)</div>
                    <div className="example-item"><span className="example-bullet">●</span>Stake into Pendle PT-eETH</div>
                    <div className="example-item"><span className="example-bullet">●</span>Deposit USDC into Aave on Optimism</div>
                  </div>
                </div>

                <div className="how-section">
                  <h3>How It Works</h3>
                  <div className="how-steps">
                    <div className="how-step">
                      <span className="how-num">1</span>
                      <span>LI.FI maintains an <strong>Action Registry</strong></span>
                    </div>
                    <div className="how-step">
                      <span className="how-num">2</span>
                      <span>Each action maps to a Composer zap + metadata</span>
                    </div>
                    <div className="how-step">
                      <span className="how-num">3</span>
                      <span>Widget executes: <code>swap → bridge → swap → deposit → return vault token</code></span>
                    </div>
                  </div>
                </div>

                <CodeBlock code={`<LiFiWidget
  mode="defiActions"
  actions={[
    { id: "morpho-usdc-base" },
    { id: "aave-usdc-op" }
  ]}
/>`} />
              </div>
              <div className="col">
                <div className="benefits-section">
                  <h3>What Integrators Get</h3>
                  <div className="benefits-grid">
                    <div className="benefit-item removed">
                      <span className="benefit-icon">✗</span>
                      <span>No zap logic</span>
                    </div>
                    <div className="benefit-item removed">
                      <span className="benefit-icon">✗</span>
                      <span>No contract orchestration</span>
                    </div>
                    <div className="benefit-item removed">
                      <span className="benefit-icon">✗</span>
                      <span>No vault-token plumbing</span>
                    </div>
                    <div className="benefit-item removed">
                      <span className="benefit-icon">✗</span>
                      <span>No multi-step UX design</span>
                    </div>
                    <div className="benefit-item added">
                      <span className="benefit-icon">→</span>
                      <span><strong>Just configure and go.</strong></span>
                    </div>
                  </div>
                </div>

                <div className="widget-preview-box">
                  <h4>Preview</h4>
                  <WidgetMockup selectedAction={selectedAction} onSelectAction={setSelectedAction} step={widgetStep} onStepChange={setWidgetStep} />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="slide slide-analysis">
            <div className="slide-header">
              <span className="slide-number">04</span>
              <h2>Why This Problem Still Exists (Despite Composer)</h2>
              <span className="phase-badge analysis">Analysis</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="insight-box">
                  <h3>Composer ≠ Product</h3>
                  <p>Composer today is:</p>
                  <div className="composer-traits">
                    <span className="trait">powerful</span>
                    <span className="trait">generic</span>
                    <span className="trait">flexible</span>
                  </div>
                  <p className="but-not">…but <strong>not packaged</strong> for integrators in a zero-effort way.</p>
                </div>

                <div className="integrator-burden">
                  <h3>Integrators Still Need To:</h3>
                  <ul className="burden-list">
                    <li>Know which vault token corresponds to which protocol action</li>
                    <li>Understand when to use <code>/quote</code> vs <code>/advanced/routes</code></li>
                    <li>Manually request Composer whitelisting</li>
                    <li>Design their own UX for multi-step DeFi flows</li>
                  </ul>
                </div>
              </div>
              <div className="col">
                <div className="widget-model-box">
                  <h3>Widget's Current Model</h3>
                  <div className="model-points">
                    <div className="model-point">
                      <span className="point-icon">📊</span>
                      <span>Presents <strong>tokens</strong>, not protocol actions</span>
                    </div>
                    <div className="model-point">
                      <span className="point-icon">❓</span>
                      <span>Does not distinguish: deposits vs swaps, staking vs bridging, actions with position tokens</span>
                    </div>
                    <div className="model-point">
                      <span className="point-icon">🔧</span>
                      <span>Operates at <strong>liquidity level</strong>, not intent level</span>
                    </div>
                  </div>
                </div>

                <div className="gap-summary">
                  <h3>Therefore, the gap remains:</h3>
                  <div className="gap-statement">
                    <p>LI.FI has the infra for one-click DeFi UX but lacks a <strong>turnkey, productized interface</strong> for it.</p>
                    <p className="closing-statement">This iteration closes that gap.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="slide slide-design">
            <div className="slide-header">
              <span className="slide-number">05</span>
              <h2>Design: PRD Snapshot</h2>
              <span className="phase-badge design">Design</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="prd-goal">
                  <h3>🎯 Goal</h3>
                  <p>Provide integrators with a safe, curated, frictionless way to use Composer flows.</p>
                </div>

                <div className="core-requirements">
                  <h3>Core Requirements</h3>
                  <div className="requirement-card">
                    <span className="req-num">1</span>
                    <div className="req-content">
                      <strong>Action List UI</strong>
                      <p>Predefined actions shown as selectable tiles. Metadata: protocol logo, chain, APR (optional, source-controlled)</p>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <span className="req-num">2</span>
                    <div className="req-content">
                      <strong>Action Detail & Route Summary</strong>
                      <p>Shows swap/bridge/deposit steps abstracted. Highlights gas usage, expected output vault token</p>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <span className="req-num">3</span>
                    <div className="req-content">
                      <strong>Routing / Execution</strong>
                      <p>Uses Composer tool automatically. Integrates pre-execution simulation. Surfaces failure reasons clearly</p>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <span className="req-num">4</span>
                    <div className="req-content">
                      <strong>Configuration Options</strong>
                      <p>Which actions to expose, which chains/tokens to allow, default risk messaging</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="nfr-section">
                  <h3>Non-Functional Requirements</h3>
                  <ul className="nfr-list">
                    <li>Must fail safely if Composer unavailable</li>
                    <li>Must work with existing Permit2/712 integrations</li>
                    <li>Should not require protocol updates by integrators</li>
                  </ul>
                </div>

                <div className="assumptions-section">
                  <h3>Assumptions (To Validate)</h3>
                  <div className="assumption-list">
                    <div className="assumption-item">
                      <span className="assumption-status">?</span>
                      <span>Protocols prefer LI.FI-maintained zap definitions</span>
                    </div>
                    <div className="assumption-item">
                      <span className="assumption-status">?</span>
                      <span>Wallets are comfortable exposing curated actions</span>
                    </div>
                    <div className="assumption-item">
                      <span className="assumption-status">?</span>
                      <span>Risk disclaimers can remain lightweight (pending legal review)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="slide slide-development">
            <div className="slide-header">
              <span className="slide-number">06</span>
              <h2>Development: Epics & Plan</h2>
              <span className="phase-badge development">Development</span>
            </div>
            <div className="slide-body">
              <div className="epics-grid-v2">
                <div className="epic-card-v2">
                  <div className="epic-header-v2">
                    <span className="epic-num">1</span>
                    <h4>Action Registry (Backend)</h4>
                  </div>
                  <ul className="epic-items">
                    <li>Data model: <code>actionId → Composer spec + metadata</code></li>
                    <li>Tooling for LI.FI team to update registry safely</li>
                    <li>Versioning for protocol vault changes</li>
                  </ul>
                </div>
                <div className="epic-card-v2">
                  <div className="epic-header-v2">
                    <span className="epic-num">2</span>
                    <h4>Widget Experience</h4>
                  </div>
                  <ul className="epic-items">
                    <li><code>mode="defiActions"</code></li>
                    <li>Action list, detail page, simulation state</li>
                    <li>Signing UX: single-transaction execution</li>
                  </ul>
                </div>
                <div className="epic-card-v2">
                  <div className="epic-header-v2">
                    <span className="epic-num">3</span>
                    <h4>Routing & Composer Integration</h4>
                  </div>
                  <ul className="epic-items">
                    <li>Ensure <code>/advanced/routes</code> pulls correct Composer tool</li>
                    <li>Integrate simulation results</li>
                    <li>Error handling & fallback behavior</li>
                  </ul>
                </div>
                <div className="epic-card-v2">
                  <div className="epic-header-v2">
                    <span className="epic-num">4</span>
                    <h4>Docs, Examples, Telemetry</h4>
                  </div>
                  <ul className="epic-items">
                    <li>Developer guide: "How to enable DeFi Actions Mode"</li>
                    <li>Tracking: view → select → quote → submit → success/fail</li>
                    <li>Playground config support</li>
                  </ul>
                </div>
              </div>

              <div className="pm-role-section">
                <h3>My Role as PM</h3>
                <div className="pm-responsibilities">
                  <div className="pm-item"><span className="pm-bullet">●</span>Keep scope tight (deposit-focused MVP)</div>
                  <div className="pm-item"><span className="pm-bullet">●</span>Ensure UX clarity around risk and staking</div>
                  <div className="pm-item"><span className="pm-bullet">●</span>Validate staging w/ design partners (wallet, protocol)</div>
                  <div className="pm-item"><span className="pm-bullet">●</span>Drive alignment between engineering, DevRel, BD</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="slide slide-deployment">
            <div className="slide-header">
              <span className="slide-number">07</span>
              <h2>Deployment & Testing Plan</h2>
              <span className="phase-badge deployment">Deployment</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="qa-section">
                  <h3>Internal QA</h3>
                  <p>Test actions across multiple chains (ETH, Base, OP, Arbitrum)</p>
                  <div className="failure-modes">
                    <h4>Simulate failure modes:</h4>
                    <ul>
                      <li>Insufficient gas on destination</li>
                      <li>Unsupported token for action</li>
                      <li>Composer disabled</li>
                      <li>Vault token mismatch</li>
                    </ul>
                  </div>
                </div>

                <div className="partner-rollout">
                  <h3>Design Partner Rollout</h3>
                  <div className="partner-targets">
                    <div className="partner-target">
                      <span className="partner-icon">🏦</span>
                      <span>1 protocol (e.g., Morpho)</span>
                    </div>
                    <div className="partner-target">
                      <span className="partner-icon">📱</span>
                      <span>1 wallet (mid-size integrator)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="beta-metrics">
                  <h3>Key Metrics During Beta</h3>
                  <div className="metric-list">
                    <div className="metric-item">
                      <span className="metric-icon">⏱️</span>
                      <span>Time to integrate</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-icon">✓</span>
                      <span>Success rate vs multi-step flows</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-icon">📉</span>
                      <span>Drop-off improvement</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-icon">💬</span>
                      <span>Qualitative feedback on clarity & confidence</span>
                    </div>
                  </div>
                </div>

                <div className="public-rollout">
                  <h3>Public Rollout</h3>
                  <ul className="rollout-items">
                    <li>Changelog + docs</li>
                    <li>BD outreach to top protocols</li>
                    <li>Highlight in LI.FI weekly/product updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="slide slide-success">
            <div className="slide-header">
              <span className="slide-number">08</span>
              <h2>Success Criteria</h2>
              <span className="phase-badge success">Success</span>
            </div>
            <div className="slide-body">
              <div className="metrics-categories">
                <div className="metrics-category">
                  <h3><span className="category-icon">📈</span> Adoption Metrics</h3>
                  <div className="metric-cards">
                    <div className="metric-card-v3">
                      <span className="metric-value-v3">10+</span>
                      <span className="metric-label-v3">integrators enabling DeFi Actions Mode</span>
                      <span className="metric-timeline">within 6–8 weeks</span>
                    </div>
                    <div className="metric-card-v3">
                      <span className="metric-value-v3">↑</span>
                      <span className="metric-label-v3">cross-chain protocol deposit volume</span>
                    </div>
                  </div>
                </div>

                <div className="metrics-category">
                  <h3><span className="category-icon">🎯</span> UX Metrics</h3>
                  <div className="metric-cards">
                    <div className="metric-card-v3 highlight">
                      <span className="metric-value-v3">70%</span>
                      <span className="metric-label-v3">completion rate</span>
                      <span className="metric-compare">vs &lt;40% typical cross-chain flows</span>
                    </div>
                    <div className="metric-card-v3">
                      <span className="metric-value-v3">↓↓</span>
                      <span className="metric-label-v3">multi-step drop-offs</span>
                    </div>
                  </div>
                </div>

                <div className="metrics-category">
                  <h3><span className="category-icon">⚙️</span> Operational Metrics</h3>
                  <div className="metric-cards">
                    <div className="metric-card-v3">
                      <span className="metric-value-v3">↓</span>
                      <span className="metric-label-v3">integration engineering hours for zap-based flows</span>
                    </div>
                    <div className="metric-card-v3">
                      <span className="metric-value-v3">↓</span>
                      <span className="metric-label-v3">support tickets related to protocol onboarding</span>
                    </div>
                  </div>
                </div>

                <div className="strategic-impact">
                  <h3><span className="category-icon">🚀</span> Strategic Impact</h3>
                  <div className="impact-points">
                    <p>Strengthens LI.FI position as <strong>intent execution layer</strong></p>
                    <p>Moves widget beyond routing → <strong>generalized DeFi entry point</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="slide slide-strategy">
            <div className="slide-header">
              <span className="slide-number">09</span>
              <h2>Strategic Fit & Future Iterations</h2>
              <span className="phase-badge strategy">Strategy</span>
            </div>
            <div className="slide-body two-col">
              <div className="col">
                <div className="alignment-section">
                  <h3>How This Aligns with LI.FI 2.0</h3>
                  <div className="evolution-flow">
                    <div className="evolution-step">
                      <span className="evo-label">Routing</span>
                      <span className="evo-desc">LI.FI API</span>
                    </div>
                    <span className="evo-arrow">→</span>
                    <div className="evolution-step active">
                      <span className="evo-label">Orchestration</span>
                      <span className="evo-desc">Composer</span>
                    </div>
                    <span className="evo-arrow">→</span>
                    <div className="evolution-step">
                      <span className="evo-label">Intents</span>
                      <span className="evo-desc">Catalyst</span>
                    </div>
                    <span className="evo-arrow">→</span>
                    <div className="evolution-step">
                      <span className="evo-label">Chain Abstraction</span>
                      <span className="evo-desc">Resource locks, AA</span>
                    </div>
                  </div>
                  <div className="alignment-insight">
                    <p>DeFi Actions Mode is the <strong>natural next layer</strong>:</p>
                    <ul>
                      <li>User expresses intent: "deposit into X protocol"</li>
                      <li>Widget abstracts execution</li>
                      <li>Under the hood: can evolve to use solvers, private liquidity, zero-slippage OFT flows</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="future-extensions">
                  <h3>Future Extensions</h3>
                  <ul className="extension-list">
                    <li>Withdraw/repay actions</li>
                    <li>Support for non-EVM chains (pending Composer expansion)</li>
                    <li>Dynamic APR data from protocols</li>
                    <li>User-defined custom actions (long-term)</li>
                    <li>Integration with LI.FI 2.0 solver competition for better pricing & gasless flows</li>
                  </ul>
                </div>

                <div className="closing-statement-box">
                  <p className="closing-intro">This is not just a feature.</p>
                  <p className="closing-main">It is the <strong>first user-facing manifestation</strong> of LI.FI's shift from cross-chain routing → intent execution.</p>
                  <p className="closing-benefits">It amplifies existing infra, reduces integration cost, and opens LI.FI to entirely new markets.</p>
                </div>
              </div>
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
        <div className="header-brand">
          <LiFiLogoHorizontal height={24} className="header-logo" />
        </div>
        <div className="header-center">
          <span className="header-title">DeFi Actions Mode — Feature Proposal</span>
        </div>
        <div className="header-controls">
          <span className="keyboard-hint">← → to navigate • 1-0 for slides</span>
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
