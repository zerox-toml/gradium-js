const Gradium = require('./gradium');

async function main() {
    const g = new Gradium('ws://localhost:9944');
    await g.init();

    const finalizedHash = await g.fetchFinalizedHead();
    console.log('Finalized head:', finalizedHash.toHex());

    const header = await g.fetchHeader(finalizedHash);
    console.log('Finalized header number:', header.number.toNumber());

    const setId = await g.fetchCurrentSetId(finalizedHash);
    console.log('Current set ID:', setId);

    const authorities = await g.fetchAuthorities(finalizedHash);
    console.log('Authorities:', authorities.toHuman());

    const sha3 = g.hashSha3(Buffer.from([1, 2, 3]));
    console.log('sha3_256 hash:', sha3);

    const bscNonce = await g.readBscNonce();
    console.log('BSC Nonce:', bscNonce);
}

main().catch(console.error);
