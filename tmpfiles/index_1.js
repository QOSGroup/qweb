import { secretbox, randomBytes , default as nacl } from 'tweetnacl'
import {
	decodeUTF8,
	encodeUTF8,
	encodeBase64,
	decodeBase64
} from 'tweetnacl-util'

console.log(secretbox.nonceLength)
const newNonce = () => randomBytes(secretbox.nonceLength)
console.log(newNonce())
export const generateKey = () => encodeBase64(randomBytes(secretbox.keyLength))

export const encrypt = (json, key) => {
	const keyUint8Array = decodeBase64(key)

	const nonce = newNonce()
	const messageUint8 = decodeUTF8(JSON.stringify(json))
	const box = secretbox(messageUint8, nonce, keyUint8Array)

	const fullMessage = new Uint8Array(nonce.length + box.length)
	fullMessage.set(nonce)
	fullMessage.set(box, nonce.length)

	const base64FullMessage = encodeBase64(fullMessage)
	return base64FullMessage
}

export const decrypt = (messageWithNonce, key) => {
	const keyUint8Array = decodeBase64(key)
	const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
	const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength)
	const message = messageWithNonceAsUint8Array.slice(
		secretbox.nonceLength,
		messageWithNonce.length
	)

	const decrypted = secretbox.open(message, nonce, keyUint8Array)

	if (!decrypted) {
		throw new Error('Could not decrypt message')
	}

	const base64DecryptedMessage = encodeUTF8(decrypted)
	return JSON.parse(base64DecryptedMessage)
}

const key = generateKey()
console.log('key', key)
const obj = { 'hello': 'world' }
const encrypted = encrypt(obj, key)
const decrypted = decrypt(encrypted, key)
console.log(decrypted, obj) // should be shallow equal

// const keyPair = nacl.sign.keyPair()
// console.log(keyPair)
// console.log('pubKey', encodeBase64(keyPair.publicKey))
// console.log('privateKey', encodeBase64(keyPair.secretKey))




import { derivePath } from 'ed25519-hd-key'
import bip39 from 'bip39'

const mnemonic = bip39.generateMnemonic(256)
console.log(mnemonic)

const secret = derivePath("m/44'/148'/0'", mnemonic).key
console.log('secret', secret)

const keyPair = nacl.sign.keyPair.fromSeed(secret)