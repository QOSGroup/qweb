var g = {
	'type': 'qbase/txs/stdtx',
	'value': {
		'itx': {
			'type': 'qos/txs/TransferTx', 'value': {
				'senders': [
					{
						'addr': 'address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay',
						'qos': '2',
						'qscs': [
							{
								'coin_name': 'AOE',
								'amount': '5'
							}
						]
					}
				],
				'receivers': [
					{
						'addr': 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
						'qos': '2',
						'qscs': [
							{
								'coin_name': 'AOE',
								'amount': '5'
							}
						]
					}
				]
			}
		}, 'sigature': [
			{
				'pubKey': {
					'type': 'tendermint/PubKeyEd25519',
					'value': 'Dsg0yaVqd4ZHezKHFVyHdzurrLaKS5Y0HTtqkZxZ78k='
				},
				'signature': 'JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==',
				'nonce': '7'
			}
		], 'chainid': 'qos-test',
		'maxgas': '0'
	}
}

var test = {
	"type": "qbase/txs/stdtx",
	"value": {
		"itx": {
			"type": "qos/txs/TxTransfer",
			"value": {
				"senders": [{
					"addr": "address13mjc3n3xxj73dhkju9a0dfr4lrfvv3whxqg0dy", "qos": "0", "qscs": [{ "coin_name": "AOE", "amount": "2" }]
				}],
				"receivers": [{
					"addr": "address13hkg8nva06hntmnhfupy29c2l9aq9zs879jhez", "qos": "0", "qscs": [{ "coin_name": "AOE", "amount": "2" }]
				}, {
					"addr": "address13hkg8nva06hntmnhfupy29c2l9aq9zs879jhez", "qos": "0", "qscs": [{ "coin_name": "AOE", "amount": "2" }]
				}]
			}
		}, "sigature": [{
			"pubkey": { "type": "tendermint/PubKeyEd25519", "value": "fDLjEW4zeLVCvKKx4iYB00fnp5Mcl3APIIla7KyETOE=" },
			"signature": "noiI1XrPRiw6UWTAuZb8XatNP0B8x8Dw0INvIsxH1PoAo3SbuwDQLX5kF8CCW9f335di87T3ZI5BsirsS9g9AA==",
			"nonce": "7"
		}], "chainid": "qos-test", "maxgas": "0"
	}
}


var mine = {
	"type": "qbase/txs/stdtx",
	"value": {
		"itx": {
			"type": "qos/txs/TxTransfer",
			"value": {
				"senders": [{
					"addr": "address13mjc3n3xxj73dhkju9a0dfr4lrfvv3whxqg0dy", "qos": "0", "qscs": [{ "coin_name": "AOE", "amount": "2" }]
				}],
				"receivers": [{
					"addr": "address13hkg8nva06hntmnhfupy29c2l9aq9zs879jhez", "qos": "0", "qscs": [{ "coin_name": "AOE", "amount": "2" }]
				}, {
					"addr": "address13hkg8nva06hntmnhfupy29c2l9aq9zs879jhez", "qos": "0", "qscs": [{ "coin_name": "AOE", "amount": "2" }]
				}]
			}
		}, "sigature": [{
			"pubKey": { "type": "tendermint/PubKeyEd25519", "value": "fDLjEW4zeLVCvKKx4iYB00fnp5Mcl3APIIla7KyETOE=" },
			"signature": "MZZlwJOYgGr4N5+Skzb1SRjEKqtSyf60WsOtsV47L7Fpj3jj87nPS/BhaJYfcjBTxRMPYckYPHUwT8qVmZIlBw==",
			"nonce": "7"
		}], "chainid": "qos-test", "maxgas": "0"
	}
}

var t = {
	"type": "qbase/txs/stdtx",
	"value": {
		"itx": {
			"type": "qos/txs/TransferTx",
			"value": {
				"senders": [
					{
						"addr": "address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay",
						"qos": 2,
						"qscs": 0
					}
				],
				"receivers": [
					{
						"addr": "address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355",
						"qos": 2,
						"qscs": 0
					}
				]
			}
		},
		"sigature": [
			{
				"pubKey": {
					"type": "tendermint/PubKeyEd25519",
					"value": "41jO3Ew9ilSWy019FQ5MiOspGN9/iKYXF9KjkbhH5zY="
				},
				"signature": "JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==",
				"nonce": 10
			}
		],
		"chainid": "qos-test",
		"maxgas": 0
	}
}


var t = {
	'type': 'qbase/txs/stdtx',
	'value': {
		'itx': {
			'type': 'qos/txs/TransferTx',
			'value': {
				'senders': [
					{
						'addr': 'address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay',
						'qos': '2',
						'qscs': null
					}
				],
				'receivers': [
					{
						'addr': 'address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355',
						'qos': '2',
						'qscs': null
					}
				]
			}
		},
		'sigature': [{
			'pubkey': {
				'type': 'tendermint/PubKeyEd25519',
				'value': 'E/LYBhSS6fgUlRC1tn00DRmf8k80yF27vX4N94Dppsw='
			},
			'signature': 'JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==',
			'nonce': '7'
		}],
		'chainid': 'qos-test', 'maxgas': '0'
	}
}

// : need to signdata % s 

// b3f67e6260e20beaefbdd223a13bc8539896d61c3257614e5da14a88514adc1995fd3447414e0b206432716f732d7465737400000000000000000000000000000007
// 16进制字符串
// from getHash256(公钥),Buffer.from(publicKey_hash256.slice(0, 20)),取前20位转换成 Hex 字符串即可
// to 同上（待定）
// from+32+to+32+chianid+nonce
// 将上面得到的值 ed25519 签名之后 得到 signature

// from: % s b3f67e6260e20beaefbdd223a13bc8539896d61c

// to: % s 57614e5da14a88514adc1995fd3447414e0b2064

// sign content: % s 
// 2544e4ff922d96abfb55f8c5c2f011684789880c5f3e14f89826db315705f8ccd82a4c57bb3f1ff8f61365e0c84345bcf7fb93cc1bd0a67e98d49f1cc9a09e06
// 2544e4ff922d96abfb55f8c5c2f011684789880c5f3e14f89826db315705f8ccd82a4c57bb3f1ff8f61365e0c84345bcf7fb93cc1bd0a67e98d49f1cc9a09e06

// 169af930979c7a5a25670f3bf4a50920249f4d964e8bb5d4ddaa4dc6cb8d4d6db08537bfabed0e37d4fb975a9d8c259b371aad02922bce0c002cd9975b26f508

// send --from=rpt3O80wAFI1+ZqNYt8DqJ5PaQ+foDq7G/InFfycoFYT8tgGFJLp+BSVELW2fTQNGZ/yTzTIXbu9fg33gOmmzA== 
// --to=address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355 
// --amount=2qos






var o = {
	"type": "qbase/account/QOSAccount",
	"value": {
		"base_account": {
			"account_address": "address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355",
			"public_key": {
				"type": "tendermint/PubKeyEd25519",
				"value": "va8Kjc8UCZUD4efbWaW0tRHSE+kxOTei+9rHvQVHvYs="
			}, "nonce": "0"
		},
		"qos": "68",
		"qscs": null
	}
}