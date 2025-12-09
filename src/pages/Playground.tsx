import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LiFiWidget } from '@lifi/widget';
import type { WidgetConfig } from '@lifi/widget';
import './Playground.css';

// Chain data
const CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 42161, name: 'Arbitrum', symbol: 'ARB' },
  { id: 10, name: 'Optimism', symbol: 'OP' },
  { id: 8453, name: 'Base', symbol: 'BASE' },
  { id: 43114, name: 'Avalanche', symbol: 'AVAX' },
  { id: 56, name: 'BNB Chain', symbol: 'BNB' },
  { id: 250, name: 'Fantom', symbol: 'FTM' },
  { id: 324, name: 'zkSync Era', symbol: 'ZK' },
  { id: 59144, name: 'Linea', symbol: 'LINEA' },
];

// Preset themes - carefully designed for good contrast
const PRESET_THEMES = {
  custom: { 
    name: 'Teal Dark', 
    primary: '#14f4c9', 
    secondary: '#0ea5e9', 
    bgDefault: '#0d1117',  // Darker base for better contrast
    bgPaper: '#161b22'     // GitHub-style dark with good separation
  },
  lifi: { 
    name: 'Li.Fi Purple', 
    primary: '#7B3FE4', 
    secondary: '#F5B5FF', 
    bgDefault: '#fafafa',  // Off-white, easier on eyes
    bgPaper: '#ffffff' 
  },
  midnight: { 
    name: 'Midnight', 
    primary: '#a78bfa',    // Lighter purple for better visibility
    secondary: '#c084fc', 
    bgDefault: '#0a0a0f',  // True dark
    bgPaper: '#18181b'     // Zinc-900, good contrast
  },
  sunset: { 
    name: 'Sunset', 
    primary: '#fb923c',    // Slightly lighter orange
    secondary: '#fbbf24', 
    bgDefault: '#0c0a09',  // Stone-950
    bgPaper: '#1c1917'     // Stone-900
  },
  ocean: { 
    name: 'Ocean', 
    primary: '#22d3ee',    // Brighter cyan
    secondary: '#38bdf8', 
    bgDefault: '#020617',  // Slate-950
    bgPaper: '#0f172a'     // Slate-900
  },
  forest: { 
    name: 'Forest', 
    primary: '#4ade80',    // Brighter green
    secondary: '#86efac', 
    bgDefault: '#022c22',  // Emerald-950
    bgPaper: '#064e3b'     // Emerald-900
  },
};

type PresetKey = keyof typeof PRESET_THEMES;

interface ConfigState {
  variant: 'compact' | 'wide';
  subvariant: 'default' | 'split';
  appearance: 'light' | 'dark';
  preset: PresetKey;
  primaryColor: string;
  secondaryColor: string;
  bgDefault: string;
  bgPaper: string;
  borderRadius: number;
  allowedChains: number[];
  fromChain: number | null;
  toChain: number | null;
  fromAmount: string;
  fee: number;
  hiddenUI: string[];
}

const HIDDEN_UI_OPTIONS = [
  { key: 'appearance', label: 'Theme Toggle' },
  { key: 'language', label: 'Language Selector' },
  { key: 'poweredBy', label: 'Powered By LI.FI' },
  { key: 'toAddress', label: 'Destination Address' },
  { key: 'history', label: 'Transaction History' },
  { key: 'walletMenu', label: 'Wallet Menu' },
];

