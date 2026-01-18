export type TemplateStatus = 'active' | 'deprecated' | 'demo-only';

export type FailureCode =
  | 'ROUTE_UNAVAILABLE'
  | 'SIMULATION_FAILED'
  | 'USER_REJECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'APPROVAL_FAILED'
  | 'EXECUTION_REVERTED'
  | 'PROTOCOL_UNAVAILABLE'
  | 'UNKNOWN';

export interface ActionTemplate {
  id: string;
  title: string;
  chainName: string;
  chainId: number;
  category: 'Lending' | 'Staking' | 'Vault';
  status: TemplateStatus;
  version: string;

  // Execution binding (when executable)
  executable: boolean;
  toToken?: string;
  fromDefaults?: {
    chainId: number;
    token: string;
  };

  // Semantics (standardized, LI.FI-owned)
  intent: string;
  whatHappens: string[];
  youReceive: string;
  canFail: Array<{ code: FailureCode; label: string; userMessage: string }>;

  // Lifecycle
  replacementId?: string;
}

export const TEMPLATES: ActionTemplate[] = [
  {
    id: 'deposit-usdc-morpho-base',
    title: 'Deposit USDC into Morpho',
    chainName: 'Base',
    chainId: 8453,
    category: 'Lending',
    status: 'active',
    version: 'v1',
    executable: true,
    toToken: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
    fromDefaults: {
      chainId: 8453,
      token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
    intent: 'Deposit USDC to open a lending position on Morpho (Base).',
    whatHappens: [
      'Check feasibility (route + deposit simulation)',
      'Request approvals if needed',
      'Execute: swap/bridge if required → deposit into Morpho',
      'Confirm position is created',
    ],
    youReceive: 'A Morpho position receipt token (per market mechanics).',
    canFail: [
      {
        code: 'ROUTE_UNAVAILABLE',
        label: 'No route available',
        userMessage: "We couldn't find a route for your selected amount. Try a different amount or asset.",
      },
      {
        code: 'SIMULATION_FAILED',
        label: 'Simulation failed',
        userMessage: "This deposit can't be guaranteed right now. Please try again later.",
      },
      {
        code: 'USER_REJECTED',
        label: 'User rejected',
        userMessage: 'Transaction was rejected in your wallet.',
      },
      {
        code: 'EXECUTION_REVERTED',
        label: 'Execution reverted',
        userMessage: 'The protocol rejected the deposit. Your funds remain in your wallet.',
      },
      {
        code: 'PROTOCOL_UNAVAILABLE',
        label: 'Protocol unavailable',
        userMessage: 'This market is temporarily unavailable (paused or capped).',
      },
    ],
    replacementId: 'deposit-usdc-morpho-base-v2',
  },

  {
    id: 'deposit-usdc-morpho-base-v2',
    title: 'Deposit USDC into Morpho (v2)',
    chainName: 'Base',
    chainId: 8453,
    category: 'Lending',
    status: 'demo-only',
    version: 'v2',
    executable: false,
    intent: 'Replacement template used to demonstrate versioning + migration.',
    whatHappens: [
      'Same user intent',
      'Updated parameter bindings / safer allowlists',
      'Improved failure normalization',
    ],
    youReceive: 'Same receipt semantics as v1.',
    canFail: [
      { code: 'UNKNOWN', label: 'See v1', userMessage: 'See v1 template for representative failures.' },
    ],
  },

  {
    id: 'deposit-usdc-aavev3-optimism',
    title: 'Deposit USDC into Aave v3',
    chainName: 'Optimism',
    chainId: 10,
    category: 'Lending',
    status: 'demo-only',
    version: 'v1',
    executable: false,
    intent: 'Deposit USDC into Aave v3 to start earning yield / enable collateral.',
    whatHappens: [
      'Check feasibility (route + deposit simulation)',
      'Request approvals if needed',
      'Execute: swap/bridge if required → supply to Aave',
      'Confirm aToken balance increased',
    ],
    youReceive: 'aUSDC (Aave receipt token).',
    canFail: [
      { code: 'PROTOCOL_UNAVAILABLE', label: 'Supply cap / paused', userMessage: 'Supply is capped or paused. Try another market.' },
      { code: 'EXECUTION_REVERTED', label: 'Reverted', userMessage: 'Deposit failed at the protocol step. Your funds remain in your wallet.' },
      { code: 'SIMULATION_FAILED', label: 'Simulation failed', userMessage: "We can't guarantee this deposit right now." },
    ],
  },
  {
    id: 'stake-eth-lido-ethereum',
    title: 'Stake ETH via Lido',
    chainName: 'Ethereum',
    chainId: 1,
    category: 'Staking',
    status: 'demo-only',
    version: 'v1',
    executable: false,
    intent: 'Stake ETH to receive stETH (liquid staking position).',
    whatHappens: [
      'Check feasibility',
      'Execute staking transaction',
      'Confirm stETH received',
    ],
    youReceive: 'stETH.',
    canFail: [
      { code: 'EXECUTION_REVERTED', label: 'Reverted', userMessage: 'Staking failed. Your ETH remains in your wallet.' },
      { code: 'USER_REJECTED', label: 'Rejected', userMessage: 'Transaction rejected in wallet.' },
    ],
  },
];
