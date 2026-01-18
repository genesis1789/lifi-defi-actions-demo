import { useState } from 'react';
import './WidgetRecipesProposal.css';

// ============================================================================
// TYPES
// ============================================================================

interface Recipe {
  id: string;
  name: string;
  coverage: string;
  example: string;
  params: string[];
}

// ============================================================================
// DATA
// ============================================================================

const RECIPES: Recipe[] = [
  {
    id: 'erc4626-deposit',
    name: 'ERC4626 Vault Deposit',
    coverage: 'Morpho, Yearn, Beefy, 100+ vaults',
    example: 'Morpho USDC Vault on Base',
    params: ['vault'],
  },
  {
    id: 'aave-v3-supply',
    name: 'Aave v3 Supply',
    coverage: 'All Aave v3 deployments (10+ chains)',
    example: 'Aave USDC on Optimism',
    params: ['pool', 'asset'],
  },
  {
    id: 'lido-stake',
    name: 'Lido ETH Stake',
    coverage: 'Lido stETH',
    example: 'Stake ETH → stETH',
    params: [],
  },
];

const CURRENT_WIDGET_USERS = [
  { name: 'Velvet Capital', type: 'Fund Management', opportunity: 'Add vault deposits to fund strategies' },
  { name: 'DLT Pay', type: 'Payments', opportunity: 'Add "save to DeFi" feature' },
  { name: 'Alpha Vault', type: 'Investment', opportunity: 'Deposit into yield protocols' },
  { name: 'Portfolio trackers', type: 'Analytics', opportunity: 'Add "put to work" actions' },
];

const NEW_SEGMENTS = [
  { name: 'Crypto Fintech Apps', pain: 'Want yield features, no DeFi expertise', unlock: 'Zero protocol knowledge required' },
  { name: 'AI Agents', pain: 'Need standardized action interfaces', unlock: 'Recipes = programmable actions' },
  { name: 'Protocol Frontends', pain: 'Cross-chain deposits too complex', unlock: 'Recipe abstracts routing + calldata' },
  { name: 'Yield Aggregators', pain: 'Deposit integration is custom work', unlock: 'Just specify vault addresses' },
];

// ============================================================================
// CODE SNIPPETS
// ============================================================================

const CODE_TODAY = `// Today: Partner must generate calldata
<LiFiWidget
  config={{
    subvariant: 'custom',
    subvariantOptions: { custom: 'deposit' },
    toChain: 8453,
    toToken: '0x833589fCD...',
    contractCalls: [{
      toContractAddress: '0x7BfA...',
      toContractCallData: '0x6e553f65...', // ❌ How do they know this?
      toContractGasLimit: '200000',
    }],
  }}
/>`;

const CODE_PROPOSED = `// Proposed: Recipe-based (zero calldata knowledge)
<LiFiWidget
  config={{
    subvariant: 'custom',
    subvariantOptions: { custom: 'deposit' },
    action: {
      recipe: 'erc4626-deposit',
      params: {
        vault: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
      },
      // ✅ LI.FI generates: calldata, approvals, gas estimate
    },
  }}
/>`;

const CODE_AI_AGENT = `// AI Agent Interface
await lifi.executeAction({
  recipe: 'erc4626-deposit',
  params: { vault: '0x7BfA...', amount: '1000000000' },
  from: { chain: 'arbitrum', token: 'USDT' },
});
// Pulsar, Olas, Coinrule already use LI.FI for agents`;

// ============================================================================
// COMPONENTS
// ============================================================================

function Section({ 
  number, 
  title, 
  children,
  accent = 'default'
}: { 
  number: string; 
  title: string; 
  children: React.ReactNode;
  accent?: 'default' | 'problem' | 'solution' | 'impact';
}) {
  return (
    <section className={`section section--${accent}`}>
      <div className="section__header">
        <span className="section__number">{number}</span>
        <h2 className="section__title">{title}</h2>
      </div>
      <div className="section__content">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="code-block">
      {label && <div className="code-block__label">{label}</div>}
      <pre><code>{code}</code></pre>
    </div>
  );
}

