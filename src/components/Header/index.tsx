import { CHAIN, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DisconnectIcon, WalletIcon } from '@/constants/icons.tsx';

import { separateTonAddress } from '@/helpers/common-helpers.ts';
import styles from './styles.module.scss';
import { useTonConnect } from '@/hooks/useTonConnect.ts';


const Header = () => {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const { network } = useTonConnect();
  const navigate = useNavigate();
  const location = useLocation();

  return address && <div className={styles.header}>
      <div className={styles.address}>
          Address: {separateTonAddress(address)} {network === CHAIN.TESTNET
        && <span className={styles.label}>testnet</span>}
      </div>
      <div className={styles.controls}>
        {location.pathname !== '/transactions-history'
          && <button onClick={() => navigate('/transactions-history')}>
                    <WalletIcon />
                </button>}
          <button onClick={() => tonConnectUI.disconnect()}>
              <DisconnectIcon />
          </button>
      </div>
  </div>;
};

export default Header;
