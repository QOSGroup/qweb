// import HTTPEndpoint from '../util/HTTPEndpoint'

export default class Account {
	constructor() {
		this._account = null
		this._address = null
	}

	getAccount() {
		// const http = new HTTPEndpoint({
		// 	HTTPBaseURL: '',
		// 	chainId: ''
		// })
		
	}

	get address() {
		return this._address
	}

	set address(address) {
		this._address = address
	}
}
