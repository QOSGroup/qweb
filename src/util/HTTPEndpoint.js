import axios from 'axios'

const createAxioRequest = (baseURL, timeout)=>{
    return axios.create({
        baseURL: `${this.HTTPBaseURL}/${this.chainId}`,
        timeout: 30000
    })
}

export default class HTTPEndpoint {
    request = null
    HTTPBaseURL = null
    chainId = null

    constructor(config){
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