import test from 'ava'
import Qweb from './Qweb'
import logger from './utils/log';

test('init Qweb', async t => {
  const qweb = new Qweb({ chainId: '1', baseUrl: 'baseUrl' })

  t.log(qweb)

  const mnemonic = qweb.key.generateMnemonic()

  t.is(mnemonic.split(' ').length, 24)

  const account = qweb.newAccount(mnemonic)

  t.log(account)
  
  const tx = await account.setTx({
    to: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
    qos: 1
  })

  logger.info(JSON.stringify(tx))

  t.is(qweb.config.chainId, '1')
})