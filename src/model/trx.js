let { Codec } = require('../lib/Js-Amino/src/index')
import trxType from './types'

const PubKeyEd25519 = trxType.PubKeyEd25519,
	ITX = trxType.ITX,
	AuthTx = trxType.AuthTx,
	Sender = trxType.Sender,
	Receiver = trxType.Receiver,
	Signature = trxType.Signature

export default class Trx {
	constrcutor(trx) {
		this.codec = null
		this.trx = {
			publicKey: null,
			trxSender: null,
			trxToAddress: null,
			trxAuthTx: null,
			trxITX: null,
			trxSignature: null
		}
		this.trx = Object.assign(this.trx, trx)
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

	get Signature() {
		return this.trxSignature
	}

	set Signature(signature) {
		this.trx.trxSignature = signature
	}

	get sender() {
		return this.trx.trxSender
	}

	set sender(sender) {
		this.trx.trxSender = sender
	}

	get receiver() {
		return this.trx.trxReceiver
	}

	set receiver(receiver) {
		this.trx.trxReceiver = receiver
	}

	get ITX() {
		return this.trx.trxITX
	}

	set ITX(ITX) {
		this.trx.trxITX = ITX
	}

	get authTx() {
		return this.trx.trxAuthTx
	}

	set authTx(authTx) {
		this.trx.trxToken = authTx
	}
}
