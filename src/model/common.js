let { TypeFactory, Types } = require('../lib/Js-Amino/src')

export default {
	/**
	 * 创建客户端（发送方/接收方）
	 * @param {String} client this.client
	 * @param {Array} coins 交易的币种及数量 如： ['qos','qsc']
	 */
	createClient(client, coins) {
		coins = coins.map(coinName => {
			return {
				name: coinName,
				type: Types.Int8
			}
		})
		const aMsg = [{
			name: 'addr',
			type: Types.String
		}, ...coins]

		return TypeFactory.create(client, aMsg)
	},
	client: {
		sender: 'Sender',
		receiver: 'Receiver'
	}
}