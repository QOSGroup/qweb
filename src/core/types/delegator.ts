import { TypeFactory, Types } from 'js-amino'

export const ITX = TypeFactory.create('ITX', [
	{
		name: 'Delegator',
		type: Types.String
  },
  {
    name: 'ValidatorOwner',
    type: Types.String
  },
	{
		name: 'Amount',
		type: Types.Int64
	},
	{
		name: 'IsCompound',
		type: Types.Boolean
	}
])

export const UnbondITX = TypeFactory.create('UnbondITX', [
	{
		name: 'Delegator',
		type: Types.String
  },
  {
    name: 'ValidatorOwner',
    type: Types.String
  },
	{
		name: 'UnbondAmount',
		type: Types.Int64
	},
	{
		name: 'IsUnbondAll',
		type: Types.Boolean
	}
])