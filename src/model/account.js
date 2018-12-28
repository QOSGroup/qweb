export default class Account {
	constructor(qweb) {
		this._qweb = qweb
	}

	get(address) {
		// http://localhost:1317/QOSaccounts/cosmosaccaddr120ws5500u0q8q75k70uetqp2xnysus5t4x9ug9
		return this._qweb.http.request({
			url: `/QOSaccounts/${address}`
		})
	}
}
