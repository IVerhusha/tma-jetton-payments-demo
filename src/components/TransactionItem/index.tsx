import { UsdtTransaction } from '@/types/usdt-transaction.ts';
import { calculateUsdFromUsdt } from '@/helpers/common-helpers.ts';
import styles from './styles.module.scss';
import { useUtils } from '@tma.js/sdk-react';
import { useTonConnect } from '@/hooks/useTonConnect.ts';
import { CHAIN } from '@tonconnect/ui-react';


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
        <p>Gas used {tx.gasUsed.toString()}</p>
        <p>UsdtAmount {calculateUsdFromUsdt(tx.usdtAmount).toString()}</p>
        <p>OrderId {tx.orderId}</p>
        {/*<p>ToAddress {tx.toAddress?.toString() ?? USDT_INVOICE_WALLET.toString()}</p>*/}
        {/*<p>FromAddress {tx.fromAddress.toString()}</p>*/}
        <p>TS {tx.timestamp}</p>
        <p>Status {tx.status}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
