import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackButton } from '@/hooks/useBackButton';
import { useMainButton } from '@/hooks/useMainButton';
import { InfoIcon } from '@/constants/icons.tsx';
import styles from './styles.module.scss';

const TransactionSent = () => {
  const navigate = useNavigate();

  useBackButton();

  const handleViewTransactionsHistory = useCallback(() => {
    navigate('/transactions-history');
  }, [navigate]);

  useMainButton({ text: 'Transactions history', onClick: handleViewTransactionsHistory });

  return (
    <div className={styles.wrapper}>
      <div className={styles.message}>
        <InfoIcon />
        <h2>Transaction sent</h2>
      </div>
    </div>
  );
};

export default TransactionSent;
