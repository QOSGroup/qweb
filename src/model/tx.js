let { Codec } = require('../lib/Js-Amino/src/index')
import trxType from './types'
import { clientType, ClientType } from './enums'

const PubKeyEd25519 = trxType.PubKeyEd25519,
	ITX = trxType.ITX,
	AuthTx = trxType.AuthTx,
	Sender = trxType.Sender,
	Receiver = trxType.Receiver,
	QSC = trxType.QSC,
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
	 * 示例：
	 * {
			publicKey: Uint8Array,
			privateKey: Uint8Array,
			senders: [
				{
					'addr': 'address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay',
					'qos': '2',
					'qscs': [
						{
							'coin_name': 'AOE',
							'amount': '5'
						}
					]
				}
			],
			receivers: [
				{
					'addr': 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
					'qos': '2',
					'qscs': [
						{
							'coin_name': 'AOE',
							'amount': '5'
						}
					]
				}
			],
			chainid: 'qos-test'
		}
     * 
     */
	constrcutor() {
		this.codec = null
		this.tx = {
			publicKey: null,
			privateKey: null,
			senders: null,
			receivers: null,
			chainid: null,
			itx: null
		}
		// this.tx = Object.assign(this.tx, tx)
	}

	initCodec() {
		const codec = new Codec()
		codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {})
		codec.registerConcrete(new ITX(), 'qos/txs/TransferTx', {})
		codec.registerConcrete(new AuthTx(), 'qbase/txs/stdtx', {})
		codec.registerConcrete(new QSC(), 'qsc', {})
		codec.registerConcrete(new Sender(), 'Sender', {})
		codec.registerConcrete(new Receiver(), 'Sender', {})
		codec.registerConcrete(new Signature, 'Signature', {})
		this.codec = codec
	}

	newClients(clients, clientType) {
		const arrClient = []
		clients.forEach(client => {
			const qscs = []
			if (client.qscs && client.qscs.length > 0) {
				client.qscs.forEach(qsc => {
					qscs.push(new QSC(qsc.coin_name, qsc.amount))
				})
			}
			let tmpClient = null
			if (clientType === ClientType.receiver) {
				tmpClient = new Receiver(client.addr, client.qos, qscs)
			} else {
				tmpClient = new Sender(client.addr, client.qos, qscs)
			}
			arrClient.push(tmpClient)
		})
		return arrClient
	}

	/**
	 * 发送交易
	 * @param {Object[]} senders - 发送方
	 * @param {string} senders[].addr - 发送方地址
	 * @param {number} senders[].qos - 发送的qos数量
	 * @param {Object[]} senders[].qscs - 发送qsc币
	 * @param {string} senders[].qscs[].coin_name - 发送qsc币名称
	 * @param {number} senders[].qscs[].amount - 发送qscbi的数量
	 * 例： [
				{
					'addr': 'address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay',
					'qos': 2,
					'qscs': [
						{
							'coin_name': 'AOE',
							'amount': 5
						}
					]
				}
			]
	 */
	from(senders) {
		this.tx.senders = this.newClients(senders)
		return this
	}

	/**
	 * 接收交易
	 * @param {Object[]} receivers - 接收方
	 * @param {string} receivers[].addr - 接收方地址
	 * @param {number} receivers[].qos - 接收的qos数量
	 * @param {Object[]} receivers[].qscs - 接收qsc币
	 * @param {string} receivers[].qscs[].coin_name - 接收qsc币名称
	 * @param {number} receivers[].qscs[].amount - 接收qscbi的数量
	 * 例： [
				{
					'addr': 'address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay',
					'qos': 2,
					'qscs': [
						{
							'coin_name': 'AOE',
							'amount': 5
						}
					]
				}
			]
	 */
	to(receivers) {
		this.tx.receivers = this.newClients(receivers)
		this.newTx()
		return this
	}

	newTx() {
		this.tx.itx = new ITX(this.tx.senders, this.tx.receivers)
	}

	sign(privateKey) {
		// b3f67e6260e20beaefbdd223a13bc8539896d61c3257614e5da14a88514adc1995fd3447414e0b206432716f732d7465737400000000000000000000000000000007
		// 16进制字符串
		// from+32+to+32+chianid+nonce
		// 将上面得到的值 ed25519 签名之后 得到 signature
		

	}

	create() {
		// const pubKeyEd25519 = new PubKeyEd25519(this.trx.publicKey)
		// const sender = new Sender(this.sender, 2, 0)
	}
}
