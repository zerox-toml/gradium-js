import { Gradium } from './gradium.js';
import { GRADIUM_WS, SEED_PHRASE } from './config.js';

async function run() {
    try {
        const gradium = new Gradium(GRADIUM_WS);
        await gradium.init();

        // 1. Finalized Head
        const head = await gradium.fetchFinalizedHead();
        console.log('✔️ Finalized head:', head.toHex());

        // 2. Block Header at Finalized Head
        const header = await gradium.fetchHeader(head);
        const blockNumber = header.number.toNumber();
        console.log('✔️ Finalized block number:', blockNumber);

        // 3. GRANDPA Set ID
        const setId = await gradium.fetchCurrentSetId(head);
        console.log('✔️ Current set ID:', setId);

        // 4. Authority Set
        const authorities = await gradium.fetchAuthorities(head);
        console.log('✔️ GRANDPA Authorities:', authorities.toHuman());

        // 5. Full GRANDPA State Object
        const grandpaState = await gradium.fetchGrandpaStateAt(head);
        console.log('🧠 GRANDPA State Snapshot:', grandpaState);

        // 6. Query last 5 headers
        const start = blockNumber - 4;
        const end = blockNumber;
        const headers = await gradium.queryHeaders(start, end);
        console.log(`📦 Queried headers from block ${start} to ${end}:`);
        headers.forEach(({ hash, header }) => {
            console.log(`   Block #${header.number.toNumber()} → hash: ${hash}`);
        });

        // 7. Simulate Read Proofs (nonces 1–3)
        const dummyNonces = [1, 2, 3];
        const readProofs = await gradium.fetchStateProofForOutwardTransfers(dummyNonces, head);
        console.log(`🔐 State proofs for dummy nonces:`, readProofs);

        // 8. Optional test transaction
        // console.log('🚀 Sending test tx...');
        // await gradium.sendTestTransaction(SEED_PHRASE);
        // console.log('✔️ Transaction sent successfully');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    }
}

run();
