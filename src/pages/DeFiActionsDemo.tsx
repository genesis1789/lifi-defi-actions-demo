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

// === Data ===
const DEFI_ACTIONS: DeFiAction[] = [
  { id: 'morpho-usdc-base', label: 'Deposit USDC into Morpho', protocol: 'Morpho', type: 'deposit', chain: 'Base', chainId: 8453, icon: '🔵', color: '#0052FF' },
  { id: 'aave-usdc-op', label: 'Deposit USDC into Aave', protocol: 'Aave', type: 'deposit', chain: 'Optimism', chainId: 10, icon: '👻', color: '#B6509E' },
  { id: 'pendle-pteeth-arb', label: 'Stake PT-eETH via Pendle', protocol: 'Pendle', type: 'stake', chain: 'Arbitrum', chainId: 42161, icon: '🔮', color: '#00D395' },
  { id: 'compound-usdc-eth', label: 'Deposit USDC into Compound', protocol: 'Compound', type: 'deposit', chain: 'Ethereum', chainId: 1, icon: '⚡', color: '#00D9FF' },
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

const SLIDES = [
  { id: 'hero', label: 'Hero' },
  { id: 'context', label: 'Context' },
  { id: 'problem', label: 'Problem' },
  { id: 'segments', label: 'Segments' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'impact', label: 'Impact' },
  { id: 'prd', label: 'PRD' },
  { id: 'risks', label: 'Risks' },
  { id: 'gtm', label: 'GTM' },
];

// === Code Block ===
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
  const [processingStep, setProcessingStep] = useState(0);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

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

  // Determine if we need extra steps (swap if not USDC for USDC actions, bridge if cross-chain)
  const needsSwap = sourceToken.symbol !== 'USDC' && selectedAction?.label.toLowerCase().includes('usdc');
  const needsBridge = selectedAction && sourceChain.name !== selectedAction.chain;
  
  const getExecutionSteps = () => {
    const steps: { title: string; subtitle: string; icon: string; status?: string }[] = [];
    
    if (needsSwap) {
      steps.push({ title: `Swap ${sourceToken.symbol} → USDC`, subtitle: `On ${sourceChain.name}`, icon: '🔄' });
    }
    if (needsBridge && selectedAction) {
      steps.push({ title: `Bridge to ${selectedAction.chain}`, subtitle: 'Via Stargate • ~2 min', icon: '🌉' });
    }
    if (selectedAction) {
      const actionVerb = selectedAction.type === 'deposit' ? 'Deposit into' : 'Stake in';
      steps.push({ title: `${actionVerb} ${selectedAction.protocol}`, subtitle: 'Receive position tokens', icon: selectedAction.icon });
    }
    return steps;
  };

  const executionSteps = getExecutionSteps();
  const totalSteps = executionSteps.length;

  const handleReview = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    // Simulate pre-execution check
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
      onStepChange('review');
    }, 800);
  };

  const handleExecute = () => {
    setIsProcessing(true);
    setProcessingStep(0);
    
    // Animate through each step
    const stepDuration = 1200;
    executionSteps.forEach((_, idx) => {
      setTimeout(() => {
        setProcessingStep(idx + 1);
      }, stepDuration * (idx + 1));
    });
    
    // Complete after all steps
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingStep(0);
      onStepChange('success');
    }, stepDuration * totalSteps + 500);
  };

  const resetWidget = () => {
    onSelectAction(null);
    onStepChange('select');
    setAmount('');
    setShowChainDropdown(false);
    setShowTokenDropdown(false);
    setSimulationComplete(false);
    setProcessingStep(0);
  };

  const isValidAmount = (): boolean => {
    const num = parseFloat(amount.replace(/,/g, '') || '0');
    const balance = parseFloat(sourceToken.balance.replace(/,/g, ''));
    return num > 0 && num <= balance;
  };

  // Calculate output amount (with small fee deduction for realism)
  const getOutputAmount = (): string => {
    const num = parseFloat(amount.replace(/,/g, '') || '0');
    let output = num;
    if (needsSwap && sourceToken.symbol === 'ETH') {
      output = num * 2150 * 0.997; // ETH → USDC conversion
    } else {
      output = num * 0.997;
    }
    return output.toFixed(2);
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
                <label>Pay with</label>
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
              
              {/* Smart route preview */}
              {isValidAmount() && (needsSwap || needsBridge) && (
                <div className="route-preview">
                  <span className="route-preview-label">Route includes:</span>
                  <div className="route-preview-items">
                    {needsSwap && <span className="route-tag swap">Swap to USDC</span>}
                    {needsBridge && <span className="route-tag bridge">Bridge to {selectedAction.chain}</span>}
                  </div>
                </div>
              )}
              
              <button className="widget-cta" onClick={handleReview} disabled={!isValidAmount() || isSimulating}>
                {isSimulating ? (
                  <><span className="spinner"></span>Simulating...</>
                ) : !amount ? 'Enter Amount' : !isValidAmount() ? 'Insufficient Balance' : `Review ${selectedAction.type === 'deposit' ? 'Deposit' : 'Stake'}`}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && selectedAction && (
          <div className="widget-content review-content">
            <div className="review-section">
              <div className="review-header">
                <span>Review Transaction</span>
                {simulationComplete && (
                  <span className="simulation-badge">✓ Simulated</span>
                )}
              </div>
              
              {/* Execution steps */}
              <div className="route-steps">
                {executionSteps.map((execStep, idx) => (
                  <div key={idx} className={`route-step-item ${isProcessing && processingStep > idx ? 'completed' : ''} ${isProcessing && processingStep === idx ? 'active' : ''}`}>
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-details">
                      <span className="step-title">{execStep.title}</span>
                      <span className="step-subtitle">{execStep.subtitle}</span>
                    </div>
                    <span className="step-status" style={idx === executionSteps.length - 1 ? { background: selectedAction.color } : undefined}>
                      {isProcessing && processingStep > idx ? '✓' : execStep.icon}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Outcome summary */}
              <div className="outcome-summary">
                <div className="outcome-row">
                  <span className="outcome-label">You deposit</span>
                  <span className="outcome-value">{formatNumber(amount)} {sourceToken.symbol}</span>
                </div>
                <div className="outcome-row highlight">
                  <span className="outcome-label">You receive</span>
                  <span className="outcome-value">{formatNumber(getOutputAmount())} {selectedAction.protocol} Position</span>
                </div>
              </div>
              
              {/* Info cards */}
              <div className="info-cards two-col">
                <div className="info-card">
                  <span className="info-label">Est. Time</span>
                  <span className="info-value">{needsBridge ? '~3' : '~1'}</span>
                  <span className="info-unit">minutes</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Network Cost</span>
                  <span className="info-value">~$2.40</span>
                  <span className="info-unit">estimated</span>
                </div>
              </div>
              
              {/* Security badge */}
              <div className="security-badge">
                <span className="shield-icon">🛡️</span>
                <div className="security-text">
                  <span className="security-title">Pre-execution verified</span>
                  <span className="security-subtitle">Route simulated • Outcome guaranteed</span>
                </div>
              </div>
              
              <button className={`widget-cta execute ${isProcessing ? 'processing' : ''}`} onClick={handleExecute} disabled={isProcessing}>
                {isProcessing ? (
                  <><span className="spinner"></span>{executionSteps[processingStep]?.title || 'Finalizing...'}</>
                ) : `Confirm ${selectedAction.type === 'deposit' ? 'Deposit' : 'Stake'}`}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && selectedAction && (
          <div className="widget-content success-state">
            <div className="success-icon">✓</div>
            <h3 className="success-title">Position Acquired!</h3>
            <p className="success-desc">You now have a position in {selectedAction.protocol} on {selectedAction.chain}.</p>
            <div className="success-details">
              <div className="detail-row">
                <span>Position</span>
                <span className="highlight">{formatNumber(getOutputAmount())} {selectedAction.protocol}</span>
              </div>
              <div className="detail-row">
                <span>Chain</span>
                <span>{selectedAction.chain}</span>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <span className="highlight">Active</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="widget-cta" onClick={resetWidget}>New Action</button>
              <button className="widget-cta secondary">View Position ↗</button>
            </div>
          </div>
        )}

        <div className="widget-footer">
          <span className="powered-by">Powered by LI.FI Composer</span>
        </div>
      </div>
    </div>
  );
}

// === Slide Indicator ===
function SlideIndicator({ activeSlide }: { activeSlide: string }) {
  const scrollToSlide = (slideId: string) => {
    const element = document.getElementById(slideId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="slide-indicator">
      {SLIDES.map(slide => (
        <div
          key={slide.id}
          className={`slide-dot ${activeSlide === slide.id ? 'active' : ''}`}
          data-label={slide.label}
          onClick={() => scrollToSlide(slide.id)}
        />
      ))}
    </div>
  );
}

// === Main Component ===
export default function DeFiActionsDemo() {
  const [selectedAction, setSelectedAction] = useState<DeFiAction | null>(null);
  const [widgetStep, setWidgetStep] = useState<'select' | 'configure' | 'review' | 'success'>('select');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState('hero');
  const mainRef = useRef<HTMLElement>(null);

  // Handle scroll progress and active slide detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Detect active slide
      const sections = SLIDES.map(s => document.getElementById(s.id)).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.getBoundingClientRect().top <= window.innerHeight / 2) {
          setActiveSlide(SLIDES[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWidget = useCallback(() => {
    const widget = document.querySelector('.widget-sticky');
    widget?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div className="landing-page">
      {/* Progress indicator */}
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Slide navigation */}
      <SlideIndicator activeSlide={activeSlide} />

      <main className="main-content" ref={mainRef}>
        {/* === SECTION 01: HERO === */}
        <section id="hero" className="section section-hero">
          <div className="hero-layout">
            <div className="hero-content">
              <div className="section-number">01 — Hero</div>
              <h1 className="hero-title">
                LI.FI Widget: <em>DeFi Actions</em> Mode
              </h1>
              <p className="hero-tagline">
                Composer-powered, outcome-oriented onboarding
              </p>

              <div className="hero-big-idea">
                <span className="big-idea-label">Big idea</span>
                <p>Evolve the LI.FI Widget from token routing to DeFi onboarding by making outcomes first-class.</p>
              </div>

              <div className="hero-narrative">
                <div className="narrative-item">
                  <span className="narrative-label">Today</span>
                  <p>The LI.FI Widget excels at swapping and bridging tokens across chains.</p>
                </div>
                <div className="narrative-item highlight">
                  <span className="narrative-label">Gap</span>
                  <p>Users want to use DeFi protocols, but cross-chain onboarding still feels like a sequence of swaps and routes.</p>
                </div>
                <div className="narrative-item">
                  <span className="narrative-label">What changes</span>
                  <p>DeFi Actions Mode lets users choose what they want to do (e.g. deposit, stake, enter) while LI.FI handles how it happens.</p>
                </div>
              </div>

              <div className="hero-outcome">
                <span className="outcome-label">Why this matters</span>
                <p>It expands Widget adoption into onboarding use cases for wallets, protocols, and appchains — not just routing.</p>
              </div>

              <button className="try-prototype-btn" onClick={scrollToWidget}>
                Try the prototype →
              </button>
            </div>

            <div className="hero-widget">
              <div className="widget-sticky">
                <span className="widget-label">Interactive Prototype</span>
                <WidgetMockup
                  selectedAction={selectedAction}
                  onSelectAction={setSelectedAction}
                  step={widgetStep}
                  onStepChange={setWidgetStep}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION 02: CONTEXT === */}
        <section id="context" className="section section-context">
          <div className="section-inner">
            <div className="section-number">02 — Context: Where This Fits in LI.FI</div>
            <h2 className="section-title">What exists today</h2>

            <div className="stack-grid">
              <div className="stack-card">
                <h3>Routing layer</h3>
                <p>Finds optimal swap and bridge paths across chains.</p>
                <span className="stack-status live">Live today</span>
              </div>
              <div className="stack-card">
                <h3>LI.FI Widget</h3>
                <p>An embeddable, configurable UI surface optimized for routing.</p>
                <span className="stack-status live">Live today</span>
              </div>
              <div className="stack-card featured">
                <h3>Composer</h3>
                <p>Infrastructure capable of orchestrating multi-step flows (e.g. swap → bridge → protocol interaction).</p>
                <span className="stack-status ready">Infrastructure ready</span>
              </div>
            </div>

            <div className="direction-flow">
              <span className="direction-label">Strategic direction (clarified)</span>
              <div className="direction-steps">
                <span className="direction-step">From token-level routing</span>
                <span className="direction-arrow">→</span>
                <span className="direction-step active">to outcome-level intent</span>
                <span className="direction-arrow">→</span>
                <span className="direction-step">to system-optimized execution</span>
              </div>
            </div>

            <div className="mental-model-grid">
              <div className="model-box old">
                <span className="model-label">In practical terms — Before</span>
                <div className="model-title">users think in tokens and routes</div>
              </div>
              <div className="model-arrow">→</div>
              <div className="model-box new">
                <span className="model-label">Next</span>
                <div className="model-title">users think in actions ("deposit", "stake")</div>
                <p className="model-sub">System determines the execution path</p>
              </div>
            </div>

            <div className="context-nuance">
              <h4>Important nuance (current state)</h4>
              <p>Composer already works out of the box with the Widget as part of route execution, but today it is surfaced only as a swap / bridge experience.</p>
              <p>There is no Widget-native way to expose Composer-powered outcomes as first-class actions that integrators can configure and users can clearly understand.</p>
            </div>

            <div className="context-opportunity">
              <h4>Opportunity</h4>
              <p>Move Composer from being:</p>
              <div className="opportunity-shift">
                <span className="shift-from">an execution tool hidden inside routing</span>
                <span className="shift-arrow">to</span>
                <span className="shift-to">the execution engine behind explicit, user-facing actions</span>
              </div>
              <p className="opportunity-note">— without changing the underlying infrastructure.</p>
            </div>
          </div>
        </section>

        {/* === SECTION 03: PROBLEM === */}
        <section id="problem" className="section section-problem">
          <div className="section-inner">
            <div className="section-number">03 — Discovery: The Real Problem</div>
            <h2 className="section-title">The problem is not execution — it's abstraction</h2>

            <div className="problem-statement">
              <p>Composer can already execute complex, multi-step flows.</p>
              <p className="problem-key">What's missing is a product-level abstraction for DeFi onboarding.</p>
            </div>

            <div className="problem-detail">
              <p>To expose a clean, user-understandable DeFi action (e.g. "Deposit into protocol X"), partners typically still need to:</p>
              <div className="burden-list">
                <div className="burden-item"><span>1</span>Define and maintain protocol-specific action parameters (e.g. vault token addresses, target contracts, position semantics)</div>
                <div className="burden-item"><span>2</span>Integrate beyond the default Widget surface (often via SDK/API usage or LI.FI-assisted setup)</div>
                <div className="burden-item"><span>3</span>Design outcome-first UX and copy ("what will happen", "what you receive", "what can fail")</div>
              </div>
            </div>

            <div className="problem-consequence">
              <p>Even when Composer execution works out of the box, defining and maintaining user-facing outcomes does not.</p>
            </div>

            <div className="problem-result">
              <span className="result-label">Result</span>
              <p>Many partners choose not to expose these flows at all.</p>
            </div>
          </div>
        </section>

        {/* === SECTION 04: WHO FEELS THIS FIRST === */}
        <section id="segments" className="section section-segments">
          <div className="section-inner">
            <div className="section-number">04 — Who Feels This First (v1 Focus)</div>
            
            <div className="segments-grid">
              <div className="segment-card">
                <h4>Wallets</h4>
                <div className="segment-row">
                  <p>Users expect more than swaps</p>
                </div>
                <div className="segment-row">
                  <p>Teams want deeper engagement without custom DeFi UX</p>
                </div>
              </div>
              <div className="segment-card">
                <h4>Protocols</h4>
                <div className="segment-row">
                  <p>Want "Deposit from any chain" on their own site</p>
                </div>
                <div className="segment-row">
                  <p>Lose users during multi-step onboarding</p>
                </div>
              </div>
              <div className="segment-card">
                <h4>Appchains / L2s</h4>
                <div className="segment-row">
                  <p>Need turnkey onboarding into key apps on day one</p>
                </div>
              </div>
            </div>

            <p className="segments-closing">These segments already embed the Widget and feel the friction most acutely.</p>
          </div>
        </section>

        {/* === SECTION 05: COMPETITIVE LANDSCAPE === */}
        <section id="landscape" className="section section-landscape">
          <div className="section-inner">
            <div className="section-number">05 — Discovery: Validation & Competitive Landscape</div>
            
            <div className="landscape-split">
              <div className="validation-section">
                <h3>How demand is validated</h3>
                <ul className="validation-list">
                  <li>Targeted conversations with wallets, protocols, and chains</li>
                  <li>Identify 1–3 actions they would enable immediately</li>
                  <li>Confirm blockers today (UX, maintenance, risk, complexity)</li>
                  <li>Tech-lead feasibility check to lock v1 constraints</li>
                </ul>
              </div>

              <div className="competitive-section">
                <h3>Competitive landscape (light)</h3>
                <p className="landscape-disclaimer">Based on public documentation; intentionally high-level.</p>
                
                <div className="landscape-table">
                  <div className="table-header">
                    <div className="col-category">Category</div>
                    <div className="col-state">Typical state</div>
                  </div>
                  <div className="table-row">
                    <div className="col-category">Routing widgets</div>
                    <div className="col-state">Excellent at swap / bridge</div>
                  </div>
                  <div className="table-row">
                    <div className="col-category">Multi-step DeFi</div>
                    <div className="col-state">Usually custom partner work</div>
                  </div>
                  <div className="table-row">
                    <div className="col-category">Protocol zaps</div>
                    <div className="col-state">Vertical, protocol-specific</div>
                  </div>
                  <div className="table-row">
                    <div className="col-category">Widget-native actions</div>
                    <div className="col-state">Largely absent</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="market-gap">
              <span className="gap-label">Gap</span>
              <p>No widely adopted routing widget exposes configurable, cross-chain DeFi actions as a standard product surface.</p>
            </div>
          </div>
        </section>

        {/* === SECTION 06: PROPOSAL === */}
        <section id="proposal" className="section section-proposal">
          <div className="section-inner">
            <div className="section-number">06 — Proposal: DeFi Actions Mode</div>
            <h2 className="section-title">What it is</h2>

            <div className="proposal-intro">
              <p>A new Widget mode that surfaces curated DeFi actions — outcomes users understand.</p>
              <p className="proposal-examples-label">Examples (illustrative):</p>
              <ul className="action-examples">
                <li>Deposit USDC into Morpho</li>
                <li>Deposit USDC into Aave</li>
                <li>Stake PT-eETH via Pendle</li>
                <li>Deposit USDC into Compound</li>
              </ul>
              <p className="action-note">Each action is a stable abstraction over a Composer-powered execution flow.</p>
            </div>

            <div className="proposal-how">
              <h3>How it works (product-level view)</h3>
              <div className="how-content">
                <p>LI.FI maintains a versioned <strong>Action Registry</strong></p>
                <p>Each actionId maps to:</p>
                <ul className="registry-list">
                  <li>execution logic (Composer)</li>
                  <li>protocol metadata</li>
                  <li>supported chains and assets</li>
                  <li>lifecycle and safety flags</li>
                </ul>
              </div>
            </div>

            <div className="proposal-code">
              <h3>Integrator Experience</h3>
              <CodeBlock code={`<LiFiWidget
  mode="defiActions"
  actions={[
    { id: "aave-usdc-op" },
    { id: "morpho-usdc-base" }
  ]}
/>`} />
            </div>

            <div className="proposal-flow">
              <h3>User experience</h3>
              <div className="flow-steps">
                <span className="flow-step">Choose action</span>
                <span className="flow-arrow">→</span>
                <span className="flow-step">Feasibility check (pre-execution simulation)</span>
                <span className="flow-arrow">→</span>
                <span className="flow-step">Confirm</span>
                <span className="flow-arrow">→</span>
                <span className="flow-step highlight">Orchestrated execution</span>
              </div>
            </div>

            <div className="key-shift">
              <h3>Key shift</h3>
              <div className="shift-comparison">
                <div className="shift-before">
                  <span className="shift-label">Today</span>
                  <p>"This is a route"</p>
                </div>
                <div className="shift-arrow">→</div>
                <div className="shift-after">
                  <span className="shift-label">With Actions Mode</span>
                  <p>"This is what you're doing"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION 07: IMPACT === */}
        <section id="impact" className="section section-impact">
          <div className="section-inner">
            <div className="section-number">07 — Expected Impact (Transparent Assumptions)</div>
            
            <div className="impact-comparison">
              <div className="impact-before">
                <h3 className="impact-col-title">Today (partner reality)</h3>
                <p className="impact-intro">Shipping a polished cross-chain DeFi onboarding flow typically requires:</p>
                <ul className="impact-list">
                  <li>defining protocol-specific action parameters</li>
                  <li>integrating Composer flows via SDK/API</li>
                  <li>building outcome-specific UX and copy</li>
                  <li>handling failures and protocol updates over time</li>
                </ul>
                <div className="impact-metric">
                  <span className="metric-label">Assumption (to validate)</span>
                  <span className="metric-value bad">~3–8 engineering days</span>
                  <span className="metric-desc">per action</span>
                </div>
              </div>

              <div className="impact-after">
                <h3 className="impact-col-title">With DeFi Actions Mode</h3>
                <div className="impact-intro">Partner:</div>
                <ul className="impact-list highlight">
                  <li>selects actionIds</li>
                  <li>configures the Widget</li>
                  <li>tests</li>
                  <li>ships</li>
                </ul>
                <div className="impact-metric">
                  <span className="metric-label">Target (to validate)</span>
                  <span className="metric-value good">≤ 1 day</span>
                  <span className="metric-desc">per action for widget-first partners</span>
                </div>
              </div>
            </div>

            <div className="impact-why">
              <span className="why-label">Why this matters</span>
              <p>Composer's execution power becomes repeatable adoption leverage for the Widget.</p>
            </div>
          </div>
        </section>

        {/* === SECTION 08: PRD SNAPSHOT === */}
        <section id="prd" className="section section-prd">
          <div className="section-inner">
            <div className="section-number">08 — Design Principles & v1 Scope</div>
            
            <div className="design-principle">
              <span className="principle-label">Design principle</span>
              <p className="principle-text">Users choose outcomes. The Widget explains the action clearly. The system handles complexity.</p>
            </div>

            <div className="prd-scope">
              <div className="scope-column">
                <h4>v1 functional scope</h4>
                <ul className="scope-list in-scope">
                  <li><code>mode="defiActions"</code></li>
                  <li>action list + detail view</li>
                  <li>high-level step summary</li>
                  <li>pre-execution simulation surfaced to users</li>
                  <li>Composer-powered execution</li>
                  <li>EVM-only</li>
                  <li>deposit-type actions</li>
                </ul>
              </div>
              <div className="scope-column">
                <h4>Explicit non-goals (v1)</h4>
                <ul className="scope-list out-scope">
                  <li>APR / yield comparisons</li>
                  <li>self-serve action creation</li>
                  <li>exit / unwind flows</li>
                  <li>multi-VM support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION 09: RISKS === */}
        <section id="risks" className="section section-risks">
          <div className="section-inner">
            <div className="section-number">09 — Risks & Mitigations</div>

            <div className="risks-table">
              <div className="risk-row">
                <span className="risk-name">Protocol changes break actions</span>
                <span className="risk-mitigation">versioned Action Registry, explicit deprecation, active monitoring</span>
              </div>
              <div className="risk-row">
                <span className="risk-name">Simulation inconsistency across chains</span>
                <span className="risk-mitigation">limited v1 scope, explicit pre-execution failure UX (no silent fallback)</span>
              </div>
              <div className="risk-row">
                <span className="risk-name">Too many actions dilute Widget UX</span>
                <span className="risk-mitigation">small, curated v1 action set</span>
              </div>
              <div className="risk-row">
                <span className="risk-name">Scope creep into an automation platform</span>
                <span className="risk-mitigation">Deposit-only, user-initiated execution;no scheduled, conditional, or recurring actions.</span>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION 10: GTM & SUCCESS === */}
        <section id="gtm" className="section section-gtm">
          <div className="section-inner">
            <div className="section-number">10 — Development, Rollout & Success</div>
            
            <div className="epics-section">
              <h3>Epics</h3>
              <div className="epics-grid">
                <div className="epic-card">
                  <span className="epic-number">1</span>
                  <p>Action Registry (model, versioning, lifecycle flags)</p>
                </div>
                <div className="epic-card">
                  <span className="epic-number">2</span>
                  <p>Widget UI for DeFi Actions</p>
                </div>
                <div className="epic-card">
                  <span className="epic-number">3</span>
                  <p>Composer integration + normalized errors</p>
                </div>
                <div className="epic-card">
                  <span className="epic-number">4</span>
                  <p>Docs, Playground presets, telemetry</p>
                </div>
              </div>
            </div>

            <div className="rollout-section">
              <h3>Rollout</h3>
              <div className="rollout-phases">
                <div className="phase-card">
                  <span className="phase-number">1</span>
                  <h4>Internal QA</h4>
                  <p>Ethereum + selected L2s</p>
                </div>
                <div className="phase-card">
                  <span className="phase-number">2</span>
                  <h4>Design-partner beta</h4>
                  <p>wallet, protocol, appchain</p>
                </div>
                <div className="phase-card">
                  <span className="phase-number">3</span>
                  <h4>Public release</h4>
                  <p>docs, Playground, changelog, BD enablement</p>
                </div>
              </div>
            </div>

            <div className="success-section">
              <h3>Success criteria</h3>
              <div className="success-grid">
                <div className="success-item">
                  <span className="success-label">Adoption</span>
                  <p>DeFi Actions Mode is enabled by design partners and additional integrators within the first release cycle</p>
                </div>
                <div className="success-item">
                  <span className="success-label">Expansion</span>
                  <p>Existing Widget partners adopt DeFi Actions to support new onboarding use cases</p>
                </div>
                <div className="success-item">
                  <span className="success-label">Integration effort</span>
                  <p>Partner-reported setup time for a new action validates at ≤ 1 day during beta</p>
                </div>
                <div className="success-item">
                  <span className="success-label">Operational signal</span>
                  <p>Reduced support questions related to cross-chain onboarding compared to manual Composer-based setups</p>
                </div>
              </div>
            </div>

            <div className="closing-section">
              <span className="closing-label">Closing</span>
              <p>DeFi Actions Mode doesn't replace routing — it builds on it. It turns Composer from execution capability into clear product value and moves the LI.FI Widget toward an intent-driven onboarding surface.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
