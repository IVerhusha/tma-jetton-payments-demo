import { Address, beginCell, Cell, Contract, ContractProvider, Sender, SendMode, Slice } from '@ton/core';

export type JettonWalletConfig = {
  ownerAddress: Address;
  minterAddress: Address;
  walletCode: Cell;
};

export class JettonWallet implements Contract {
  static readonly OPCODES = {
    TRANSFER: 0xf8a7ea5,
  };

  constructor(
    readonly address: Address,
  ) {
  }

  static createFromAddress(address: Address) {
    return new JettonWallet(address);
  }

  async sendTransfer(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      toAddress: Address;
      queryId?: number;
      fwdAmount: bigint;
      jettonAmount: bigint;
    } & ({
      forwardPayload?: Cell | Slice | null;
    } | {
      comment: string;
    }),
  ) {
    const builder = beginCell()
      .storeUint(JettonWallet.OPCODES.TRANSFER, 32)
      .storeUint(opts.queryId ?? 0, 64)
      .storeCoins(opts.jettonAmount)
      .storeAddress(opts.toAddress)
      .storeAddress(via.address)
      .storeUint(0, 1)
      .storeCoins(opts.fwdAmount);

    if ('comment' in opts) {
      const commentPayload = beginCell()
        .storeUint(0, 32)
        .storeStringTail(opts.comment)
        .endCell();

      builder.storeMaybeRef(commentPayload);
    } else {
      if (opts.forwardPayload instanceof Slice) {
        builder.storeSlice(opts.forwardPayload);
      } else {
        builder.storeMaybeRef(opts.forwardPayload);
      }
    }

    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: builder.endCell(),
    });
  }

  async getWalletData(provider: ContractProvider): Promise<{
    balance: bigint;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
  }> {
    const { stack } = await provider.get('get_wallet_data', []);

    return {
      balance: stack.readBigNumber(),
      ownerAddress: stack.readAddress(),
      jettonMasterAddress: stack.readAddress(),
      jettonWalletCode: stack.readCell(),
    };
  }
}
