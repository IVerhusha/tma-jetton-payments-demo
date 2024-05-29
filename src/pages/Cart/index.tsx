import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from '@ton/core';
import { useMainButton } from '@/hooks/useMainButton';
import { useTonAddress, useTonConnectModal, useTonConnectUI } from '@tonconnect/ui-react';
import { useApp } from '@/context/app-context.tsx';
import CartItem from '@/components/CartItem';
import Header from '@/components/Header';
import { useBackButton } from '@/hooks/useBackButton.ts';
import styles from './styles.module.scss';


const Cart = () => {
  const { cart, addProduct, removeProduct } = useApp();

  const navigate = useNavigate();
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();

  useBackButton();

  const handleCompletePayment = useCallback(async () => {
    try {
      await tonConnectUI.sendTransaction({
        // The transaction is valid for 10 minutes from now, in unix epoch seconds.
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: Address.parse('kQDwyflpzmR_LENUgxRi8D_qrjojtRA-nOKeEOXtfilsZyox').toString(),
            amount: '70000000',
          },
        ],
      });
    } catch (error) {
      console.log('Error during transaction check:', error);
    }
  }, [tonConnectUI]);

  const handleConnectWallet = useCallback(() => {
    open();
  }, [open]);

  useMainButton(address
    ? { text: 'Complete payment', onClick: handleCompletePayment }
    : { text: 'Connect wallet', onClick: handleConnectWallet });

  useEffect(() => {
    if (!Object.keys(cart).length) {
      navigate('/');
    }
  }, [cart, navigate]);

  const totalCost = Object.values(cart).reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

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
      <div>Total: ${(Math.round(totalCost * 100) / 100).toFixed(2)}</div>
    </div>
  );
};

export default Cart;
