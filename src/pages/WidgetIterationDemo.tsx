import { useState, useEffect } from 'react';
import { Banner } from '../components/Banner';
import { Tabs } from '../components/Tabs';
import { ComparisonStrip } from '../components/ComparisonStrip';
import { TodayCustomDeposit } from '../components/TodayCustomDeposit';
import { ProposedActionsMode } from '../components/ProposedActionsMode';
import { track } from '../lib/telemetry';

export default function WidgetIterationDemo() {
  const [activeTab, setActiveTab] = useState<'today' | 'proposed'>('today');
  const integrator = import.meta.env.VITE_LIFI_INTEGRATOR;

  // Handle URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'proposed') {
      setActiveTab('proposed');
    }
  }, []);

  const handleTabChange = (tab: 'today' | 'proposed') => {
    setActiveTab(tab);
    track('tab_viewed', { tab });
  };

  useEffect(() => {
    track('tab_viewed', { tab: activeTab });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7f7f7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
          }}>
            LI.FI Widget Prototype
          </div>
          <div style={{
            fontSize: '13px',
            color: '#6b7280',
          }}>
            Actions Mode (Deposit v1)
          </div>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 500,
          padding: '4px 10px',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          borderRadius: '100px',
        }}>
          Interview demo
        </span>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Missing integrator banner */}
        {!integrator && (
          <Banner 
            message="Missing VITE_LIFI_INTEGRATOR. Add it to .env to render the Widget." 
            type="error"
          />
        )}

        {/* Tabs */}
        <div style={{ marginBottom: '20px' }}>
          <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Comparison strip */}
        <ComparisonStrip />

        {/* Tab content */}
        {activeTab === 'today' && <TodayCustomDeposit />}
        {activeTab === 'proposed' && <ProposedActionsMode />}
      </main>
    </div>
  );
}
