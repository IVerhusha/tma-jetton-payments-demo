import { getHttpEndpoint } from '@orbs-network/ton-access';
import { CHAIN } from '@tonconnect/ui-react';
import { TonClient } from '@ton/ton';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';

// TODO: extract to context???
export const useTonClient = () => {
  const { network } = useTonConnect();

  const client = useAsyncInitialize(async () => {
    if (!network) return;

    const endpoint = await getHttpEndpoint({
      network: network === CHAIN.MAINNET ? 'mainnet' : 'testnet',
    });

    return new TonClient({ endpoint });
  }, [network]);

  return {
    client,
  };
};
