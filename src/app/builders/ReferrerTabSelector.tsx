import { Radio, RadioGroup } from '@headlessui/react';
import { FC } from 'react';

const options = [
  { title: 'Users 👫', value: 'users' },
  { title: 'Fees 💰', value: 'fees' },
];

interface ReferrerTabSelectorProps {
  value: 'users' | 'fees';
  onChange: (value: 'users' | 'fees') => void;
}

const ReferrerTabSelector: FC<ReferrerTabSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className='w-full px-4 mb-6'>
      <div className='mx-auto w-full max-w-xs'>
        <RadioGroup
          value={value}
          onChange={onChange}
          aria-label='Referrer Data Type'
          className='grid grid-cols-2 gap-4 justify-center'
        >
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              className='group relative flex border border-hl-light cursor-pointer rounded-lg bg-white/5 py-2 px-3 text-white shadow-md transition focus:outline-none data-[checked]:bg-primary-200/20 data-[checked]:border data-[checked]:border-hl-primary'
            >
              <div className='flex justify-center w-full text-sm/6'>
                <span className='font-semibold text-white text-sm'>
                  {option.title}
                </span>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default ReferrerTabSelector;
