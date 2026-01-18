import { CodeBlock } from './CodeBlock';
import { WidgetPanel } from './WidgetPanel';

const TODAY_CODE = `<LiFiWidget
  config={{
    variant: 'wide',
    subvariant: 'custom',
    subvariantOptions: { custom: 'deposit' },

    // Partner defines the destination interaction
    toChain: 8453,
    toToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    toAmount: '1000000000', // exact-output: ensure this amount

    // Partner generates and maintains the contract calls
    contractCalls: [{
      fromAmount: '1000000000',
      fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      toContractAddress: '0x7BfA...', // Morpho vault
      toContractCallData: '0x...', // Partner-generated calldata
      toContractGasLimit: '200000',
      toApprovalAddress: '0x...', // Spender if different
    }],

    // Partner can inject custom UI
    contractComponent: <MorphoDepositUI />,
  }}
/>`;

const PARTNER_RESPONSIBILITIES = [
  { 
    label: 'Generate contractCalls[]', 
    detail: 'Calldata for the destination contract interaction',
    technical: true,
  },
  { 
    label: 'Track approval/spender addresses', 
    detail: 'toApprovalAddress if different from contract',
    technical: true,
  },
  { 
    label: 'Maintain protocol changes', 
    detail: 'New vaults, deprecated markets, contract upgrades',
    technical: false,
  },
  { 
    label: 'Design protocol-specific UI', 
    detail: 'Using contractComponent, contractSecondaryComponent',
    technical: false,
  },
  { 
    label: 'Write outcome semantics', 
    detail: '"What you receive", risks, failure explanations',
    technical: false,
  },
];

export function TodayCustomDeposit() {
  const widgetConfig = {
    variant: 'wide',
    subvariant: 'custom',
    subvariantOptions: { custom: 'deposit' },
    toChain: 8453,
    toToken: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
    fromChain: 8453,
    fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  } as Record<string, unknown>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* How it works */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        padding: '16px',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0369a1', marginBottom: '8px' }}>
          How custom deposit works today
        </div>
        <div style={{ fontSize: '13px', color: '#0c4a6e', lineHeight: 1.6 }}>
          <strong>Custom subvariant</strong> is a toolkit for building complete flows. You define the destination 
          interaction via <code style={{ backgroundColor: '#e0f2fe', padding: '2px 4px', borderRadius: '3px' }}>contractCalls[]</code> — 
          the Widget routes (swap/bridge) to ensure <code style={{ backgroundColor: '#e0f2fe', padding: '2px 4px', borderRadius: '3px' }}>toAmount</code> exists 
          on the destination chain, then executes your contract call(s).
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left: Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#2563eb',
              backgroundColor: '#dbeafe',
              padding: '4px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              LI.FI Widget
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              custom deposit subvariant
            </span>
          </div>

          <WidgetPanel
            config={widgetConfig}
            label="Routes to toAmount, then executes contractCalls[]"
            mode="today_custom"
          />

          {/* What Widget/Composer provides */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px',
            padding: '12px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', marginBottom: '6px' }}>
              What LI.FI provides
            </div>
            <ul style={{
              margin: 0,
              paddingLeft: '16px',
              fontSize: '12px',
              color: '#1e3a8a',
              lineHeight: 1.6,
            }}>
              <li>Routing: finds optimal swap/bridge path</li>
              <li>Exact-output: ensures toAmount on destination</li>
              <li>Execution: multi-step flow (route → contract calls)</li>
              <li>UI injection points: contractComponent slots</li>
            </ul>
          </div>

          {/* Code */}
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: '0 0 10px 0' }}>
              Widget config (today)
            </h4>
            <CodeBlock code={TODAY_CODE} showCopy snippetName="today" />
          </div>
        </div>

        {/* Right: Partner responsibilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              padding: '4px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Partner owns
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              the "you bring the calldata" part
            </span>
          </div>

          {/* Partner responsibilities */}
          <div style={{
            backgroundColor: '#fff',
            border: '2px dashed #fecaca',
            borderRadius: '8px',
            padding: '16px',
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: '0 0 14px 0' }}>
              What partners generate & maintain
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PARTNER_RESPONSIBILITIES.map((item) => (
                <div key={item.label} style={{
                  backgroundColor: item.technical ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${item.technical ? '#fecaca' : '#fde68a'}`,
                  borderRadius: '6px',
                  padding: '10px 12px',
                }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: item.technical ? '#991b1b' : '#92400e',
                    marginBottom: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {item.label}
                    {item.technical && (
                      <span style={{
                        fontSize: '9px',
                        padding: '1px 4px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        borderRadius: '3px',
                      }}>
                        TECHNICAL
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: item.technical ? '#7f1d1d' : '#78350f' }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The gap */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '14px',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '6px' }}>
              Why many embedders stop at bridge/swap
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
              Generating calldata, tracking spender addresses, and maintaining protocol changes 
              is significant effort. Many Widget embedders have a <strong>deposit cliff</strong> — 
              onboarding requires a deposit to activate — but they don't ship it because the 
              custom subvariant is a toolkit, not a turnkey solution.
            </div>
          </div>

          {/* Use cases */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '14px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              Who uses custom deposit today
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
              <strong>Well-resourced integrators</strong> with engineering capacity to:
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px' }}>
                <li>Generate and maintain protocol calldata</li>
                <li>Build custom UI around contractComponent</li>
                <li>Track protocol changes and deprecations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom summary */}
      <div style={{
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
          <strong>The toolkit works.</strong> But "Deposit into X" requires partners to bring calldata, 
          build UI, and maintain protocol changes. That's the gap Actions Mode addresses.
        </div>
      </div>
    </div>
  );
}
