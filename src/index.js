import Trx from './model/trx'
import Account from './model/account'
import DefaultConfig from './config'
import HTTPEndpoint from './util/HTTPEndpoint'

export default class QOSWeb {
	constructor(config = DefaultConfig) {
		this.config = config
		this.HTTPEndpoint = new HTTPEndpoint(this.config)
	}

	// setConfig(config) {}

	isValidAccount(address){
		console.log(address)
		return true
	}

	async getAccount(address) {
		const result = await this.HTTPEndpoint.requestGetAccount(address)
		console.log(result)
		const account = new Account()
		account.address = address
		return account
	}

	// getTransaction(transactionID) {
	// 	const trx = new Trx()
	// 	return trx
	// }

	createTransaction() {
		const trx = new Trx()
		return trx
	}

	createAccount() {}
}
