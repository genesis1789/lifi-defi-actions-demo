import { Link } from 'react-router-dom';
import { LiFiWidget } from '@lifi/widget';
import type { WidgetConfig } from '@lifi/widget';
import './Home.css';

const widgetConfig: WidgetConfig = {
  integrator: 'CrossBridge Demo',
  variant: 'compact',
  subvariant: 'default',
  appearance: 'dark',
  theme: {
    palette: {
      primary: { main: '#14f4c9' },
      secondary: { main: '#0ea5e9' },
      background: {
        default: '#111827',
        paper: '#1a2235',
      },
    },
    shape: {
      borderRadius: 12,
      borderRadiusSecondary: 8,
    },
    typography: {
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    container: {
      borderRadius: '16px',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
    },
  },
  chains: {
    allow: [1, 137, 42161, 10, 8453, 43114, 56],
  },
  hiddenUI: ['appearance', 'language'],
};

export default function Home() {
  return (
    <div className="home">
      {/* Background effects */}
      <div className="bg-effects">
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="grid-overlay" />
      </div>

      {/* Header */}
      <header className="header fade-in">
        <div className="logo">
          <span className="logo-icon">🌉</span>
          <span className="logo-text">CrossBridge</span>
        </div>
        <nav className="nav">
          <Link to="/playground" className="nav-playground">
            🎮 Playground
          </Link>
          <Link to="/dashboard" className="nav-dashboard">
            📊 Dashboard
          </Link>
          <a href="https://docs.li.fi" target="_blank" rel="noopener noreferrer">
            Docs
          </a>
          <a
            href="https://github.com/lifinance/widget"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <GithubIcon />
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <span className="badge fade-in-delay-1">Li.Fi Widget Integration</span>
            <h1 className="hero-title fade-in-delay-2">
              Cross-Chain
              <span className="gradient-text"> Bridging </span>
              Made Simple
            </h1>
            <p className="hero-subtitle fade-in-delay-3">
              Seamlessly swap tokens across multiple blockchains with the best rates. 
              Powered by Li.Fi's aggregation protocol.
            </p>
            
            <div className="features fade-in-delay-4">
              <div className="feature">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>Instant Routes</strong>
                  <span>Best path discovery</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔗</div>
                <div className="feature-text">
                  <strong>Multi-Chain</strong>
                  <span>20+ networks supported</span>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🛡️</div>
                <div className="feature-text">
                  <strong>Secure</strong>
                  <span>Battle-tested bridges</span>
                </div>
              </div>
            </div>

            <Link to="/playground" className="cta-button fade-in-delay-4">
              <span>🎮</span>
              <span>Try the Widget Configurator</span>
              <span>→</span>
            </Link>
          </div>

          {/* Widget Container */}
          <div className="widget-section fade-in-delay-3">
            <div className="widget-glow" />
            <div className="widget-container">
              <LiFiWidget config={widgetConfig} integrator="CrossBridge Demo" />
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="info-section">
          <div className="info-card fade-in-delay-4">
            <div className="card-icon">🔄</div>
            <h3>Aggregated Liquidity</h3>
            <p>
              Li.Fi aggregates DEXs and bridges to find the most efficient route 
              for your cross-chain transfers.
            </p>
          </div>
          <div className="info-card fade-in-delay-4">
            <div className="card-icon">💎</div>
            <h3>Best Rates</h3>
            <p>
              Compare quotes from multiple sources to ensure you always get 
              the best available rate.
            </p>
          </div>
          <div className="info-card fade-in-delay-4">
            <div className="card-icon">🎯</div>
            <h3>One Transaction</h3>
            <p>
              Complex multi-hop routes are bundled into a single transaction 
              for maximum convenience.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer fade-in-delay-4">
        <p>
          Built with <span className="heart">♥</span> using{' '}
          <a href="https://li.fi" target="_blank" rel="noopener noreferrer">
            Li.Fi Widget
          </a>{' '}
          ·{' '}
          <code>@lifi/widget</code>
        </p>
        <p className="footer-note">
          Demo integration showcasing cross-chain bridging capabilities
        </p>
      </footer>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

