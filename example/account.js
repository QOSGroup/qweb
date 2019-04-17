
const baseUrl = "http://qmoonapi.qoschain.info"
const qweb = new QWeb({ chainId: "capricorn-2000", baseUrl: baseUrl })

//const qweb = new QWeb({ chainId: 'qos-test', baseUrl: 'http://192.168.1.223:1317' })

const newAccount = qweb.newAccount()
console.log('--------------------------------------')
console.log(newAccount)
console.log('--------------------------------------')

const mn = 'milk garden scare goat sketch laundry teach rival loyal double cotton renew giraffe spend web amused vault snake emerge beauty suffer kitten surface level'

const recoveryAccount = qweb.recoveryAccountByMnemonic(mn)
console.log(recoveryAccount)
console.log('--------------------------------------')

const rAccount = qweb.recoveryAccountByPrivateKey('JcoHX1Oeuvo1coS7nTukw1Km24YbFTccQMpAof/ZEhH2i2uznasYVD/U7oKYN4eL5JT9syYSh+KBmgTffinyNg==')
console.log(rAccount)
console.log('--------------------------------------')

qweb.account.get('address1pcjs0t9m9vl7vejwttuc2fzfgnutndnrpyw08m').then(res=>{
	console.log(res)
})
