const { TypeFactory, Types } = require('js-amino') 
// import { TypeFactory, Types } from '../lib/js-amino/src'

export const TxStd = TypeFactory.create('TxStd', [
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
		type: Types.Int64
	}
])

export const TxTransfer = TypeFactory.create('TxTransfer', [
	{
		name: 'senders',
		type: Types.ArrayStruct
	},
	{
		name: 'receivers',
		type: Types.ArrayStruct
	}
])

export const Signature = TypeFactory.create('Signature', [
	{
		name: 'pubkey',
		type: Types.Interface
	},
	{
		name: 'signature',
		type: Types.ByteSlice
	},
	{
		name: 'nonce',
		type: Types.String
	}
])

export const Sender = TypeFactory.create('Sender', [
	{
		name: 'addr',
		type: Types.ByteSlice
	},
	{
		name: 'qos',
		type: Types.String
	},
	{
		name: 'qscs',
		type: Types.ArrayStruct
	}
])

export const Receiver = TypeFactory.create('Receiver', [
	{
		name: 'addr',
		type: Types.ByteSlice
	},
	{
		name: 'qos',
		type: Types.Int64
	},
	{
		name: 'qscs',
		type: Types.ArrayStruct
	}
])

export const QSC = TypeFactory.create('qsc', [
	{
		name: 'coin_name',
		type: Types.String
	},
	{
		name: 'amount',
		type: Types.Int64
	}
])

export const PubKeyEd25519 = TypeFactory.create('PubKeyEd25519', [
	{
		name: 'a',
		type: Types.ByteSlice
	}], Types.ByteSlice
)