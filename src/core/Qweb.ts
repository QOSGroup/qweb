import nacl from 'tweetnacl'
import Account from './Account'
import SecretKey from './SecretKey'
import { decodeBase64 } from './utils';
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

    return new Account(this, keyPair, mnemonic)
  }

  /**
	  * 根据私钥恢复账户
	  * @param {string} privateKey 私钥
	  */
  public recoveryAccountByPrivateKey(privateKey) {
    const privateKeyBuffer = decodeBase64(privateKey)
    const keyPair = nacl.sign.keyPair.fromSecretKey(privateKeyBuffer)
    return new Account(this, keyPair)
  }

}

export default Qweb