# Gradium.js

A backend JavaScript project for interacting with Polkadot-based blockchains, providing functionality for fetching blockchain data and handling GRANDPA consensus operations.

## Overview

This project provides a set of utilities for:
- Connecting to Polkadot-based blockchains
- Fetching blocks, headers, and finalized heads
- Working with GRANDPA consensus
- Transaction handling

## Setup

1. Clone the repository:
```bash
git clone https://github.com/zerox-toml/gradium-js.git
cd gradium-js
```

2. Install dependencies:
```bash
npm install
```

## Usage

```javascript
import { Gradium } from './gradium.js';

// Initialize connection
const gradium = new Gradium('wss://your-node-url');
await gradium.init();

// Fetch latest finalized block
const finalizedHead = await gradium.fetchFinalizedHead();
const block = await gradium.fetchBlock(finalizedHead);
```

## Available Methods

### Constructor
```javascript
const gradium = new Gradium(wsUrl: string)
```

### Methods

#### `init()`
Initializes the connection to the blockchain node.

#### `fetchFinalizedHead()`
Returns the hash of the latest finalized block.

#### `fetchHeader(hash: string)`
Fetches the header for a specific block hash.

#### `fetchBlockHash(number: number)`
Retrieves the block hash for a given block number.

#### `fetchBlock(hash: string)`
Fetches the complete block data for a given hash.

#### `fetchCurrentSetId(atHash: string)`
Retrieves the current GRANDPA set ID at a specific block.

#### `fetchAuthorities(atHash: string)`
Fetches the current GRANDPA authorities at a specific block.

#### `hashSha3(data: string)`
Computes SHA3-256 hash of the provided data.

#### `sendTestTransaction(seedPhrase: string)`
Sends a test transaction using the provided seed phrase.

## Example Usage

### Fetching Block Information

```javascript
const gradium = new Gradium('wss://your-node-url');
await gradium.init();

// Get latest block
const finalizedHead = await gradium.fetchFinalizedHead();
const header = await gradium.fetchHeader(finalizedHead);
console.log('Latest block number:', header.number.toNumber());
```

### Working with GRANDPA Consensus

```javascript
const gradium = new Gradium('wss://your-node-url');
await gradium.init();

// Get current set ID
const setId = await gradium.fetchCurrentSetId(finalizedHead);
console.log('Current set ID:', setId);

// Get authorities
const authorities = await gradium.fetchAuthorities(finalizedHead);
console.log('Current authorities:', authorities);
```

## Development

To run the project locally:

1. Make sure you have Node.js installed
2. Install dependencies with `npm install`
3. Configure your blockchain node URL in the configuration
4. Run the project using `node index.js`

## License

MIT License - see the [LICENSE](LICENSE) file for details. 