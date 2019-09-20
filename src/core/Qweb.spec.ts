import test from 'ava';
// import { marshalTx } from '../lib/web.js'
import Qweb from './Qweb';
import logger from './utils/log';

test('init Qweb', async t => {
  const qweb = new Qweb({
    chainId: 'aquarius-1001',
    baseUrl: 'ws://47.103.78.91:26657'
  });

  t.log(qweb);

  const mnemonic = qweb.key.generateMnemonic();

  logger.info('mnemonic: ', mnemonic);

  // const mnemonic = 'genius cable sea obey goddess glow wood tree have example fee grow enough release garden access antique general sail either palace nothing remember shop'

  t.is(mnemonic.split(' ').length, 12);

  // const account = qweb.newAccount(mnemonic)

  // logger.log('account.address: ', account.address)
  // logger.log('account.privateKey: ', account.privateKey)

  // delegator test
  // await account.sendDelegatorTx({
  //   to: 'address1nzv9awha9606jp5rpqe2kujckddpyauggu56ru',
  //   qos: 100,
  //   isCompound: false
  // })

  // await account.sendUnbondDelegatorTx({
  //   to: 'address1nzv9awha9606jp5rpqe2kujckddpyauggu56ru',
  //   qos: 100,
  //   isUnbondAll: false
  // })

  // await account.sendApproveTx({
  //   to: 'address1v26ael2jh0q7aetuk45yqf3jcyyywg2g6wq2tv',
  //   qos: 100,
  //   // qscs: false
  // })

  // transfer test
  // const tx =
  // await account.sendTx([{
  //   to: 'address1eep59h9ez4thymept8nxl0padlrc6r78fsjmp3',
  //   qos: 100,
  //   // qscs: [{
  //   //   amount: 3,
  //   //   coin_name: 'QSC'
  //   // },
  //   // {
  //   //   amount: 3,
  //   //   coin_name: 'AOE'
  //   // }]
  // }])

  // logger.info(JSON.stringify(tx))

  t.is(qweb.config.chainId, 'aquarius-1001');

  // const marshaled = marshalTx(tx)

  // logger.debug('marshaled: ', marshaled)

  // const originAddr = getOriginAddress('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay')
  // const bf1 = Buffer.from('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay', 'ascii')
  // logger.info(buf2hex(originAddr))
  // logger.info(stringToHex(originAddr))

  // const msg = signMsg({
  //   account,
  //   tx: [{
  //     to: 'address1eep59h9ez4thymept8nxl0padlrc6r78fsjmp3',
  //     qos: 2,
  //     qscs: [{
  //       amount: 3,
  //       coin_name: 'QSC'
  //     },
  //     {
  //       amount: 3,
  //       coin_name: 'AOE'
  //     }]
  //   }],
  //   chainid: qweb.config.chainId,
  //   maxGas: 20000,
  //   nonce: 1
  // })
  // const signatureBase64 = encodeBase64(msg)
  // logger.info(msg.join(' '))
  // logger.debug(signatureBase64)

  t.pass();
});
