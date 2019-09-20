import { TypeFactory, Types } from 'js-amino';

export const ApproveITX = TypeFactory.create('ApproveITX', [
  {
    name: 'Approve',
    type: Types.Struct
  }
]);

export const Approve = TypeFactory.create('Approve', [
  {
    name: 'from',
    type: Types.String
  },
  {
    name: 'to',
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
]);
