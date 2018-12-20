import QOSWeb from '../src'
import defaultConfig from '../src/config'

const expect = chai.expect

describe('[create the qosweb]',  ()=>{
	it('create with default config', ()=>{
		const qosweb = new QOSWeb()
		expect(qosweb).not.null
		expect(qosweb.config.chainId).to.equal(defaultConfig.chainId)
		expect(qosweb.config.HTTPAPINode).to.equal(defaultConfig.HTTPAPINode)
	})
})

describe('[validation for account]',  ()=>{
	it('is valid account?', ()=>{
		const qosweb = new QOSWeb()
		expect(qosweb.isValidAccount('adress0000')).to.equal(true)
	})
})