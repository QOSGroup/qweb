// import QWeb from '../src/qweb'

const qweb = new QWeb({ chainId: 'qos-test', baseUrl: 'http://192.168.1.223:1317' })

qweb.account.get('addr1').then(res=>{

	console.log('-------------')
	console.log(res)
})


const promise = qweb.tx.from([
	{
		privateKey: 'privateKey1',
		addr: 'addr1',
		qos: '1',
		qscs: [
			{ coin_name: 'AOE', amount: '1' }
		]
	},
	{
		privateKey: 'privateKey2',
		addr: 'addr2',
		qos: '1',
		qscs: []
	}
]).to([
	{
		addr: 'addr3',
		qos: '1',
		qscs: [{ coin_name: 'AOE', amount: '1' }]
	},
	{
		addr: 'addr4',
		qos: '1'
	}
]).send()

promise.then(res => {
	console.log('----------')
	console.log('promise res:', res)
})


