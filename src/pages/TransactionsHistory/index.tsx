import { useBackButton } from '@/hooks/useBackButton.ts';
import { EmptyFilter } from '@/constants/icons.tsx';
import styles from './styles.module.scss';
import Header from '@/components/Header';

const TransactionHistory = () => {

  const isEmpty = true;

  useBackButton();

  return (
    <div className={styles.wrapper}>
      <Header />
      {isEmpty
        && (<div className={styles.isEmpty}>
          <EmptyFilter />
          <h4>Nothing found</h4>
        </div>)}
    </div>
  );
};

export default TransactionHistory;
