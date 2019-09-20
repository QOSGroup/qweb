import test from 'ava';
import Qweb from './Qweb';

test('test sendTx', t => {
  const qweb = new Qweb({
    chainId: 'capricorn-2000',
    baseUrl: 'ws://47.103.78.91:26657'
  });
  const mnemonic = qweb.key.generateMnemonic();
  const account = qweb.newAccount(mnemonic);
  t.log(account);

  t.pass();
});
