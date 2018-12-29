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
	getSep = Symbol('getSep'),
	signHandler = Symbol('signHandler'),
	cacheSignData = Symbol('cacheSignData')

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

		this.originSenders = null
		this.chainId_hex = tool.stringToHex(this.tx.chainid)

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
	 * @param {string} senders[].privateKey 发送方私钥
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
		this.originSenders = senders
		this.tx.senders = this.newClients(senders)
		this[cacheSignData](senders)
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
		this[cacheSignData](receivers)
		this.newTx()
		return this
	}

	newTx() {
		this.tx.itx = new ITX(this.tx.senders, this.tx.receivers)
	}

	async send() {
		// 得到 signature
		// 根据 senders 和 receivers 拼接签名数据
		// 每个 sender 需要单独签名，即有几个sender就需要签名几次

		const needSignData_arr = await this[signHandler]()
		const signature_arr = []
		needSignData_arr.forEach(need => {
			const account = this._qweb.recoveryAccountByPrivateKey(need.from.privateKey),
				keyPair = account.keyPair,
				pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey)

			const signature_buffer = Buffer.from(need.arr.join(''), 'hex')
			const signatureData = nacl.sign.detached(signature_buffer, keyPair.secretKey)
			console.log(signatureData)
			console.log(tool.buf2hex(signatureData.buffer))
			console.log(tool.encodeBase64(signatureData))

			const signature = new Signature(pubKeyEd25519, tool.encodeBase64(signatureData), '7')
			signature_arr.push(signature)
		})

		const authTx = new AuthTx(this.tx.itx, signature_arr, this.tx.chainid, '0')
		// 最终生成的输出的JSON
		const str = this._codec.marshalJson(authTx)
		console.log('str', str)

		const bufferArr = this._codec.marshalBinary(authTx)
		console.log('bufferArr', bufferArr)

		const res = await this._qweb.http.request({
			url: `/QOSaccounts/send` //地址待定
		})

		return res
	}

	async [signHandler]() {
		const from = this.originSenders
		const needSignData_arr = []
		// 添加from的nonce,32位，不够前面补0
		for (let i = 0; i < from.length; i++) {
			const f = from[i]

			if (Object.prototype.toString.call(needSignData_arr[i]) !== '[Object Object]') {
				needSignData_arr[i] = {}
				needSignData_arr[i].arr = [...this.tx.signatureArr]
				needSignData_arr[i].from = f
			}

			needSignData_arr[i].arr.push(this.chainId_hex)
			const res = await this._qweb.account.get(f.addr)
			if (res.data.error) {
				throw new Error(res.data.error.message)
			}
			const nonce = res.data.result.value.base_account.nonce
			// if (nonce === '0') {
			// 	nonce = 8
			// } else {
			// 	nonce = 7
			// }
			const nonce_str = `00000000000000000000000000000000${nonce}`
			const nonce_32_str = nonce_str.slice(-32)
			console.log('nonce:', nonce)
			needSignData_arr[i].nonce = nonce
			needSignData_arr[i].arr.push(nonce_32_str)
			needSignData_arr[i].arr.push(this.chainId_hex)
		}
		return needSignData_arr
	}

	[cacheSignData](clients) {
		clients.forEach(f => {
			// const keyPair = this._qweb.recoveryAccountByPrivateKey(f.privateKey).keyPair
			this.tx.signatureArr.push(this[getAddrOriginHexStr](f.addr))
			this.tx.signatureArr.push(tool.stringToHex(f.qos))
			if (Array.isArray(f.qscs)) {
				const arrQscs = []
				f.qscs.forEach(qsc => {
					arrQscs.push(`${qsc.amount}${qsc.coin_name}`)
				})
				if (arrQscs.length > 0)
					this.tx.signatureArr.push(tool.stringToHex(arrQscs.join(',')))
			}
		})
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
		const fromwords = bech32.fromWords(addr_decode.words)
		const addrHex = tool.buf2hex(fromwords)
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

// function hexToBase64(str) {
// 	return btoa(String.fromCharCode.apply(null,
// 		str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' '))
// 	)
// }

// function base64ToHex(str) {
// 	for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
// 		var tmp = bin.charCodeAt(i).toString(16)
// 		if (tmp.length === 1) tmp = '0' + tmp
// 		hex[hex.length] = tmp
// 	}
// 	return hex.join(' ')
// }

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
// function ab2str(buf) {
// 	return String.fromCharCode.apply(null, new Uint16Array(buf))
// }
// // 字符串转为ArrayBuffer对象，参数为字符串
// function str2ab(str) {
// 	var buf = new ArrayBuffer(str.length * 2) // 每个字符占用2个字节
// 	var bufView = new Uint16Array(buf)
// 	for (var i = 0, strLen = str.length; i < strLen; i++) {
// 		bufView[i] = str.charCodeAt(i)
// 	}
// 	return buf
// }