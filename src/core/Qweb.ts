import Account from './Account'
import createAxioRequest from './utils/request'

class Qweb {
  public readonly config: {
    readonly chainId: string
    readonly baseUrl: string
  };

  constructor(config: {
    readonly chainId: string,
    readonly baseUrl: string
  }) {
    this.config = config
  }

  public get request() {
    return createAxioRequest(this.config.baseUrl)
  }

  public newAccount() {
    return new Account(this)
  }
}

export default Qweb