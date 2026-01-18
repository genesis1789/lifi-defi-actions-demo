import { useState, useEffect } from 'react';
import { TEMPLATES } from '../registry/templates';
import type { ActionTemplate } from '../registry/templates';
import { compileTemplateToWidgetConfig } from '../lib/compileTemplate';
import { track } from '../lib/telemetry';
import { CodeBlock } from './CodeBlock';
import { LiFiWidget } from '@lifi/widget';
import type { WidgetConfig } from '@lifi/widget';

const CANONICAL_SNIPPET = `// Canonical Actions — LI.FI curates & maintains
<LiFiWidget
  mode="actions"
  actions={[
    "deposit-usdc-morpho-base",      // LI.FI owns calldata
    "deposit-usdc-aavev3-optimism",  // LI.FI owns calldata
  ]}
/>`;

const PARTNER_SNIPPET = `// Partner Actions — Partner maintains, LI.FI provides framework
<LiFiWidget
  mode="actions"
  actions={[
    {
      id: "deposit-myprotocol-vault",
      // Partner supplies their own contract interaction
      contractCalls: [...],
      // But uses LI.FI's standardized semantics framework
      semantics: {
        intent: "Deposit into MyProtocol Vault",
        whatHappens: [...],
        youReceive: "MyProtocol receipt token",
        canFail: [...],
      },
    },
  ]}
/>`;

type ViewState = 'list' | 'detail' | 'executing';

