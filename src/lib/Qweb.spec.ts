import test from 'ava';
import Qweb from './Qweb'

test('init Qweb', t => {
  const qweb = new Qweb({ chainId: '1', baseUrl: 'baseUrl' })

  t.log(qweb)

  t.is(qweb.config.chainId, '1')
});