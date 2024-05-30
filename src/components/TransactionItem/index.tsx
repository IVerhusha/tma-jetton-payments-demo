import clsx from 'clsx';
import { UsdtTransaction } from '@/types/usdt-transaction.ts';
import { calculateUsdFromUsdt } from '@/helpers/common-helpers.ts';
import { useUtils } from '@tma.js/sdk-react';
import { useTonConnect } from '@/hooks/useTonConnect.ts';
import { CHAIN } from '@tonconnect/ui-react';
import styles from './styles.module.scss';


type Props = {
  tx: UsdtTransaction
}

const TransactionItem = ({ tx }: Props) => {
  const { network } = useTonConnect();
  const utils = useUtils();
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button
            className={styles.link}
            onClick={() => utils.openLink(`https://${network === CHAIN.TESTNET ? 'testnet.' : ''}tonviewer.com/transaction/${tx.hash}`)}
          >
            See transaction
          </button>
          <div className={clsx(styles.label, { [styles.failed]: tx.status === 'failed' })}>{tx.status}</div>
        </div>
        <p>Price: ${calculateUsdFromUsdt(tx.usdtAmount).toString()}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