export function ProposedActionsMode() {
  const [selectedTemplate, setSelectedTemplate] = useState<ActionTemplate | null>(null);
  const [viewState, setViewState] = useState<ViewState>('list');
  const [isDeprecatedSimulated, setIsDeprecatedSimulated] = useState(false);
  const integrator = import.meta.env.VITE_LIFI_INTEGRATOR;

  useEffect(() => {
    if (!selectedTemplate) {
      const morpho = TEMPLATES.find(t => t.id === 'deposit-usdc-morpho-base');
      if (morpho) setSelectedTemplate(morpho);
    }
  }, [selectedTemplate]);

  const handleSelectAction = (template: ActionTemplate) => {
    setSelectedTemplate(template);
    setViewState('detail');
    setIsDeprecatedSimulated(false);
    track('template_selected', { id: template.id });
  };

  const handleBack = () => {
    if (viewState === 'executing') {
      setViewState('detail');
    } else {
      setViewState('list');
    }
  };

  const handleProceed = () => {
    setViewState('executing');
    track('action_proceed_clicked', { id: selectedTemplate?.id });
  };

  const handleUseReplacement = () => {
    if (selectedTemplate?.replacementId) {
      const replacement = TEMPLATES.find(t => t.id === selectedTemplate.replacementId);
      if (replacement) {
        setSelectedTemplate(replacement);
        setIsDeprecatedSimulated(false);
      }
    }
  };

  const widgetConfig = selectedTemplate ? compileTemplateToWidgetConfig(selectedTemplate) : null;
  const showDeprecationWarning = isDeprecatedSimulated || selectedTemplate?.status === 'deprecated';
  const replacementTemplate = selectedTemplate?.replacementId 
    ? TEMPLATES.find(t => t.id === selectedTemplate.replacementId) 
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Key proposal */}
      <div style={{
        backgroundColor: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: '8px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#065f46', marginBottom: '8px' }}>
          Actions Mode: Productized activation for protocols with a deposit cliff
        </div>
        <div style={{ fontSize: '13px', color: '#047857', lineHeight: 1.6 }}>
          Turn "custom deposit" from a developer toolkit into a curated, maintained product surface. 
          Two tiers: <strong>Canonical Actions</strong> (LI.FI owns calldata + maintenance) for common protocols, 
          and <strong>Partner Actions</strong> (partner owns calldata, LI.FI provides framework) for custom vaults.
        </div>
      </div>

      {/* Two-tier explanation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        {/* Canonical */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#166534',
              backgroundColor: '#dcfce7',
              padding: '3px 8px',
              borderRadius: '4px',
            }}>
              CANONICAL
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#166534' }}>
              LI.FI-owned
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#15803d', lineHeight: 1.5, marginBottom: '10px' }}>
            Common deposit actions that scale across many embedders. LI.FI generates calldata, 
            tracks protocol changes, and maintains everything.
          </div>
          <div style={{ fontSize: '11px', color: '#166534' }}>
            <strong>Examples:</strong> Aave v3 pools, Morpho markets, Lido staking, Compound
          </div>
        </div>

        {/* Partner */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#92400e',
              backgroundColor: '#fef3c7',
              padding: '3px 8px',
              borderRadius: '4px',
            }}>
              PARTNER
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
              Partner-maintained
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#a16207', lineHeight: 1.5, marginBottom: '10px' }}>
            For embedders with their own vaults/contracts. Partner owns calldata, 
            LI.FI provides standardized UX + semantics framework.
          </div>
          <div style={{ fontSize: '11px', color: '#92400e' }}>
            <strong>Examples:</strong> Custom yield strategies, auto-compounding vaults, perps collateral
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left: Widget mockup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#059669',
              backgroundColor: '#d1fae5',
              padding: '4px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Actions Mode
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              (canonical action demo)
            </span>
          </div>

          {/* Mockup Widget */}
          <div style={{
            backgroundColor: '#161b22',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #30363d',
              display: 'flex',
              alignItems: 'center',
            }}>
              {viewState !== 'list' && (
                <button
                  onClick={handleBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8b949e',
                    cursor: 'pointer',
                    fontSize: '13px',
                    padding: '4px 8px',
                    marginLeft: '-8px',
                    marginRight: '8px',
                  }}
                >
                  ←
                </button>
              )}
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                {viewState === 'list' && 'Choose an action'}
                {viewState === 'detail' && selectedTemplate?.title}
                {viewState === 'executing' && 'Deposit'}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '16px 18px', minHeight: '360px' }}>
              {/* LIST VIEW */}
              {viewState === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '12px', color: '#8b949e', margin: '0 0 8px 0' }}>
                    Select what you want to do. LI.FI handles the how.
                  </p>
                  {TEMPLATES.filter(t => t.status !== 'deprecated').map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectAction(template)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        backgroundColor: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = '#30363d'}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#e6edf3' }}>
                          {template.title}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '5px' }}>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            backgroundColor: '#1f6feb33',
                            color: '#58a6ff',
                            borderRadius: '4px',
                          }}>
                            {template.chainName}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            backgroundColor: template.status === 'active' ? '#23863633' : '#6e768166',
                            color: template.status === 'active' ? '#3fb950' : '#8b949e',
                            borderRadius: '4px',
                          }}>
                            {template.status === 'active' ? 'Canonical' : 'Demo'}
                          </span>
                        </div>
                      </div>
                      <span style={{ color: '#8b949e', fontSize: '16px' }}>→</span>
                    </button>
                  ))}
                </div>
              )}

              {/* DETAIL VIEW */}
              {viewState === 'detail' && selectedTemplate && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Deprecation toggle */}
                  {selectedTemplate.replacementId && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#8b949e' }}>Simulate deprecation</span>
                      <button
                        onClick={() => setIsDeprecatedSimulated(!isDeprecatedSimulated)}
                        style={{
                          width: '32px',
                          height: '18px',
                          borderRadius: '9px',
                          border: 'none',
                          backgroundColor: isDeprecatedSimulated ? '#f59e0b' : '#30363d',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: '#fff',
                          position: 'absolute',
                          top: '2px',
                          left: isDeprecatedSimulated ? '16px' : '2px',
                          transition: 'left 0.2s',
                        }} />
                      </button>
                    </div>
                  )}

                  {/* Deprecation warning */}
                  {showDeprecationWarning && replacementTemplate && (
                    <div style={{
                      backgroundColor: '#3d2a00',
                      border: '1px solid #634c00',
                      borderRadius: '6px',
                      padding: '10px 12px',
                    }}>
                      <div style={{ fontSize: '12px', color: '#fbbf24', marginBottom: '6px' }}>
                        ⚠️ Deprecated. Use {replacementTemplate.title} instead.
                      </div>
                      <button
                        onClick={handleUseReplacement}
                        style={{
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 500,
                          backgroundColor: '#fbbf24',
                          color: '#1c1917',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Use replacement
                      </button>
                    </div>
                  )}

                  {/* Semantics - The key value */}
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Intent
                    </div>
                    <div style={{ fontSize: '13px', color: '#c9d1d9', lineHeight: 1.5 }}>
                      {selectedTemplate.intent}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      What happens
                    </div>
                    <ol style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#c9d1d9', lineHeight: 1.6 }}>
                      {selectedTemplate.whatHappens.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      You receive
                    </div>
                    <div style={{ fontSize: '12px', color: '#c9d1d9' }}>
                      {selectedTemplate.youReceive}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#8b949e', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      What can fail
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {selectedTemplate.canFail.slice(0, 2).map((failure) => (
                        <div key={failure.code} style={{
                          backgroundColor: '#3d1f1f',
                          border: '1px solid #6b2c2c',
                          borderRadius: '5px',
                          padding: '7px 10px',
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: 500, color: '#f87171' }}>
                            {failure.label}
                          </div>
                          <div style={{ fontSize: '10px', color: '#fca5a5', marginTop: '2px' }}>
                            {failure.userMessage}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTemplate.executable && (
                    <button
                      onClick={handleProceed}
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        backgroundColor: '#238636',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '6px',
                      }}
                    >
                      Continue →
                    </button>
                  )}

                  {!selectedTemplate.executable && (
                    <div style={{
                      padding: '12px',
                      fontSize: '12px',
                      backgroundColor: '#21262d',
                      color: '#8b949e',
                      borderRadius: '8px',
                      textAlign: 'center',
                      marginTop: '6px',
                    }}>
                      Demo template — execution not wired
                    </div>
                  )}
                </div>
              )}

              {/* EXECUTING VIEW */}
              {viewState === 'executing' && selectedTemplate && widgetConfig && integrator && (
                <LiFiWidget 
                  integrator={integrator} 
                  config={{ ...widgetConfig, integrator, appearance: 'dark' } as WidgetConfig} 
                />
              )}

              {viewState === 'executing' && !integrator && (
                <div style={{ padding: '32px', textAlign: 'center', color: '#8b949e' }}>
                  <div style={{ marginBottom: '8px' }}>Missing VITE_LIFI_INTEGRATOR</div>
                  <div style={{ fontSize: '12px' }}>Add it to .env to see execution</div>
                </div>
              )}
            </div>

            <div style={{
              padding: '10px 18px',
              borderTop: '1px solid #30363d',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: '10px', color: '#8b949e' }}>
                Powered by <strong style={{ color: '#58a6ff' }}>LI.FI</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Config examples */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Canonical config */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#166534',
                backgroundColor: '#dcfce7',
                padding: '2px 6px',
                borderRadius: '3px',
              }}>
                CANONICAL
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                Partner config
              </span>
            </div>
            <CodeBlock code={CANONICAL_SNIPPET} showCopy snippetName="canonical" />
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '10px 0 0 0' }}>
              Partner selects template IDs. LI.FI owns calldata + maintenance.
            </p>
          </div>

          {/* Partner config */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#92400e',
                backgroundColor: '#fef3c7',
                padding: '2px 6px',
                borderRadius: '3px',
              }}>
                PARTNER
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                Partner config
              </span>
            </div>
            <CodeBlock code={PARTNER_SNIPPET} showCopy snippetName="partner" />
            <p style={{ fontSize: '11px', color: '#6b7280', margin: '10px 0 0 0' }}>
              Partner owns calldata for their contracts. LI.FI provides semantics framework.
            </p>
          </div>

          {/* Value prop */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '14px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              What Actions Mode changes
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Canonical:</strong> Partner gets turnkey deposit flows for common protocols 
                (Aave, Morpho, Lido) without generating calldata or tracking changes.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Partner:</strong> Partner brings their own calldata for custom vaults, 
                but gets standardized Widget UX + semantics framework.
              </p>
            </div>
          </div>

          {/* Template metadata */}
          {selectedTemplate && (
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '14px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Template metadata
              </div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.7 }}>
                <div><strong>ID:</strong> {selectedTemplate.id}</div>
                <div><strong>Version:</strong> {selectedTemplate.version}</div>
                <div><strong>Status:</strong> {showDeprecationWarning ? 'deprecated' : selectedTemplate.status}</div>
                <div><strong>Type:</strong> {selectedTemplate.status === 'active' ? 'Canonical (LI.FI-owned)' : 'Demo'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom summary */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '14px', color: '#166534', lineHeight: 1.6 }}>
          <strong>Actions Mode = productized activation for protocols with a deposit cliff.</strong><br/>
          Canonical actions scale across embedders. Partner actions use the same framework for custom vaults.
        </div>
      </div>
    </div>
  );
}
