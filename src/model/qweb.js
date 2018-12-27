import nacl from 'tweetnacl'
import { derivePath } from 'ed25519-hd-key'
import bip39 from 'bip39'
import HTTPEndpoint from '../util/HTTPEndpoint'
import Tx from './tx'
import Account from './account'

export default class QWeb {
	constructor(config) {
		this._chainId = config.chainId
		this._baseUrl = config.baseUrl
		this._httpEndpoint = new HTTPEndpoint({ chainId: this._chainId, baseUrl: this._baseUrl })
	}

	get chainId() {
		return this._chainId
	}

	get baseUrl() {
		return this._baseUrl
	}

	get tx() {
		return new Tx(this.chainId)
	}

	get account() {
		return new Account()
	}

	/**
     * 生成助记符
     */
	genarateSeed() {
		// 商 256，生成24个助记单词
		const mnemonic = bip39.generateMnemonic(256)
		return mnemonic
	}

	/**
	 * 生成公私钥对
	 * @param {string} mnemonic 助记符
	 * @returns {object} 公私钥对
	 */
	genarateKeyPair(mnemonic) {
		console.log('mnemonic', mnemonic)
		const hexSeed = bip39.mnemonicToSeed(mnemonic, 'qstars')
		console.log(hexSeed)
		console.log(bip39.validateMnemonic(mnemonic))
        
		const secret = derivePath("m/44'/148'/0'", hexSeed).key
		console.log(secret)
        
		const keyPair = nacl.sign.keyPair.fromSeed(secret)
		return keyPair
	}

	/**
	 * 获取链上地址
	 * @param {Uint8Array} publicKey 公钥
	 */
	getAddress(publicKey) {
		const bech32 = require('bech32')
		const pkAarry = this.getHash256(publicKey)
		const nw = bech32.toWords((Buffer.from(pkAarry.slice(0, 20))))
		const addr = bech32.encode('address', nw)
		return addr
	}

}