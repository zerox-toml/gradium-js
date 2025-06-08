import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { u8aToHex, hexToU8a } from '@polkadot/util';
import { hexToBn } from '@polkadot/util';
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

        // Handle different result types
        if (result.isSome) {
            const unwrapped = result.unwrap();
            if (unwrapped.toString) {
                return unwrapped.toString();
            } else if (unwrapped.toHex) {
                return unwrapped.toHex();
            }
        } else if (result.toHex) {
            // If it's a hex value, return it as is
            return result.toHex();
        } else if (typeof result === 'string') {
            // If it's a string, return it as is
            return result;
        }

        // If we get here, try to create a u64 type
        try {
            const decoded = this.api.createType('u64', result);
            return decoded.toString();
        } catch (e) {
            console.error('Failed to decode set ID:', e);
            throw new Error("Unable to decode GRANDPA current set ID");
        }
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

    async queryHeaders(start, end) {
        const headers = [];
        for (let i = start; i <= end; i++) {
            const hash = await this.fetchBlockHash(i);
            const header = await this.fetchHeader(hash);
            headers.push({ hash: hash.toHex(), header });
        }
        return headers;
    }

    async fetchStateProofForOutwardTransfers(nonces, at) {
        // `bridge_pallet_outward_transfers_storage_key` is custom pallet logic;
        // for now, we'll simulate using a general pattern
        const keys = nonces.map(nonce => {
            // This is an assumption: your runtime will need custom key generation
            return `0x${nonce.toString(16).padStart(64, '0')}`;
        });

        const result = await this.api.rpc.state.getReadProof(keys, at);
        return result.proof.map(entry => entry.toHex());
    }

    async fetchGrandpaStateAt(headHash = null) {
        const finalizedHash = headHash || await this.fetchFinalizedHead();
        const header = await this.fetchHeader(finalizedHash);
        const setId = await this.fetchCurrentSetId(finalizedHash);
        const authorities = await this.fetchAuthorities(finalizedHash);

        const authorityList = authorities.toHuman();
        const blockNumber = header.number.toNumber();

        // Sanity: check for duplicates
        const ids = authorityList.map(([id, _]) => id);
        const unique = new Set(ids);
        if (ids.length !== unique.size) {
            throw new Error("Duplicate authorities found in GRANDPA set.");
        }

        return {
            current_set_id: setId,
            current_authorities: authorityList,
            latest_height: blockNumber,
            latest_hash: finalizedHash.toHex(),
            slot_duration: 6000,
            state_machine: 'Polkadot(0)',
        };
    }

    async sendTestTransaction(seedPhrase) {
        const keyring = new Keyring({ type: 'ethereum' });
        const pair = keyring.addFromUri(seedPhrase);
        const tx = this.api.tx.system.remark('0x1234');
        const nonce = await this.api.rpc.system.accountNextIndex(pair.address);

        return new Promise((resolve, reject) => {
            tx.signAndSend(pair, { nonce }, ({ status, dispatchError }) => {
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
