import type { ComponentType, JSX } from 'react';
import Main from '@/pages/Main';
import Cart from '@/pages/Cart';
import TransactionsHistory from '@/pages/TransactionsHistory';
import TransactionSuccess from '@/pages/TransactionSuccess';


interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: Main },
  { path: '/cart', Component: Cart, title: 'Cart' },
  { path: '/transactions-history', Component: TransactionsHistory, title: 'Transactions history' },
  { path: '/transaction-success', Component: TransactionSuccess, title: 'Transaction success' },
];
