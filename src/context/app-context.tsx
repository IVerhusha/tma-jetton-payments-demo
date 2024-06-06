import { createContext, ReactNode, useCallback, useContext, useReducer } from 'react';
import { TProduct } from '@/types/common-types.ts';

export type Product = TProduct;

export type Cart = Record<number, Product & { quantity: number }>;

type TAppStateProvider = {
  children: ReactNode;
};

type AppStateContextProviderValue = {
  cart: Cart;
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  clearCart: () => void;
};

const initialContext: AppStateContextProviderValue = {
  cart: {},
  addProduct: () => {},
  removeProduct: () => {},
  clearCart: () => {},
};

const AppStateContext = createContext<AppStateContextProviderValue>(initialContext);

type CartAction =
  | { type: 'ADD_PRODUCT'; product: Product }
  | { type: 'REMOVE_PRODUCT'; product: Product }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const product = action.product;
      if (!(product.id in state)) {
        return { ...state, [product.id]: { ...product, quantity: 1 } };
      }

      const previousQuantity = state[product.id].quantity;

      return {
        ...state,
        [product.id]: { ...product, quantity: previousQuantity + 1 }
      };
    }
    case 'REMOVE_PRODUCT': {
      const product = action.product;
      if (!(product.id in state)) {
        return state;
      }

      const newQuantity = state[product.id].quantity - 1;

      if (newQuantity > 0) {
        return { ...state, [product.id]: { ...product, quantity: newQuantity } };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [product.id]: _, ...rest } = state;
      return rest;
    }
    case 'CLEAR_CART':
      return {};
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }: TAppStateProvider) => {
  const [cart, dispatch] = useReducer(cartReducer, {});

  const addProduct = useCallback((product: Product) => {
    dispatch({ type: 'ADD_PRODUCT', product });
  }, []);

  const removeProduct = useCallback((product: Product) => {
    dispatch({ type: 'REMOVE_PRODUCT', product });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  return (
    <AppStateContext.Provider value={{ cart, clearCart, addProduct, removeProduct }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
