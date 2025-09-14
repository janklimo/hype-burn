'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import TradeButton from '@/components/TradeButton';

import ReferralPromptModal from './ReferralPromptModal';

interface Balance {
  coin: string;
  token: number;
  total: string;
  hold: string;
  entryNtl: string;
}

interface HyperliquidResponse {
  balances: Balance[];
}

const shouldShowModal = (
  lastShownTimestamp: string | null,
  intervalDays = 0,
): boolean => {
  if (!lastShownTimestamp) return true; // Never shown before

  const lastShownTime = parseInt(lastShownTimestamp);
  const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
  const timeSinceLastShown = Date.now() - lastShownTime;

  return timeSinceLastShown >= intervalMs;
};

const fetchPUMPBalance = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'spotClearinghouseState',
        user: '0x89249fc1c72e46F96178668E332A2ffe82e19555',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: HyperliquidResponse = await response.json();

    // Find UPUMP balance
    const upumpBalance = data.balances.find(
      (balance) => balance.coin === 'UPUMP',
    );
    const balance = upumpBalance ? parseFloat(upumpBalance.total) : 0;

    // eslint-disable-next-line no-console
    console.log('PUMP balance:', balance);
    return balance;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching UPUMP balance:', error);
    return 0;
  }
};

const ReferralPromptWrapper = () => {
  const [shouldShowBasedOnTime, setShouldShowBasedOnTime] = useState(false);
  const [isBalanceSufficient, setIsBalanceSufficient] = useState(false);

  useEffect(() => {
    const checkBalanceAndShowModal = async () => {
      // Check time-based condition first
      const modalLastShown = localStorage.getItem('referralModalLastShown');
      const timeBasedCheck = shouldShowModal(modalLastShown, 7);
      setShouldShowBasedOnTime(timeBasedCheck);

      if (!timeBasedCheck) {
        return;
      }

      const pumpBalance = await fetchPUMPBalance();
      const balanceSufficient = pumpBalance >= 555;
      setIsBalanceSufficient(balanceSufficient);
    };

    checkBalanceAndShowModal();
  }, []);

  const handleModalClose = () => {
    // Store the current timestamp when modal is closed
    localStorage.setItem('referralModalLastShown', Date.now().toString());
    setShouldShowBasedOnTime(false);
  };

  // Only show modal if both conditions are met
  if (!shouldShowBasedOnTime || !isBalanceSufficient) {
    return null;
  }

  return (
    <ReferralPromptModal title='Claim your PUMP' onClose={handleModalClose}>
      <div className='text-center'>
        <div className='flex justify-center mt-2 mb-5'>
          <div className='w-44'>
            <Image
              src='/images/pump-logo.png'
              width={640}
              height={360}
              priority
              alt='PUMP logo'
            />
          </div>
        </div>
        <div className='space-y-2 mb-6 px-3'>
          <p className='text-gray-200 text-sm'>
            Instantly receive{' '}
            <span className='font-bold text-accent'>555 PUMP</span> tokens once
            you use my referral code on Hyperliquid. Accounts of any age are
            eligible.
          </p>
          <p className='text-gray-200 text-sm'>
            Farm Unit's airdrop. Get 4% discount on your trading fees.
          </p>
        </div>
        <div className='mb-3'>
          <TradeButton />
        </div>
        <p className='text-hlGray text-xs'>
          *Promotion may be terminated or modified at any time without notice.
          Maximum one referral reward per unique individual. Unit has not
          confirmed their airdrop. Your account will need to have some volume to
          prevent spam. Subject to PUMP token availability in distribution
          wallet. NFA. DYOR.
        </p>
      </div>
    </ReferralPromptModal>
  );
};

export default ReferralPromptWrapper;
