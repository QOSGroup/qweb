export default class Account {
	constructor(qweb) {
		this._qweb = qweb
	}

	get(address) {
		return this._qweb.http.request({
			url: `nodes/${this._qweb.chainId}/accounts/${address}`
		})
	}
}
