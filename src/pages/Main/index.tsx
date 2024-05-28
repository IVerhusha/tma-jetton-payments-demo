import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainButton } from '@tma.js/sdk-react';
import data from '@/assets/products.json';
import ProductCard from '@/components/ProductCard';
import { useApp } from '@/context/app-context.tsx';
import styles from './styles.module.scss';


const Main = () => {
  const navigate = useNavigate();
  const { cart, addProduct, removeProduct } = useApp();
  const mainButton = useMainButton();

  const handleClick = useCallback(() => {
    if (!Object.keys(cart).length) {
      return;
    }

    navigate('/cart');
  }, [cart, navigate]);


  useEffect(() => {
    if (Object.keys(cart).length && !mainButton.isVisible) {
      mainButton.show();
      return;
    }
    if (!Object.keys(cart).length) {
      mainButton.hide();
    }
  }, [cart, mainButton]);

  useEffect(() => {
    mainButton.setParams({ text: 'View order', bgColor: '#0098EA' });
    mainButton.on('click', handleClick);
  }, [handleClick, mainButton]);

  return (
    <div className={styles.wrapper}>
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
