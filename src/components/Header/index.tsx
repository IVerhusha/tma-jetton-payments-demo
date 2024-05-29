import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import { DisconnectIcon, WalletIcon } from '@/constants/icons.tsx';

import { separateTonAddress } from '@/helpers/common-helpers.ts';
import styles from './styles.module.scss';


const Header = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();

  return address && <div className={styles.header}>
      <div className={styles.address}>
          Address: {separateTonAddress(address)}
      </div>
      <div className={styles.controls}>
          <button onClick={() => navigate('/transactions-history')}>
              <WalletIcon />
          </button>
          <button onClick={() => tonConnectUI.disconnect()}>
              <DisconnectIcon />
          </button>
      </div>
  </div>;
};

export default Header;
