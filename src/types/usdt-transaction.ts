import { Address } from '@ton/core';

export type UsdtTransaction = {
  hash: string;
  orderId: string;
  fromAddress: Address;
  usdtAmount: bigint;
  timestamp: number;
  gasUsed: bigint;
  status: 'succeeded' | 'failed';
}
