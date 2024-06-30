import { Address, TonClient, Transaction } from '@ton/ton';
import { retry } from '@/helpers/common-helpers.ts';

export class AccountSubscriptionService {
  constructor(
    readonly client: TonClient,
    readonly accountAddress: Address,
    readonly onTransactions: (txs: Transaction[]) => Promise<void> | void,
  ) {
  }

  private lastIndexedLt?: string;

  async getTransactionsBatch(toLt?: string, lt?: string, hash?: string) {
    const transactions = await retry(() => this.client.getTransactions(this.accountAddress, {
      lt,
      limit: 100,
      hash,
      to_lt: toLt,
      inclusive: false,
      archival: true,
    }), { retries: 10, delay: 1000 });

    if (transactions.length === 0) {
      return { hasMore: false, transactions };
    }

    const lastTransaction = transactions.at(-1)!;

    return {
      hasMore: true,
      transactions,
      lt: lastTransaction.lt.toString(),
      hash: lastTransaction.hash().toString('base64'),
    };
  }

  async subscribeToTransactionUpdate(): Promise<void> {
    let iterationStartLt: string = '';
    let hasMore = true;
    let lt: string | undefined;
    let hash: string | undefined;

    while (hasMore) {
      const res = await this.getTransactionsBatch(this.lastIndexedLt, lt, hash);
      hasMore = res.hasMore;
      lt = res.lt;
      hash = res.hash;

      if (res.transactions.length > 0) {
        if (!iterationStartLt) {
          iterationStartLt = res.transactions[0].lt.toString();
        }

        await this.onTransactions(res.transactions);
      }
    }

    if (iterationStartLt) {
      this.lastIndexedLt = iterationStartLt;
    }
  }

  start(): number {
    let isProcessing = false;
    const tick = async () => {
      if (isProcessing) return;
      isProcessing = true;

      await this.subscribeToTransactionUpdate();

      isProcessing = false;
    };

    const intervalId = setInterval(tick, 10 * 1000);
    tick();

    return intervalId;
  }
}
