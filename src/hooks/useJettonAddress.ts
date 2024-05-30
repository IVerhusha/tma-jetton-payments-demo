import { useAsyncInitialize } from '@/hooks/useAsyncInitialize.ts';
import { Address } from '@ton/core';
import { JettonMaster, TonClient } from '@ton/ton';

export const useJettonAddress = (walletAddress: Address | undefined, jettonMasterAddress: Address | undefined, tonClient: TonClient | undefined): Address => {
  const jettonAddress = useAsyncInitialize(async () => {
    if (!tonClient || !walletAddress || !jettonMasterAddress) {
      return;
    }

    const jettonMaster = tonClient.open(JettonMaster.create(jettonMasterAddress));
    return jettonMaster.getWalletAddress(walletAddress);
  }, [tonClient, walletAddress, jettonMasterAddress]);

  return jettonAddress;
};
