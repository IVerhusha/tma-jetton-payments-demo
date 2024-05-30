import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsdtTransaction } from '@/types/usdt-transaction.ts';
import { useBackButton } from '@/hooks/useBackButton.ts';
import { useUsdtTransactions } from '@/hooks/useUsdtTransactions.ts';
import { useMainButton } from '@/hooks/useMainButton.ts';
import { EmptyFilter } from '@/constants/icons.tsx';
import Header from '@/components/Header';
import TransactionItem from '@/components/TransactionItem';
import styles from './styles.module.scss';

const groupByDate = (transactions: UsdtTransaction[]) => {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.timestamp * 1000).toISOString().split('T')[0]; // Converting timestamp to date string (yyyy-mm-dd)
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as Record<string, UsdtTransaction[]>);
};

const Transaction = () => {
  const navigate = useNavigate();
  useBackButton();
  const transactions = useUsdtTransactions();
  const isEmpty = !transactions.length;

  const groupedTransactions = useMemo(() => groupByDate(transactions), [transactions]);

  useMainButton({ text: 'Go to shop', onClick: () => navigate('/') });

  return (
    <div className={styles.wrapper}>
      <Header />
      {isEmpty
        ? (<div className={styles.isEmpty}>
          <EmptyFilter />
          <h4>Nothing found</h4>
        </div>) :
        (Object.keys(groupedTransactions).map(date => (
          <div key={date} className={styles.block}>
            <h4>{date}</h4>
            <div className={styles.transactions}>
              {groupedTransactions[date].map(tx => (
                <TransactionItem key={tx.hash} tx={tx} />
              ))}
            </div>
          </div>
        )))}
    </div>
  );
};

export default Transaction;
