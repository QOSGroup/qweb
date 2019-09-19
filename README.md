# QWeb
QOS JS SDK

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