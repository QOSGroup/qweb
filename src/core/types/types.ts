
/** @TODO document */
export interface IAuthTx {
  type: string;
  value: IStdTx;
}

export interface IStdTx {
  itx: ITx,
  sigature: ISigature[],
  chainid: string,
  maxgas: number
}

export interface ITx {
  type: string;
  value: ITraders
}

export interface ITraders {
  senders: ITrader[],
  receivers: ITrader[]
}

export interface ITrader {
  addr: string,
  qos: number,
  qscs: IQSC[]
}

export interface IQSC {
  coin_name: string,
  amount: number
}

export interface ISigature {
  pubkey: IPubkey,
  signature: string,
  nonce: string
}

export interface IPubkey {
  type: string,
  value: string
}