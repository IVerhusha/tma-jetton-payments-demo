import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonAddress, useTonConnectModal } from '@tonconnect/ui-react';
import { useMainButton } from '@/hooks/useMainButton';
import data from '@/assets/products.json';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import { useAppState } from '@/context/app-context.tsx';
import styles from './styles.module.scss';

const Main = () => {
  const navigate = useNavigate();
  const { cart, addProduct, removeProduct } = useAppState();
  const address = useTonAddress();
  const { open } = useTonConnectModal();

  const handleViewOrder = useCallback(() => {
    navigate('/cart');
  }, [navigate]);

  const handleConnectWallet = useCallback(() => {
    open();
  }, [open]);

  const mainButton = useMainButton(address
    ? { text: 'View order', onClick: handleViewOrder }
    : { text: 'Connect wallet', onClick: handleConnectWallet });

  useEffect(() => {
    if (Object.keys(cart).length && !mainButton.isVisible) {
      mainButton.show();
      return;
    }
    if (!Object.keys(cart).length) {
      mainButton.hide();
    }
  }, [cart, mainButton, address]);

  return (
    <div className={styles.wrapper}>
      <Header />
      {data.products.map(product => (
        <ProductCard
          product={product.id in cart ? cart[product.id] : { ...product, quantity: 0 }}
          key={product.id}
          onAddProduct={addProduct}
          onRemoveProduct={removeProduct}
        />
      ))}
    </div>
  );
};

export default Main;
