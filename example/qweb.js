// import QWeb from '../src/qweb'

// import {
// 	encodeBase64,
// 	// decodeBase64
// } from 'tweetnacl-util'

const qweb = new QWeb({ chainId: 'capricorn-1000', baseUrl: 'http://106.14.178.99:1317' })

// const privateKey = 'Ey+2bNFF2gTUV6skSBgRy3rZwo9nS4Dw0l2WpLrhVvV8MuMRbjN4tUK8orHiJgHTR+enkxyXcA8giVrsrIRM4Q=='


const promise = qweb.tx.from([
	{
		privateKey: 'yo6uk98GyulBuAiuVGnaa667tPCyPhlp1ukQSDBCuuZi5gFP24p3cG04QFSlrzUnqmmaTCRNRozhGJRaSzNxpQ==',
		addr: 'address1rpmtqcexr8m20zpl92llnquhpzdua9stszmhyq',
		qos: '0',
		qscs: [
			{
				coin_name: 'AOE', amount: '100'
			}
		]
	}
]).to([
	{
		addr: 'address1pcjs0t9m9vl7vejwttuc2fzfgnutndnrpyw08m',
		qos: '0',
		qscs: [
			{
				coin_name: 'AOE', amount: '100'
			}
		]
	}
]).send()

promise.then(res => {
	console.log('----------')
	console.log('promise res:', res)
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
