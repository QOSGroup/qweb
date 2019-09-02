import test from 'ava'
// import { marshalTx } from '../lib/web.js'
import Qweb from './Qweb'
import logger from './utils/log'

test('init Qweb', async t => {
  const qweb = new Qweb({ chainId: 'aquarius-1000', baseUrl: 'ws://47.103.78.91:26657' })

  t.log(qweb)

  // const mnemonic = qweb.key.generateMnemonic()

  // logger.info('mnemonic: ', mnemonic)

  const mnemonic = 'genius cable sea obey goddess glow wood tree have example fee grow enough release garden access antique general sail either palace nothing remember shop'

  t.is(mnemonic.split(' ').length, 24)

  const account = qweb.newAccount(mnemonic)

  logger.log('account.address: ', account.address)
  logger.log('account.privateKey: ', account.privateKey)

  // const tx =
  await account.sendTx([{
    to: 'address1eep59h9ez4thymept8nxl0padlrc6r78fsjmp3',
    qos: 100,
    // qscs: [{
    //   amount: 3,
    //   coin_name: 'QSC'
    // },
    // {
    //   amount: 3,
    //   coin_name: 'AOE'
    // }]
  }])
  // await account.getNonce()

  // logger.info(JSON.stringify(tx))


  t.is(qweb.config.chainId, 'aquarius-1000')

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

  t.pass()
})



