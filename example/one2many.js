// import QWeb from '../src/qweb'

const baseUrl = "http://qmoonapi.qoschain.info"
const qweb = new QWeb({ chainId: "capricorn-2000", baseUrl: baseUrl })

const promise = qweb.tx.from([
	{
		privateKey: 'privateKey1',
		addr: 'addr1',
		qos: '0',
		qscs: [
			{
				coin_name: 'AOE', amount: '200'
			}
		]
	}
]).to([
	{
		addr: 'addr2',
		qos: '0',
		qscs: [
			{
				coin_name: 'AOE', amount: '100'
			}
		]
	},
	{
		addr: 'addr3',
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

