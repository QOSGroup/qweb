// import { default as nacl } from 'tweetnacl'
import { default as nacl } from '../src/lib/nacl-fast'
// const nacl = require('tweetnacl')
// import {
//     decodeUTF8,
//     encodeUTF8,
//     encodeBase64,
//     decodeBase64
// } from 'tweetnacl-util'

const { derivePath, getMasterKeyFromSeed, getPublicKey } = require('ed25519-hd-key')
// import { derivePath } from 'ed25519-hd-key';
const bip39 = require('bip39')

const mnemonic = bip39.generateMnemonic()
console.log(mnemonic)

const seed = bip39.mnemonicToSeed(mnemonic)
console.log(seed)

const secret = derivePath("m/44'/148'/0'", mnemonic).key;
console.log('secret', secret)
const keyPair = nacl.sign.keyPair.fromSeed(secret)

// // const keyPair = nacl.sign.keyPair()
console.log(keyPair)
// console.log('pubKey', encodeBase64(keyPair.publicKey))
// console.log('privateKey', encodeBase64(keyPair.secretKey))


const hexSeed = bip39.mnemonicToSeedHex(mnemonic)

// const k = getMasterKeyFromSeed(hexSeed);
// console.log(k)
// console.log(getPublicKey(k.key))

// var crypto = require('crypto');
// const ed25519 = require('ed25519')

// // var aliceSeed = crypto.randomBytes(32);

// var aliceKeypair = ed25519.MakeKeypair(seed);
// console.log(aliceKeypair)

// tweetnacl-util


