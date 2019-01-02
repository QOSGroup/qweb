// import QWeb from '../src/qweb'

// import {
// 	encodeBase64,
// 	// decodeBase64
// } from 'tweetnacl-util'

const qweb = new QWeb({ chainId: 'qos-test', baseUrl: 'http://192.168.1.223:1317' })

qweb.account.get('address13mjc3n3xxj73dhkju9a0dfr4lrfvv3whxqg0dy').then(res=>{

	console.log('-------------')
	console.log(res)
})


const promise = qweb.tx.from([
	{
		privateKey: 'Ey+2bNFF2gTUV6skSBgRy3rZwo9nS4Dw0l2WpLrhVvV8MuMRbjN4tUK8orHiJgHTR+enkxyXcA8giVrsrIRM4Q==',
		addr: 'address13mjc3n3xxj73dhkju9a0dfr4lrfvv3whxqg0dy',
		qos: '1',
		qscs: [
			{ coin_name: 'AOE', amount: '1' }
		]
	},
	{
		privateKey: '31PlT2p6UICjV63dG7Nh3Mh9W0b+7FAEU+KOAxyNbZ29rwqNzxQJlQPh59tZpbS1EdIT6TE5N6L72se9BUe9iw==',
		addr: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
		qos: '1',
		qscs: []
	}
]).to([
	{
		addr: 'address13hkg8nva06hntmnhfupy29c2l9aq9zs879jhez',
		qos: '1',
		qscs: [{ coin_name: 'AOE', amount: '1' }]
	},
	{
		addr: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
		qos: '1'
	}
]).send()

promise.then(res => {
	console.log('----------')
	console.log('promise res:', res)
})


