import { JettonMaster, Transaction } from '@ton/ton';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isUUID } from '@/helpers/common-helpers.ts';
import { UsdtTransaction } from '@/types/usdt-transaction.ts';
import { AccountSubscriptionService } from '@/services/account-subscription.service.ts';
import { INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS } from '@/constants/common-constants.ts';
import { useApp } from '@/context/app-context.tsx';

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

    slice.loadUint(64);
    const jettonAmount = slice.loadCoins();
    const fromAddress = slice.loadAddress();
    slice.loadAddress();
    slice.loadCoins();
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


export const useUsdtTransactions = (): UsdtTransaction[] => {
  const { tonClient } = useApp();

  const [transactions, setTransactions] = useState<UsdtTransaction[]>([]);
  const intervalId = useRef<number | null>(null)

  const launchSubscriptionService = useCallback(async () => {
    if (!tonClient) return
    const jettonMaster = tonClient.open(JettonMaster.create(USDT_MASTER_ADDRESS));
    const address = await jettonMaster.getWalletAddress(INVOICE_WALLET_ADDRESS)
    const accountSubscriptionService = new AccountSubscriptionService(tonClient, address, (txs) => {
      const newUsdtTransactions = txs.map(parseUsdtPayload).filter((tx): tx is UsdtTransaction => tx !== undefined);
      setTransactions((oldTxs) => [
        ...newUsdtTransactions,
        ...oldTxs,
      ]);
    });

    intervalId.current = accountSubscriptionService.start();
  }, [tonClient])

  useEffect(() => {
    launchSubscriptionService().catch(null);

    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    };
  }, [launchSubscriptionService]); // double render in dev mode

  return transactions;
}
