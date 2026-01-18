import { LiFiWidget } from '@lifi/widget';
import type { WidgetConfig } from '@lifi/widget';
import { useEffect } from 'react';
import { track } from '../lib/telemetry';

interface WidgetPanelProps {
  config: Record<string, unknown> | null;
  label: string;
  mode: 'today_custom' | 'proposed_compiled';
  templateId?: string;
  placeholder?: {
    title: string;
    body: string;
    note?: string;
  };
}

export function WidgetPanel({ config, label, mode, templateId, placeholder }: WidgetPanelProps) {
  const integrator = import.meta.env.VITE_LIFI_INTEGRATOR;

  useEffect(() => {
    if (config && integrator) {
      track('widget_rendered', { mode, templateId });
    }
  }, [config, mode, templateId, integrator]);

  if (!integrator) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '12px',
        }}>
          {label}
        </div>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: 500 }}>
            Widget unavailable
          </div>
          <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
            Missing VITE_LIFI_INTEGRATOR
          </div>
        </div>
      </div>
    );
  }

  if (!config || placeholder) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px',
      }}>
        <div style={{
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '12px',
        }}>
          {label}
        </div>
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '32px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '15px', color: '#374151', fontWeight: 500, marginBottom: '8px' }}>
            {placeholder?.title || 'Select a template'}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>
            {placeholder?.body || 'Choose an action from the list to see the widget configuration.'}
          </div>
          {placeholder?.note && (
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px', fontStyle: 'italic' }}>
              {placeholder.note}
            </div>
          )}
        </div>
      </div>
    );
  }

  const fullConfig = {
    integrator,
    ...config,
  } as WidgetConfig;

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginBottom: '12px',
      }}>
        {label}
      </div>
      <LiFiWidget integrator={integrator} config={fullConfig} />
    </div>
  );
}
