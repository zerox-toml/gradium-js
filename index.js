import { Gradium } from './gradium.js';
import { GRADIUM_WS, SEED_PHRASE } from './config.js';

async function run() {
    const gradium = new Gradium(GRADIUM_WS);
    await gradium.init();

    const head = await gradium.fetchFinalizedHead();
    console.log('✔️ Finalized head:', head.toHex());

    const header = await gradium.fetchHeader(head);
    console.log('✔️ Finalized block number:', header.number.toNumber());

    const setId = await gradium.fetchCurrentSetId(head);
    console.log('✔️ Current set ID:', setId);

    const authorities = await gradium.fetchAuthorities(head);
    console.log('✔️ Authorities:', authorities.toHuman());

    console.log('🚀 Sending test tx...');
    await gradium.sendTestTransaction(SEED_PHRASE);
    console.log('✔️ Done.');
}

run().catch(err => {
    console.error('❌ Error:', err);
});
