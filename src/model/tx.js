import nacl from 'tweetnacl'
const bech32 = require('bech32')
let { Codec } = require('../lib/Js-Amino/src/index')
import trxType from './types'
import { ClientType } from './enums'
import { default as tool } from '../util/tool'

const PubKeyEd25519 = trxType.PubKeyEd25519,
	ITX = trxType.ITX,
	AuthTx = trxType.AuthTx,
	Sender = trxType.Sender,
	Receiver = trxType.Receiver,
	QSC = trxType.QSC,
	Signature = trxType.Signature

const getAddrOriginHexStr = Symbol('getAddrOriginHexStr'),
	getSep = Symbol('getSep')

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
	constructor(qweb) {
		this._codec = null
		this._qweb = qweb

		this._tx = {
			publicKey: null,
			privateKey: null,
			senders: null,
			receivers: null,
			chainid: qweb.chainId,
			itx: null,
			signatureArr: []
		}
		// this.tx = Object.assign(this.tx, tx)
		this.initCodec()
	}

	get tx() {
		return this._tx
	}

	initCodec() {
		const codec = new Codec()
		codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {})
		codec.registerConcrete(new ITX(), 'qos/txs/TxTransfer', {})
		codec.registerConcrete(new AuthTx(), 'qbase/txs/stdtx', {})
		codec.registerConcrete(new QSC(), 'qsc', {})
		codec.registerConcrete(new Sender(), 'Sender', {})
		codec.registerConcrete(new Receiver(), 'Sender', {})
		codec.registerConcrete(new Signature, 'Signature', {})
		this._codec = codec
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
		console.log(this.tx)
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

	async sign(privateKey) {
		// 得到 signature
		if (this.tx.senders.length === 1) {
			this.oneToMany(privateKey)
		}
		const keyPair = this._qweb.recoveryAccountByPrivateKey(privateKey).keyPair
		console.log('keyPair', keyPair)
		console.log(tool.decodeBase64(privateKey))

		const chainId_hex = tool.stringToHex(this.tx.chainid)
		console.log('chainId_hex', chainId_hex)
		this.tx.signatureArr.push(chainId_hex)

		console.log(this.tx.signatureArr.join(this[getSep]()))
		const res = await this._qweb.account.get(this.tx.senders[0].addr)
		console.log(res)

		//00000000000000000000000000000007716f732d746573740000000000000007
		// res.data.result.value.base_account.nonce
		const nonce_str = `00000000000000000000000000000000${7}`
		const nonce_32_str = nonce_str.slice(-32),
			nonce_16_str = nonce_str.slice(-16)

		const signature_str = this.tx.signatureArr.join(this[getSep]()) + nonce_32_str + chainId_hex //+ nonce_16_str
		console.log(signature_str)
		const signature_buffer = Buffer.from(signature_str, 'hex')
		const signatureData = nacl.sign.detached(signature_buffer, keyPair.secretKey)
		console.log(signatureData)
		console.log(tool.buf2hex(signatureData.buffer))
		console.log(tool.encodeBase64(signatureData))


		console.log(tool.decodeBase64('GwJwoChg7SE19bIBucL3yM0STkqb1RmxfIf2a7AKODG+0WckvyDDL2BIiCLewlA7aDQElZsg/ihxYhmR1q+PDw=='))

		const pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey)
		const signature = new Signature(pubKeyEd25519, tool.encodeBase64(signatureData), '7')
		const authTx = new AuthTx(this.tx.itx, [signature], this.tx.chainid, '0')
		// 最终生成的输出的JSON
		const str = this._codec.marshalJson(authTx)
		console.log('str', str)

		const bufferArr = this._codec.marshalBinary(authTx)
		console.log('bufferArr', bufferArr)
	}

	[getSep]() {
		const from = this.tx.senders[0]
		const qsc = from.qscs[0]
		console.log(from)
		console.log(`${from.qos}${qsc.amount}${qsc.coin_name}`)
		let sep = tool.stringToHex(`${from.qos}${qsc.amount}${qsc.coin_name}`)
		console.log('sep', sep)
		return sep
	}

	/**
	 * 一对多交易
	 */
	oneToMany(privateKey) {
		console.log(privateKey)
		const from = this.tx.senders[0]
		this.tx.signatureArr.push(this[getAddrOriginHexStr](from.addr))
		this.tx.receivers.forEach((client) => {
			this.tx.signatureArr.push(this[getAddrOriginHexStr](client.addr))
		})
	}

	/**
	 * 根据地址获取原始hex串
	 * @param {string} addr 地址
	 */
	[getAddrOriginHexStr](addr) {
		/**快捷获取签名的from Hex或者 to Hex 值 --start*/
		const addr_decode = bech32.decode(addr)
		console.log('addr_decode', addr_decode)
		const fromwords = bech32.fromWords(addr_decode.words)
		console.log('fromwords', fromwords)
		const addrHex = tool.buf2hex(fromwords)
		console.log('addrHex', addrHex)
		return addrHex
		/**快捷获取签名的from Hex或者 to Hex 值 --end*/
	}

	create() {
		// const pubKeyEd25519 = new PubKeyEd25519(this.trx.publicKey)
		// const sender = new Sender(this.sender, 2, 0)
	}
}


if (!window.atob) {
	var tableStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	var table = tableStr.split('')

	window.atob = function (base64) {
		if (/(=[^=]+|={3,})$/.test(base64)) throw new Error('String contains an invalid character')
		base64 = base64.replace(/=/g, '')
		var n = base64.length & 3
		if (n === 1) throw new Error('String contains an invalid character')
		for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
			var a = tableStr.indexOf(base64[j++] || 'A'), b = tableStr.indexOf(base64[j++] || 'A')
			var c = tableStr.indexOf(base64[j++] || 'A'), d = tableStr.indexOf(base64[j++] || 'A')
			if ((a | b | c | d) < 0) throw new Error('String contains an invalid character')
			bin[bin.length] = ((a << 2) | (b >> 4)) & 255
			bin[bin.length] = ((b << 4) | (c >> 2)) & 255
			bin[bin.length] = ((c << 6) | d) & 255
		}
		return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4)
	}

	window.btoa = function (bin) {
		for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
			var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++)
			if ((a | b | c) > 255) throw new Error('String contains an invalid character')
			base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
				(isNaN(b) ? '=' : table[((b << 2) & 63) | (c >> 6)]) +
				(isNaN(b + c) ? '=' : table[c & 63])
		}
		return base64.join('')
	}

}

function hexToBase64(str) {
	return btoa(String.fromCharCode.apply(null,
		str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' '))
	)
}

function base64ToHex(str) {
	for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
		var tmp = bin.charCodeAt(i).toString(16)
		if (tmp.length === 1) tmp = '0' + tmp
		hex[hex.length] = tmp
	}
	return hex.join(' ')
}