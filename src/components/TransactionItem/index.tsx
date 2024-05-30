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
        <button
          className={styles.link}
          onClick={() => utils.openLink(`https://${network === CHAIN.TESTNET ? 'testnet.' : ''}tonviewer.com/transaction/${tx.hash}`)}
        >
          See transaction
        </button>
        <p>Price: ${calculateUsdFromUsdt(tx.usdtAmount).toString()}</p>
        <p>Status: <span className={clsx(styles.label, {[styles.failed]: tx.status === 'failed'})}>{tx.status}</span></p>
      </div>
    </div>
);
};

export default TransactionItem;
