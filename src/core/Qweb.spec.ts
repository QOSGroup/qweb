import test from 'ava'
import Qweb from './Qweb'
import { signMsg } from './utils/business'
import logger from './utils/log'

test('init Qweb', async t => {
  const qweb = new Qweb({ chainId: 'capricorn-2000', baseUrl: 'baseUrl' })

  t.log(qweb)

  // const mnemonic = qweb.key.generateMnemonic()

  // logger.info('mnemonic: ', mnemonic)

  const mnemonic = 'genius cable sea obey goddess glow wood tree have example fee grow enough release garden access antique general sail either palace nothing remember shop'

  t.is(mnemonic.split(' ').length, 24)

  const account = qweb.newAccount(mnemonic)

  logger.log('account.address: ', account.address)
  logger.log('account.privateKey: ', account.privateKey)

  // const acc = new Account(qweb, )

  // const tx = await account.setTx({
  //   to: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
  //   qos: 1
  // })

  // logger.info(JSON.stringify(tx))

  // const originAddr = getOriginAddress('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay')
  // const bf1 = Buffer.from('address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay', 'ascii')
  // logger.info(buf2hex(originAddr))
  // logger.info(stringToHex(originAddr))

  const msg = signMsg({
    account,
    tx: [{
      to: 'address1eep59h9ez4thymept8nxl0padlrc6r78fsjmp3',
      qos: 2,
      qscs: [{
        amount: 3,
        coin_name: 'QSC'
      },
      {
        amount: 3,
        coin_name: 'AOE'
      }]
    }],
    chainid: qweb.config.chainId,
    maxGas: 20000,
    nonce: 1
  })

  logger.info(msg.join(' '))

  t.pass()
})



// function stringToHex(str) {
//   let val = ''
//   // tslint:disable-next-line: no-let
//   for (let i = 0; i < str.length; i++) {
//     val += str.charCodeAt(i).toString(16)
//   }
//   return val
// }