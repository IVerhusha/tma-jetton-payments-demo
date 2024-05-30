import { useBackButton } from '@/hooks/useBackButton.ts';
import { useUsdtTransactions } from "@/hooks/useUsdtTransactions.ts";
import { useApp } from "@/context/app-context.tsx";
import { USDT_INVOICE_WALLET } from "@/constants/common-constants.ts";
import { EmptyFilter } from '@/constants/icons.tsx';
import styles from './styles.module.scss';
import Header from '@/components/Header';

const Transaction = () => {
  const { cart, setCart, addProduct, removeProduct, tonClient } = useApp();
  useBackButton();
  const isEmpty = true;
  const transactions = useUsdtTransactions(tonClient, USDT_INVOICE_WALLET);

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
        <p>ToAddress {tx.toAddress?.toString() ?? USDT_INVOICE_WALLET.toString()}</p>
        <p>FromAddress {tx.fromAddress.toString()}</p>
        <p>TS {tx.timestamp}</p>
        <p>Status {tx.status}</p>
      </div>))}
    </div>
  );
};

export default Transaction;
