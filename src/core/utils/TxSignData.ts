import bech32 from 'bech32'
import { Int64BE } from 'int64-buffer'
import { Codec } from 'js-amino'
import nacl from 'tweetnacl'
import { accMul, Int64ToBuffer, stringToBuffer } from '.'
import Account from '../Account'
import { IUserTx, qosDecimal } from '../types/common'
import { MsgMultiSend, PubKeyEd25519, QSC, Receiver, Sender, Signature, StdTx } from '../types/tx'
import logger from './log'

export function getOriginAddress(address: string) {
  const addrDecode = bech32.decode(address)
  const fromwords = bech32.fromWords(addrDecode.words)
  return fromwords
}

export function signTxMsg(
  oMsg: {
    account: Account,
    tx: IUserTx | IUserTx[],
    chainid: string,
    maxGas: number,
    nonce: number
  }) {
  const msg = makeTxSignMsg(oMsg)
  const signatureData = nacl.sign.detached(Buffer.from(msg.signedMsg), oMsg.account.keypair.secretKey)

  const codec = registerCodec()
  const pubKey = new PubKeyEd25519([...oMsg.account.keypair.publicKey])
  const sig = new Signature(pubKey, [...signatureData], oMsg.nonce.toString())

  const sendMultiMsg = new MsgMultiSend(msg.senders, msg.receivers)

  const stdtx = new StdTx(sendMultiMsg, [sig], oMsg.chainid, oMsg.maxGas.toString())
  // const jsonTx = codec.marshalJson(stdtx)
  // logger.debug('stdtx: ')
  // logger.info(jsonTx)
  // logger.debug('marshalBinary: ')
  const binary = codec.marshalBinary(stdtx)
  logger.debug(binary.toString())

  // const decodedDataTx = new StdTx();
  // codec.unMarshalBinary(binary, decodedDataTx)
  // logger.debug('unMb StdTx: ')
  // logger.info(decodedDataTx.JsObject())

  return binary
}

function makeTxSignMsg({ account, tx, chainid, maxGas, nonce }
  : {
    account: Account,
    tx: IUserTx | IUserTx[],
    chainid: string,
    maxGas: number,
    nonce: number
  }) {
  let arrMsg: any[] = []
  // push buffer of orginaddress
  const fromAddress = getOriginAddress(account.address)
  arrMsg = arrMsg.concat(fromAddress)

  const allData = composeData(tx)
  // concat buffer of qosAmount
  arrMsg = arrMsg.concat([...stringToBuffer(allData.qosAmount.toString())])
  // concat buffer of qscAmount
  const qscArray: string[] = []

  const qscArr: any[] = []
  for (const qsc of allData.qscAmountArr) {
    qscArray.push(`${qsc.amount}${qsc.coinName}`)
    qscArr.push(new QSC(qsc.coinName, qsc.amount.toString()))
  }

  // compose qsc string , e.g. 2qsca,3qscb
  const qscString = qscArray.join(',')
  arrMsg = arrMsg.concat([...stringToBuffer(qscString)])

  arrMsg = arrMsg.concat([...allData.arrReceiver])

  const chaidBufferArray = [...stringToBuffer(chainid)]
  arrMsg = arrMsg.concat(chaidBufferArray)
  arrMsg = arrMsg.concat([...Int64ToBuffer(maxGas)])
  arrMsg = arrMsg.concat([...Int64ToBuffer(nonce)])
  arrMsg = arrMsg.concat(chaidBufferArray)

  const senders = [new Sender(fromAddress, allData.qosAmount.toString(), qscArr)]
  const receivers = allData.receivers

  return { signedMsg: arrMsg, senders, receivers }
}

function registerCodec() {
  const codec = new Codec();
  codec.registerConcrete(new StdTx(), 'qbase/txs/stdtx', {});
  codec.registerConcrete(new MsgMultiSend(), 'transfer/txs/TxTransfer', {});
  codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {});
  return codec
}

function composeData(tx: IUserTx | IUserTx[]) {

  const coinNameArr = getQscCoinNames(tx)

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

  const receivers: any[] = []

  for (const item of tx) {
    item.qos = accMul(item.qos, qosDecimal)
    qosAmount += item.qos
    const toAddress = getOriginAddress(item.to)
    arrReceiver = arrReceiver.concat(toAddress)
    arrReceiver = arrReceiver.concat([...stringToBuffer(item.qos.toString())])

    const qscArr: any[] = []
    const cqscAmountArr: string[] = []
    if (item.qscs && item.qscs.length > 0) {
      for (const coinName of coinNameArr) {
        const cqsc = item.qscs.filter(x => x.coin_name.toLowerCase() === coinName).reduce((pre, current) => {
          return {
            coin_name: pre.coin_name,
            amount: pre.amount + current.amount
          }
        })
        cqsc.amount = accMul(cqsc.amount, qosDecimal)
        cqscAmountArr.push(`${cqsc.amount}${coinName}`)
        qscArr.push(new QSC(coinName, cqsc.amount.toString()))
        const index = qscAmountArr.findIndex(x => x.coinName === coinName)
        if (index > -1) {
          qscAmountArr[index].amount += cqsc.amount
        } else {
          qscAmountArr.push({
            coinName,
            amount: cqsc.amount
          })
        }
      }
      arrReceiver = arrReceiver.concat([...stringToBuffer(cqscAmountArr.join(','))])
    }
    receivers.push(new Receiver(toAddress, item.qos.toString(), qscArr))
  }
  return {
    qosAmount: new Int64BE(qosAmount),
    qscAmountArr,
    arrReceiver,
    receivers
  }
}

function txForComposeData(tx: IUserTx, coinNameArr: string[]) {
  let qosAmount = 0
  const qscAmountArr: any[] = []
  // 添加 receiver 代签名 byte[]
  let arrReceiver: any[] = []

  const qscArr: any[] = []

  qosAmount = accMul(tx.qos, qosDecimal)
  const toAddress = getOriginAddress(tx.to)
  arrReceiver = arrReceiver.concat(toAddress)

  arrReceiver = arrReceiver.concat([...stringToBuffer(tx.qos.toString())])
  const cqscAmountArr: string[] = []
  if (tx.qscs && tx.qscs.length > 0) {
    for (const coinName of coinNameArr) {
      const cqsc = tx.qscs.filter(x => x.coin_name.toLowerCase() === coinName).reduce((pre, current) => {
        return {
          coin_name: pre.coin_name,
          amount: pre.amount + current.amount
        }
      })
      cqsc.amount = accMul(cqsc.amount, qosDecimal)
      cqscAmountArr.push(`${cqsc.amount}${coinName}`)
      qscAmountArr.push({
        coinName,
        amount: cqsc.amount
      })
      qscArr.push(new QSC(coinName, cqsc.amount.toString()))
    }
    arrReceiver = arrReceiver.concat([...stringToBuffer(cqscAmountArr.join(','))])
  }

  const receivers = [new Receiver(toAddress, tx.qos.toString(), qscAmountArr)]

  return {
    qosAmount: new Int64BE(qosAmount),
    qscAmountArr,
    arrReceiver,
    receivers
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