'use client';

import { Field, Label, Switch } from '@headlessui/react';

interface EvmToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const EvmToggle = ({ enabled, onChange }: EvmToggleProps) => {
  return (
    <Field className='flex items-center'>
      <Switch
        checked={enabled}
        onChange={onChange}
        className='group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-hl-light transition-colors duration-200 ease-in-out  data-[checked]:bg-hl-primary'
      >
        <span
          aria-hidden='true'
          className='pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5'
        />
      </Switch>
      <Label as='span' className='ml-3 text-sm'>
        <span className='font-medium text-white'>Exclude Bridged HYPE</span>
      </Label>
    </Field>
  );
};

export default EvmToggle;
