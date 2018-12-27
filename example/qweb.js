import QWeb from '../src/model/qweb'

const qweb = new QWeb({ chainId: 'qos-test', baseUrl: 'http://' })

const privateKey = 'rpt3O80wAFI1+ZqNYt8DqJ5PaQ+foDq7G/InFfycoFYT8tgGFJLp+BSVELW2fTQNGZ/yTzTIXbu9fg33gOmmzA=='


qweb.tx.from([{ addr: 'address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay', qos: 10, qscs: { coin_name: 'AOE', amount: 5 } }])
	.to([{ addr: 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355', qos: 10, qscs: { coin_name: 'AOE', amount: 5 } }])
	.sign(privateKey)