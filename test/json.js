var g = {
    "type": "qbase/txs/stdtx",
    "value": {
        "itx": {
            "type": "qos/txs/TransferTx", "value": {
                "senders": [
                    {
                        "addr": "address1k0m8ucnqug974maa6g36zw7g2wvfd4sug6uxay",
                        "qos": "2",
                        "qscs": "0"
                    }
                ],
                "receivers": [
                    {
                        "addr": "address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355",
                        "qos": "2",
                        "qscs": "0"
                    }
                ]
            }
        }, "sigature": [
            {
                "pubKey": {
                    "type": "tendermint/PubKeyEd25519",
                    "value": "Dsg0yaVqd4ZHezKHFVyHdzurrLaKS5Y0HTtqkZxZ78k="
                },
                "signature": "JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==",
                "nonce": "7"
            }
        ], "chainid": "qos-test",
        "maxgas": "0"
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
                        "qos": "2",
                        "qscs": null
                    }
                ],
                "receivers": [
                    {
                        "addr": "address12as5uhdpf2y9zjkurx2l6dz8g98qkgryc4x355",
                        "qos": "2",
                        "qscs": null
                    }
                ]
            }
        },
        "sigature": [{
            "pubkey": {
                "type": "tendermint/PubKeyEd25519",
                "value": "E/LYBhSS6fgUlRC1tn00DRmf8k80yF27vX4N94Dppsw="
            },
            "signature": "JUTk/5Itlqv7VfjFwvARaEeJiAxfPhT4mCbbMVcF+MzYKkxXuz8f+PYTZeDIQ0W89/uTzBvQpn6Y1J8cyaCeBg==",
            "nonce": "7"
        }],
        "chainid": "qos-test", "maxgas": "0"
    }
}

// : need to signdata % s 

// b3f67e6260e20beaefbdd223a13bc8539896d61c3257614e5da14a88514adc1995fd3447414e0b206432716f732d7465737400000000000000000000000000000007
// 16进制字符串
// from+32+to+32+chianid+none
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
    "type": "shareledger/AuthTx",
    "value": {
        "msg": {
            "type": "shareledger/bank/MsgSend",
            "value": {
                "nonce": "10",
                "from": "1234567",
                "to": "2345678",
                "amount": {
                    "denom": "SHR",
                    "amount": "10"
                }
            }
        }, "signature": {
            "pubKey": {
                "type": "shareledger/PubSecp256k1",
                "value": "BEKZrPS2oJw28meokkVZtZ+gbF0+Kl38BOg4sBVGxhIwKnzhATQeSI4vVyzZcYMUdZsX4i92C4yyxw2d5WnEwaE="
            },
            "signature": {
                "type": "shareledger/SigSecp256k1",
                "value": "MEQCIGUSdz4zUrSkmvhIE5mmdDWC57Teksm6oV3YwjRHq9oAAiBiOYOsLSNcqEaxCrSzIQuGKOU8WCULdXSbg5Jn7LA1ag=="
            },
            "nonce": "10"
        }
    }
}

