# Environment Setup

Create a `.env` file in the root directory with the following:

```env
VITE_LIFI_INTEGRATOR=your_integrator_id_here

# Optional (only if you need stable RPCs)
# VITE_RPC_BASE=https://...
# VITE_RPC_OPTIMISM=https://...
```

**Required:**
- `VITE_LIFI_INTEGRATOR` - Your LI.FI integrator ID. Without this, the widget will not render.

**Optional:**
- `VITE_RPC_BASE` - Custom RPC endpoint for Base chain
- `VITE_RPC_OPTIMISM` - Custom RPC endpoint for Optimism chain

## Quick Start

1. Copy this template to `.env`:
   ```bash
   echo "VITE_LIFI_INTEGRATOR=your_integrator_id_here" > .env
   ```

2. Replace `your_integrator_id_here` with your actual LI.FI integrator ID

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Visit `/widget-comparison` to see the demo
