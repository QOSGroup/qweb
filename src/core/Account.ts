import Qweb from './qweb'
import { IAuthTx, IPubkey, IQSC, ISigature, ITrader } from './types/types';
import { isNotEmpty } from './utils';

/**
 * 用户交易
 */
export interface IUserTx {
  /**
   * 接收方地址
   */
  to: string,
  /**
   * QOS 数量
   */
  qos: number,
  /**
   * QSC对象数组
   */
  qscs: IQSC[]
}

export interface IAccount {
  addr: string;
  pubKey: string;
  privateKey: string;
}

class Account {
  public readonly qweb: Qweb
  public account: IAccount
  public qos: number = 0
  public qscs: IQSC[] = []

  constructor(controller: Qweb, account?: IAccount) {
    this.qweb = controller
    if (account) {
      this.account = account
    }
  }

  public async setTx(tx: IUserTx | IUserTx[]) {
    return new Promise((resolve: any, _reject: any) => {
      
      resolve(this.makeAuthTx(tx))
    })
  }

  public reset() {
    this.qos = 0
    this.qscs = []
  }

  private makeAuthTx(tx: IUserTx | IUserTx[]) {
    const receivers: ITrader[] = this.makeReceivers(tx)
    const acc = this.account as IAccount
    for (const item of (tx as IUserTx[])) {
      this.qos += item.qos
      this.makeSenderQSCs(item)
    }
    const senders: ITrader[] = [{
      addr: acc.addr,
      qos: this.qos,
      qscs: this.qscs.length > 0 ? this.qscs : null
    }]

    const pubkey: IPubkey = {
      type: 'tendermint/PubKeyEd25519',
      value: acc.pubKey
    }

    const sigature: ISigature = {
      pubkey,
      signature: '',
      nonce: '1'
    }

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
        maxgas: 0
      }
    }

    return authTx
  }

  private makeSenderQSCs(receiver: IUserTx) {
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
    for (const qsc of tx.qscs) {
      qscs.push(qsc)
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