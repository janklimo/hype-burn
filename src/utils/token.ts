export const ADDITIONAL_NON_CIRCULATING_AMOUNT = 428_060_000 + 238_000_000;

export const adjustCirculatingSupply = (circulatingSupply: number): number => {
  return circulatingSupply > 900_000_000
    ? circulatingSupply - ADDITIONAL_NON_CIRCULATING_AMOUNT
    : circulatingSupply;
};
