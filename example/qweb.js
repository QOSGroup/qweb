import QWeb from '../src/model/qweb'

// import {
// 	encodeBase64,
// 	// decodeBase64
// } from 'tweetnacl-util'

const qweb = new QWeb({ chainId: 'qos-test', baseUrl: 'http://192.168.1.223:1317' })

// const privateKey = 'Ey+2bNFF2gTUV6skSBgRy3rZwo9nS4Dw0l2WpLrhVvV8MuMRbjN4tUK8orHiJgHTR+enkxyXcA8giVrsrIRM4Q=='


const promise = qweb.tx.from([
	{
		privateKey: 'Ey+2bNFF2gTUV6skSBgRy3rZwo9nS4Dw0l2WpLrhVvV8MuMRbjN4tUK8orHiJgHTR+enkxyXcA8giVrsrIRM4Q==',
		addr: 'address13mjc3n3xxj73dhkju9a0dfr4lrfvv3whxqg0dy', qos: '1',
		qscs: [
			// {
			// 	coin_name: 'AOE', amount: '100'
			// }
		]
	}
]).to([
	{
		addr: 'address13hkg8nva06hntmnhfupy29c2l9aq9zs879jhez', qos: '1', qscs: [
			// {
			// 	coin_name: 'AOE', amount: '100'
			// }
		]
	}
]).send()

promise.then(res => {
	console.log('----------promise res:', res)
})

// const keyPair = qweb.genarateKeyPair()

// console.log(keyPair)
// console.log(encodeBase64(keyPair.publicKey))
// console.log(encodeBase64(keyPair.secretKey))

// const newAccount = qweb.newAccount()
// console.log('--------------------------------------')
// console.log(newAccount)
// console.log('--------------------------------------')

// const mn = 'milk garden scare goat sketch laundry teach rival loyal double cotton renew giraffe spend web amused vault snake emerge beauty suffer kitten surface level'

// const recoveryAccount = qweb.recoveryAccountByMnemonic(mn)
// console.log(recoveryAccount)
// console.log('--------------------------------------')

// const rAccount = qweb.recoveryAccountByPrivateKey('JcoHX1Oeuvo1coS7nTukw1Km24YbFTccQMpAof/ZEhH2i2uznasYVD/U7oKYN4eL5JT9syYSh+KBmgTffinyNg==')
// console.log(rAccount)
// console.log('--------------------------------------')

// qweb.account.get('address1pcjs0t9m9vl7vejwttuc2fzfgnutndnrpyw08m').then(res=>{
// 	console.log(res)
// })
