# Typed Data Signing Demo 🚀

Sign a typed data message with random generated private key or with wallet extension.

## Requirements

Ensure your development environment is set up with the following:

- **Node.js (v18 or later):** [Download here](https://nodejs.org/en/download/package-manager) 📥
- **Yarn:** [Install here](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) 🧶
- **Docker (for containerization):** [Get Docker](https://docs.docker.com/get-docker/) 🐳
- **Hardhat (for smart contracts):** [Getting Started with Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started) ⛑️

## Project Structure

### Frontend (apps/frontend) 🌐

A blazing-fast React application powered by Vite:

- **Vechain dapp-kit:** Streamline wallet connections and interactions. [Learn more](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit)

### Contracts (packages/contracts) 📜

Smart contract in Solidity, managed with Hardhat for deployment on the Vechain Thor network.

### Packages 📦

Shared configurations and utility functions to unify and simplify your development process.

### Getting Started

Clone the repository and install dependencies with ease:

```bash
yarn # Run this at the root level of the project
```

Place your `.env` files in the root folder, you can copy `.env.example` file and rename it to `.env` changing the values to your own:

### Run the frontend and deploy the contracts on the Local Solo Network (if not deployed yet) with a single command:

```bash
  yarn dev:testnet
```

You should see a log like this, that means the frontend is running:

```bash
frontend:dev:   VITE v5.3.2  ready in 135 ms
frontend:dev:
frontend:dev:   ➜  Local:   http://localhost:5001/
frontend:dev:   ➜  Network: http://192.168.1.26:5001/
frontend:dev:   ➜  Network: http://192.168.64.1:5001/
frontend:dev:   ➜  press h + enter to show help
```

### Run the frontend and deploy the contracts on your own solo network:

```bash
  yarn dev

```
