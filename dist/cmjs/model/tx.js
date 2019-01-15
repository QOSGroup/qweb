'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tweetnacl = require('tweetnacl');

var _tweetnacl2 = _interopRequireDefault(_tweetnacl);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

var _enums = require('./enums');

var _tool = require('../util/tool');

var _tool2 = _interopRequireDefault(_tool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bech32 = require('bech32');

var _require = require('../lib/Js-Amino/src/index'),
    Codec = _require.Codec;

var PubKeyEd25519 = _types2.default.PubKeyEd25519,
    ITX = _types2.default.ITX,
    AuthTx = _types2.default.AuthTx,
    Sender = _types2.default.Sender,
    Receiver = _types2.default.Receiver,
    QSC = _types2.default.QSC,
    Signature = _types2.default.Signature;

var getAddrOriginHexStr = Symbol('getAddrOriginHexStr'),
    getSep = Symbol('getSep'),
    signHandler = Symbol('signHandler'),
    cacheSignData = Symbol('cacheSignData');

var Tx = function () {
	function Tx(qweb) {
		_classCallCheck(this, Tx);

		this._codec = null;
		this._qweb = qweb;

		this._tx = {
			publicKey: null,
			privateKey: null,
			senders: null,
			receivers: null,
			chainid: qweb.chainId,
			itx: null,
			signatureArr: []
		};

		this.originSenders = null;
		this.chainId_hex = _tool2.default.stringToHex(this.tx.chainid);

		// this.tx = Object.assign(this.tx, tx)
		this.initCodec();
	}

	_createClass(Tx, [{
		key: 'initCodec',
		value: function initCodec() {
			var codec = new Codec();
			codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {});
			codec.registerConcrete(new ITX(), 'qos/txs/TxTransfer', {});
			codec.registerConcrete(new AuthTx(), 'qbase/txs/stdtx', {});
			codec.registerConcrete(new QSC(), 'qsc', {});
			codec.registerConcrete(new Sender(), 'Sender', {});
			codec.registerConcrete(new Receiver(), 'Sender', {});
			codec.registerConcrete(new Signature(), 'Signature', {});
			this._codec = codec;
		}
	}, {
		key: 'newClients',
		value: function newClients(clients, clientType) {
			var arrClient = [];
			clients.forEach(function (client) {
				var qscs = [];
				if (client.qscs && client.qscs.length > 0) {
					client.qscs.forEach(function (qsc) {
						qscs.push(new QSC(qsc.coin_name, qsc.amount));
					});
				}
				var tmpClient = null;
				if (clientType === _enums.ClientType.receiver) {
					tmpClient = new Receiver(client.addr, client.qos, qscs);
				} else {
					tmpClient = new Sender(client.addr, client.qos, qscs);
				}
				arrClient.push(tmpClient);
			});
			return arrClient;
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

	}, {
		key: 'from',
		value: function from(senders) {
			this.originSenders = senders;
			this.tx.senders = this.newClients(senders);
			this[cacheSignData](senders);
			return this;
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

	}, {
		key: 'to',
		value: function to(receivers) {
			this.tx.receivers = this.newClients(receivers);
			this[cacheSignData](receivers);
			this.newTx();
			return this;
		}
	}, {
		key: 'newTx',
		value: function newTx() {
			this.tx.itx = new ITX(this.tx.senders, this.tx.receivers);
		}
	}, {
		key: 'send',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
				var _this = this;

				var needSignData_arr, signature_arr, authTx, str, res;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this[signHandler]();

							case 2:
								needSignData_arr = _context.sent;
								signature_arr = [];

								needSignData_arr.forEach(function (need) {
									var account = _this._qweb.recoveryAccountByPrivateKey(need.from.privateKey),
									    keyPair = account.keyPair,
									    pubKeyEd25519 = new PubKeyEd25519(keyPair.publicKey);

									console.log('need.arr:', need.arr);

									var signature_buffer = Buffer.from(need.arr.join(''), 'hex');
									var signatureData = _tweetnacl2.default.sign.detached(signature_buffer, keyPair.secretKey);
									console.log(signatureData);
									console.log(_tool2.default.buf2hex(signatureData.buffer));
									console.log(_tool2.default.encodeBase64(signatureData));

									var signature = new Signature(pubKeyEd25519, _tool2.default.encodeBase64(signatureData), need.nonce + '');
									signature_arr.push(signature);
								});

								authTx = new AuthTx(this.tx.itx, signature_arr, this.tx.chainid, '0');
								// 最终生成的输出的JSON

								str = this._codec.marshalJson(authTx);

								console.log('str', str);

								// const bufferArr = this._codec.marshalBinary(authTx)
								// console.log('bufferArr', bufferArr)

								_context.next = 10;
								return this._qweb.http.request({
									url: '/accounts/txSend', //地址待定
									method: 'post',
									data: str
								});

							case 10:
								res = _context.sent;
								return _context.abrupt('return', res);

							case 12:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function send() {
				return _ref.apply(this, arguments);
			}

			return send;
		}()
	}, {
		key: signHandler,
		value: function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
				var from, needSignData_arr, i, f, res, nonce, nonce_str, nonce_32_str;
				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								from = this.originSenders;
								needSignData_arr = [];
								// 添加from的nonce,32位，不够前面补0

								i = 0;

							case 3:
								if (!(i < from.length)) {
									_context2.next = 22;
									break;
								}

								f = from[i];


								if (Object.prototype.toString.call(needSignData_arr[i]) !== '[Object Object]') {
									needSignData_arr[i] = {};
									needSignData_arr[i].arr = [].concat(_toConsumableArray(this.tx.signatureArr));
									needSignData_arr[i].from = f;
								}

								needSignData_arr[i].arr.push(this.chainId_hex);
								_context2.next = 9;
								return this._qweb.account.get(f.addr);

							case 9:
								res = _context2.sent;

								if (!res.data.error) {
									_context2.next = 12;
									break;
								}

								throw new Error(res.data.error.message);

							case 12:
								nonce = Number(res.data.result.value.base_account.nonce) + 1;
								nonce_str = '00000000000000000000000000000000' + nonce.toString(16);
								nonce_32_str = nonce_str.slice(-32);

								console.log('nonce:', nonce.toString(16));
								needSignData_arr[i].nonce = nonce;
								needSignData_arr[i].arr.push(nonce_32_str);
								needSignData_arr[i].arr.push(this.chainId_hex);

							case 19:
								i++;
								_context2.next = 3;
								break;

							case 22:
								return _context2.abrupt('return', needSignData_arr);

							case 23:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function value() {
				return _ref2.apply(this, arguments);
			}

			return value;
		}()
	}, {
		key: cacheSignData,
		value: function value(clients) {
			var _this2 = this;

			clients.forEach(function (f) {
				// const keyPair = this._qweb.recoveryAccountByPrivateKey(f.privateKey).keyPair
				_this2.tx.signatureArr.push(_this2[getAddrOriginHexStr](f.addr));
				_this2.tx.signatureArr.push(_tool2.default.stringToHex(f.qos));
				if (Array.isArray(f.qscs)) {
					var arrQscs = [];
					f.qscs.forEach(function (qsc) {
						arrQscs.push('' + qsc.amount + qsc.coin_name);
					});
					if (arrQscs.length > 0) _this2.tx.signatureArr.push(_tool2.default.stringToHex(arrQscs.join(',')));
				}
			});
		}
	}, {
		key: getSep,
		value: function value() {
			var from = this.tx.senders[0];
			var qsc = from.qscs[0];
			console.log(from);
			console.log('' + from.qos + qsc.amount + qsc.coin_name);
			var sep = _tool2.default.stringToHex('' + from.qos + qsc.amount + qsc.coin_name);
			console.log('sep', sep);
			return sep;
		}

		/**
   * 一对多交易
   */

	}, {
		key: 'oneToMany',
		value: function oneToMany(privateKey) {
			var _this3 = this;

			console.log(privateKey);
			var from = this.tx.senders[0];
			this.tx.signatureArr.push(this[getAddrOriginHexStr](from.addr));
			this.tx.receivers.forEach(function (client) {
				_this3.tx.signatureArr.push(_this3[getAddrOriginHexStr](client.addr));
			});
		}

		/**
   * 根据地址获取原始hex串
   * @param {string} addr 地址
   */

	}, {
		key: getAddrOriginHexStr,
		value: function value(addr) {
			/**快捷获取签名的from Hex或者 to Hex 值 --start*/
			var addr_decode = bech32.decode(addr);
			var fromwords = bech32.fromWords(addr_decode.words);
			var addrHex = _tool2.default.buf2hex(fromwords);
			return addrHex;
			/**快捷获取签名的from Hex或者 to Hex 值 --end*/
		}
	}, {
		key: 'tx',
		get: function get() {
			return this._tx;
		}
	}]);

	return Tx;
}();

exports.default = Tx;