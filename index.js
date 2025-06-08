import { Gradium } from './gradium.js';
import { GRADIUM_WS, SEED_PHRASE } from './config.js';

async function run() {
    try {
        const gradium = new Gradium(GRADIUM_WS);
        await gradium.init();

        // Example block hash
        const specificBlockHash = '0x55717df300d557d051aed16d3c0bfbdf40d2d3258ec98e73cdda9a73219dc910';
        
        // Get detailed block info for the specific block
        console.log('\n🔍 Fetching detailed block info...');
        const blockInfo = await gradium.fetchBlockInfo(specificBlockHash);
        
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
        });

        // Display first few events
        console.log('\n🔔 First 3 Events:');
        blockInfo.events.slice(0, 3).forEach((event, index) => {
            console.log(`\nEvent #${index + 1}:`);
            console.log(`  Section: ${event.section}`);
            console.log(`  Method: ${event.method}`);
            console.log(`  Phase: ${event.phase}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}

run();
