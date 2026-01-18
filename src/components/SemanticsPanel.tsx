import type { ActionTemplate } from '../registry/templates';

interface SemanticsPanelProps {
  template: ActionTemplate | null;
  isDeprecated: boolean;
  onToggleDeprecation: () => void;
  onUseReplacement: () => void;
  replacementTemplate: ActionTemplate | null;
}

export function SemanticsPanel({
  template,
  isDeprecated,
  onToggleDeprecation,
  onUseReplacement,
  replacementTemplate,
}: SemanticsPanelProps) {
  if (!template) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Select an action to view semantics
        </div>
      </div>
    );
  }

  const showDeprecationWarning = isDeprecated || template.status === 'deprecated';

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
    }}>
      {/* Header with deprecation toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#111827',
          margin: 0,
        }}>
          What this does
        </h3>
        
        {template.replacementId && (
          <button
            onClick={onToggleDeprecation}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              backgroundColor: isDeprecated ? '#fef2f2' : '#f3f4f6',
              color: isDeprecated ? '#dc2626' : '#6b7280',
              border: `1px solid ${isDeprecated ? '#fecaca' : '#e5e7eb'}`,
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {isDeprecated ? 'Deprecation ON' : 'Simulate deprecation'}
          </button>
        )}
      </div>

      {/* Deprecation warning */}
      {showDeprecationWarning && replacementTemplate && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '8px' }}>
            This template is deprecated. New integrations should use <strong>{replacementTemplate.id}</strong>. 
            Existing integrations keep working until removal date.
          </div>
          <div style={{ fontSize: '12px', color: '#a16207', marginBottom: '10px' }}>
            Removal: TBD
          </div>
          <button
            onClick={onUseReplacement}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: '#fbbf24',
              color: '#78350f',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Use replacement
          </button>
        </div>
      )}

      {/* Semantics sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Intent */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}>
            Intent
          </div>
          <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>
            {template.intent}
          </div>
        </div>

        {/* What happens */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}>
            What happens
          </div>
          <ol style={{
            margin: 0,
            paddingLeft: '18px',
            fontSize: '13px',
            color: '#374151',
            lineHeight: 1.6,
          }}>
            {template.whatHappens.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {/* You receive */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '4px',
          }}>
            You receive
          </div>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            {template.youReceive}
          </div>
        </div>

        {/* What can fail */}
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '6px',
          }}>
            What can fail
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {template.canFail.map((failure) => (
              <div
                key={failure.code}
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '4px',
                  padding: '8px 10px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', marginBottom: '2px' }}>
                  {failure.label}
                </div>
                <div style={{ fontSize: '12px', color: '#7f1d1d' }}>
                  {failure.userMessage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template metadata */}
      <div style={{
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '8px',
        }}>
          Template metadata
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#6b7280' }}>
          <div><strong>Template ID:</strong> {template.id}</div>
          <div><strong>Version:</strong> {template.version}</div>
          <div><strong>Status:</strong> {isDeprecated ? 'Deprecated' : template.status}</div>
          <div><strong>Owned by:</strong> LI.FI (curated)</div>
        </div>
      </div>
    </div>
  );
}