export default function Playground() {
  const [config, setConfig] = useState<ConfigState>({
    variant: 'wide',
    subvariant: 'split',
    appearance: 'light',
    preset: 'lifi',
    primaryColor: '#7B3FE4',
    secondaryColor: '#F5B5FF',
    bgDefault: '#ffffff',
    bgPaper: '#f5f5f5',
    borderRadius: 12,
    allowedChains: [1, 137, 42161, 10, 8453],
    fromChain: null,
    toChain: null,
    fromAmount: '',
    fee: 0,
    hiddenUI: ['appearance', 'language'],
  });

  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'theme' | 'chains' | 'defaults' | 'advanced'>('layout');
  const [widgetKey, setWidgetKey] = useState(0);

  // Calculate smart contrast background for preview
  const previewBgColor = useMemo(() => {
    const hex = config.bgDefault.replace('#', '');
    if (hex.length !== 6) return '#0f172a';
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    return brightness > 128 ? '#0f172a' : '#f1f5f9';
  }, [config.bgDefault]);

  // Apply preset theme
  const applyPreset = (presetKey: PresetKey) => {
    const preset = PRESET_THEMES[presetKey];
    const isDark = preset.bgDefault.startsWith('#0') || preset.bgDefault.startsWith('#1') || preset.bgDefault.startsWith('#2');
    setConfig(prev => ({
      ...prev,
      preset: presetKey,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      bgDefault: preset.bgDefault,
      bgPaper: preset.bgPaper,
      appearance: isDark ? 'dark' : 'light',
    }));
    // Force remount for theme changes
    setWidgetKey(k => k + 1);
  };

  // Build widget config
  const widgetConfig: WidgetConfig = useMemo(() => {
    // Determine if this is a dark or light theme based on background brightness
    const hex = config.bgDefault.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    const isDarkTheme = brightness < 128;

    const cfg: WidgetConfig = {
      integrator: 'Widget Playground',
      variant: config.variant,
      subvariant: config.subvariant,
      appearance: config.appearance,
      theme: {
        palette: {
          primary: { main: config.primaryColor },
          secondary: { main: config.secondaryColor },
          background: {
            default: config.bgDefault,
            paper: config.bgPaper,
          },
          // Explicitly set text colors based on theme brightness
          text: {
            primary: isDarkTheme ? '#ffffff' : '#1a1a1a',
            secondary: isDarkTheme ? '#a1a1aa' : '#71717a',
          },
          grey: {
            200: isDarkTheme ? '#3f3f46' : '#e4e4e7',
            300: isDarkTheme ? '#52525b' : '#d4d4d8',
            700: isDarkTheme ? '#a1a1aa' : '#3f3f46',
            800: isDarkTheme ? '#d4d4d8' : '#27272a',
          },
        },
        shape: {
          borderRadius: config.borderRadius,
          borderRadiusSecondary: Math.max(4, config.borderRadius - 4),
        },
        container: {
          borderRadius: `${config.borderRadius + 4}px`,
        },
      },
      chains: {
        allow: config.allowedChains.length > 0 ? config.allowedChains : undefined,
      },
      hiddenUI: config.hiddenUI.length > 0 ? config.hiddenUI as WidgetConfig['hiddenUI'] : undefined,
    };

    if (config.fromChain) cfg.fromChain = config.fromChain;
    if (config.toChain) cfg.toChain = config.toChain;
    if (config.fromAmount) cfg.fromAmount = config.fromAmount;
    if (config.fee > 0) cfg.fee = config.fee / 100;

    return cfg;
  }, [config]);

  // Generate exportable code
  const exportCode = useMemo(() => {
    const lines = [
      `const widgetConfig: WidgetConfig = {`,
      `  integrator: 'Your App Name',`,
      `  variant: '${config.variant}',`,
      config.subvariant !== 'default' ? `  subvariant: '${config.subvariant}',` : null,
      `  appearance: '${config.appearance}',`,
      `  theme: {`,
      `    palette: {`,
      `      primary: { main: '${config.primaryColor}' },`,
      `      secondary: { main: '${config.secondaryColor}' },`,
      `      background: {`,
      `        default: '${config.bgDefault}',`,
      `        paper: '${config.bgPaper}',`,
      `      },`,
      `    },`,
      `    shape: {`,
      `      borderRadius: ${config.borderRadius},`,
      `      borderRadiusSecondary: ${Math.max(4, config.borderRadius - 4)},`,
      `    },`,
      `  },`,
      config.allowedChains.length > 0 ? `  chains: {\n    allow: [${config.allowedChains.join(', ')}],\n  },` : null,
      config.hiddenUI.length > 0 ? `  hiddenUI: [${config.hiddenUI.map(h => `'${h}'`).join(', ')}],` : null,
      config.fromChain ? `  fromChain: ${config.fromChain},` : null,
      config.toChain ? `  toChain: ${config.toChain},` : null,
      config.fromAmount ? `  fromAmount: '${config.fromAmount}',` : null,
      config.fee > 0 ? `  fee: ${(config.fee / 100).toFixed(3)}, // ${config.fee}% fee` : null,
      `};`,
    ].filter(Boolean);
    
    return lines.join('\n');
  }, [config]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(exportCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleChain = (chainId: number) => {
    setConfig(prev => ({
      ...prev,
      allowedChains: prev.allowedChains.includes(chainId)
        ? prev.allowedChains.filter(id => id !== chainId)
        : [...prev.allowedChains, chainId],
    }));
  };

  const toggleHiddenUI = (key: string) => {
    setConfig(prev => ({
      ...prev,
      hiddenUI: prev.hiddenUI.includes(key)
        ? prev.hiddenUI.filter(h => h !== key)
        : [...prev.hiddenUI, key],
    }));
    // Force remount for hidden UI changes
    setWidgetKey(k => k + 1);
  };

  // Force remount helper
  const forceRemount = () => {
    setWidgetKey(k => k + 1);
    // Force re-render
    setConfig(prev => ({ ...prev }));
  };

  return (
    <div className="playground">
      {/* Header */}
      <header className="playground-header">
        <Link to="/" className="back-link">
          <span>←</span>
          <span>Back to Demo</span>
        </Link>
        <div className="playground-title">
          <h1>Widget Configurator</h1>
          <span className="badge-small">Interactive Playground</span>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={forceRemount} title="Refresh Widget">
            🔄 Refresh
          </button>
          <button className="export-btn" onClick={copyCode}>
            {copiedCode ? '✓ Copied!' : '📋 Export Config'}
          </button>
        </div>
      </header>

      <div className="playground-content">
        {/* Control Panel */}
        <aside className="control-panel">
          {/* Tabs */}
          <div className="tabs">
            {(['layout', 'theme', 'chains', 'defaults', 'advanced'] as const).map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="controls-body">
            {/* Layout Tab */}
            {activeTab === 'layout' && (
              <div className="control-section">
                <h3>Widget Layout</h3>
                
                <div className="control-group">
                  <label>Variant</label>
                  <div className="button-group">
                    {(['compact', 'wide'] as const).map(v => (
                      <button
                        key={v}
                        className={config.variant === v ? 'active' : ''}
                        onClick={() => setConfig(prev => ({ ...prev, variant: v }))}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <span className="hint">
                    {config.variant === 'compact' && 'Best for sidebars and limited space'}
                    {config.variant === 'wide' && 'Shows route details in sidebar'}
                  </span>
                </div>

                <div className="control-group">
                  <label>Subvariant</label>
                  <div className="button-group">
                    {(['default', 'split'] as const).map(sv => (
                      <button
                        key={sv}
                        className={config.subvariant === sv ? 'active' : ''}
                        onClick={() => setConfig(prev => ({ ...prev, subvariant: sv }))}
                      >
                        {sv}
                      </button>
                    ))}
                  </div>
                  <span className="hint">
                    {config.subvariant === 'default' && 'Single unified exchange interface'}
                    {config.subvariant === 'split' && 'Separate Bridge & Swap tabs'}
                  </span>
                </div>

                <div className="control-group">
                  <label>Appearance</label>
                  <div className="button-group">
                    {(['light', 'dark'] as const).map(a => (
                      <button
                        key={a}
                        className={config.appearance === a ? 'active' : ''}
                        onClick={() => {
                          setConfig(prev => ({ ...prev, appearance: a }));
                          setWidgetKey(k => k + 1);
                        }}
                      >
                        {a === 'dark' ? '🌙 Dark' : '☀️ Light'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="info-box">
                  <span className="info-icon">💡</span>
                  <span>Click "Refresh" button if changes don't apply immediately</span>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="control-section">
                <h3>Theme & Colors</h3>

                <div className="control-group">
                  <label>Preset Themes</label>
                  <div className="preset-grid">
                    {(Object.keys(PRESET_THEMES) as PresetKey[]).map(key => (
                      <button
                        key={key}
                        className={`preset-btn ${config.preset === key ? 'active' : ''}`}
                        onClick={() => applyPreset(key)}
                        style={{
                          '--preset-primary': PRESET_THEMES[key].primary,
                          '--preset-bg': PRESET_THEMES[key].bgDefault,
                        } as React.CSSProperties}
                      >
                        <span className="preset-swatch" />
                        <span>{PRESET_THEMES[key].name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-group">
                  <label>Primary Color (Buttons, Links)</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={e => setConfig(prev => ({ ...prev, primaryColor: e.target.value, preset: 'custom' }))}
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={e => setConfig(prev => ({ ...prev, primaryColor: e.target.value, preset: 'custom' }))}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Secondary Color</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={e => setConfig(prev => ({ ...prev, secondaryColor: e.target.value, preset: 'custom' }))}
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={e => setConfig(prev => ({ ...prev, secondaryColor: e.target.value, preset: 'custom' }))}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Background (Default)</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={config.bgDefault}
                      onChange={e => setConfig(prev => ({ ...prev, bgDefault: e.target.value, preset: 'custom' }))}
                    />
                    <input
                      type="text"
                      value={config.bgDefault}
                      onChange={e => setConfig(prev => ({ ...prev, bgDefault: e.target.value, preset: 'custom' }))}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Background (Paper/Cards)</label>
                  <div className="color-input">
                    <input
                      type="color"
                      value={config.bgPaper}
                      onChange={e => setConfig(prev => ({ ...prev, bgPaper: e.target.value, preset: 'custom' }))}
                    />
                    <input
                      type="text"
                      value={config.bgPaper}
                      onChange={e => setConfig(prev => ({ ...prev, bgPaper: e.target.value, preset: 'custom' }))}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Border Radius: {config.borderRadius}px</label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={config.borderRadius}
                    onChange={e => setConfig(prev => ({ ...prev, borderRadius: Number(e.target.value) }))}
                  />
                </div>

                <button className="apply-theme-btn" onClick={forceRemount}>
                  Apply Theme Changes
                </button>
              </div>
            )}

            {/* Chains Tab */}
            {activeTab === 'chains' && (
              <div className="control-section">
                <h3>Allowed Chains</h3>
                <p className="section-desc">Select which blockchain networks users can interact with</p>
                
                <div className="chain-grid">
                  {CHAINS.map(chain => (
                    <label key={chain.id} className="chain-checkbox">
                      <input
                        type="checkbox"
                        checked={config.allowedChains.includes(chain.id)}
                        onChange={() => toggleChain(chain.id)}
                      />
                      <span className="chain-info">
                        <span className="chain-name">{chain.name}</span>
                        <span className="chain-id">ID: {chain.id}</span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="chain-actions">
                  <button onClick={() => {
                    setConfig(prev => ({ ...prev, allowedChains: CHAINS.map(c => c.id) }));
                  }}>
                    Select All
                  </button>
                  <button onClick={() => {
                    setConfig(prev => ({ ...prev, allowedChains: [] }));
                  }}>
                    Clear All
                  </button>
                </div>

                <div className="info-box">
                  <span className="info-icon">ℹ️</span>
                  <span>Chain changes require widget refresh to take effect</span>
                </div>
              </div>
            )}

            {/* Defaults Tab */}
            {activeTab === 'defaults' && (
              <div className="control-section">
                <h3>Form Defaults</h3>
                <p className="section-desc">Pre-fill the widget with default values</p>

                <div className="control-group">
                  <label>Default Source Chain</label>
                  <select
                    value={config.fromChain || ''}
                    onChange={e => {
                      setConfig(prev => ({ ...prev, fromChain: e.target.value ? Number(e.target.value) : null }));
                      setWidgetKey(k => k + 1);
                    }}
                  >
                    <option value="">None (User selects)</option>
                    {CHAINS.filter(c => config.allowedChains.includes(c.id) || config.allowedChains.length === 0).map(chain => (
                      <option key={chain.id} value={chain.id}>{chain.name}</option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Default Destination Chain</label>
                  <select
                    value={config.toChain || ''}
                    onChange={e => {
                      setConfig(prev => ({ ...prev, toChain: e.target.value ? Number(e.target.value) : null }));
                      setWidgetKey(k => k + 1);
                    }}
                  >
                    <option value="">None (User selects)</option>
                    {CHAINS.filter(c => config.allowedChains.includes(c.id) || config.allowedChains.length === 0).map(chain => (
                      <option key={chain.id} value={chain.id}>{chain.name}</option>
                    ))}
                  </select>
                </div>

                <div className="control-group">
                  <label>Default Amount</label>
                  <input
                    type="text"
                    placeholder="e.g., 100"
                    value={config.fromAmount}
                    onChange={e => setConfig(prev => ({ ...prev, fromAmount: e.target.value }))}
                    onBlur={forceRemount}
                  />
                  <span className="hint">Pre-fill the amount field (press Enter or click away to apply)</span>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="control-section">
                <h3>Advanced Options</h3>

                <div className="control-group">
                  <label>Integration Fee: {config.fee}%</label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={config.fee}
                    onChange={e => setConfig(prev => ({ ...prev, fee: Number(e.target.value) }))}
                  />
                  <span className="hint">
                    {config.fee === 0 ? 'No fee charged' : `Earn ${config.fee}% on each transaction`}
                  </span>
                </div>

                <div className="control-group">
                  <label>Hidden UI Elements</label>
                  <p className="hint" style={{ marginBottom: '8px' }}>Hide these elements from the widget</p>
                  <div className="checkbox-list">
                    {HIDDEN_UI_OPTIONS.map(option => (
                      <label key={option.key} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={config.hiddenUI.includes(option.key)}
                          onChange={() => toggleHiddenUI(option.key)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Code Preview */}
          <div className="code-preview">
            <div className="code-header">
              <span>Generated Config</span>
              <button onClick={copyCode} className="copy-btn">
                {copiedCode ? '✓' : '📋'}
              </button>
            </div>
            <pre>{exportCode}</pre>
          </div>
        </aside>

        {/* Widget Preview */}
        <main className="widget-preview">
          <div className="preview-header">
            <h2>Live Preview</h2>
            <span className="preview-hint">Key: {widgetKey}</span>
          </div>
          <div 
            className="preview-container"
            style={{ 
              '--preview-bg': previewBgColor,
            } as React.CSSProperties}
          >
            <div className={`widget-wrapper ${config.variant}`}>
              <LiFiWidget 
                key={widgetKey}
                config={widgetConfig} 
                integrator="Widget Playground" 
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
