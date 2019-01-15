'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _require = require('../lib/Js-Amino/src'),
    TypeFactory = _require.TypeFactory,
    Types = _require.Types;

exports.default = {
	/**
  * 创建客户端（发送方/接收方）
  * @param {String} client this.client
  * @param {Array} coins 交易的币种及数量 如： ['qos','qsc']
  */
	createClient: function createClient(client, coins) {
		coins = coins.map(function (coinName) {
			return {
				name: coinName,
				type: Types.Int8
			};
		});
		var aMsg = [{
			name: 'addr',
			type: Types.String
		}, {
			name: 'qos',
			type: Types.Int8
		}, coins];

		return TypeFactory.create(client, aMsg);
	},

	client: {
		sender: 'Sender',
		receiver: 'Receiver'
	}
};