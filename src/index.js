import Trx from './model/trx';
import DefaultConfig from './config';

export default class QOSWeb {
	constructor(config) {
		this.config = config || DefaultConfig
  }

	setConfig(config) {}

	getBalance(address) {}

	getTransaction(transactionID) {
		const trx = new Trx()
    return trx
  }

	createTransaction() {
		const trx = new Trx()
    return trx
  }

	createAccount() {}
}
