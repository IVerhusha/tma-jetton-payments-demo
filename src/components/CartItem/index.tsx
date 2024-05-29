import { TProduct } from '@/types/common-types.ts';
import Button from '@/components/Button';
import { MinusIcon, PlusIcon } from '@/constants/icons.tsx';
import styles from './styles.module.scss';

type Props = {
  product: TProduct;
  onAddProduct: (product: TProduct) => void;
  onRemoveProduct: (product: TProduct) => void;
}

const CartItem = ({ product, onAddProduct, onRemoveProduct }: Props) => {
  const { image, shortName, quantity, price } = product;
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img className={styles.image} src={image} alt={shortName} />
        <div>
          <h5>{shortName}</h5>
          <p>${(Math.round(price * quantity * 100) / 100).toFixed(2)}</p>
        </div>
      </div>
      <div className={styles.controls}>
        <Button className={styles.button} onClick={() => onRemoveProduct(product)}><MinusIcon /></Button>
        <div className={styles.quantity}>{quantity}</div>
        <Button className={styles.button} onClick={() => onAddProduct(product)}><PlusIcon /></Button>
      </div>
    </div>
  );
};

export default CartItem;
