import { Codec } from 'js-amino';
import nacl from 'tweetnacl';
import { accMul, Int64ToBuffer, stringToBuffer } from '.';
import Account from '../Account';
import { Approve, ApproveITX } from '../types/approve';
import { IApproveTx, qosDecimal } from '../types/common';
import { PubKeyEd25519, QSC, Signature, StdTx } from '../types/tx';
import { getOriginAddress } from './TxSignData';

function registerCodec() {
  const codec = new Codec();
  codec.registerConcrete(new StdTx(), 'qbase/txs/stdtx', {});
  codec.registerConcrete(new ApproveITX(), 'approve/txs/TxCreateApprove', {});
  codec.registerConcrete(new PubKeyEd25519(), 'tendermint/PubKeyEd25519', {});
  return codec;
}

export function signApproveTxMsg(oMsg: {
  account: Account;
  tx: IApproveTx;
  chainid: string;
  maxGas: number;
  nonce: number;
}) {
  oMsg.tx.qos = accMul(oMsg.tx.qos, qosDecimal);
  const signed = makeTxSignMsg(oMsg);
  // logger.debug('Approve signedMsg: ')
  // logger.info(JSON.stringify(signed.arrMsg))
  const signatureData = nacl.sign.detached(
    Buffer.from(signed.arrMsg),
    oMsg.account.keypair.secretKey
  );

  const codec = registerCodec();
  const pubKey = new PubKeyEd25519([...oMsg.account.keypair.publicKey]);
  const sig = new Signature(pubKey, [...signatureData], oMsg.nonce.toString());
  const approve = new Approve(
    getOriginAddress(oMsg.account.address),
    getOriginAddress(oMsg.tx.to),
    oMsg.tx.qos.toString(),
    signed.qscArr
  );
  const itx = new ApproveITX(approve);
  const stdtx = new StdTx(itx, [sig], oMsg.chainid, oMsg.maxGas.toString());

  // const jsonTx = codec.marshalJson(stdtx)
  // logger.debug('stdtx: ')
  // logger.info(jsonTx)
  const binary = codec.marshalBinary(stdtx);
  // logger.debug(binary.toString())

  return binary;
}

function makeTxSignMsg({
  account,
  tx,
  chainid,
  maxGas,
  nonce
}: {
  account: Account;
  tx: IApproveTx;
  chainid: string;
  maxGas: number;
  nonce: number;
}) {
  let arrMsg: any[] = [];
  // push buffer of orginaddres
  const txMsg = composeData(account, tx);
  arrMsg = arrMsg.concat(txMsg.txMsgArray);
  const chaidBufferArray = [...stringToBuffer(chainid)];
  arrMsg = arrMsg.concat(chaidBufferArray);
  arrMsg = arrMsg.concat([...Int64ToBuffer(maxGas)]);
  arrMsg = arrMsg.concat([...Int64ToBuffer(nonce)]);
  arrMsg = arrMsg.concat(chaidBufferArray);
  return {
    arrMsg,
    qscArr: txMsg.qscArr
  };
}

function composeData(account: Account, tx: IApproveTx) {
  let txMsgArray = [];
  txMsgArray = txMsgArray.concat(getOriginAddress(account.address));
  txMsgArray = txMsgArray.concat(getOriginAddress(tx.to));
  txMsgArray = txMsgArray.concat([...stringToBuffer(tx.qos.toString())]);
  const qscArr: any[] = [];
  const cqscAmountArr: string[] = [];
  // logger.debug('Array.isArray(tx.qscs)', Array.isArray(tx.qscs), tx.qscs)
  if (Array.isArray(tx.qscs) && tx.qscs.length > 0) {
    for (const qsc of tx.qscs) {
      cqscAmountArr.push(`${qsc.amount}${qsc.coin_name.toLowerCase()}`);
      qscArr.push(new QSC(qsc.coin_name.toLowerCase(), qsc.amount.toString()));
    }
  }
  txMsgArray = txMsgArray.concat([...stringToBuffer(cqscAmountArr.join(','))]);

  return { txMsgArray, qscArr };
}
