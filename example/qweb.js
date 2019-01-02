// import QWeb from '../src/qweb'

const qweb = new QWeb({ chainId: 'capricorn-1000', baseUrl: 'http://106.14.178.99:1317' })

const promise = qweb.tx.from([
	{
		privateKey: 'privateKey1',
		addr: 'addr1',
		qos: '0',
		qscs: [
			{
				coin_name: 'AOE', amount: '100'
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
	}
]).send()

promise.then(res => {
	console.log('----------')
	console.log('promise res:', res)
})

