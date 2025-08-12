import { ComputedNodeWithoutStyles, ResponsiveTreeMap } from '@nivo/treemap';
import { FC, memo, useState } from 'react';

import ChartSkeleton from '@/components/ChartSkeleton';

import { ValidatorNode } from '@/app/hooks/use-staking-snapshot';

const addressRegex = /^0x[a-fA-F0-9]+$/;

const trimAddress = (address: string) =>
  addressRegex.test(address)
    ? `${address.slice(0, 5)}...${address.slice(-4)}`
    : address;

const getDisplayName = (
  address: string,
  validatorNames?: { [address: string]: string },
) => {
  if (validatorNames && validatorNames[address]) {
    return validatorNames[address];
  }
  return trimAddress(address);
};

interface ValidatorsTreeMapProps {
  validatorNames: { [address: string]: string } | undefined;
  validatorNamesLoading: boolean;
  stakingData: ValidatorNode | null;
  snapshotDate: string;
  stakingDataLoading: boolean;
}

const ValidatorsTreeMap: FC<ValidatorsTreeMapProps> = ({
  validatorNames,
  validatorNamesLoading,
  stakingData,
  snapshotDate,
  stakingDataLoading,
}) => {
  const [selectedValidator, setSelectedValidator] = useState<string>('');
  const isLoading = stakingDataLoading || validatorNamesLoading;

  if (isLoading) {
    return (
      <ChartSkeleton
        className='h-[800px]'
        message='Loading validator data...'
      />
    );
  }

  if (!stakingData) {
    return (
      <div className='h-[800px] flex items-center justify-center'>
        <p className='text-gray-400'>Failed to load validator data</p>
      </div>
    );
  }

  const getSubtreeForValidator = (address: string) => {
    if (!address) return stakingData;

    const validatorNode = stakingData?.children?.find(
      (child: ValidatorNode) => child.address === address,
    );
    if (!validatorNode) return { address: 'Not found', children: [] };
    return { ...validatorNode, address: validatorNode.address };
  };

  const validatorOptions = Object.entries(validatorNames || {})
    .map(([address, name]) => ({ address, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Determine which data to show
  const chartData = selectedValidator
    ? getSubtreeForValidator(selectedValidator)
    : stakingData;

  return (
    <div className='mb-8'>
      <div className='flex justify-center mb-3'>
        <p className='text-center text-sm text-gray-400 flex-1 max-w-3xl mx-auto'>
          Choose a validator to see their delegations:
        </p>
      </div>
      <div className='flex justify-center mb-5'>
        <select
          id='validator-select'
          name='validator-select'
          className='inline-block bg-white/5 rounded-md border border-hl-light py-1.5 pl-3 pr-10 text-gray-300 ring-0 focus:ring-1 focus:border-hl-primary focus:ring-hl-primary sm:text-sm sm:leading-6'
          value={selectedValidator}
          onChange={(event) => setSelectedValidator(event.target.value)}
        >
          <option value=''>All Validators</option>
          {validatorOptions.map((opt) => (
            <option key={opt.address} value={opt.address}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>
      {snapshotDate && (
        <p className='text-xs text-gray-500 text-right mb-2'>
          Snapshot: {new Date(snapshotDate).toLocaleString()}
        </p>
      )}
      <div className='relative w-full h-[800px]'>
        <ResponsiveTreeMap
          data={chartData}
          colors={{ scheme: 'pastel2' }}
          identity='address'
          value='amount'
          valueFormat={(v: number) =>
            v.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
          }
          label={(
            datum: Omit<
              ComputedNodeWithoutStyles<ValidatorNode>,
              'label' | 'parentLabel'
            >,
          ) => getDisplayName(datum.data.address, validatorNames)}
          parentLabel={(
            datum: Omit<
              ComputedNodeWithoutStyles<ValidatorNode>,
              'parentLabel'
            >,
          ) => getDisplayName(datum.data.address, validatorNames)}
          labelSkipSize={45}
          nodeOpacity={0.7}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          parentLabelPosition='top'
          parentLabelTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
          borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
          onClick={(
            datum: Omit<
              ComputedNodeWithoutStyles<ValidatorNode>,
              'parentLabel'
            >,
          ) => {
            const address = datum.data.address;
            if (address && addressRegex.test(address)) {
              window.open(
                `https://hypurrscan.io/address/${address}`,
                '_blank',
                'noopener,noreferrer',
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default memo(ValidatorsTreeMap);
