import bech32 from 'bech32';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import nacl from 'tweetnacl';
import { getHash256 } from './utils';

export default class SecretKey {
  public generateMnemonic() {
    // 商 256，生成24个助记单词, 商 128，生成12个助记单词
    const mnemonic = generateMnemonic(128);
    return mnemonic;
  }

  public genarateKeyPair(mnemonic: string) {
    const hexSeed = mnemonicToSeedSync(mnemonic, 'qstars');
    const secret = getHash256(hexSeed);
    const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(secret));
    return keyPair;
  }

  public getAddress(publicKey: Uint8Array) {
    const pkAarry = getHash256(publicKey);
    const nw = bech32.toWords(Buffer.from(pkAarry.slice(0, 20)));
    const addr = bech32.encode('address', nw);
    return addr;
  }
}
