# 🧠 Backend Core API Workspace

A secure, performance-tuned **Express API** architecture driving session state validation. Operates on strict native **Node ES Modules** and uses structural controllers to maintain game integrity.

## 🛡️ Game Security Rules
* **Stopwatch Manipulation Protection**: Server session tracking begins via IP mapping registers on `POST /api/game/start` and calculates totals *on the backend* on completion, bypassing client-side clock tampering.
* **Coordinate Obfuscation**: Game characters fetch coordinates from the database during selection checks, keeping target coordinates completely hidden from frontend JSON payloads on mount.
* **Validation Cushion Logic**: Evaluates click coordinate variables (`userX`, `userY`) against relational targets with a strict `±3%` tolerance boundary padding.

## 🚀 Execution Scripts
Driven via root workspace filters:
* `npm run dev --workspace=backend`: Launches API server with internal hot-reload watch streams (`port 3000`).
