export function ComparisonStrip() {
  const cards = [
    {
      header: 'Execution',
      today: 'contractCalls[]',
      todayDetail: 'Partner generates calldata',
      proposed: 'Same (Canonical: LI.FI generates)',
      proposedDetail: 'Partner actions: partner generates',
      highlight: 'canonical',
    },
    {
      header: 'Protocol params',
      today: 'Partner maintains',
      todayDetail: 'Addresses, spenders, allowlists',
      proposed: 'Canonical: LI.FI maintains',
      proposedDetail: 'Partner actions: partner maintains',
      highlight: 'canonical',
    },
    {
      header: 'Semantics',
      today: 'Partner designs',
      todayDetail: 'Using contractComponent slots',
      proposed: 'Standardized framework',
      proposedDetail: 'Intent, happens, receive, fail',
      highlight: 'both',
    },
    {
      header: 'Lifecycle',
      today: 'Partner tracks',
      todayDetail: 'Protocol changes, deprecations',
      proposed: 'Canonical: LI.FI tracks',
      proposedDetail: 'Versioning, deprecation, migration',
      highlight: 'canonical',
    },
  ];

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '24px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#374151',
          margin: 0,
        }}>
          What changes
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            backgroundColor: '#dcfce7',
            color: '#166534',
            borderRadius: '3px',
            fontWeight: 500,
          }}>
            Canonical
          </span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>= LI.FI-owned</span>
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            borderRadius: '3px',
            fontWeight: 500,
            marginLeft: '8px',
          }}>
            Partner
          </span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>= Partner-maintained</span>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
      }}>
        {cards.map((card) => (
          <div key={card.header} style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '12px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#111827',
              marginBottom: '10px',
            }}>
              {card.header}
            </div>
            
            {/* Today */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px',
              }}>Today</div>
              <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>
                {card.today}
              </div>
              <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                {card.todayDetail}
              </div>
            </div>

            {/* Proposed */}
            <div>
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px',
              }}>Proposed</div>
              <div style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>
                {card.proposed}
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280' }}>
                {card.proposedDetail}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p style={{
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '14px',
        marginBottom: 0,
        lineHeight: 1.5,
      }}>
        <strong>Key insight:</strong> Custom deposit today uses <code style={{ backgroundColor: '#f3f4f6', padding: '1px 4px', borderRadius: '3px', fontSize: '11px' }}>contractCalls[]</code> where 
        partners bring calldata. Actions Mode productizes this — for canonical actions, LI.FI owns everything; 
        for partner actions, partners bring calldata but get the framework.
      </p>
    </div>
  );
}
