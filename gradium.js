import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import pkg from 'js-sha3';
const { sha3_256 } = pkg;


export class Gradium {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
    }

    async init() {
        const provider = new WsProvider(this.wsUrl);
        this.api = await ApiPromise.create({ provider });
    }

    async fetchFinalizedHead() {
        return await this.api.rpc.chain.getFinalizedHead();
    }

    async fetchHeader(hash) {
        return await this.api.rpc.chain.getHeader(hash);
    }

    async fetchBlockHash(number) {
        return await this.api.rpc.chain.getBlockHash(number);
    }

    async fetchBlock(hash) {
        return await this.api.rpc.chain.getBlock(hash);
    }

    async fetchCurrentSetId(atHash) {
        const keyHex = '0x5f9cc45b7a00c5899361e1c6099678dc8a2d09463effcc78a22d75b9cb87dffc';
        const result = await this.api.rpc.state.getStorage(keyHex, atHash);
    
        if (!result) {
            throw new Error("Storage key for GRANDPA current set ID returned null.");
        }
    
        // Case: result is already a Codec object (e.g., Option<u64>)
        if (result.toNumber) {
            return result.toNumber();
        }
    
        // Case: result is hex bytes and needs decoding
        const decoded = this.api.createType('u64', result.toHex ? result.toHex() : result);
        return decoded.toNumber();
    }

    async fetchAuthorities(atHash) {
        const res = await this.api.rpc.state.call('GrandpaApi_grandpa_authorities', '0x', atHash.toHex());
        const bytes = hexToU8a(res.toHex ? res.toHex() : res);
        const decoded = this.api.createType('Vec<(AuthorityId, u64)>', bytes);
        return decoded;
    }

    hashSha3(data) {
        return u8aToHex(Buffer.from(sha3_256.arrayBuffer(data)));
    }

    async sendTestTransaction(seedPhrase) {
        const keyring = new Keyring({ type: 'ethereum' });
        const pair = keyring.addFromUri(seedPhrase);
        const tx = this.api.tx.system.remark([0, 1, 2]);

        return new Promise((resolve, reject) => {
            tx.signAndSend(pair, ({ status, dispatchError }) => {
                if (status.isInBlock || status.isFinalized) {
                    console.log('Tx included in block:', status.asFinalized?.toHex() || status.asInBlock?.toHex());
                    resolve();
                } else if (dispatchError) {
                    console.error('Tx failed:', dispatchError.toString());
                    reject(dispatchError.toString());
                }
            });
        });
    }
}
