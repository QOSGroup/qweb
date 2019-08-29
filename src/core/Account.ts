import { encodeBase64 } from 'tweetnacl-util'
import Qweb from './qweb'
import { IKeyPair, IUserTx } from './types/common';
import { IAuthTx, IPubkey, IQSC, ISigature, ITrader } from './types/tx'
import { isNotEmpty } from './utils';
import { signMsg } from './utils/business';
import logger from './utils/log';

// tslint:disable-next-line: max-classes-per-file
class Account {
  public readonly qweb: Qweb
  // public account: IAccount
  public qos: number = 0
  public qscs: IQSC[] = []
  public mnemonic: string
  public keypair: IKeyPair
  public address: string
  public pubKey: string
  public privateKey: string

  constructor(controller: Qweb, keyPair?: IKeyPair, mnemonic?: string) {
    this.qweb = controller
    if (keyPair) {
      this.mnemonic = mnemonic
      this.keypair = keyPair
      this.address = this.qweb.key.getAddress(keyPair.publicKey)
      this.pubKey = encodeBase64(keyPair.publicKey)
      this.privateKey = encodeBase64(keyPair.secretKey)
    }
  }

  public sendTx(tx: IUserTx | IUserTx[]) {
    return this.setTx(tx)
  }

  private async setTx(tx: IUserTx | IUserTx[]) {
    return new Promise((resolve: any, _reject: any) => {
      const signingMsg = {
        account: this,
        tx,
        chainid: this.qweb.config.chainId,
        maxGas: 20000,
        nonce: 1
      }
      const sigature = signMsg(signingMsg)
      logger.debug('sigature: ', sigature.join(' '))
      // const signatureBase64 = encodeBase64(sigature)
      resolve(this.makeAuthTx({ tx, sigaturearr: sigature, maxGas: signingMsg.maxGas, nonce: signingMsg.nonce }))
    })
  }

  // private reset() {
  //   this.qos = 0
  //   this.qscs = []
  // }

  private makeAuthTx({ tx, sigaturearr, maxGas, nonce }: { tx: IUserTx | IUserTx[], sigaturearr: Uint8Array, maxGas: number, nonce: number }) {
    const receivers: ITrader[] = this.makeReceivers(tx)
    if (Array.isArray(tx)) {
      for (const item of (tx as IUserTx[])) {
        this.qos += item.qos
        this.makeSenderQSCs(item)
      }
    } else {
      this.qos = tx.qos
      this.makeSenderQSCs(tx)
    }

    const senders: ITrader[] = [{
      addr: this.address,
      qos: this.qos,
      qscs: this.qscs.length > 0 ? this.qscs : null
    }]

    const pubkey: IPubkey = {
      type: 'tendermint/PubKeyEd25519',
      value: this.pubKey
    }

    const sigature: ISigature = {
      pubkey,
      signature: encodeBase64(sigaturearr),
      nonce: nonce.toString()
    }

    // tslint:disable-next-line: no-console
    // console.log('acc.pubKey', JSON.stringify(this.pubKey))
    const authTx: IAuthTx = {
      type: 'qbase/txs/stdtx',
      value: {
        itx: {
          type: 'transfer/txs/TxTransfer',
          value: {
            senders,
            receivers
          }
        },
        sigature: [sigature],
        chainid: this.qweb.config.chainId,
        maxgas: maxGas
      }
    }
    return authTx
  }

  private makeSenderQSCs(receiver: IUserTx) {
    if (!isNotEmpty(receiver.qscs)) {
      return
    }
    for (const item of receiver.qscs) {
      const sameQsc = this.qscs.find(x => x.coin_name === item.coin_name)
      if (isNotEmpty(sameQsc)) {
        sameQsc.amount + item.amount
        continue
      }
      this.qscs.push(item)
    }
  }

  private makeReceivers(tx: IUserTx | IUserTx[]) {
    const txIsArray = Array.isArray(tx)
    if (!txIsArray) {
      return [this.makeReceiver(tx as IUserTx)]
    }
    const receivers: ITrader[] = []
    for (const item of (tx as IUserTx[])) {
      receivers.push(this.makeReceiver(item))
    }
    return receivers
  }

  private makeReceiver(tx: IUserTx) {
    const qscs: IQSC[] = []
    if (isNotEmpty(tx.qscs)) {
      for (const qsc of tx.qscs) {
        qscs.push(qsc)
      }
    }

    const receiver: ITrader = {
      addr: tx.to,
      qos: tx.qos,
      qscs: qscs.length > 0 ? qscs : null
    };

    return receiver
  }
}

export default Account