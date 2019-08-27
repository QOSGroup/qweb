import { IQSC } from './tx'

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
  qscs?: IQSC[]
}

export interface IKeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}