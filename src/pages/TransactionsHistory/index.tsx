import { useBackButton } from '@/hooks/useBackButton.ts';
import { useUsdtTransactions } from "@/hooks/useUsdtTransactions.ts";
import { useApp } from "@/context/app-context.tsx";
import { INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS } from "@/constants/common-constants.ts";
import { useJettonAddress } from "@/hooks/useJettonAddress.ts";
import { EmptyFilter } from '@/constants/icons.tsx';
import Header from '@/components/Header';
import TransactionItem from '@/components/TransactionItem';
import styles from './styles.module.scss';

const Transaction = () => {
  const { tonClient } = useApp();
  useBackButton();
  const isEmpty = true;
  const usdtWalletAddress = useJettonAddress(INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS, tonClient);
  const transactions = useUsdtTransactions(tonClient, usdtWalletAddress);

  return (
    <div className={styles.wrapper}>
      <Header />
      {isEmpty
        ? (<div className={styles.isEmpty}>
          <EmptyFilter />
          <h4>Nothing found</h4>
        </div>) :
        (transactions.map(tx => (<TransactionItem key={tx.hash} tx={tx} />)))}
    </div>
  );
};

export default Transaction;
