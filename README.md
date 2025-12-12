# LI.FI Widget - DeFi Actions Mode

A presentation and interactive prototype for **DeFi Actions Mode**, a new Widget mode that surfaces curated DeFi actions as outcomes users understand.

## Overview

This project presents a product proposal for evolving the LI.FI Widget from token-level routing to outcome-level intent. DeFi Actions Mode enables users to choose what they want to do (e.g., "Deposit USDC into Aave") while LI.FI handles how it happens through Composer-powered execution.

## Features

- **Interactive Prototype**: Fully functional widget mockup demonstrating the DeFi Actions Mode experience
- **Smart Route Detection**: Automatically shows required steps (swap, bridge) based on user selection
- **Pre-execution Simulation**: Visual feedback showing route verification before execution
- **Step-by-step Processing**: Animated execution flow showing orchestrated multi-step transactions
- **Outcome-focused UX**: Clear display of what users receive (position tokens, not just confirmation)

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Custom CSS with design tokens
- **Fonts**: GT America (display), Inter (body), JetBrains Mono (mono)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── src/
│   ├── pages/
│   │   ├── DeFiActionsDemo.tsx    # Main presentation component
│   │   └── DeFiActionsDemo.css    # Presentation styles
│   ├── App.tsx                    # App wrapper
│   └── main.tsx                   # Entry point
├── index.html
├── package.json
└── README.md
```

## Presentation Sections

1. **Hero**: Introduction to DeFi Actions Mode
2. **Context**: Where this fits in LI.FI's architecture
3. **Problem**: The abstraction gap, not execution
4. **Segments**: Target users (wallets, protocols, appchains)
5. **Landscape**: Market validation and competitive analysis
6. **Proposal**: How DeFi Actions Mode works
7. **Impact**: Expected effort reduction for partners
8. **PRD**: Design principles and v1 scope
9. **Risks**: Identified risks and mitigations
10. **GTM**: Development roadmap and success criteria

## Interactive Prototype

The prototype demonstrates:
- Action selection (4 curated DeFi actions)
- Cross-chain capability (automatic bridge detection)
- Token flexibility (swap detection when needed)
- Pre-execution simulation
- Multi-step execution visualization
- Outcome-focused success states

## Design Principles

- **Users choose outcomes**: The Widget explains the action clearly
- **System handles complexity**: Execution orchestration is abstracted
- **Clean, modern, fintech aesthetic**: Lean design focused on clarity

## License

MIT
