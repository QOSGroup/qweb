import axios from 'axios'

const createAxioRequest = (baseURL, timeout)=>{
	return axios.create({
		baseURL: baseURL,
		timeout: timeout
	})
}

export default class HTTPEndpoint {
	constructor(config){
		this.HTTPBaseURL = config.HTTPAPINode
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

	requestGetAccount(address){
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