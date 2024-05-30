import { Address, TonClient, Transaction } from "@ton/ton";
import { useEffect, useState } from "react";
import { isUUID } from "@/helpers/common-helpers.ts";
import { UsdtTransaction } from "@/types/usdt-transaction.ts";
import { AccountSubscriptionService } from "@/services/account-subscription.service.ts";

function parseUsdtPayload(tx: Transaction): UsdtTransaction | undefined {
  try {
    if (tx.inMessage?.info.type !== 'internal' || tx.description.type !== 'generic' || tx.description.computePhase?.type !== 'vm') {
      return;
    }

    const slice = tx.inMessage.body.beginParse();
    const opcode = slice.loadUint(32);
    if (opcode !== 0x178d4519) { // jetton internal transfer
      return;
    }

    const queryId = slice.loadUint(64);
    const jettonAmount = slice.loadCoins();
    const fromAddress = slice.loadAddress();
    const responseAddress = slice.loadAddress();
    const forwardTonAmount = slice.loadCoins();
    const forwardPayload = slice.loadMaybeRef();
    if (!forwardPayload) {
      return;
    }

    const payloadSlice = forwardPayload.beginParse();

    const payloadOpcode = payloadSlice.loadUint(32);
    if (payloadOpcode !== 0) {
      return;
    }

    const comment = payloadSlice.loadStringTail();
    if (!isUUID(comment)) {
      return;
    }

    return {
      status: tx.description.computePhase.success ? 'succeeded' : 'failed',
      hash: tx.hash().toString('hex'),
      usdtAmount: jettonAmount,
      gasUsed: tx.totalFees.coins,
      toAddress: undefined,
      orderId: comment,
      timestamp: tx.inMessage.info.createdAt,
      fromAddress,
    };
  } catch {
    return;
  }
}

// TODO: ??? fix?
const appStartTime = Date.now() / 1000;

export function useUsdtTransactions(client?: TonClient, address?: Address): UsdtTransaction[] {
  const [transactions, setTransactions] = useState<UsdtTransaction[]>([]);

  useEffect(() => {
    if (!client || !address) {
      return;
    }

    const accountSubscriptionService = new AccountSubscriptionService(client, address, (txs) => {
      const newUsdtTransactions = txs.map(parseUsdtPayload).filter((tx): tx is UsdtTransaction => tx !== undefined);
      setTransactions((oldTxs) => [
        ...newUsdtTransactions,
        ...oldTxs,
      ]);
    }, appStartTime);

    const intervalId = accountSubscriptionService.start();
    return () => {
      clearInterval(intervalId);
    };
  }, [client, address]);

  return transactions;
}
