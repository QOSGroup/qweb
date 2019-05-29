// import QWeb from '../src/qweb'

const baseUrl = "http://qmoonapi.qoschain.info"
const qweb = new QWeb({ chainId: "capricorn-2000", baseUrl: baseUrl })

// qweb.account.get('addr1').then(res=>{

// 	console.log('-------------')
// 	console.log(res)
// })


const promise = qweb.tx.from([
	{
		privateKey: 'maD8NeYMqx6fHWHCiJdkV4/B+tDXFIpY4LX4vhrdmAYIKC67z/lpRje4NAN6FpaMBWuIjhWcYeI5HxMh2nTOQg==',
		addr: 'address1l7d3dc26adk9gwzp777s3a9p5tprn7m43p99cg',
		qos: '2',
		qscs: [{ coin_name: 'AOE', amount: '1' }]
	}
	// ,
	// {
	// 	privateKey: '31PlT2p6UICjV63dG7Nh3Mh9W0b+7FAEU+KOAxyNbZ29rwqNzxQJlQPh59tZpbS1EdIT6TE5N6L72se9BUe9iw==',
	// 	addr: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
	// 	qos: '0',
	// 	qscs: [{ coin_name: 'AOE', amount: '1' }]
	// }
]).to([
	// {
	// 	addr: 'address1zsqzn6wdecyar6c6nzem3e8qss2ws95csr8d0r',
	// 	qos: '0',
	// 	qscs: [{ coin_name: 'AOE', amount: '1' }]
	// },
	{
		addr: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
		qos: '2',
		qscs: [{ coin_name: 'AOE', amount: '1' }]
	}
]).send()

// promise.then(res => {
// 	console.log('----------')
// 	console.log('promise res:', res)
// })


