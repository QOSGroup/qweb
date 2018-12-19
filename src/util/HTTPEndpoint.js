import axios from 'axios'

const createAxioRequest = (baseURL, timeout)=>{
	return axios.create({
		baseURL: `${this.HTTPBaseURL}/${this.chainId}`,
		timeout: timeout
	})
}

export default class HTTPEndpoint {
	constructor(config){
		this.request = null
		this.HTTPBaseURL = null
		this.chainId = null
		this.init(config)
	}

	init(config){
		this.HTTPBaseURL = config.HTTPAPIEndpoint
		this.chainId = config.chainId
		this.request = createAxioRequest(`${this.HTTPBaseURL}/${this.chainId}`, 30000)
	}

	setHTTPBaseURL(url){
		this.HTTPBaseURL = url
		this.request = createAxioRequest(`${this.HTTPBaseURL}/${this.chainId}`, 30000)
	}

	setChainId(chainId){
		this.chainId = chainId
		this.request = createAxioRequest(`${this.HTTPBaseURL}/${this.chainId}`, 30000)
	}

	requestGetBalance(address){
		return this.request({
			url: `/accounts/${address}`
		})
	}

	requestGetTransaction(trxId){
		return this.request({
			url: `/block/${trxId}`
		})
	}

	requestCreateTransaction(){

	}
}