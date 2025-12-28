// Hyper Foundation 1..5 from https://data.asxn.xyz/dashboard/hype-staking
export const FOUNDATION_STAKED_AMOUNT =
  60_180_010.71068834 +
  60_180_010.71068833 +
  60_180_010.71068834 +
  60_180_010.71068833 +
  60_180_010.71068833;

export const calculateReadyForSaleSupply = (
  circulatingSupply: number,
  stakedBalance: number,
  foundationStakedAmount: number,
): number => {
  const stakedSupply = stakedBalance - foundationStakedAmount;
  return circulatingSupply - stakedSupply;
};
