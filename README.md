# QWeb
QOS JS SDK

[![version](https://img.shields.io/github/tag/QOSGroup/qweb.svg)](https://github.com/QOSGroup/qweb/releases/latest)
[![Build Status](https://travis-ci.org/QOSGroup/qweb.svg?branch=master)](https://travis-ci.org/QOSGroup/qweb)
[![license](https://img.shields.io/github/license/QOSGroup/qweb.svg)](https://github.com/QOSGroup/qweb/blob/master/LICENSE)
[![](https://tokei.rs/b1/github/QOSGroup/qweb?category=lines)](https://github.com/QOSGroup/qweb)

# 开发
- 安装依赖  
  $ yarn install

- 开发  
  $ npm run watch

- 打包  
  $ npm run build

# 安装
  yarn add qos-qweb

# 用法

- 初始化
```
  import Qweb from 'qos-qweb';
  const qweb = new Qweb({ chainId: 'aquarius-1001', baseUrl: 'ws://47.103.78.91:26657' })
```

- 生成助记符
```
  const mnemonic = qweb.key.generateMnemonic()
  console.log(mnemonic)
```

- 新建账号
```
  const mnemonic = 'genius cable sea obey goddess glow wood tree have example fee grow enough release garden access antique general sail either palace nothing remember shop'

  const account = qweb.newAccount(mnemonic)
```

- 发送一对多交易
```
  const tx = await account.sendTx([{
    to: 'address1eep59h9ez4thymept8nxl0padlrc6r78fsjmp3',
    qos: 100,
    qscs: [{
      amount: 3,
      coin_name: 'QSC'
    }]
  }])
```

- 发送委托交易
```
  await account.sendDelegatorTx({
    to: 'address1nzv9awha9606jp5rpqe2kujckddpyauggu56ru',
    qos: 100,
    isCompound: false
  })
```

- 发送解绑交易
```
  await account.sendUnbondDelegatorTx({
    to: 'address1nzv9awha9606jp5rpqe2kujckddpyauggu56ru',
    qos: 100,
    isUnbondAll: false
  })
```

- 发送预授权交易
```
  await account.sendApproveTx({
    to: 'address1v26ael2jh0q7aetuk45yqf3jcyyywg2g6wq2tv',
    qos: 100
  })
```

- 以上所有交易方法第二个参数是gas费用，可自行设定正整数。  
如： 
```
  await account.sendDelegatorTx({
    to: 'address1nzv9awha9606jp5rpqe2kujckddpyauggu56ru',
    qos: 100,
    isCompound: false
  }, 30000)
```