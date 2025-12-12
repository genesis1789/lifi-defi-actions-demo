import { useState, useEffect, useRef, useCallback } from 'react';
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
  icon: string;
  color: string;
}

interface Section {
  id: string;
  label: string;
  shortLabel: string;
}

// === Data ===
const SECTIONS: Section[] = [
  { id: 'hero', label: 'Title & Strategic Intent', shortLabel: 'Intro' },
  { id: 'context', label: 'Product Strategy Context', shortLabel: 'Context' },
  { id: 'problem', label: 'Problem & Segments', shortLabel: 'Problem' },
  { id: 'landscape', label: 'Competitive Landscape', shortLabel: 'Landscape' },
  { id: 'proposal', label: 'DeFi Actions Mode', shortLabel: 'Proposal' },
  { id: 'impact', label: 'Impact & Standards', shortLabel: 'Impact' },
  { id: 'prd', label: 'PRD Snapshot', shortLabel: 'PRD' },
  { id: 'stakeholders', label: 'Stakeholders & Risks', shortLabel: 'Design' },
  { id: 'development', label: 'Epics & PM Role', shortLabel: 'Dev' },
  { id: 'deployment', label: 'GTM & Success', shortLabel: 'GTM' },
];

const DEFI_ACTIONS: DeFiAction[] = [
  { id: 'morpho-usdc-base', label: 'Deposit into Morpho USDC Vault', protocol: 'Morpho', type: 'deposit', chain: 'Base', chainId: 8453, icon: '🔵', color: '#0052FF' },
  { id: 'aave-usdc-op', label: 'Deposit into Aave USDC Market', protocol: 'Aave', type: 'deposit', chain: 'Optimism', chainId: 10, icon: '👻', color: '#B6509E' },
  { id: 'pendle-steth-arb', label: 'Stake PT-eETH on Pendle', protocol: 'Pendle', type: 'stake', chain: 'Arbitrum', chainId: 42161, icon: '🔮', color: '#00D395' },
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

// === Sidebar Navigation ===
function SidebarNav({ activeSection, onNavigate, scrollProgress }: { 
  activeSection: string; 
  onNavigate: (id: string) => void;
  scrollProgress: number;
}) {
  return (
    <nav className="sidebar-nav">
      <div className="sidebar-header">
        <LiFiLogoHorizontal height={20} />
      </div>
      <div className="sidebar-sections">
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onNavigate(section.id)}
          >
            <span className="sidebar-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="sidebar-label">{section.shortLabel}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ height: `${scrollProgress}%` }} />
        </div>
      </div>
    </nav>
  );
}

// === Code Block ===
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

