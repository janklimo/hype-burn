import NumberFlow from '@number-flow/react';
import { FC } from 'react';

import useTokenInfo from '@/app/hooks/use-token-info';

interface Props {
  tokenInfo: ReturnType<typeof useTokenInfo>['tokenInfo'];
}

const ChartInner: FC<Props> = ({ tokenInfo }) => {
  if (!tokenInfo) return;

  return (
    <div className='absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2 -mt-9 md:-mt-10'>
      <span className='font-bold text-sm text-hlGray'>Total Supply</span>
      <div className='text-accent font-mono font-semibold text-lg md:text-2xl mt-1'>
        <NumberFlow
          value={parseFloat(tokenInfo.circulatingSupply)}
          format={{
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }}
          spinTiming={{ duration: 1500 }}
        />
      </div>
      <p className='font-mono text-md md:text-xl text-accent'>HYPE</p>
    </div>
  );
};

export default ChartInner;