function StatCard({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <div className="stat-card">
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {sublabel && <div className="stat-card__sublabel">{sublabel}</div>}
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="comparison-table">
      <div className="comparison-table__header">
        <div className="comparison-table__col">Aspect</div>
        <div className="comparison-table__col comparison-table__col--today">Today (Custom Deposit)</div>
        <div className="comparison-table__col comparison-table__col--proposed">With Recipes</div>
      </div>
      <div className="comparison-table__row">
        <div className="comparison-table__col">Partner provides</div>
        <div className="comparison-table__col comparison-table__col--today">Full calldata</div>
        <div className="comparison-table__col comparison-table__col--proposed">Recipe + params</div>
      </div>
      <div className="comparison-table__row">
        <div className="comparison-table__col">Knowledge required</div>
        <div className="comparison-table__col comparison-table__col--today">Protocol contract interfaces</div>
        <div className="comparison-table__col comparison-table__col--proposed">Just vault/pool address</div>
      </div>
      <div className="comparison-table__row">
        <div className="comparison-table__col">Maintenance burden</div>
        <div className="comparison-table__col comparison-table__col--today">Partner tracks changes</div>
        <div className="comparison-table__col comparison-table__col--proposed">LI.FI maintains patterns</div>
      </div>
      <div className="comparison-table__row">
        <div className="comparison-table__col">Time to implement</div>
        <div className="comparison-table__col comparison-table__col--today">Days to weeks</div>
        <div className="comparison-table__col comparison-table__col--proposed">Hours</div>
      </div>
      <div className="comparison-table__row">
        <div className="comparison-table__col">Target user</div>
        <div className="comparison-table__col comparison-table__col--today">DeFi-proficient teams</div>
        <div className="comparison-table__col comparison-table__col--proposed">Anyone</div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, isSelected, onClick }: { recipe: Recipe; isSelected: boolean; onClick: () => void }) {
  return (
    <button 
      className={`recipe-card ${isSelected ? 'recipe-card--selected' : ''}`}
      onClick={onClick}
    >
      <div className="recipe-card__name">{recipe.name}</div>
      <div className="recipe-card__coverage">{recipe.coverage}</div>
      <div className="recipe-card__id">
        <code>{recipe.id}</code>
      </div>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WidgetRecipesProposal() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(RECIPES[0]);

  return (
    <div className="proposal">
      {/* Hero */}
      <header className="hero">
        <div className="hero__badge">Widget Iteration Proposal</div>
        <h1 className="hero__title">
          Deposit Recipes
        </h1>
        <p className="hero__subtitle">
          Enable DeFi deposits without protocol expertise
        </p>
        <div className="hero__thesis">
          <span className="hero__thesis-label">Core thesis</span>
          <p>
            The Widget's custom deposit subvariant requires partners to generate calldata — 
            a barrier for most Widget users. <strong>Recipes</strong> abstract this: 
            partners specify a recipe + parameters, LI.FI generates the calldata.
          </p>
        </div>
      </header>

      {/* Strategic Context */}
      <Section number="01" title="Strategic Alignment">
        <div className="context-grid">
          <div className="context-card">
            <div className="context-card__header">LI.FI Growth Direction</div>
            <blockquote className="context-card__quote">
              "Scale the universal liquidity market for digital assets"
            </blockquote>
            <p className="context-card__source">— Series A Extension (Dec 2025)</p>
          </div>
          <div className="context-card context-card--metrics">
            <div className="context-card__header">Current Position</div>
            <div className="metrics-row">
              <StatCard value="~1,000" label="B2B Partners" />
              <StatCard value="$8B" label="Monthly Volume" sublabel="595% YoY" />
              <StatCard value="$60B+" label="Lifetime Volume" />
            </div>
          </div>
        </div>
        
        <div className="alignment-flow">
          <div className="alignment-step">
            <span className="alignment-step__label">Today</span>
            <span className="alignment-step__value">Swap + Bridge</span>
          </div>
          <div className="alignment-arrow">→</div>
          <div className="alignment-step alignment-step--active">
            <span className="alignment-step__label">This Iteration</span>
            <span className="alignment-step__value">+ Deposit Recipes</span>
          </div>
          <div className="alignment-arrow">→</div>
          <div className="alignment-step">
            <span className="alignment-step__label">Q1 2026</span>
            <span className="alignment-step__value">Intent Marketplace</span>
          </div>
        </div>
        
        <p className="alignment-note">
          Recipes are the bridge from "routing" to "intent-based execution" — 
          they're structured intents that align with the announced roadmap.
        </p>
      </Section>

      {/* The Problem */}
      <Section number="02" title="The Problem" accent="problem">
        <div className="problem-statement">
          <p className="problem-statement__main">
            Custom deposit <strong>already works</strong> — but requires partners to generate calldata.
          </p>
          <p className="problem-statement__sub">
            This is a barrier for typical Widget users who lack DeFi protocol expertise.
          </p>
        </div>

        <div className="problem-detail">
          <div className="problem-detail__header">What partners must do today:</div>
          <div className="burden-list">
            <div className="burden-item">
              <span className="burden-item__number">1</span>
              <div className="burden-item__content">
                <strong>Generate calldata</strong> — understand Morpho/Aave contract interfaces
              </div>
            </div>
            <div className="burden-item">
              <span className="burden-item__number">2</span>
              <div className="burden-item__content">
                <strong>Track approval addresses</strong> — know what needs approval and to whom
              </div>
            </div>
            <div className="burden-item">
              <span className="burden-item__number">3</span>
              <div className="burden-item__content">
                <strong>Maintain on protocol changes</strong> — new vaults, deprecated markets, upgrades
              </div>
            </div>
          </div>
        </div>

        <CodeBlock code={CODE_TODAY} label="Current: Partner generates calldata" />
        
        <div className="problem-result">
          <span className="problem-result__label">Result</span>
          <p>Many Widget partners don't ship deposit flows — the "deposit cliff" remains.</p>
        </div>
      </Section>

      {/* The Solution */}
      <Section number="03" title="The Solution: Recipes" accent="solution">
        <div className="solution-intro">
          <p>
            <strong>Recipes</strong> are parameterized calldata generators. 
            LI.FI maintains the <em>pattern</em>, partners provide <em>parameters</em>.
          </p>
        </div>

        <div className="solution-grid">
          <div className="solution-code">
            <CodeBlock code={CODE_PROPOSED} label="Proposed: Recipe-based" />
          </div>
          
          <div className="solution-explanation">
            <div className="solution-explanation__header">What LI.FI generates from recipe:</div>
            <ul className="solution-list">
              <li><code>toContractCallData</code> — deposit function calldata</li>
              <li><code>toApprovalAddress</code> — spender for token approval</li>
              <li><code>toContractGasLimit</code> — estimated gas</li>
              <li><code>toChain</code> / <code>toToken</code> — derived from vault</li>
            </ul>
            <div className="solution-explanation__note">
              Partner just specifies the vault address. Zero calldata knowledge required.
            </div>
          </div>
        </div>

        <div className="recipes-section">
          <h3 className="recipes-section__title">v1 Recipe Library</h3>
          <p className="recipes-section__subtitle">Three recipes covering 80%+ of common deposit use cases</p>
          
          <div className="recipes-grid">
            {RECIPES.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isSelected={selectedRecipe.id === recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>

          <div className="recipe-detail">
            <div className="recipe-detail__header">
              <code>{selectedRecipe.id}</code>
            </div>
            <div className="recipe-detail__row">
              <span className="recipe-detail__label">Coverage:</span>
              <span className="recipe-detail__value">{selectedRecipe.coverage}</span>
            </div>
            <div className="recipe-detail__row">
              <span className="recipe-detail__label">Parameters:</span>
              <span className="recipe-detail__value">
                {selectedRecipe.params.length > 0 
                  ? selectedRecipe.params.map(p => <code key={p}>{p}</code>)
                  : <span className="recipe-detail__none">None (fixed contract)</span>
                }
              </span>
            </div>
            <div className="recipe-detail__row">
              <span className="recipe-detail__label">Example:</span>
              <span className="recipe-detail__value">{selectedRecipe.example}</span>
            </div>
          </div>
        </div>

        <div className="scalability-note">
          <span className="scalability-note__label">Why this scales</span>
          <p>
            ERC4626 is a <strong>standard interface</strong> — one recipe covers hundreds of vaults 
            (Morpho, Yearn, Beefy, etc.). LI.FI maintains patterns, not instances.
          </p>
        </div>
      </Section>

      {/* Comparison */}
      <Section number="04" title="Before vs After">
        <ComparisonTable />
      </Section>

      {/* Target Segments */}
      <Section number="05" title="Target Segments">
        <div className="segments-container">
          <div className="segment-group">
            <h3 className="segment-group__title">
              Current Widget Users
              <span className="segment-group__badge">Increase value per embed</span>
            </h3>
            <div className="segment-cards">
              {CURRENT_WIDGET_USERS.map((user) => (
                <div key={user.name} className="segment-card">
                  <div className="segment-card__name">{user.name}</div>
                  <div className="segment-card__type">{user.type}</div>
                  <div className="segment-card__opportunity">{user.opportunity}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="segment-group segment-group--new">
            <h3 className="segment-group__title">
              New Segments Unlocked
              <span className="segment-group__badge segment-group__badge--new">Net new partners</span>
            </h3>
            <div className="segment-cards">
              {NEW_SEGMENTS.map((segment) => (
                <div key={segment.name} className="segment-card segment-card--new">
                  <div className="segment-card__name">{segment.name}</div>
                  <div className="segment-card__pain">{segment.pain}</div>
                  <div className="segment-card__unlock">→ {segment.unlock}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ai-callout">
          <div className="ai-callout__header">
            <span className="ai-callout__icon">🤖</span>
            <span className="ai-callout__title">AI Agent Opportunity</span>
          </div>
          <p className="ai-callout__text">
            Pulsar, Olas, and Coinrule already use LI.FI for AI agents. 
            Recipes provide the <strong>standardized action interfaces</strong> AI needs.
          </p>
          <CodeBlock code={CODE_AI_AGENT} />
        </div>
      </Section>

      {/* Competitive Position */}
      <Section number="06" title="Competitive Advantage">
        <div className="competitive-grid">
          <div className="competitive-card">
            <div className="competitive-card__name">Socket / Bungee</div>
            <div className="competitive-card__focus">Bridge aggregation</div>
            <div className="competitive-card__gap">No deposit abstraction</div>
          </div>
          <div className="competitive-card">
            <div className="competitive-card__name">0x / Matcha</div>
            <div className="competitive-card__focus">DEX aggregation + cross-chain</div>
            <div className="competitive-card__gap">No widget-native DeFi actions</div>
          </div>
          <div className="competitive-card">
            <div className="competitive-card__name">DZap</div>
            <div className="competitive-card__focus">Zap infrastructure</div>
            <div className="competitive-card__gap">Lower partner reach, no Widget</div>
          </div>
          <div className="competitive-card competitive-card--lifi">
            <div className="competitive-card__name">LI.FI + Recipes</div>
            <div className="competitive-card__focus">Cross-chain + DeFi activation</div>
            <div className="competitive-card__advantage">
              Embeddable Widget + Composer orchestration + Recipe abstraction
            </div>
          </div>
        </div>
        <p className="competitive-note">
          No competitor offers an embeddable widget with standardized DeFi action abstractions.
        </p>
      </Section>

      {/* Implementation */}
      <Section number="07" title="Implementation Path">
        <div className="phases-grid">
          <div className="phase-card">
            <div className="phase-card__number">Phase 1</div>
            <div className="phase-card__title">Recipe Foundation</div>
            <ul className="phase-card__items">
              <li>Recipe schema + runtime</li>
              <li>ERC4626, Aave v3, Lido recipes</li>
              <li>Widget integration</li>
              <li>Simulation integration</li>
            </ul>
            <div className="phase-card__effort">~3-4 weeks</div>
          </div>
          <div className="phase-card">
            <div className="phase-card__number">Phase 2</div>
            <div className="phase-card__title">Partner Rollout</div>
            <ul className="phase-card__items">
              <li>Documentation</li>
              <li>Playground presets</li>
              <li>Beta with select partners</li>
              <li>Feedback iteration</li>
            </ul>
            <div className="phase-card__effort">~2-3 weeks</div>
          </div>
          <div className="phase-card">
            <div className="phase-card__number">Phase 3</div>
            <div className="phase-card__title">Expansion</div>
            <ul className="phase-card__items">
              <li>AI agent interface</li>
              <li>Additional recipes</li>
              <li>Category-based actions (v1.5)</li>
            </ul>
            <div className="phase-card__effort">Ongoing</div>
          </div>
        </div>

        <div className="engineering-note">
          <span className="engineering-note__label">Engineering reality check</span>
          <p>
            ERC4626 is a standard interface — recipe implementation is straightforward. 
            The complexity is in simulation and error handling, which Composer already provides.
          </p>
        </div>
      </Section>

      {/* Business Impact */}
      <Section number="08" title="Expected Impact" accent="impact">
        <div className="impact-grid">
          <div className="impact-card">
            <div className="impact-card__metric">Value per Embed</div>
            <div className="impact-card__arrow">↑</div>
            <div className="impact-card__detail">
              Same partners use Widget for more (swap + bridge + deposit)
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-card__metric">Partner Stickiness</div>
            <div className="impact-card__arrow">↑</div>
            <div className="impact-card__detail">
              Widget becomes essential infrastructure, not commodity routing
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-card__metric">New Segments</div>
            <div className="impact-card__arrow">+</div>
            <div className="impact-card__detail">
              Fintech, AI agents, yield apps — couldn't use custom deposit before
            </div>
          </div>
          <div className="impact-card">
            <div className="impact-card__metric">Routing Volume</div>
            <div className="impact-card__arrow">↑</div>
            <div className="impact-card__detail">
              Deposits still route through LI.FI (same fee structure)
            </div>
          </div>
        </div>

        <div className="success-criteria">
          <h4 className="success-criteria__title">Success Criteria</h4>
          <ul className="success-criteria__list">
            <li>20%+ of current Widget partners enable deposit flows within 6 months</li>
            <li>Partner-reported setup time validates at ≤1 day</li>
            <li>At least 3 new partner segments (fintech, AI, yield) adopt</li>
            <li>Reduced support questions vs. custom contractCalls approach</li>
          </ul>
        </div>
      </Section>

      {/* Risks */}
      <Section number="09" title="Risks & Mitigations">
        <div className="risks-table">
          <div className="risk-row">
            <div className="risk-row__risk">Recipe maintenance burden</div>
            <div className="risk-row__mitigation">
              Focus on standards (ERC4626 covers 100+ vaults). Pattern maintenance, not instance maintenance.
            </div>
          </div>
          <div className="risk-row">
            <div className="risk-row__risk">Protocol changes break recipes</div>
            <div className="risk-row__mitigation">
              Versioning, pre-execution simulation, explicit failure modes. Standards change slowly.
            </div>
          </div>
          <div className="risk-row">
            <div className="risk-row__risk">Adoption slower than expected</div>
            <div className="risk-row__mitigation">
              Start with current partners who have expressed deposit needs. Validate before broad rollout.
            </div>
          </div>
          <div className="risk-row">
            <div className="risk-row__risk">Liability concerns</div>
            <div className="risk-row__mitigation">
              Clear semantics: LI.FI guarantees execution, not economic outcomes. Same as current routing.
            </div>
          </div>
        </div>
      </Section>

      {/* Summary */}
      <Section number="10" title="Summary">
        <div className="summary-box">
          <div className="summary-box__pitch">
            <p>
              <strong>Deposit Recipes</strong> close the gap between Widget capability and Widget usability. 
              Custom deposit already works — but requires calldata expertise most partners don't have.
            </p>
            <p>
              Recipes let partners specify <em>what</em> (vault address), while LI.FI handles <em>how</em> (calldata generation).
            </p>
          </div>
          
          <div className="summary-box__points">
            <div className="summary-point">
              <span className="summary-point__icon">✓</span>
              <span>Increases value per embed for current partners</span>
            </div>
            <div className="summary-point">
              <span className="summary-point__icon">✓</span>
              <span>Unlocks new segments (fintech, AI agents, yield apps)</span>
            </div>
            <div className="summary-point">
              <span className="summary-point__icon">✓</span>
              <span>Aligns with intent-based direction (Q1 2026 roadmap)</span>
            </div>
            <div className="summary-point">
              <span className="summary-point__icon">✓</span>
              <span>Differentiates from Socket, 0x, DZap</span>
            </div>
            <div className="summary-point">
              <span className="summary-point__icon">✓</span>
              <span>Builds on existing Composer infrastructure</span>
            </div>
          </div>
        </div>

        <div className="cta-box">
          <p className="cta-box__text">
            This iteration moves the Widget from "routing infrastructure" to "DeFi activation infrastructure" — 
            a meaningful step toward the "universal liquidity market" vision.
          </p>
        </div>
      </Section>

      {/* Footer */}
      <footer className="proposal-footer">
        <p>LI.FI Widget · Deposit Recipes Proposal · January 2026</p>
      </footer>
    </div>
  );
}
