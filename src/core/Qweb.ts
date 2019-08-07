import Account from './Account'
import SecretKey from './SecretKey'
import createAxioRequest from './utils/request'

class Qweb {
  public readonly config: {
    readonly chainId: string
    readonly baseUrl: string
  };
  public key: SecretKey;

  constructor(config: {
    readonly chainId: string,
    readonly baseUrl: string
  }) {
    this.config = config
    this.key = new SecretKey()
  }

  public get request() {
    return createAxioRequest(this.config.baseUrl)
  }

  public newAccount(mnemonic: string) {
    const keyPair = this.key.genarateKeyPair(mnemonic)

    return new Account(this, keyPair)
  }

}

export default Qweb