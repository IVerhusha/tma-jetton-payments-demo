import './polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { SDKProvider } from '@tma.js/sdk-react';
import '@/assets/styles/globals.scss';
import '@/assets/styles/vendors/normalize.scss';
import eruda from "eruda";

eruda.init();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SDKProvider acceptCustomStyles debug>
      <App />
    </SDKProvider>
  </React.StrictMode>,
);
