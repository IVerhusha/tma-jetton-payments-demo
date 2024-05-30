import { useBackButton } from '@/hooks/useBackButton.ts';
import { useUsdtTransactions } from "@/hooks/useUsdtTransactions.ts";
import { useApp } from "@/context/app-context.tsx";
import { INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS } from "@/constants/common-constants.ts";
import { useJettonAddress } from "@/hooks/useJettonAddress.ts";
import styles from './styles.module.scss';
import Header from '@/components/Header';
import { EmptyFilter } from '@/constants/icons.tsx';

const Transaction = () => {
  const { tonClient } = useApp();
  useBackButton();
  const isEmpty = true;
  const usdtWalletAddress = useJettonAddress(INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS, tonClient);
  const transactions = useUsdtTransactions(tonClient, usdtWalletAddress);

  return (
    <div>
      <div className={styles.wrapper}>
        <Header />
        {isEmpty
          && (<div className={styles.isEmpty}>
            <EmptyFilter />
            <h4>Nothing found</h4>
          </div>)}
      </div>
      {transactions.map(tx => (<div>
        <br/>
        <h3>TRANSACTION {tx.hash}</h3>
        <p>Gas used {tx.gasUsed.toString()}</p>
        <p>UsdtAmount {tx.usdtAmount.toString()}</p>
        <p>OrderId {tx.orderId}</p>
        <p>ToAddress {tx.toAddress?.toString() ?? INVOICE_WALLET_ADDRESS.toString()}</p>
        <p>FromAddress {tx.fromAddress.toString()}</p>
        <p>TS {tx.timestamp}</p>
        <p>Status {tx.status}</p>
      </div>))}
    </div>
  );
};

export default Transaction;
