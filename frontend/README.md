# 🎨 Frontend Client Layer Workspace

The interactive client interface layer built using **React + Vite**, styled exclusively with highly scoped **CSS Modules** and orchestrated via **React Router v7**.

## 🧠 Strategic Core Modules
* **Custom Hooks (`/src/hooks`)**:
  * `useGameSession`: Runs a high-performance rendering animation frame loop (`requestAnimationFrame`) to prevent browser thread stopwatch lag.
  * `useLeaderboard`: Controls arcade submission states and clears Router index history nodes on save.
* **Responsive Architecture**: Utilizes localized custom CSS variables (`--box-size`, `--marker-size`) combined with precise viewport media breakpoints to prevent layout drift on desktop, tablet, and smartphone monitors.

## 🚀 Execution Scripts
Driven via root workspace filters:
* `npm run dev --workspace=frontend`: Fires development environment local server (`port 5173`).
* `npm run build --workspace=frontend`: Compiles optimized chunked client bundle outputs.

