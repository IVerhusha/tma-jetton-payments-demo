import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address, toNano } from '@ton/core';
import { useMainButton } from '@/hooks/useMainButton';
import { useTonConnectModal } from '@tonconnect/ui-react';
import { useApp } from '@/context/app-context.tsx';
import CartItem from '@/components/CartItem';
import { useBackButton } from '@/hooks/useBackButton.ts';
import { DisconnectIcon } from '@/constants/icons.tsx';
import styles from './styles.module.scss';
import { useTonConnect } from '@/hooks/useTonConnect.ts';
import { useTonClient } from '@/hooks/useTonClient.ts';
import { JettonWallet } from '@/wrappers/JettonWallet.ts';
import { calculateUsdtAmount, separateTonAddress } from '@/helpers/common-helpers.ts';
import { useJettonAddress } from '@/hooks/useJettonAddress.ts';

// TODO: extract to constants (or env)
const usdtMasterAddress = Address.parse('kQC2sWxkwfqwsb7O3z-lRInJQO1f11qDDd8jD5wrcg27ss5h');
// TODO: generate id
const ID = 'ID';

const Cart = () => {
  const { cart, addProduct, removeProduct } = useApp();
  const navigate = useNavigate();
  const { client } = useTonClient();
  const { open } = useTonConnectModal();
  const { tonConnectUI, sender, walletAddress, network } = useTonConnect();
  const { jettonAddress: usersUsdtAddress } = useJettonAddress(walletAddress, usdtMasterAddress);
  useBackButton();

  // TODO? validate network?
  network;

  // TODO: count total costs in cents for more precision?
  const totalCost = Object.values(cart).reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const handleCompletePayment = useCallback(async () => {
    try {
      if (!client || !walletAddress || !usersUsdtAddress) return;

      const jettonWallet = client.open(JettonWallet.createFromAddress(usersUsdtAddress));
      await jettonWallet.sendTransfer(sender, {
        fwdAmount: 1n,
        comment: `${ID}`,
        jettonAmount: calculateUsdtAmount(totalCost * 100),
        toAddress: walletAddress, // WARNING: transaction currently comes back to user wallet
        value: toNano('0.047'), // will be enough?
      });
      console.log(`See transaction at https://testnet.tonviewer.com/${usersUsdtAddress}`);
    } catch (error) {
      console.log('Error during transaction check:', error);
    }
  }, [client, sender, totalCost, walletAddress, usersUsdtAddress]);

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
      {walletAddress && <div className={styles.wallet}>
        Address: {separateTonAddress(walletAddress.toString())}
        <button onClick={() => tonConnectUI.disconnect()}>
          <DisconnectIcon/>
        </button>
      </div>}
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
