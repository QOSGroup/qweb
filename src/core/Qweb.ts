import { RpcClient } from 'tendermint'
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
  public rpc: any;
  public node: any;
  public qmoonUrl: string;

  constructor(config: {
    readonly chainId: string,
    readonly baseUrl: string
  }) {
    this.config = config
    this.qmoonUrl = 'http://qmoonapi.qoschain.info'
    this.key = new SecretKey()
    // this.node = Tendermint(config.baseUrl)
    this.rpc = RpcClient(config.baseUrl)
  }

  public get request() {
    return createAxioRequest(this.qmoonUrl)
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