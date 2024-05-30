import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JettonMaster } from '@ton/ton';
import { toNano } from '@ton/core';
import { useMainButton } from '@/hooks/useMainButton';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { useApp } from '@/context/app-context.tsx';
import CartItem from '@/components/CartItem';
import { useBackButton } from '@/hooks/useBackButton.ts';
import { useTonConnect } from '@/hooks/useTonConnect.ts';
import { JettonWallet } from '@/wrappers/JettonWallet.ts';
import { calculateUsdtAmount } from '@/helpers/common-helpers.ts';
import { INVOICE_WALLET_ADDRESS, USDT_MASTER_ADDRESS } from '@/constants/common-constants.ts';
import { useGenerateId } from '@/hooks/useGenerateId.ts';
import Header from '@/components/Header';
import styles from './styles.module.scss';

const Cart = () => {
  const { cart, setCart, addProduct, removeProduct, tonClient } = useApp();
  const navigate = useNavigate();
  const { open } = useTonConnectModal();
  const orderId = useGenerateId();
  const { sender, walletAddress } = useTonConnect();

  useBackButton();
  const totalCost = (Math.round(Object.values(cart).reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0) * 100) / 100);

  const handleCompletePayment = useCallback(async () => {
    console.log(tonClient);
    try {
      if (!tonClient || !walletAddress) return;

      const jettonMaster = tonClient.open(JettonMaster.create(USDT_MASTER_ADDRESS));
      const usersUsdtAddress = await jettonMaster.getWalletAddress(walletAddress);

      const jettonWallet = tonClient.open(JettonWallet.createFromAddress(usersUsdtAddress));

      const res = await jettonWallet.sendTransfer(sender, {
        fwdAmount: 1n,
        comment: orderId,
        jettonAmount: calculateUsdtAmount(totalCost * 100),
        toAddress: INVOICE_WALLET_ADDRESS,
        value: toNano('0.038'), // will be enough?
      });
      console.log(res);
      navigate('/transaction-success');
      setCart({});
      console.log(`See transaction at https://testnet.tonviewer.com/${usersUsdtAddress.toString()}`);
    } catch (error) {
      console.log('Error during transaction check:', error);
    }
  }, [tonClient, walletAddress, sender, orderId, totalCost, setCart, navigate]);

  const handleConnectWallet = useCallback(() => {
    open();
  }, [open]);

  useMainButton(walletAddress
    ? { text: 'Complete payment', onClick: handleCompletePayment }
    : { text: 'Connect wallet', onClick: handleConnectWallet });

  useEffect(() => {
    if (!Object.keys(cart).length) {
      navigate('/');
    }
  }, [cart, navigate]);


  return (
    <div className={styles.wrapper}>
      <Header />
      {Object.values(cart).map(product => (
        <CartItem
          product={cart[product.id]}
          key={product.id}
          onAddProduct={addProduct}
          onRemoveProduct={removeProduct}
        />
      ))}
      <div>Total: ${totalCost.toFixed(2)}</div>
    </div>
  );
};

export default Cart;