// === Interactive Widget Mockup ===
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
                <span className="banner-meta">{selectedAction.chain}</span>
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
              <div className="info-cards two-col">
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
              <div className="detail-row"><span>Status</span><span className="highlight">Confirmed</span></div>
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
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedAction, setSelectedAction] = useState<DeFiAction | null>(null);
  const [widgetStep, setWidgetStep] = useState<'select' | 'configure' | 'review' | 'success'>('select');
  const mainRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Handle scroll progress and active section detection
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Find active section
      let currentSection = 'hero';
      sectionRefs.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          currentSection = id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToSection = useCallback((id: string) => {
    const element = sectionRefs.current.get(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      sectionRefs.current.set(id, element);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      if (!isTyping && e.key >= '0' && e.key <= '9') {
        const idx = e.key === '0' ? 9 : parseInt(e.key) - 1;
        if (idx < SECTIONS.length) {
          navigateToSection(SECTIONS[idx].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSection]);

  return (
    <div className="landing-page">
      <SidebarNav 
        activeSection={activeSection} 
        onNavigate={navigateToSection}
        scrollProgress={scrollProgress}
      />
      
      <main className="main-content" ref={mainRef}>
        {/* === SLIDE 1: HERO / TITLE & STRATEGIC INTENT === */}
        <section id="hero" className="section section-hero" ref={el => registerSection('hero', el)}>
          <div className="hero-background">
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
            <div className="hero-orb orb-3"></div>
          </div>
          <div className="hero-content">
            <div className="hero-badge">LI.FI Widget — Feature Proposal</div>
            <h1 className="hero-title">
              DeFi Actions Mode
              <span className="hero-subtitle">Composer-Powered</span>
            </h1>
            <p className="hero-description">
              Expanding the LI.FI Widget into a <strong>configurable onboarding layer</strong> for cross-chain DeFi.
            </p>
            
            <div className="hero-meta">
              <span className="hero-role">Product Manager — LI.FI Widget & SDK</span>
            </div>

            <div className="hero-cards">
              <div className="hero-card">
                <span className="hero-card-icon">🎯</span>
                <span className="hero-card-label">Strategic Intent</span>
                <p>Extend LI.FI Widget adoption into new <strong>DeFi onboarding use cases</strong> by exposing curated, Composer-powered multi-step flows as configurable user actions.</p>
              </div>
              <div className="hero-card highlight">
                <span className="hero-card-icon">📉</span>
                <span className="hero-card-label">Expected Impact</span>
                <p>Significantly lower integration effort for complex cross-chain DeFi flows — from <strong>multiple days → ≤ 1 day</strong> — based on typical partner workflows <em>(to be validated)</em>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 2: CONTEXT === */}
        <section id="context" className="section section-context" ref={el => registerSection('context', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">Where This Fits Into LI.FI's Strategy</h2>
            </div>
            
            <div className="context-grid">
              <div className="context-card">
                <div className="context-icon">🔀</div>
                <h3>Routing Layer</h3>
                <p>Multi-DEX + multi-bridge aggregation for cross-chain swaps.</p>
                <span className="context-status">Live today</span>
              </div>
              <div className="context-card">
                <div className="context-icon">🧩</div>
                <h3>LI.FI Widget</h3>
                <p>Customizable, zero-backend-required UI for swaps/bridges, adopted by wallets, dApps, and chains.</p>
                <span className="context-status">Live today</span>
              </div>
              <div className="context-card featured">
                <div className="context-icon">⚡</div>
                <h3>Composer</h3>
                <p>Orchestration engine enabling multi-step flows (swap → bridge → deposit) using contract calls and on-chain VM.</p>
                <span className="context-status highlight">Infrastructure ready</span>
              </div>
            </div>

            <div className="strategy-direction">
              <div className="direction-label">Strategic Direction</div>
              <div className="direction-flow">
                <div className="direction-node">Routing</div>
                <div className="direction-arrow">→</div>
                <div className="direction-node active">Intent-driven</div>
                <div className="direction-arrow">→</div>
                <div className="direction-node">Solver-based execution</div>
              </div>
            </div>

            <div className="context-boxes">
              <div className="context-box limitation">
                <h4>Current Limitation</h4>
                <p>Composer is powerful at the infra/API level but <strong>not accessible via the Widget</strong> without custom engineering and complex UX work.</p>
              </div>
              <div className="context-box opportunity">
                <h4>Opportunity</h4>
                <p>Turn Composer's capabilities into a <strong>Widget-native mode</strong>, unlocking new markets: protocol onboarding, L2 onboarding, restaking flows, strategy entry.</p>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 3: PROBLEM & WHO FEELS IT === */}
        <section id="problem" className="section section-problem" ref={el => registerSection('problem', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">Problem & Who Feels It</h2>
            </div>
            
            <div className="problem-statement">
              <div className="problem-icon">⚠️</div>
              <div className="problem-content">
                <h3>Core Problem</h3>
                <p>Cross-chain DeFi onboarding requires multi-step flows across multiple UIs.<br/>
                Composer solves the orchestration, but <strong>integrators must still build:</strong></p>
              </div>
            </div>

            <div className="burden-grid">
              <div className="burden-item"><span className="burden-num">1</span>Handling protocol-specific metadata (e.g., vault token addresses)</div>
              <div className="burden-item"><span className="burden-num">2</span>Manual Composer integrations</div>
              <div className="burden-item"><span className="burden-num">3</span>Custom UX for each action</div>
              <div className="burden-item"><span className="burden-num">4</span>Failure-handling & simulation states</div>
            </div>

            <div className="impact-statement">
              <span className="impact-arrow">→</span>
              <span>This <strong>slows down or fully blocks</strong> adoption of DeFi onboarding use cases in the Widget.</span>
            </div>

            <div className="segments-header">
              <h3>Primary Segments for v1</h3>
              <p>Strongest pain & fastest adoption potential</p>
            </div>

            <div className="segments-grid">
              <div className="segment-card">
                <div className="segment-header">
                  <span className="segment-icon">📱</span>
                  <h4>Wallets</h4>
                </div>
                <div className="segment-need">
                  <span className="need-label">User expectation</span>
                  <p>Deposit, stake, or restake from any chain</p>
                </div>
                <div className="segment-pain">
                  <span className="pain-label">Team pain</span>
                  <p>Want to retain users without redirecting to external UIs</p>
                </div>
              </div>
              <div className="segment-card">
                <div className="segment-header">
                  <span className="segment-icon">🏦</span>
                  <h4>Protocols</h4>
                </div>
                <div className="segment-need">
                  <span className="need-label">User expectation</span>
                  <p>"Deposit from any chain" flows on-site</p>
                </div>
                <div className="segment-pain">
                  <span className="pain-label">Team pain</span>
                  <p>Lose users during onboarding (bridge → swap → deposit)</p>
                </div>
              </div>
              <div className="segment-card">
                <div className="segment-header">
                  <span className="segment-icon">⛓️</span>
                  <h4>Appchains / L2s</h4>
                </div>
                <div className="segment-need">
                  <span className="need-label">User expectation</span>
                  <p>Bridge in and use core apps immediately</p>
                </div>
                <div className="segment-pain">
                  <span className="pain-label">Team pain</span>
                  <p>Need turnkey onboarding flows for new ecosystems</p>
                </div>
              </div>
            </div>

            <div className="segments-rationale">
              <strong>Why these three:</strong> LI.FI's highest-frequency widget integrators with clearest unmet need around cross-chain DeFi actions.
            </div>
          </div>
        </section>

        {/* === SLIDE 4: COMPETITIVE LANDSCAPE === */}
        <section id="landscape" className="section section-landscape" ref={el => registerSection('landscape', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title">Competitive Landscape</h2>
              <p className="section-subtitle">Based on public docs; intentionally high-level and non-speculative</p>
            </div>

            <div className="landscape-table">
              <div className="table-header">
                <div className="col-project">Project</div>
                <div className="col-widget">Widget / SDK</div>
                <div className="col-flows">Multi-step DeFi?</div>
                <div className="col-notes">Notes</div>
              </div>
              <div className="table-row highlight-row">
                <div className="col-project"><strong>LI.FI (today)</strong></div>
                <div className="col-widget">Swap/bridge widget</div>
                <div className="col-flows"><span className="tag yellow">Infra only</span></div>
                <div className="col-notes">Composer supports multi-step but not exposed as widget mode</div>
              </div>
              <div className="table-row">
                <div className="col-project">Squid (Axelar)</div>
                <div className="col-widget">Cross-chain swap widget</div>
                <div className="col-flows"><span className="tag gray">Custom only</span></div>
                <div className="col-notes">DeFi flows as custom partner integrations</div>
              </div>
              <div className="table-row">
                <div className="col-project">Rango</div>
                <div className="col-widget">Swap/bridge widget</div>
                <div className="col-flows"><span className="tag red">No</span></div>
                <div className="col-notes">Swap-centric, no DeFi onboarding actions</div>
              </div>
              <div className="table-row">
                <div className="col-project">Socket</div>
                <div className="col-widget">SDK-first router</div>
                <div className="col-flows"><span className="tag gray">Custom only</span></div>
                <div className="col-notes">"One-click" flows are partner-specific</div>
              </div>
              <div className="table-row">
                <div className="col-project">Vertical zaps</div>
                <div className="col-widget">Protocol-specific widgets</div>
                <div className="col-flows"><span className="tag green">Yes, limited</span></div>
                <div className="col-notes">Not cross-protocol, not cross-chain</div>
              </div>
            </div>

            <div className="gap-highlight">
              <div className="gap-icon">💡</div>
              <div className="gap-text">
                <h4>Market Gap</h4>
                <p>No provider offers a <strong>general-purpose, cross-chain "DeFi Actions Mode"</strong> inside a routing widget that any integrator can enable through configuration.</p>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 5: PROPOSAL === */}
        <section id="proposal" className="section section-proposal" ref={el => registerSection('proposal', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-title">DeFi Actions Mode</h2>
            </div>

            <div className="proposal-layout">
              <div className="proposal-content">
                <div className="proposal-concept">
                  <h3>Concept</h3>
                  <p>Introduce a new widget mode that surfaces <strong>curated, safe, Composer-powered DeFi actions</strong>, for example:</p>
                  <ul className="action-examples">
                    <li>"Deposit USDC into Aave v3 on Optimism"</li>
                    <li>"Deposit into Morpho Base USDC Vault"</li>
                    <li>"Stake PT-eETH with Pendle"</li>
                    <li>"Enter sUSDe via Ethena"</li>
                    <li>"Restake ETH into EigenLayer"</li>
                  </ul>
                  <p className="action-note">Each action is a <strong>turnkey abstraction</strong> over a Composer Zap.</p>
                </div>

                <div className="proposal-design">
                  <h3>Internal Design (Proposed)</h3>
                  <div className="design-item">
                    <span className="design-bullet">→</span>
                    <p>Maintain a versioned <strong>Action Registry</strong> mapping:<br/>
                    <code>actionId → Composer spec + protocol metadata + supported chains + safety flags</code></p>
                  </div>
                  <div className="design-item">
                    <span className="design-bullet">→</span>
                    <p>Widget fetches definitions when <code>mode="defiActions"</code> is active</p>
                  </div>
                </div>

                <div className="proposal-code">
                  <h3>Integrator Experience</h3>
                  <CodeBlock code={`<LiFiWidget
  mode="defiActions"
  actions={[
    { id: 'morpho-usdc-base' },
    { id: 'aave-usdc-op' }
  ]}
/>`} />
                </div>

                <div className="proposal-flow">
                  <h3>User Flow</h3>
                  <div className="flow-steps">
                    <div className="flow-step">Choose action</div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">Simulation</div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">Confirm</div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step highlight">Orchestrated execution</div>
                  </div>
                </div>

                <div className="strategic-value">
                  <h4>Strategic Value</h4>
                  <p>Positions the LI.FI Widget as a <strong>cross-chain DeFi onboarding layer</strong>, not just a swap/bridge UI.</p>
                </div>
              </div>

              <div className="proposal-widget">
                <div className="widget-sticky">
                  <span className="widget-label">Interactive Preview</span>
                  <WidgetMockup 
                    selectedAction={selectedAction} 
                    onSelectAction={setSelectedAction} 
                    step={widgetStep} 
                    onStepChange={setWidgetStep} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 6: IMPACT & STANDARDS === */}
        <section id="impact" className="section section-impact" ref={el => registerSection('impact', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">06</span>
              <h2 className="section-title">Expected Impact & Standards</h2>
            </div>

            <div className="effort-comparison">
              <div className="effort-card before">
                <div className="effort-header">
                  <span className="effort-badge bad">Today</span>
                  <h3>Manual Implementation</h3>
                </div>
                <p className="effort-desc">Implementing a multi-step deposit flow manually (e.g., "Bridge ETH → swap to USDC → deposit into Morpho vault") requires:</p>
                <ul className="effort-list">
                  <li>Protocol metadata maintenance</li>
                  <li>Custom Composer wiring</li>
                  <li>Bespoke onboarding UX & explanations</li>
                  <li>Error handling + simulation management</li>
                  <li>Ongoing protocol change maintenance</li>
                </ul>
                <div className="effort-stat">
                  <span className="stat-number bad">3–8 days</span>
                  <span className="stat-label">engineering effort per flow</span>
                </div>
                <p className="effort-note">Assumption based on typical partner patterns; subject to validation.</p>
              </div>

              <div className="effort-arrow-block">
                <div className="arrow-line"></div>
                <span className="arrow-label">With DeFi Actions Mode</span>
              </div>

              <div className="effort-card after">
                <div className="effort-header">
                  <span className="effort-badge good">Proposed</span>
                  <h3>Configuration-Based</h3>
                </div>
                <p className="effort-desc">Integrator selects actionIds → configures the widget → tests → ships.</p>
                <div className="effort-stat">
                  <span className="stat-number good">≤ 1 day</span>
                  <span className="stat-label">integration effort</span>
                </div>
                <p className="effort-note">Assumption based on current widget integration minus orchestration overhead.</p>
              </div>
            </div>

            <div className="standards-section">
              <h3>Standards Alignment</h3>
              <p className="standards-intro">The Widget supports (factually grounded in Widget docs):</p>
              <div className="standards-grid">
                <div className="standard-item">
                  <span className="standard-icon">✓</span>
                  <span>EIP-5792</span>
                </div>
                <div className="standard-item">
                  <span className="standard-icon">✓</span>
                  <span>Permit2</span>
                </div>
                <div className="standard-item">
                  <span className="standard-icon">✓</span>
                  <span>ERC-2612</span>
                </div>
                <div className="standard-item">
                  <span className="standard-icon">✓</span>
                  <span>EIP-712</span>
                </div>
              </div>
              <p className="standards-note">These help reduce UX friction (e.g., fewer approvals).</p>
              <div className="scope-note">
                <span className="scope-icon">ℹ️</span>
                <span>Composer today is <strong>EVM-only</strong> and focuses on DeFi interactions & tokenized positions — hence v1 should stay within these boundaries.</span>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 7: PRD SNAPSHOT === */}
        <section id="prd" className="section section-prd" ref={el => registerSection('prd', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">07</span>
              <h2 className="section-title">v1 PRD Snapshot</h2>
            </div>

            <div className="prd-intro">
              <div className="prd-box problem-box">
                <h4>Problem</h4>
                <p>Multi-step cross-chain DeFi onboarding flows are <strong>too costly</strong> for integrators to implement manually, limiting Widget adoption in these scenarios.</p>
              </div>
              <div className="prd-box goal-box">
                <h4>Product Goal</h4>
                <p>Expand LI.FI Widget adoption into DeFi onboarding use cases by exposing curated Composer flows as configurable <strong>"DeFi Actions"</strong>.</p>
              </div>
            </div>

            <div className="prd-columns">
              <div className="prd-column">
                <h3>v1 Functional Scope</h3>
                <div className="scope-list">
                  <div className="scope-item"><span className="scope-check">✓</span>New mode: <code>mode="defiActions"</code></div>
                  <div className="scope-item"><span className="scope-check">✓</span>Action list with metadata</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Action detail view with step breakdown</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Pre-execution simulation results</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Composer-powered execution (Zap)</div>
                  <div className="scope-item"><span className="scope-check">✓</span>EVM-only</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Deposit-type actions for v1</div>
                </div>
              </div>

              <div className="prd-column">
                <h3>v1 Non-Functional Scope</h3>
                <div className="scope-list">
                  <div className="scope-item"><span className="scope-check">✓</span>Versioned Action Registry</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Feature-flag rollout</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Explicit failure UX (no silent fallback)</div>
                  <div className="scope-item"><span className="scope-check">✓</span>Telemetry events:</div>
                  <div className="telemetry-events">
                    <span className="event-tag">action_viewed</span>
                    <span className="event-tag">action_started</span>
                    <span className="event-tag">simulation_failed</span>
                    <span className="event-tag">action_completed</span>
                  </div>
                </div>
              </div>

              <div className="prd-column">
                <h3>Non-Goals (v1)</h3>
                <div className="non-goals-list">
                  <div className="non-goal-item"><span className="non-goal-x">✗</span>APR/yield display</div>
                  <div className="non-goal-item"><span className="non-goal-x">✗</span>Self-service action creation</div>
                  <div className="non-goal-item"><span className="non-goal-x">✗</span>Complex exit flows</div>
                  <div className="non-goal-item"><span className="non-goal-x">✗</span>Multi-VM support</div>
                  <div className="non-goal-item"><span className="non-goal-x">✗</span>Fully auto-generated metadata</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 8: STAKEHOLDERS & RISKS === */}
        <section id="stakeholders" className="section section-stakeholders" ref={el => registerSection('stakeholders', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">08</span>
              <h2 className="section-title">Stakeholders, Deliverables & Risks</h2>
            </div>

            <div className="stakeholders-grid">
              <div className="stakeholder-card">
                <div className="stakeholder-icon">⚙️</div>
                <h4>Tech Lead / Engineering</h4>
                <ul>
                  <li>Feasibility, architecture, constraints</li>
                  <li>Error/simulation handling</li>
                  <li>Registry structure design</li>
                </ul>
              </div>
              <div className="stakeholder-card">
                <div className="stakeholder-icon">🎨</div>
                <h4>Design</h4>
                <ul>
                  <li>UI patterns for action lists, details</li>
                  <li>Simulation state visuals</li>
                  <li>Clear messaging for multi-step flows</li>
                </ul>
              </div>
              <div className="stakeholder-card">
                <div className="stakeholder-icon">🤝</div>
                <h4>BD / DevRel</h4>
                <ul>
                  <li>Identify design partners</li>
                  <li>Prioritize protocols for v1</li>
                  <li>Validate integrator needs</li>
                </ul>
              </div>
              <div className="stakeholder-card">
                <div className="stakeholder-icon">🏦</div>
                <h4>Protocol Partners</h4>
                <ul>
                  <li>Validate protocol metadata</li>
                  <li>Contract assumptions</li>
                  <li>Zap correctness review</li>
                </ul>
              </div>
            </div>

            <div className="deliverables-section">
              <h3>Deliverables After Design Phase</h3>
              <div className="deliverables-list">
                <span className="deliverable-item">PRD (DeFi Actions Mode)</span>
                <span className="deliverable-item">UX flows & screens</span>
                <span className="deliverable-item">v1 Action Registry</span>
                <span className="deliverable-item">Example widget configs</span>
                <span className="deliverable-item">MVP scope + acceptance criteria</span>
              </div>
            </div>

            <div className="risks-section">
              <h3>Risks & Mitigations</h3>
              <div className="risks-grid">
                <div className="risk-card">
                  <div className="risk-header">
                    <span className="risk-icon">⚠️</span>
                    <span className="risk-title">Protocol updates break flows</span>
                  </div>
                  <div className="risk-mitigation">
                    <span className="mitigation-label">Mitigation:</span>
                    <span>Versioning + active monitoring</span>
                  </div>
                </div>
                <div className="risk-card">
                  <div className="risk-header">
                    <span className="risk-icon">⚠️</span>
                    <span className="risk-title">Simulation inconsistency across chains</span>
                  </div>
                  <div className="risk-mitigation">
                    <span className="mitigation-label">Mitigation:</span>
                    <span>Multi-chain QA + limited v1 scope</span>
                  </div>
                </div>
                <div className="risk-card">
                  <div className="risk-header">
                    <span className="risk-icon">⚠️</span>
                    <span className="risk-title">Too many actions → unclear UX</span>
                  </div>
                  <div className="risk-mitigation">
                    <span className="mitigation-label">Mitigation:</span>
                    <span>Small curated v1 list</span>
                  </div>
                </div>
                <div className="risk-card">
                  <div className="risk-header">
                    <span className="risk-icon">⚠️</span>
                    <span className="risk-title">Scope creep into full automation</span>
                  </div>
                  <div className="risk-mitigation">
                    <span className="mitigation-label">Mitigation:</span>
                    <span>Deposit-only v1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 9: DEVELOPMENT EPICS === */}
        <section id="development" className="section section-development" ref={el => registerSection('development', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">09</span>
              <h2 className="section-title">Development Epics & PM Role</h2>
            </div>

            <div className="epics-grid">
              <div className="epic-card">
                <div className="epic-number">1</div>
                <h4>Action Registry (Internal)</h4>
                <ul>
                  <li>Data model & versioning</li>
                  <li>Safety flags (beta/active/deprecated)</li>
                  <li>Simple internal update flow</li>
                </ul>
              </div>
              <div className="epic-card">
                <div className="epic-number">2</div>
                <h4>Widget UI: DeFi Actions Mode</h4>
                <ul>
                  <li>Action list & detail views</li>
                  <li>Simulation UX</li>
                  <li>Error handling patterns</li>
                  <li>Integration with existing theme</li>
                </ul>
              </div>
              <div className="epic-card">
                <div className="epic-number">3</div>
                <h4>Composer Integration Layer</h4>
                <ul>
                  <li>Mapping actionId → Composer Zap</li>
                  <li>Unified simulation output</li>
                  <li>Standardized error messages</li>
                </ul>
              </div>
              <div className="epic-card">
                <div className="epic-number">4</div>
                <h4>Docs, Telemetry, Playground</h4>
                <ul>
                  <li>New docs section (config examples)</li>
                  <li>Playground presets</li>
                  <li>Telemetry event schema</li>
                </ul>
              </div>
            </div>

            <div className="pm-section">
              <h3>PM Responsibilities</h3>
              <div className="pm-grid">
                <div className="pm-item">
                  <span className="pm-icon">📋</span>
                  <span>Refine PRD into epics + vertical slices</span>
                </div>
                <div className="pm-item">
                  <span className="pm-icon">🧪</span>
                  <span>Validate early slices live in staging with real wallets & chains</span>
                </div>
                <div className="pm-item">
                  <span className="pm-icon">🤝</span>
                  <span>Coordinate design partners for feedback</span>
                </div>
                <div className="pm-item">
                  <span className="pm-icon">✅</span>
                  <span>Ensure acceptance criteria are tight and testable</span>
                </div>
                <div className="pm-item">
                  <span className="pm-icon">📢</span>
                  <span>Align BD/DevRel for rollout timing and communication</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SLIDE 10: DEPLOYMENT & SUCCESS === */}
        <section id="deployment" className="section section-deployment" ref={el => registerSection('deployment', el)}>
          <div className="section-inner">
            <div className="section-header">
              <span className="section-number">10</span>
              <h2 className="section-title">Deployment, GTM & Success Criteria</h2>
            </div>

            <div className="deployment-phases">
              <div className="phase-card">
                <div className="phase-header">
                  <span className="phase-number">1</span>
                  <h3>Testing & QA</h3>
                </div>
                <div className="phase-content">
                  <div className="phase-row">
                    <span className="phase-label">Chains:</span>
                    <span>Ethereum + 1–2 L2s (Base, Optimism)</span>
                  </div>
                  <div className="phase-row">
                    <span className="phase-label">Wallets:</span>
                    <span>MetaMask, WalletConnect, mobile wallet</span>
                  </div>
                  <div className="phase-row">
                    <span className="phase-label">Frontends:</span>
                    <span>React + Next.js embedding tests</span>
                  </div>
                  <div className="phase-row">
                    <span className="phase-label">Scenarios:</span>
                    <span>Fuzz testing of simulation failures, liquidity issues, revert paths</span>
                  </div>
                </div>
              </div>

              <div className="phase-connector"></div>

              <div className="phase-card">
                <div className="phase-header">
                  <span className="phase-number">2</span>
                  <h3>Design Partner Beta</h3>
                </div>
                <div className="phase-content">
                  <p className="phase-partners">One wallet, one protocol, one appchain</p>
                  <div className="phase-metrics">
                    <span className="phase-metric-label">Measure (targets, not assumed truths):</span>
                    <div className="metric-items">
                      <span className="metric-item">Integration time (goal: ≤ 1 day)</span>
                      <span className="metric-item">Completion rate vs baseline</span>
                      <span className="metric-item">Developer sentiment</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="phase-connector"></div>

              <div className="phase-card">
                <div className="phase-header">
                  <span className="phase-number">3</span>
                  <h3>Public Rollout</h3>
                </div>
                <div className="phase-content">
                  <div className="rollout-items">
                    <span className="rollout-item">Documentation + Playground update</span>
                    <span className="rollout-item">Changelog + announcement</span>
                    <span className="rollout-item">BD/DevRel outreach for DeFi onboarding use cases</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="success-section">
              <h3>Success Criteria</h3>
              <p className="success-subtitle">Targets / Assumptions</p>
              <div className="success-grid">
                <div className="success-card">
                  <span className="success-icon">📈</span>
                  <span className="success-metric">≥ 5 integrators</span>
                  <span className="success-label">enabling DeFi Actions Mode within ~8 weeks</span>
                </div>
                <div className="success-card">
                  <span className="success-icon">🔄</span>
                  <span className="success-metric">At least 2</span>
                  <span className="success-label">are existing widget users adopting new DeFi use cases</span>
                </div>
                <div className="success-card">
                  <span className="success-icon">⚡</span>
                  <span className="success-metric">≤ 1 day</span>
                  <span className="success-label">integration time for DeFi flows (validated via partners)</span>
                </div>
                <div className="success-card">
                  <span className="success-icon">💬</span>
                  <span className="success-metric">Fewer</span>
                  <span className="success-label">onboarding-related support questions</span>
                </div>
              </div>
            </div>

            <div className="closing-statement">
              <div className="closing-icon">🚀</div>
              <p className="closing-main">LI.FI Widget evolves from <strong>"swap/bridge UI"</strong> → <strong>intent & onboarding UI</strong></p>
              <p className="closing-sub">Leveraging Composer as a product surface, not just infrastructure</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
