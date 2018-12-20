let { Codec } = require('../lib/Js-Amino/src/index')
import trxType from './model/trxType'

const PubKeyEd25519 = trxType.PubKeyEd25519,
	ITX = trxType.ITX,
	AuthTx = trxType.AuthTx,
	Sender = trxType.Sender,
	Receiver = trxType.Receiver,
	Signature = trxType.Signature

export default class Tx {
	/**
     * Tx
     * @param {Object} tx  { publicKey: null, privateKey: null, senders: null, receivers: null, chainid: null }
     * @param {Uint8Array} tx.publicKey - 公钥
     * @param {Uint8Array} tx.privateKey - 公钥
     * @param {Array} tx.senders - 发送方
     * @param {string} tx.senders[].addr - 发送方地址
     * @param {Array} tx.receivers - 接收方
     * @param {string} tx.senders[].addr - 接收方地址
     * 
     */
	constrcutor(tx) {
		this.codec = null
		this.tx = {
			publicKey: null,
			privateKey: null,
			senders: null,
			receivers: null,
			chainid: null
		}
		this.tx = Object.assign(this.tx, tx)
	}

	initCodec() {
		const codec = new Codec()
		codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {})
		codec.registerConcrete(new ITX(), 'qos/txs/TransferTx', {})
		codec.registerConcrete(new AuthTx(), 'qbase/txs/stdtx', {})
		codec.registerConcrete(new Sender(), 'Sender', {})
		codec.registerConcrete(new Receiver(), 'Sender', {})
		codec.registerConcrete(new Signature, 'Signature', {})
		this.codec = codec
	}
    


	create() {
		// const pubKeyEd25519 = new PubKeyEd25519(this.trx.publicKey)
		// const sender = new Sender(this.sender, 2, 0)
	}
}
