let { TypeFactory, Types } = require('../lib/Js-Amino/src')

export default {
	AuthTx: TypeFactory.create('AuthTx', [
		{
			name: 'itx',
			type: Types.Interface
		},
		{
			name: 'sigature',
			type: Types.ArrayStruct
		}, {
			name: 'chainid',
			type: Types.String
		},
		{
			name: 'maxgas',
			type: Types.String
			// type: Types.Int8
		}
	]),
	ITX: TypeFactory.create('ITX', [
		{
			name: 'senders',
			type: Types.ArrayStruct
		},
		{
			name: 'receivers',
			type: Types.ArrayStruct
		}
	]),
	PubKeyEd25519: TypeFactory.create('PubKeyEd25519', [
		{
			name: 'a',
			type: Types.ByteSlice
		}], Types.ByteSlice
	),
	Sender: TypeFactory.create('Sender', [
		{
			name: 'addr',
			type: Types.String
		},
		{
			name: 'qos',
			type: Types.String
			// type: Types.Int8
		},
		{
			name: 'qscs',
			type: Types.ArrayStruct
		}
	]),
	Receiver: TypeFactory.create('Receiver', [
		{
			name: 'addr',
			type: Types.String
		},
		{
			name: 'qos',
			type: Types.String
			// type: Types.Int8
		},
		{
			name: 'qscs',
			type: Types.ArrayStruct
		}
	]),
	QSC: TypeFactory.create('qsc', [
		{
			name: 'coin_name',
			type: Types.String
		},
		{
			name: 'amount',
			type: Types.String
			// type: Types.Int8
		}
	]),
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
			type: Types.String
			// type: Types.Int8
		}
	])
}