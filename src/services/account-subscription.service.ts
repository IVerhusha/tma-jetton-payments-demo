import { Address, TonClient, Transaction } from "@ton/ton";
import { retry } from "@/helpers/common-helpers.ts";

export class AccountSubscriptionService {
  constructor(
    readonly client: TonClient,
    readonly accountAddress: Address,
    readonly onTransactions: (txs: Transaction[]) => Promise<void> | void,
  ) {
  }

  private lastIndexedLt?: string;
  private lastTransactionHash?: string;

  async getTransactionsBatch() {
    const transactions = await retry(() => this.client.getTransactions(this.accountAddress, {
      lt: this.lastIndexedLt,
      limit: 100,
      hash: this.lastTransactionHash,
      archival: true,
    }), { retries: 10, delay: 1000 });

    if (transactions.length === 0) {
      return { hasMore: false, transactions };
    }

    const lastTransaction = transactions.at(-1)!;
    this.lastIndexedLt = lastTransaction.lt.toString();
    this.lastTransactionHash = lastTransaction.hash().toString('base64');

    return { hasMore: true, transactions };
  }

  async subscribeToTransactionUpdate(): Promise<void> {
    let hasMore = true;

    while (hasMore) {
      const res = await this.getTransactionsBatch();

      hasMore = res.hasMore;
      if (res.transactions.length > 0) {
        await this.onTransactions(res.transactions);
      }
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
