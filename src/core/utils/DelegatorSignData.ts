import { Codec } from 'js-amino'
import nacl from 'tweetnacl'
import { accMul, Int64ToBuffer, stringToBuffer } from '.'
import Account from '../Account'
import { IDelegatorTx, qosDecimal } from '../types/common'
import { ITX } from '../types/delegator'
import { PubKeyEd25519, Signature, StdTx } from '../types/tx'
import logger from './log';
import { getOriginAddress } from './TxSignData'

function registerCodec() {
  const codec = new Codec();
  codec.registerConcrete(new StdTx(), 'qbase/txs/stdtx', {});
  codec.registerConcrete(new ITX(), 'stake/txs/TxCreateDelegation', {});
  codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {});
  return codec
}

export function signDelegatorTxMsg(oMsg: {
  account: Account,
  tx: IDelegatorTx,
  chainid: string,
  maxGas: number,
  nonce: number
}) {
  oMsg.tx.qos = accMul(oMsg.tx.qos, qosDecimal)
  const signedMsg = makeTxSignMsg(oMsg)
  logger.debug('Delegator signedMsg: ')
  logger.info(JSON.stringify(signedMsg))
  const signatureData = nacl.sign.detached(Buffer.from(signedMsg), oMsg.account.keypair.secretKey)

  const codec = registerCodec()
  const pubKey = new PubKeyEd25519([...oMsg.account.keypair.publicKey])
  const sig = new Signature(pubKey, [...signatureData], oMsg.nonce.toString())
  const itx = new ITX(
    getOriginAddress(oMsg.account.address),
    getOriginAddress(oMsg.tx.to),
    oMsg.tx.qos.toString(),
    oMsg.tx.isCompound
  )
  const stdtx = new StdTx(itx, [sig], oMsg.chainid, oMsg.maxGas.toString())

  const jsonTx = codec.marshalJson(stdtx)
  logger.debug('stdtx: ')
  logger.info(jsonTx)
  const binary = codec.marshalBinary(stdtx)
  // logger.debug(binary.toString())

  return binary
}

function makeTxSignMsg({ account, tx, chainid, maxGas, nonce }: {
  account: Account,
  tx: IDelegatorTx,
  chainid: string,
  maxGas: number,
  nonce: number
}) {
  let arrMsg: any[] = []
  // push buffer of orginaddres
  const txMsgArray = composeData(account, tx)
  arrMsg = arrMsg.concat(txMsgArray)
  const chaidBufferArray = [...stringToBuffer(chainid)]
  logger.debug('chaidBufferArray', chaidBufferArray)
  arrMsg = arrMsg.concat(chaidBufferArray)
  arrMsg = arrMsg.concat([...Int64ToBuffer(maxGas)])
  logger.debug('[...Int64ToBuffer(maxGas)]', [...Int64ToBuffer(maxGas)])
  arrMsg = arrMsg.concat([...Int64ToBuffer(nonce)])
  arrMsg = arrMsg.concat(chaidBufferArray)
  return arrMsg
}

function composeData(account: Account, tx: IDelegatorTx) {
  // ret = append(ret, Delegator.Address...)
  // ret = append(ret, ValidatorOwner.Address...)
  // ret = append(ret, QOSAmount..)
  // ret = append(ret, IsCompound)
  let txMsgArray = []
  txMsgArray = txMsgArray.concat(getOriginAddress(account.address))
  txMsgArray = txMsgArray.concat(getOriginAddress(tx.to))
  txMsgArray = txMsgArray.concat([...Int64ToBuffer(tx.qos)])
  txMsgArray = txMsgArray.concat([...Buffer.from([Number(tx.isCompound)])])

  logger.debug('[...Int64ToBuffer(tx.qos)]', JSON.stringify([...Int64ToBuffer(tx.qos)]))
  logger.debug('[...Buffer.from([Number(tx.isCompound)])]', [...Buffer.from([Number(tx.isCompound)])])
  return txMsgArray
}