# Gradium.js

A powerful JavaScript library for interacting with Polkadot-based blockchains, providing seamless access to blockchain data and GRANDPA consensus operations.

## Features

- 🔗 Connect to any Polkadot-based blockchain
- 📦 Fetch blocks, headers, and finalized heads
- 🔐 GRANDPA consensus operations
- 🔑 Transaction signing and submission
- 🛠️ Easy-to-use API

## Installation

```bash
npm install gradium-js
```

## Quick Start

```javascript
import { Gradium } from 'gradium-js';

// Initialize connection
const gradium = new Gradium('wss://your-node-url');
await gradium.init();

// Fetch latest finalized block
const finalizedHead = await gradium.fetchFinalizedHead();
const block = await gradium.fetchBlock(finalizedHead);
```

## API Reference

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

## Examples

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details. 