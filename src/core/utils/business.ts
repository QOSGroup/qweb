import bech32 from 'bech32'
import { Int64BE } from 'int64-buffer'
import nacl from 'tweetnacl'
import { Int64ToBuffer, stringToBuffer } from '.';
import Account from '../Account';
import { IUserTx } from '../types/common'
import logger from './log';

export function getOriginAddress(address: string) {
  const addrDecode = bech32.decode(address)
  const fromwords = bech32.fromWords(addrDecode.words)
  return fromwords
}

export function signMsg(
  oMsg: {
    account: Account,
    tx: IUserTx | IUserTx[],
    chainid: string,
    maxGas: number,
    nonce: number
  }) {
  const signedMsg = makeSignMsg(oMsg)
  logger.debug('signedMsg: ')
  logger.debug(signedMsg.join(' '))
  const signatureData = nacl.sign.detached(Buffer.from(signedMsg), oMsg.account.keypair.secretKey)

  return signatureData
}

function makeSignMsg({ account, tx, chainid, maxGas, nonce }
  : {
    account: Account,
    tx: IUserTx | IUserTx[],
    chainid: string,
    maxGas: number,
    nonce: number
  }) {
  let arrMsg: any[] = []
  // push buffer of orginaddress
  arrMsg = arrMsg.concat(getOriginAddress(account.address))

  const allData = composeData(tx)
  // concat buffer of qosAmount
  arrMsg = arrMsg.concat([...allData.qosAmount.toBuffer()])
  // concat buffer of qscAmount
  for (const qsc of allData.qscAmountArr) {
    arrMsg = arrMsg.concat([...stringToBuffer(`${qsc.amount}${qsc.coinName}`)])
  }
  
  arrMsg = arrMsg.concat([...allData.arrReceiver])
  const chaidBufferArray = [...stringToBuffer(chainid)]
  arrMsg = arrMsg.concat(chaidBufferArray)
  arrMsg = arrMsg.concat([...Int64ToBuffer(maxGas)])
  arrMsg = arrMsg.concat([...Int64ToBuffer(nonce)])
  arrMsg = arrMsg.concat(chaidBufferArray)

  return arrMsg
}

function composeData(tx: IUserTx | IUserTx[]) {

  const coinNameArr = getQscCoinNames(tx)
  logger.debug(coinNameArr)

  if (Array.isArray(tx)) {
    return txIsArrayForComposeData(tx, coinNameArr)
  }
  return txForComposeData(tx, coinNameArr)
}

function txIsArrayForComposeData(tx: IUserTx[], coinNameArr: string[]) {
  let qosAmount = 0
  const qscAmountArr: any[] = []
  // 添加 receiver 代签名 byte[]
  let arrReceiver: any[] = []

  for (const item of tx) {
    qosAmount += item.qos
    arrReceiver = arrReceiver.concat(getOriginAddress(item.to))
    arrReceiver = arrReceiver.concat([...Int64ToBuffer(item.qos)])

    const cqscAmountArr: any[] = []
    if (item.qscs && item.qscs.length > 0) {
      for (const coinName of coinNameArr) {
        const cqsc = item.qscs.filter(x => x.coin_name.toLowerCase() === coinName).reduce((pre, current) => {
          return {
            coin_name: pre.coin_name,
            amount: pre.amount + current.amount
          }
        })
        cqscAmountArr.push({
          coinName,
          amount: cqsc.amount
        })
        const index = qscAmountArr.findIndex(x => x.coinName === coinName)
        logger.debug('index: ', index , coinName)
        if (index > -1) {
          qscAmountArr[index].amount += cqsc.amount
        } else {
          qscAmountArr.push({
            coinName,
            amount: cqsc.amount
          })
        }
      }
    }
    for (const qsc of cqscAmountArr) {
      arrReceiver = arrReceiver.concat([...stringToBuffer(`${qsc.amount}${qsc.coinName}`)])
    }
  }
  return {
    qosAmount: new Int64BE(qosAmount),
    qscAmountArr,
    arrReceiver
  }
}

function txForComposeData(tx: IUserTx, coinNameArr: string[]) {
  let qosAmount = 0
  const qscAmountArr: any[] = []
  // 添加 receiver 代签名 byte[]
  let arrReceiver: any[] = []
  qosAmount = tx.qos
  arrReceiver = arrReceiver.concat(getOriginAddress(tx.to))
  arrReceiver = arrReceiver.concat([...Int64ToBuffer(tx.qos)])
  if (tx.qscs && tx.qscs.length > 0) {
    for (const coinName of coinNameArr) {
      const cqsc = tx.qscs.filter(x => x.coin_name.toLowerCase() === coinName).reduce((pre, current) => {
        return {
          coin_name: pre.coin_name,
          amount: pre.amount + current.amount
        }
      })
      qscAmountArr.push({
        coinName,
        amount: cqsc.amount
      })
    }
  }
  for (const qsc of qscAmountArr) {
    arrReceiver = arrReceiver.concat([...stringToBuffer(`${qsc.amount}${qsc.coinName}`)])
  }
  return {
    qosAmount: new Int64BE(qosAmount),
    qscAmountArr,
    arrReceiver
  }
}

/**
 * 去重并获取所有QSC的CoinName数组,如['QSC']
 * @param tx 交易体
 */
function getQscCoinNames(tx: IUserTx | IUserTx[]): string[] {
  const qscSet = new Set()
  if (Array.isArray(tx)) {
    for (const item of tx) {
      if (item.qscs && item.qscs.length > 0) {
        for (const qsc of item.qscs) {
          qscSet.add(qsc.coin_name.toLowerCase())
        }
      }
    }
  } else {
    if (tx.qscs && tx.qscs.length > 0) {
      for (const qsc of tx.qscs) {
        qscSet.add(qsc.coin_name.toLowerCase())
      }
    }
  }
  return [...qscSet] as string[]
}