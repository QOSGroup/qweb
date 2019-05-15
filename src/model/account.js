export default class Account {
	constructor(qweb) {
		this._qweb = qweb
	}

	async get(address) {
		const result = await this._qweb.http.request({
			url: `nodes/${this._qweb.chainId}/accounts/${address}`
		})
		return result.value
	}
}
