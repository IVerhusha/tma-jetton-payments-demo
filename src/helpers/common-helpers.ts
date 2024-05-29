export const separateTonAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

export const calculateUsdtAmount = (usdCents: number) => BigInt(usdCents * 10000);
