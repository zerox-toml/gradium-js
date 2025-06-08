# js-gradium

A JavaScript library for interacting with the Gradium blockchain.

## Installation

```bash
npm install js-gradium
```

## Features

- Connect to Gradium blockchain nodes
- Fetch block information and headers
- Query blockchain state
- SHA3 hashing utilities
- GRANDPA consensus information
- Transaction handling

## Usage

```javascript
import { Gradium } from 'js-gradium';

// Initialize the client
const client = new Gradium('ws://localhost:9944');

// Connect to the network
await client.init();

// Get latest finalized block
const finalizedHead = await client.fetchFinalizedHead();
console.log('Latest block hash:', finalizedHead.toHex());

// Get block information
const blockInfo = await client.fetchBlockInfo(finalizedHead);
console.log('Block number:', blockInfo.number);

// Test SHA3 hashing
const hash = client.hashSha3('Hello, Gradium!');
```

## API Reference

### Constructor
```javascript
const client = new Gradium(wsUrl: string)
```
- `wsUrl`: WebSocket URL of the Gradium node

### Methods

#### `init()`
Connects to the blockchain node.

#### `fetchFinalizedHead()`
Returns the latest finalized block hash.

#### `fetchHeader(hash)`
Fetches block header information.

#### `fetchBlockHash(number)`
Gets block hash by block number.

#### `fetchBlock(hash)`
Retrieves raw block data.

#### `fetchCurrentSetId(atHash)`
Gets current GRANDPA set ID.

#### `fetchAuthorities(atHash)`
Retrieves GRANDPA authorities.

#### `hashSha3(data)`
Computes SHA3 hash of input data.

#### `fetchBlockInfo(hash)`
Gets detailed block information including:
- Block number
- Hash
- Parent hash
- Timestamp
- Extrinsics
- Events

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test
```

## License

MIT 