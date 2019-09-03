
export const qosDecimal = 10000

export interface IQSC {
  coin_name: string,
  amount: number
}


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

/**
 * 委托交易
 */
export interface IDelegatorTx{
  /**
   * ValidatorOwner: Validator 地址
   */
  to: string,
  /**
   * QOS 数量
   */
  qos: number,
  /**
   * 是否复投
   */
  isCompound: boolean
}