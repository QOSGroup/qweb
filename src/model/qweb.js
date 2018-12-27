import HTTPEndpoint from '../util/HTTPEndpoint'
import Tx from './tx'

export default class QWeb {
	constructor(config) {
		this._chainId = config.chainId
		this._baseUrl = config.baseUrl
		this._httpEndpoint = new HTTPEndpoint({ chainId: this._chainId, baseUrl: this._baseUrl })
	}

	get chainId() {
		return this._chainId
	}

	get baseUrl() {
		return this._baseUrl
	}

	get tx() {
		return new Tx(this.chainId)
	}

}