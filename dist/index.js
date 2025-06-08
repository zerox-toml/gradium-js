import { Gradium } from './gradium.js';

export { Gradium };

async function run() {
    try {
        // Initialize Gradium with local node
        const gradium = new Gradium('ws://localhost:9944');
        console.log('🔌 Initializing connection to local node...');
        await gradium.init();
        console.log('✅ Connected successfully!\n');

        // 1. Get latest finalized block hash
        console.log('📦 Fetching latest finalized block hash...');
        const finalizedHead = await gradium.fetchFinalizedHead();
        console.log('Latest finalized block hash:', finalizedHead.toHex());
        console.log('✅ Success!\n');

        // 2. Get block header
        console.log('📄 Fetching block header...');
        const header = await gradium.fetchHeader(finalizedHead);
        console.log('Block number:', header.number.toNumber());
        console.log('Parent hash:', header.parentHash.toHex());
        console.log('State root:', header.stateRoot.toHex());
        console.log('✅ Success!\n');

        // 3. Get block hash by number
        const blockNumber = header.number.toNumber();
        console.log('🔍 Fetching block hash for number', blockNumber, '...');
        const blockHash = await gradium.fetchBlockHash(blockNumber);
        console.log('Block hash:', blockHash.toHex());
        console.log('✅ Success!\n');

        // 4. Get raw block data
        console.log('📦 Fetching raw block data...');
        const block = await gradium.fetchBlock(finalizedHead);
        console.log('Block extrinsics count:', block.block.extrinsics.length);
        console.log('✅ Success!\n');

        // 5. Get current set ID
        console.log('🔄 Fetching current GRANDPA set ID...');
        const setId = await gradium.fetchCurrentSetId(finalizedHead);
        console.log('Current set ID:', setId);
        console.log('✅ Success!\n');

        // 6. Get authorities
        console.log('👥 Fetching GRANDPA authorities...');
        const authorities = await gradium.fetchAuthorities(finalizedHead);
        console.log('Number of authorities:', authorities.length);
        console.log('✅ Success!\n');

        // 7. Test SHA3 hashing
        console.log('🔐 Testing SHA3 hashing...');
        const testData = 'Hello, Gradium!';
        const hash = gradium.hashSha3(testData);
        console.log('Input:', testData);
        console.log('SHA3 hash:', hash);
        console.log('✅ Success!\n');

        // 8. Get detailed block info
        console.log('📊 Fetching detailed block information...');
        const blockInfo = await gradium.fetchBlockInfo(finalizedHead);
        
        // Display block information
        console.log('\n📦 Block Information:');
        console.log('-------------------');
        console.log(`Block Number: ${blockInfo.number}`);
        console.log(`Block Hash: ${blockInfo.hash}`);
        console.log(`Parent Hash: ${blockInfo.parentHash}`);
        console.log(`Timestamp: ${blockInfo.timestamp ? new Date(blockInfo.timestamp).toISOString() : 'N/A'}`);
        console.log(`State Root: ${blockInfo.stateRoot}`);
        console.log(`Extrinsics Root: ${blockInfo.extrinsicsRoot}`);
        console.log(`\nExtrinsics Count: ${blockInfo.extrinsics.length}`);
        console.log(`Events Count: ${blockInfo.events.length}`);
        
        // Display first few extrinsics
        console.log('\n📝 First 3 Extrinsics:');
        blockInfo.extrinsics.slice(0, 3).forEach((ext, index) => {
            console.log(`\nExtrinsic #${index + 1}:`);
            console.log(`  Section: ${ext.section}`);
            console.log(`  Method: ${ext.method}`);
            console.log(`  Signer: ${ext.signer || 'None'}`);
            console.log(`  Nonce: ${ext.nonce || 'N/A'}`);
            console.log(`  Tip: ${ext.tip || '0'}`);
        });

        // Display first few events
        console.log('\n🔔 First 3 Events:');
        blockInfo.events.slice(0, 3).forEach((event, index) => {
            console.log(`\nEvent #${index + 1}:`);
            console.log(`  Section: ${event.section}`);
            console.log(`  Method: ${event.method}`);
            console.log(`  Phase: ${event.phase}`);
            console.log('  Data:', event.data);
        });
        console.log('✅ Success!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}

// Run the script
console.log('🚀 Starting Gradium block data fetch from local node...\n');
run();
