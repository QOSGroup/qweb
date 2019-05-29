import nacl from 'tweetnacl'
import bech32 from 'bech32'
// import { Codec } from '../lib/js-amino/src'
const { Codec } = require('js-amino')
import { ClientType } from '../model/enums'
import tool from '../util/tool'

import { Signature, TxStd, TxTransfer , Sender, Receiver, QSC, PubKeyEd25519 } from '../model/property'

const getAddrOriginHexStr = Symbol('getAddrOriginHexStr')
const getSep = Symbol('getSep')
const signHandler = Symbol('signHandler')
const cacheSignData = Symbol('cacheSignData')

export default class Transaction {

	constructor(qweb) {
		this._codec = null
		this._qweb = qweb

		this._txInfo = {
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
		return this._txInfo
	}

	initCodec() {
		const codec = new Codec()
		codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {})
		codec.registerConcrete(new TxTransfer(), 'qos/txs/TxTransfer', {})
		codec.registerConcrete(new TxStd(), 'qbase/txs/stdtx', {})    
		codec.registerConcrete(new QSC(), 'qsc', {})
		codec.registerConcrete(new Sender(), 'Sender', {})
		codec.registerConcrete(new Receiver(), 'Receiver', {})
		codec.registerConcrete(new Signature, 'qbase/txs/signature', {})
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
			const addr = bech32.decode(client.addr)
			const bytes = bech32.fromWords(addr.words)
			// const addrBytes = new Uint8Array(addr.words)
			console.log(bytes)
			if (clientType === ClientType.receiver) {
				tmpClient = new Receiver(bytes, client.qos, qscs)
			} else {
				tmpClient = new Sender(bytes, client.qos, qscs)
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
		this.tx.itx = new TxTransfer(this.tx.senders, this.tx.receivers)
	}

	async send() {
		console.log('in send')
		// 得到 signature
		// 根据 senders 和 receivers 拼接签名数据
		// 每个 sender 需要单独签名，即有几个sender就需要签名几次
		const needSignData_arr = await this[signHandler]()
		const signature_arr = []
		needSignData_arr.forEach(need => {
			const account = this._qweb.account.recoveryAccountByPrivateKey(need.from.privateKey),
				keyPair = account.keyPair,
				pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey)

			// console.log('need.arr:', need.arr)

			const signature_buffer = Buffer.from(need.arr.join(''), 'hex')
			const signatureData = nacl.sign.detached(signature_buffer, keyPair.secretKey)
			// console.log(signatureData)
			// console.log(tool.buf2hex(signatureData.buffer))
			// console.log(tool.encodeBase64(signatureData))
			// tool.encodeBase64(signatureData)
			console.log('signatureData',signatureData)
			const signature = new Signature(pubKeyEd25519, signatureData, need.nonce + '')
			signature_arr.push(signature)
		})
    
		console.log('.................................................................')
		console.log(this.tx.itx)
		console.log(signature_arr)

		const txStd = new TxStd(this.tx.itx, signature_arr, this.tx.chainid, '0')
		// 最终生成的输出的JSON
		const str = this._codec.marshalJson(txStd)
		console.log('str', str)

		const bufferArr = this._codec.marshalBinary(txStd)
		console.log('bufferArr', bufferArr.join(','))
		// let decodedDataTx = new TxStd()
		// this._codec.unMarshalJson(str, decodedDataTx)

		// const res = await this._qweb.http.request({
		// 	url: `/accounts/txSend`, //地址待定
		// 	method: 'post',
		// 	data: str
		// })

		// return res
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
			// const res = await this._qweb.account.get(f.addr)
			// if (res.data.error) {
			// 	throw new Error(res.data.error.message)
			// }
			const nonce = 1 // Number(res.data.result.value.base_account.nonce) + 1
			const nonce_str = `00000000000000000000000000000000${nonce.toString(16)}`
			const nonce_32_str = nonce_str.slice(-32)
			// console.log('nonce:', nonce.toString(16))
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
}