import { encodeBase64 } from 'tweetnacl-util'
import Qweb from './qweb'
import { IKeyPair, IUserTx } from './types/common'
import { IQSC } from './types/tx'
import { signTxMsg } from './utils/business'

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

  public async getNonce() {
    // const path = '/store/acc/key'
    // const key = getOriginAddress(this.address)
    // logger.debug('account:', `account:[${key}]`)
    // const accountBuffer = stringToBuffer('account:')
    // const res = await this.qweb.rpc.abciQuery({ path, data: buf2hex([...accountBuffer, ...key]) }, { height: 0, prove: false })

    // logger.debug('account:', `account:[${key}]`)
    // const resValue = res.response.value
    // const codec = new Codec()
    // codec.registerConcrete(new QOSAccount(), 'qos/types/QOSAccount', {});
    // codec.registerConcrete(new BaseAccount(), 'qbase/account/BaseAccount', {});
    // codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {});
    // codec.registerConcrete([new QSC()], 'qscs');
    // codec.registerConcrete(new QSC(), 'qsc');
    // const baseAccount = new BaseAccount([...key], new PubKeyEd25519([...this.keypair.publicKey]), 0)
    // const account = new QOSAccount(
    //   baseAccount,
    //   '501000000000',
    //   [
    //     // new QSC('','')
    //   ]
    // )
    // logger.debug('marshalJson: ')
    // const json = codec.marshalJson(account)

  }

  public async sendTx(tx: IUserTx | IUserTx[], maxGas = 200000) {
    const txBinary = await this.setTx(tx, maxGas)
    // logger.log('log rpc block:')
    // const res = await this.qweb.rpc.block({ height: 100 })
    // logger.debug(res)
    // const res = await this.qweb.rpc.broadcastTxSync({tx: txBinary})
    // logger.debug(res)
    await this.getNonce()
    return txBinary
  }

  private async setTx(tx: IUserTx | IUserTx[], maxGas = 200000) {
    return new Promise((resolve: any, _reject: any) => {
      const signingMsg = {
        account: this,
        tx,
        chainid: this.qweb.config.chainId,
        maxGas,
        nonce: 1
      }

      resolve(signTxMsg(signingMsg))
      // const signatureBase64 = encodeBase64(sigature)
      // resolve(this.makeAuthTx({ tx, sigaturearr: sig.signatureData, maxGas: signingMsg.maxGas, nonce: signingMsg.nonce }))
    })
  }

  // private reset() {
  //   this.qos = 0
  //   this.qscs = []
  // }

  // private makeAuthTx({ tx, sigaturearr, maxGas, nonce }: { tx: IUserTx | IUserTx[], sigaturearr: Uint8Array, maxGas: number, nonce: number }) {
  //   const receivers: ITrader[] = this.makeReceivers(tx)
  //   if (Array.isArray(tx)) {
  //     for (const item of (tx as IUserTx[])) {
  //       this.qos += item.qos
  //       this.makeSenderQSCs(item)
  //     }
  //   } else {
  //     this.qos = tx.qos
  //     this.makeSenderQSCs(tx)
  //   }

  //   const senders: ITrader[] = [{
  //     addr: this.address,
  //     qos: this.qos,
  //     qscs: this.qscs.length > 0 ? this.qscs : null
  //   }]

  //   const pubkey: IPubkey = {
  //     type: 'tendermint/PubKeyEd25519',
  //     value: this.pubKey
  //   }

  //   const sigature: ISigature = {
  //     pubkey,
  //     signature: encodeBase64(sigaturearr),
  //     nonce: nonce.toString()
  //   }

  //   // tslint:disable-next-line: no-console
  //   // console.log('acc.pubKey', JSON.stringify(this.pubKey))
  //   const authTx: IAuthTx = {
  //     type: 'qbase/txs/stdtx',
  //     value: {
  //       itx: {
  //         type: 'transfer/txs/TxTransfer',
  //         value: {
  //           senders,
  //           receivers
  //         }
  //       },
  //       sigature: [sigature],
  //       chainid: this.qweb.config.chainId,
  //       maxgas: maxGas
  //     }
  //   }
  //   return authTx
  // }

  // private makeSenderQSCs(receiver: IUserTx) {
  //   if (!isNotEmpty(receiver.qscs)) {
  //     return
  //   }
  //   for (const item of receiver.qscs) {
  //     const sameQsc = this.qscs.find(x => x.coin_name === item.coin_name)
  //     if (isNotEmpty(sameQsc)) {
  //       sameQsc.amount + item.amount
  //       continue
  //     }
  //     this.qscs.push(item)
  //   }
  // }

  // private makeReceivers(tx: IUserTx | IUserTx[]) {
  //   const txIsArray = Array.isArray(tx)
  //   if (!txIsArray) {
  //     return [this.makeReceiver(tx as IUserTx)]
  //   }
  //   const receivers: ITrader[] = []
  //   for (const item of (tx as IUserTx[])) {
  //     receivers.push(this.makeReceiver(item))
  //   }
  //   return receivers
  // }

  // private makeReceiver(tx: IUserTx) {
  //   const qscs: IQSC[] = []
  //   if (isNotEmpty(tx.qscs)) {
  //     for (const qsc of tx.qscs) {
  //       qscs.push(qsc)
  //     }
  //   }

  //   const receiver: ITrader = {
  //     addr: tx.to,
  //     qos: tx.qos,
  //     qscs: qscs.length > 0 ? qscs : null
  //   }

  //   return receiver
  // }
}

export default Account