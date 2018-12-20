import nacl from 'tweetnacl'
import { derivePath } from 'ed25519-hd-key'
import bip39 from 'bip39'

export default {
	/**
	 * 生成助记符
	 */
	genarateSeed() {
		const mnemonic = bip39.generateMnemonic()
		return mnemonic
	},
	/**
	 * 生成公私钥对
	 * @param {string} mnemonic 助记符
	 * @returns {object} 公私钥对
	 */
	genarateKeyPair(mnemonic) {
		const hexSeed = bip39.mnemonicToSeedHex(mnemonic)
		const secret = derivePath("m/44'/148'/0'", hexSeed).key
		const keyPair = nacl.sign.keyPair.fromSeed(secret)
		return keyPair
	},
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
	},
	getHash256(input) {
		let sha256 = require('js-sha256')
		let hash2 = sha256.update(input)
		return hash2.array()
	}
}