import test from 'ava'
import Qweb from './Qweb'

test('test sendTx', t => {
  const qweb = new Qweb({ chainId: 'capricorn-2000', baseUrl: 'http://192.168.1.183:26657' })
  const account = qweb.newAccount();
  // const account2 = qweb.account;

  t.is(account, account)
})