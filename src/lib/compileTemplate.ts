import type { ActionTemplate } from '../registry/templates';

export function compileTemplateToWidgetConfig(t: ActionTemplate) {
  if (!t.executable || !t.toToken) return null;

  // Using Record<string, unknown> for flexibility with widget config types
  const config: Record<string, unknown> = {
    variant: 'wide',
    subvariant: 'custom',
    // Key config: tells widget this is a deposit flow, not checkout
    subvariantOptions: { custom: 'deposit' },
    toChain: t.chainId,
    toToken: t.toToken,
  };

  if (t.fromDefaults) {
    config.fromChain = t.fromDefaults.chainId;
    config.fromToken = t.fromDefaults.token;
  }

  return config;
}
