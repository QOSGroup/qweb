let {
	TypeFactory,
	Types
} = require('../lib/Js-Amino/src/index')

export default {
	AuthTx: TypeFactory.create('AuthTx', [
		{
			name: 'itx',
			type: Types.Interface
		},
		{
			name: 'sigature',
			type: Types.Array
		}, {
			name: 'chainid',
			type: Types.String
		},
		{
			name: 'maxgas',
			type: Types.Int8
		}
	]),
	ITX: TypeFactory.create('ITX', [
		{
			name: 'senders',
			type: Types.Array
		},
		{
			name: 'receivers',
			type: Types.Array
		}
	]),
	Sender: TypeFactory.create('Sender', [
		{
			name: 'addr',
			type: Types.String
		},
		{
			name: 'qos',
			type: Types.Int8
		},
		{
			name: 'qscs',
			type: Types.Int8
		}
	]),
	Receiver: TypeFactory.create('Receiver', [
		{
			name: 'addr',
			type: Types.String
		},
		{
			name: 'qos',
			type: Types.Int8
		},
		{
			name: 'qscs',
			type: Types.Int8
		}
	]),
	PubKeyEd25519: TypeFactory.create('PubKeyEd25519', [
		{
			name: 'a',
			type: Types.ByteSlice
		}],
	Types.ByteSlice
	),
	Signature: TypeFactory.create('Signature', [
		{
			name: 'pubKey',
			type: Types.Interface
		},
		{
			name: 'signature',
			type: Types.String
		},
		{
			name: 'nonce',
			type: Types.Int8
		}
	])
}