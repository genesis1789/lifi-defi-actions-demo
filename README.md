# CrossBridge - Li.Fi Widget Integration Demo

A beautifully crafted demo showcasing the integration of the [Li.Fi Widget](https://docs.li.fi/widget/overview) for cross-chain token swaps and bridges.

![CrossBridge Demo](./screenshot.png)

## Features

- 🌉 **Li.Fi Widget Integration** - Full cross-chain bridging capabilities
- 🎨 **Custom Dark Theme** - Professional DeFi-inspired design
- ⚡ **Vite + React + TypeScript** - Modern, fast development stack
- 📱 **Responsive Design** - Works on all screen sizes
- 🔗 **Multi-Chain Support** - Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche, BSC

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Widget**: `@lifi/widget` v3.36+
- **Styling**: Custom CSS with CSS variables
- **Font**: Outfit (Google Fonts)

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

## Widget Configuration

The Li.Fi widget is configured in `src/App.tsx`:

```typescript
const widgetConfig: WidgetConfig = {
  integrator: 'CrossBridge Demo',
  variant: 'compact',
  appearance: 'dark',
  theme: {
    palette: {
      primary: { main: '#14f4c9' },
      secondary: { main: '#0ea5e9' },
      background: {
        default: '#111827',
        paper: '#1a2235',
      },
    },
    // ... additional theme options
  },
  chains: {
    allow: [1, 137, 42161, 10, 8453, 43114, 56],
  },
};
```

### Configuration Options

| Option | Description |
|--------|-------------|
| `integrator` | Your app/company name for analytics |
| `variant` | Widget layout: `compact`, `wide`, or `drawer` |
| `appearance` | Theme mode: `light`, `dark`, or `auto` |
| `theme` | Custom theming (colors, typography, etc.) |
| `chains.allow` | Array of chain IDs to enable |

## Project Structure

```
├── src/
│   ├── App.tsx        # Main component with Li.Fi widget
│   ├── App.css        # Component styles
│   ├── main.tsx       # Entry point with providers
│   └── index.css      # Global styles & CSS variables
├── index.html         # HTML template
├── package.json
└── vite.config.ts
```

## Resources

- [Li.Fi Widget Documentation](https://docs.li.fi/widget/overview)
- [Widget Configuration Guide](https://docs.li.fi/integrate-li.fi-widget/configure-widget)
- [Theme Customization](https://docs.li.fi/integrate-li.fi-widget/customize-widget)
- [Widget Variants](https://docs.li.fi/integrate-li.fi-widget/select-widget-variants)
- [Li.Fi GitHub](https://github.com/lifinance/widget)

## License

MIT
