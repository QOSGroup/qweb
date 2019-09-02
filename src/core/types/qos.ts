import { TypeFactory, Types } from 'js-amino'

export const qosDecimal = 10000

export const StdTx = TypeFactory.create('StdTx', [
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
	}
])

export const MsgMultiSend = TypeFactory.create('MsgMultiSend', [
	{
		name: 'senders',
		type: Types.ArrayStruct
	},
	{
		name: 'receivers',
		type: Types.ArrayStruct
	}
])

export const PubKeyEd25519 = TypeFactory.create('PubKeyEd25519', [
	{
		name: 's',
		type: Types.ByteSlice
	}], Types.ByteSlice
)

export const Sender = TypeFactory.create('Sender', [
	{
		name: 'addr',
		type: Types.String
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
		type: Types.String
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

export const QSC = TypeFactory.create('qsc', [
	{
		name: 'coin_name',
		type: Types.String
	},
	{
		name: 'amount',
		type: Types.String
	}
])

export const Signature = TypeFactory.create('signature', [
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
		type: Types.Int64
	}
])
