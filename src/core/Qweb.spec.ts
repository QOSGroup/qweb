import test from 'ava'
import Qweb from './Qweb'

test('init Qweb', t => {
  const qweb = new Qweb({ chainId: '1', baseUrl: 'baseUrl' })

  t.log(qweb)

  const mnemonic = qweb.key.generateMnemonic()

  t.is(mnemonic.split(' ').length, 24)

  const account = qweb.newAccount(mnemonic)

  t.log(account)

  t.is(qweb.config.chainId, '1')
})