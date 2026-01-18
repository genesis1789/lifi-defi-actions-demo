interface TabsProps {
  activeTab: 'today' | 'proposed';
  onTabChange: (tab: 'today' | 'proposed') => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '4px',
      backgroundColor: '#e5e7eb',
      borderRadius: '8px',
      width: 'fit-content',
    }}>
      <button
        onClick={() => onTabChange('today')}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          backgroundColor: activeTab === 'today' ? '#fff' : 'transparent',
          color: activeTab === 'today' ? '#111827' : '#6b7280',
          boxShadow: activeTab === 'today' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        Today: Custom Deposit
      </button>
      <button
        onClick={() => onTabChange('proposed')}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          backgroundColor: activeTab === 'proposed' ? '#fff' : 'transparent',
          color: activeTab === 'proposed' ? '#111827' : '#6b7280',
          boxShadow: activeTab === 'proposed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s ease',
        }}
      >
        Proposed: Actions Mode
      </button>
    </div>
  );
}
