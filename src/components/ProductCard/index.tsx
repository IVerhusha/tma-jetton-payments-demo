import { TProduct } from '@/types/common-types.ts';
import Button from '@/components/Button';
import styles from './styles.module.scss';
import { MinusIcon, PlusIcon } from '@/constants/icons.tsx';

type Props = {
  product: TProduct;
  onAddProduct: (product: TProduct) => void;
  onRemoveProduct: (product: TProduct) => void;
}

const ProductCard = ({ product, onAddProduct, onRemoveProduct }: Props) => {
  const { image, shortName, description, quantity, price } = product;
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img className={styles.image} src={image} alt={shortName} />
        <h5>{shortName}</h5>
        <p>${price}</p>
        <p className={styles.description}>{description}</p>
      </div>
      {!quantity ? (
        <Button onClick={() => onAddProduct(product)}>Add to cart</Button>
      ) : (
        <div className={styles.controls}>
          <Button className={styles.button} onClick={() => onRemoveProduct(product)}><MinusIcon /></Button>
          <div className={styles.quantity}>{quantity}</div>
          <Button className={styles.button} onClick={() => onAddProduct(product)}><PlusIcon /></Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
