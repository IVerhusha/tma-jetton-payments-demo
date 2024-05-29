import { useAsyncInitialize } from '@/hooks/useAsyncInitialize.ts';
import { useTonClient } from '@/hooks/useTonClient.ts';
import { Address } from '@ton/core';
import { JettonMaster } from '@ton/ton';

export const useJettonAddress = (walletAddress?: Address | null, jettonMasterAddress?: Address | null): {
  jettonAddress?: Address
} => {
  const { client } = useTonClient();

  const jettonAddress = useAsyncInitialize(async () => {
    if (!client || !walletAddress || !jettonMasterAddress) {
      return;
    }

    const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));
    return jettonMaster.getWalletAddress(walletAddress);
  }, [client, walletAddress, jettonMasterAddress]);

  return { jettonAddress };
};
