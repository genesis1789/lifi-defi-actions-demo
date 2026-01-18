import type { ActionTemplate, TemplateStatus } from '../registry/templates';

interface ActionListProps {
  templates: ActionTemplate[];
  selectedId: string | null;
  onSelect: (template: ActionTemplate) => void;
  deprecatedIds: Set<string>;
}

function StatusBadge({ status, isSimulatedDeprecated }: { status: TemplateStatus; isSimulatedDeprecated?: boolean }) {
  const effectiveStatus = isSimulatedDeprecated ? 'deprecated' : status;
  
  const styles: Record<TemplateStatus, { bg: string; color: string; label: string }> = {
    active: { bg: '#dcfce7', color: '#166534', label: 'Active' },
    deprecated: { bg: '#f3f4f6', color: '#6b7280', label: 'Deprecated' },
    'demo-only': { bg: '#fef3c7', color: '#92400e', label: 'Demo-only' },
  };

  const style = styles[effectiveStatus];

  return (
    <span style={{
      fontSize: '10px',
      fontWeight: 600,
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: style.bg,
      color: style.color,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    }}>
      {style.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span style={{
      fontSize: '10px',
      fontWeight: 500,
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
    }}>
      {category}
    </span>
  );
}

function ChainPill({ chain }: { chain: string }) {
  return (
    <span style={{
      fontSize: '11px',
      fontWeight: 500,
      padding: '2px 8px',
      borderRadius: '10px',
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
    }}>
      {chain}
    </span>
  );
}

export function ActionList({ templates, selectedId, onSelect, deprecatedIds }: ActionListProps) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      height: 'fit-content',
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#111827',
        marginTop: 0,
        marginBottom: '4px',
      }}>
        Choose an action
      </h3>
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        marginTop: 0,
        marginBottom: '16px',
      }}>
        Actions are curated templates. LI.FI owns semantics + lifecycle.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {templates.map((template) => {
          const isSelected = selectedId === template.id;
          const isSimulatedDeprecated = deprecatedIds.has(template.id);

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '12px',
                backgroundColor: isSelected ? '#eff6ff' : '#f9fafb',
                border: `1px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111827',
                }}>
                  {template.title}
                </span>
                <StatusBadge status={template.status} isSimulatedDeprecated={isSimulatedDeprecated} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <ChainPill chain={template.chainName} />
                <CategoryBadge category={template.category} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
