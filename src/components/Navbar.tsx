'use client';

import { FC } from 'react';

import NavbarLink from '@/components/links/NavbarLink';
import StakeButton from '@/components/StakeButton';
import TradeButton from '@/components/TradeButton';

const Navbar: FC = () => {
  return (
    <div className='flex relative justify-center py-6'>
      <NavbarLink href='/'>Home</NavbarLink>
      <NavbarLink href='/leaderboard'>Leaderboard</NavbarLink>
      <NavbarLink href='/builders'>Builders</NavbarLink>
      <NavbarLink href='/stats'>Stats</NavbarLink>
      <div className='absolute top-0 right-5 py-5 hidden xl:flex flex-col items-end space-y-3'>
        <StakeButton />
        <div className='flex flex-col items-end'>
          <TradeButton />
          <p className='text-gray-400 text-xs mt-1 text-right'>
            Enjoy a{' '}
            <a
              href='https://hyperliquid.gitbook.io/hyperliquid-docs/referrals'
              className='text-hl-primary hover:text-accent transition-all'
              target='_blank'
              rel='noopener noreferrer'
            >
              4% discount
            </a>{' '}
            on your trading fees
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
