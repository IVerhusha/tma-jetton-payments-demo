export const separateTonAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

export const calculateUsdtAmount = (usdCents: number) => BigInt(usdCents * 10000);

export const calculateUsdFromUsdt = (usdtAmount: bigint) => Math.round((Number(usdtAmount) / 1000000) * 100) / 100;

export const isUUID = (uuid: string): boolean => uuid.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') !== null;

export async function wait(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      await wait(options.delay);
    }
  }
  throw lastError;
}



