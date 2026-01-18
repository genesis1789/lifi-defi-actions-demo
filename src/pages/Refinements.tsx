import './Refinements.css';

export default function Refinements() {
  return (
    <div className="ref">
      <header className="ref-header">
        <span className="ref-label">Iteration Learnings</span>
        <h1>What I'd Refine</h1>
      </header>

      {/* Learning 1 */}
      <section className="ref-block">
        <div className="ref-block__number">01</div>
        <div className="ref-block__content">
          <h2>The Real Barrier</h2>
          <p>
            Custom deposit <strong>already exists</strong>. Partners can use <code>contractCalls[]</code> today.
          </p>
          <p className="ref-emphasis">
            The barrier is <strong>calldata generation</strong>. Widget users aren't DeFi engineers. That's why they chose the Widget over SDK/API.
          </p>
        </div>
      </section>

      {/* Learning 2 */}
      <section className="ref-block">
        <div className="ref-block__number">02</div>
        <div className="ref-block__content">
          <h2>The Actual Widget ICP</h2>
          <div className="ref-columns">
            <div className="ref-col ref-col--muted">
              <span className="ref-col__label">SDK/API</span>
              <p>Major wallets, appchains, and AI agents like Pulsar, Olas, and Coinrule. They want programmatic control.</p>
            </div>
            <div className="ref-col ref-col--highlight">
              <span className="ref-col__label">Widget</span>
              <p>Teams like Velvet Capital and DLT Pay. They need turnkey UI and want to ship fast without deep DeFi expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning 3 */}
      <section className="ref-block">
        <div className="ref-block__number">03</div>
        <div className="ref-block__content">
          <h2>The Fix: Recipes</h2>
          <p className="ref-subhead">LI.FI maintains the <em>patterns</em>. Partners provide the <em>parameters</em>.</p>
          
          <div className="ref-comparison">
            <div className="ref-code">
              <span className="ref-code__label">Today</span>
              <pre>{`contractCalls: [{
  toContractCallData: '0x6e553f65...'
  // Partner generates calldata
}]`}</pre>
            </div>
            <div className="ref-code ref-code--new">
              <span className="ref-code__label">Recipes</span>
              <pre>{`action: {
  recipe: 'erc4626-deposit',
  params: { vault: '0x7BfA...' }
  // LI.FI generates calldata
}`}</pre>
            </div>
          </div>

          <div className="ref-scale">
            <strong>Why it scales:</strong> ERC4626 is a vault standard adopted by Morpho, Yearn v3, Beefy, and many others. One recipe covers all of them. Protocols with different interfaces like Aave pools need their own recipe, but each recipe still covers multiple deployments across chains.
          </div>
        </div>
      </section>

      {/* Strategic Fit */}
      <section className="ref-block ref-block--strategy">
        <div className="ref-block__number">04</div>
        <div className="ref-block__content">
          <h2>Why This Matters for Li.Fi</h2>
          
          <div className="ref-strategy-dual">
            <div className="ref-strategy-col">
              <span className="ref-strategy-col__label">Depth</span>
              <h3>Current Partners</h3>
              <p>Teams like Velvet and DLT Pay can now add deposit features they couldn't build before. Widget moves from routing tool to full DeFi infrastructure. Higher switching cost.</p>
            </div>
            <div className="ref-strategy-col ref-strategy-col--highlight">
              <span className="ref-strategy-col__label">Breadth</span>
              <h3>New Adopters</h3>
              <p>Teams that need deposits but can't dedicate engineering to calldata generation. Portfolio apps wanting yield features. Fintech apps adding DeFi. They looked at Widget before and passed. Recipes unlock them.</p>
            </div>
          </div>

          <div className="ref-distribution">
            <h3>The Distribution Angle</h3>
            <div className="ref-flywheel">
              <div className="ref-flywheel__step">
                <span>1</span>
                <p>Recipes lower barrier</p>
              </div>
              <div className="ref-flywheel__arrow">→</div>
              <div className="ref-flywheel__step">
                <span>2</span>
                <p>More partners enable deposits</p>
              </div>
              <div className="ref-flywheel__arrow">→</div>
              <div className="ref-flywheel__step">
                <span>3</span>
                <p>Widget becomes a distribution channel</p>
              </div>
              <div className="ref-flywheel__arrow">→</div>
              <div className="ref-flywheel__step">
                <span>4</span>
                <p>Protocols want recipe coverage</p>
              </div>
            </div>
          </div>

          <div className="ref-strategy-grid">
            <div className="ref-strategy-item">
              <span className="ref-strategy-item__label">Stacks with Roadmap</span>
              <p>Recipes generate the destination calldata. Works with Li.Fi's existing infrastructure. One abstraction, compatible with any routing method.</p>
            </div>
            <div className="ref-strategy-item">
              <span className="ref-strategy-item__label">Platform Leverage</span>
              <p>Widget gets this first, but recipes work across SDK and API too. One abstraction, multiple products. AI agents get the same benefit. Same routing fees, more transaction types flowing through Li.Fi.</p>
            </div>
            <div className="ref-strategy-item">
              <span className="ref-strategy-item__label">Competitive Gap</span>
              <p>Routing is crowded. Socket, 0x, and others compete there. Widget + action abstraction is open territory.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk */}
      <section className="ref-block">
        <div className="ref-block__number">05</div>
        <div className="ref-block__content">
          <h2>Key Risk & Validation</h2>
          <p>
            Adoption depends on whether partners actually want deposit features. First validation: talk to 5 current partners and 5 potential Widget users. Ask if they've tried custom deposit and why they stopped. Ask if deposit capability would have changed their Widget adoption decision.
          </p>
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#8b8b96' }}>
            Engineering feasibility is low risk. ERC4626 recipe builds on Composer, about two weeks of work.
          </p>
        </div>
      </section>

      {/* Bottom Line */}
      <section className="ref-bottom">
        <p>
          <strong>Same goal:</strong> enable deposits for Widget users.<br/>
          <strong>Better abstraction:</strong> recipes turn a toolkit into a product.
        </p>
      </section>
    </div>
  );
}
