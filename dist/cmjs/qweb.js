'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var _tweetnaclUtil = require('tweetnacl-util');

var _tool = require('./util/tool');

var _tool2 = _interopRequireDefault(_tool);

var _bip = require('bip39');

var _bip2 = _interopRequireDefault(_bip);

var _HTTPEndpoint = require('./util/HTTPEndpoint');

var _HTTPEndpoint2 = _interopRequireDefault(_HTTPEndpoint);

var _tx = require('./model/tx');

var _tx2 = _interopRequireDefault(_tx);

var _account = require('./model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var genarateMnemonic = Symbol('genarateMnemonic');
var genarateKeyPair = Symbol('genarateKeyPair');

var QWeb = function () {
	function QWeb(config) {
		_classCallCheck(this, QWeb);

		this._chainId = config.chainId;
		this._baseUrl = config.baseUrl;
		this._httpEndpoint = new _HTTPEndpoint2.default({ chainId: this._chainId, baseUrl: this._baseUrl });
	}

	_createClass(QWeb, [{
		key: 'newAccount',


		/**
   * 新建账户
   */
		value: function newAccount() {
			var mnemonic = this[genarateMnemonic]();
			var keyPair = this[genarateKeyPair](mnemonic);
			return {
				mnemonic: mnemonic,
				keyPair: keyPair,
				publicKey: (0, _tweetnaclUtil.encodeBase64)(keyPair.publicKey),
				privateKey: (0, _tweetnaclUtil.encodeBase64)(keyPair.secretKey),
				address: this.getAddress(keyPair.publicKey)
			};
		}

		/**
   * 根据助记符恢复账户
   * @param {string} mnemonic 助记符
   */

	}, {
		key: 'recoveryAccountByMnemonic',
		value: function recoveryAccountByMnemonic(mnemonic) {
			var keyPair = this[genarateKeyPair](mnemonic);
			return {
				mnemonic: mnemonic,
				keyPair: keyPair,
				publicKey: (0, _tweetnaclUtil.encodeBase64)(keyPair.publicKey),
				privateKey: (0, _tweetnaclUtil.encodeBase64)(keyPair.secretKey),
				address: this.getAddress(keyPair.publicKey)
			};
		}

		/**
   * 根据私钥恢复账户
   * @param {string} privateKey 私钥
   */

	}, {
		key: 'recoveryAccountByPrivateKey',
		value: function recoveryAccountByPrivateKey(privateKey) {
			var privateKey_buffer = (0, _tweetnaclUtil.decodeBase64)(privateKey);
			var keyPair = _tweetnacl2.default.sign.keyPair.fromSecretKey(privateKey_buffer);
			return {
				keyPair: keyPair,
				publicKey: (0, _tweetnaclUtil.encodeBase64)(keyPair.publicKey),
				privateKey: (0, _tweetnaclUtil.encodeBase64)(keyPair.secretKey),
				address: this.getAddress(keyPair.publicKey)
			};
		}

		/**
      * 生成助记符
      */

	}, {
		key: genarateMnemonic,
		value: function value() {
			// 商 256，生成24个助记单词
			var mnemonic = _bip2.default.generateMnemonic(256);
			return mnemonic;
		}

		/**
   * 生成公私钥对
   * @param {string} mnemonic 助记符
   * @returns {object} 公私钥对
   */

	}, {
		key: genarateKeyPair,
		value: function value(mnemonic) {
			var hexSeed = _bip2.default.mnemonicToSeed(mnemonic, 'qstars');
			var secret = _tool2.default.getHash256(hexSeed);
			var keyPair = _tweetnacl2.default.sign.keyPair.fromSeed(new Uint8Array(secret));
			return keyPair;
		}

		/**
   * 获取链上地址
   * @param {Uint8Array} publicKey 公钥
   */

	}, {
		key: 'getAddress',
		value: function getAddress(publicKey) {
			var bech32 = require('bech32');
			var pkAarry = _tool2.default.getHash256(publicKey);
			var nw = bech32.toWords(Buffer.from(pkAarry.slice(0, 20)));
			var addr = bech32.encode('address', nw);
			return addr;
		}
	}, {
		key: 'chainId',
		get: function get() {
			return this._chainId;
		}
	}, {
		key: 'baseUrl',
		get: function get() {
			return this._baseUrl;
		}
	}, {
		key: 'tx',
		get: function get() {
			return new _tx2.default(this);
		}
	}, {
		key: 'account',
		get: function get() {
			return new _account2.default(this);
		}
	}, {
		key: 'http',
		get: function get() {
			return this._httpEndpoint;
		}
	}, {
		key: 'tool',
		get: function get() {
			return _tool2.default;
		}
	}]);

	return QWeb;
}();

exports.default = QWeb;