import { encodeBase64 } from 'tweetnacl-util';
import Qweb from './Qweb';
import {
  IApproveTx,
  IDelegatorTx,
  IKeyPair,
  IQSC,
  IUnbondDelegatorTx,
  IUserTx
} from './types/common';
import { signApproveTxMsg } from './utils/ApproveSignData';
import {
  signDelegatorTxMsg,
  signUnbondDelegatorTxMsg
} from './utils/DelegatorSignData';
import { signTxMsg } from './utils/TxSignData';

class Account {
  public readonly qweb: Qweb;
  // public account: IAccount
  public qos: number = 0;
  public qscs: IQSC[] = [];
  public mnemonic: string;
  public keypair: IKeyPair;
  public address: string;
  public pubKey: string;
  public privateKey: string;

  constructor(controller: Qweb, keyPair?: IKeyPair, mnemonic?: string) {
    this.qweb = controller;
    if (keyPair) {
      this.mnemonic = mnemonic;
      this.keypair = keyPair;
      this.address = this.qweb.key.getAddress(keyPair.publicKey);
      this.pubKey = encodeBase64(keyPair.publicKey);
      this.privateKey = encodeBase64(keyPair.secretKey);
    }
  }

  public async getAccount() {
    const result = await this.qweb.request({
      url: `nodes/${this.qweb.config.chainId}/accounts/${this.address}`
    });
    if (!result || !result.data) {
      throw new Error('network request error: ' + JSON.stringify(result));
    }
    return result.data.result.value;
  }

  public async sendTx(tx: IUserTx | IUserTx[], maxGas = 200000) {
    const acc = await this.getAccount();
    // logger.info('acc:', acc)
    const txBinary = await this.setTx(
      tx,
      Number(acc.base_account.nonce) + 1,
      maxGas
    );
    // logger.log('log rpc block:')
    // const res = await this.qweb.rpc.block({ height: 100 })
    // logger.debug(res)
    const res = await this.qweb.rpc.broadcastTxSync({ tx: txBinary });
    // logger.debug(res)
    return res;
  }

  public async sendDelegatorTx(tx: IDelegatorTx, maxGas = 2000000) {
    const acc = await this.getAccount();
    const txBinary = await this.setDelegatorTx(
      tx,
      Number(acc.base_account.nonce) + 1,
      maxGas
    );
    const res = await this.qweb.rpc.broadcastTxSync({ tx: txBinary });
    // logger.debug(res)
    return res;
  }

  public async sendUnbondDelegatorTx(tx: IUnbondDelegatorTx, maxGas = 2000000) {
    const acc = await this.getAccount();
    const txBinary = await this.setUnbondDelegatorTx(
      tx,
      Number(acc.base_account.nonce) + 1,
      maxGas
    );
    const res = await this.qweb.rpc.broadcastTxSync({ tx: txBinary });
    // logger.debug(res)
    return res;
  }

  public async sendApproveTx(tx: IApproveTx, maxGas = 200000) {
    const acc = await this.getAccount();
    const txBinary = await this.setApproveTx(
      tx,
      Number(acc.base_account.nonce) + 1,
      maxGas
    );
    const res = await this.qweb.rpc.broadcastTxSync({ tx: txBinary });
    // logger.debug(res)
    return res;
  }

  public async setApproveTx(tx: IApproveTx, nonce: number, maxGas: number) {
    return new Promise((resolve: any, _reject: any) => {
      const signingMsg = {
        account: this,
        tx,
        chainid: this.qweb.config.chainId,
        maxGas,
        nonce
      };
      resolve(signApproveTxMsg(signingMsg));
    });
  }

  public async setDelegatorTx(tx: IDelegatorTx, nonce: number, maxGas: number) {
    return new Promise((resolve: any, _reject: any) => {
      const signingMsg = {
        account: this,
        tx,
        chainid: this.qweb.config.chainId,
        maxGas,
        nonce
      };
      resolve(signDelegatorTxMsg(signingMsg));
    });
  }

  public async setUnbondDelegatorTx(
    tx: IUnbondDelegatorTx,
    nonce: number,
    maxGas: number
  ) {
    return new Promise((resolve: any, _reject: any) => {
      const signingMsg = {
        account: this,
        tx,
        chainid: this.qweb.config.chainId,
        maxGas,
        nonce
      };
      resolve(signUnbondDelegatorTxMsg(signingMsg));
    });
  }

  private async setTx(tx: IUserTx | IUserTx[], nonce: number, maxGas: number) {
    return new Promise((resolve: any, _reject: any) => {
      const signingMsg = {
        account: this,
        tx,
        chainid: this.qweb.config.chainId,
        maxGas,
        nonce
      };

      resolve(signTxMsg(signingMsg));
    });
  }
}

export default Account;
