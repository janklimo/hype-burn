// Hyper Foundation 1..5 from https://data.asxn.xyz/dashboard/hype-staking
export const FOUNDATION_STAKED_AMOUNT =
  60_180_010.71068834 +
  60_180_010.71068833 +
  60_180_010.71068834 +
  60_180_010.71068833 +
  60_180_010.71068833;

export const calculateReadyForSaleSupply = (
  circulatingSupply: number,
  assistanceFundBalance: number,
  stakedBalance: number,
  evmBalance: number,
): number => {
  const stakedSupply = stakedBalance - FOUNDATION_STAKED_AMOUNT;
  return circulatingSupply - assistanceFundBalance - stakedSupply - evmBalance;
};
