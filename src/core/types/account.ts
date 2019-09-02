import { TypeFactory, Types } from 'js-amino'

export const QOSAccount = TypeFactory.create('QOSAccount', [
  {
    name: 'base_account',
    type: Types.Struct
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


export const BaseAccount = TypeFactory.create('base_account', [
	{
		name: 'account_address',
		type: Types.String
	},
  {
		name: 'public_key',
		type: Types.Interface
	},
  {
    name: 'nonce',
    type: Types.Int64
  }
])
