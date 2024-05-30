import { useBackButton } from '@/hooks/useBackButton.ts';
import { useUsdtTransactions } from "@/hooks/useUsdtTransactions.ts";
import { useApp } from "@/context/app-context.tsx";
import { USDT_INVOICE_WALLET } from "@/constants/common-constants.ts";

const Transaction = () => {
  const { cart, setCart, addProduct, removeProduct, tonClient } = useApp();
  useBackButton();

  const transactions = useUsdtTransactions(tonClient, USDT_INVOICE_WALLET);

  return (
    <div>
      // TODO:
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
