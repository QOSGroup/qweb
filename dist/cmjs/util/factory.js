'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var _ed25519HdKey = require('ed25519-hd-key');

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _tweetnaclUtil = require('tweetnacl-util');

var _types = require('../model/types');

var _types2 = _interopRequireDefault(_types);

var _tool = require('../util/tool');

var _tool2 = _interopRequireDefault(_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('../lib/Js-Amino/src/index'),
    Codec = _require.Codec;

var getHash256 = function getHash256(input) {
	var sha256 = require('js-sha256');
	var hash2 = sha256.update(input);
	return hash2.array();
};
exports.default = {
	/**
  * 生成助记符
  */
	genarateSeed: function genarateSeed() {
		// 商 256，生成24个助记单词
		var mnemonic = _bip2.default.generateMnemonic(256);
		return mnemonic;
	},

	/**
  * 生成公私钥对
  * @param {string} mnemonic 助记符
  * @returns {object} 公私钥对
  */
	genarateKeyPair: function genarateKeyPair(mnemonic) {
		console.log('mnemonic', mnemonic);
		var hexSeed = _bip2.default.mnemonicToSeedHex(mnemonic);
		var secret = (0, _ed25519HdKey.derivePath)("m/44'/148'/0'", hexSeed).key;
		var keyPair = _tweetnacl2.default.sign.keyPair.fromSeed(secret);
		// let secretKeyUint8 = keyPair.secretKey
		// let naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8)

		// console.log('naclKeys', naclKeys)

		return keyPair;
	},

	/**
  * 获取链上地址
  * @param {Uint8Array} publicKey 公钥
  */
	getAddress: function getAddress(publicKey) {
		var bech32 = require('bech32');
		var publicKey_hash256 = getHash256(publicKey);
		var addr_suffix = bech32.toWords(Buffer.from(publicKey_hash256.slice(0, 20)));

		var addr = bech32.encode('address', addr_suffix);
		return addr;
	},

	/**
     * 签名
     * @param {Uint8Array} msg 
     * @param {Uint8Array} secretKey 
     */
	sign: function sign(msg, secretKey) {
		return _tweetnacl2.default.sign(msg, secretKey);
	},
	genarateTxMsg: function genarateTxMsg() {
		var codec = new Codec();
		var PubKeyEd25519 = _types2.default.PubKeyEd25519,
		    ITX = _types2.default.ITX,
		    AuthTx = _types2.default.AuthTx,
		    QSC = _types2.default.QSC,
		    Sender = _types2.default.Sender,
		    Receiver = _types2.default.Receiver,
		    Signature = _types2.default.Signature;

		codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {});
		codec.registerConcrete(new ITX(), 'qos/txs/TransferTx', {});
		codec.registerConcrete(new AuthTx(), 'qbase/txs/stdtx', {});
		codec.registerConcrete(new Sender(), 'Sender', {});
		codec.registerConcrete(new Receiver(), 'Sender', {});
		codec.registerConcrete(new Signature(), 'Signature', {});

		var seed = this.genarateSeed();
		console.log('seed', seed);
		var keyPair = this.genarateKeyPair(seed);
		console.log('keyPair', keyPair);

		console.log('publicKey hex', this.buf2hex(keyPair.publicKey));

		var addr = this.getAddress(keyPair.publicKey);
		console.log('addr', addr);

		var pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey);

		var qsc = new QSC('AOE', 5);
		var sender = new Sender('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay', 2, [qsc]);

		console.log('sender: ', sender);

		var receiver = new Receiver('address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355', 2, [qsc]);

		var itx = new ITX([sender], [receiver]);

		var privateKeyBuffers = _tool2.default.base64ToByteArray('k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay');
		console.log('privateKeyBuffers', privateKeyBuffers);
		console.log('privateKeyBuffers', privateKeyBuffers[0].buffer);
		var tmpBy = this.buf2hex1(privateKeyBuffers[0]);
		console.log('tmpBy:', tmpBy);

		var signature = new Signature(pubKeyEd25519, 'JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==', 10);

		var authTx = new AuthTx(itx, [signature], 'qos-test', 0);

		// 最终生成的输出的JSON
		var str = codec.marshalJson(authTx);

		console.log('str', str);

		//测试签名后数据是否正确
		var privateKey = 'rpt3O80wAFI1+ZqNYt8DqJ5PaQ+foDq7G/InFfycoFYT8tgGFJLp+BSVELW2fTQNGZ/yTzTIXbu9fg33gOmmzA==';
		var singdata = 'b3f67e6260e20beaefbdd223a13bc8539896d61c3257614e5da14a88514adc1995fd3447414e0b206432716f732d7465737400000000000000000000000000000007';

		var by = Buffer.from(singdata, 'hex');
		console.log(by);

		var pk = (0, _tweetnaclUtil.decodeBase64)(privateKey);
		console.log('pk', pk);

		var pubkey = (0, _tweetnaclUtil.decodeBase64)('E/LYBhSS6fgUlRC1tn00DRmf8k80yF27vX4N94Dppsw=');
		console.log('pubkey', pubkey);

		console.log('Array.from(pk).slice(0,32)', Array.from(pk).slice(0, 32));
		var publicKey = (0, _ed25519HdKey.getPublicKey)(Array.from(pk).slice(0, 32)).slice(1);
		console.log('publicKey', publicKey);

		/**快捷获取签名的from Hex或者 to Hex 值 --start*/
		var bech32 = require('bech32');
		var addr_decode = bech32.decode('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay');
		console.log('addr_decode', addr_decode);
		var fromwords = bech32.fromWords(addr_decode.words);
		console.log('fromwords', fromwords);
		var fromHex = this.buf2hex(fromwords);
		console.log('fromHex', fromHex);

		/**快捷获取签名的from Hex或者 to Hex 值 --end*/

		var publicKey_hash256 = getHash256(publicKey);
		var publicKey_hash256_slice20 = Buffer.from(publicKey_hash256.slice(0, 20));

		var publickeyHex = this.buf2hex1(publicKey_hash256_slice20);
		console.log('pucpublickeyHex', publickeyHex);

		var sd = _tweetnacl2.default.sign.detached(by, pk);
		console.log(sd.buffer);
		console.log(this.buf2hex(sd.buffer));
		console.log((0, _tweetnaclUtil.encodeBase64)(sd));
	},

	/**
  * buffer to hex
  * @param {*} buffer buffer 数组
  */
	buf2hex: function buf2hex(buffer) {
		return Array.prototype.map.call(new Uint8Array(buffer), function (x) {
			return ('00' + x.toString(16)).slice(-2);
		}).join('');
	},

	/**
  * buffer to hex
  * @param {*} buffer buffer 数组
  */
	buf2hex1: function buf2hex1(uint8Array) {
		return Array.prototype.map.call(uint8Array, function (x) {
			return ('00' + x.toString(16)).slice(-2);
		}).join('');
	}
};

// function buf2hex(buffer) { // buffer is an ArrayBuffer
// 	return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
// }