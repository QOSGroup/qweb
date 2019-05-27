import { default as tool } from './util/tool'
import Request from './util/request'
import Transaction from './module/Transaction'
import Account from './module/account'

export default class QWeb {
	constructor(config) {
		this.chainId = config.chainId
		this.baseUrl = config.baseUrl
		this.http = new Request({ chainId: this._chainId, baseUrl: this._baseUrl })
		this.account = new Account(this)
		this.tx = new Transaction(this)
	}

	get tool() {
		return tool
	}
}
