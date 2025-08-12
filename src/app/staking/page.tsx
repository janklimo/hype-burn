'use client';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Calendar } from 'primereact/calendar';
import { useRef, useState } from 'react';

import '@/styles/calendar.css';

import useStakingSnapshot from '@/app/hooks/use-staking-snapshot';
import useValidators from '@/app/hooks/use-validators';
import ValidatorsChart from '@/app/staking/ValidatorsChart';
import ValidatorsTabSelector from '@/app/staking/ValidatorsTabSelector';
import ValidatorsTreeMap from '@/app/staking/ValidatorsTreeMap';

const parseCurrentDate = (date: Date | null, snapshotDate: string) => {
  if (date || snapshotDate === '') return date;

  return new Date(snapshotDate);
};

const formatDateForAPI = (date: Date | null) => {
  if (!date) return null;

  const adjustedDate = new Date(date);
  adjustedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
  return adjustedDate.toISOString().split('T')[0];
};

const Staking = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [chartMode, setChartMode] = useState<'stakers' | 'total'>('total');
  const calendarRef = useRef<Calendar>(null);

  const { validatorNames, isLoading: validatorNamesLoading } = useValidators();
  const {
    data: stakingData,
    snapshotDate,
    snapshotDates,
    delegationsCount,
    totalStake,
    isLoading: isStakingSnapshotLoading,
  } = useStakingSnapshot(formatDateForAPI(date));

  const currentDate = parseCurrentDate(date, snapshotDate);

  return (
    <main>
      <section className='bg-hl-dark p-3 md:p-4'>
        <h2 className='text-white text-2xl mb-3 text-center'>Validators</h2>

        <div className='flex justify-center mb-3'>
          <p className='text-center text-sm text-gray-400 flex-1 max-w-3xl mx-auto'>
            Choose snapshot date:
          </p>
        </div>
        <div className='flex justify-center flex-col items-center gap-1'>
          <div
            onClick={() => calendarRef.current?.show()}
            className='inline-flex items-center justify-between bg-white/5 rounded-md border border-hl-light py-1.5 pl-3 pr-3 text-gray-300 cursor-pointer hover:bg-white/10 transition-colors sm:text-sm sm:leading-6 min-w-[200px]'
          >
            <span className='flex-1 text-left'>
              {currentDate
                ? currentDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Select date'}
            </span>
            <div className='w-5 h-5 bg-hl-primary rounded flex items-center justify-center ml-2'>
              <CalendarDaysIcon className='w-3 h-3 text-black' />
            </div>
          </div>
          <div id='calendar-container' className='relative min-w-[200px]' />
        </div>

        <Calendar
          ref={calendarRef}
          value={date}
          onChange={(e) => setDate(e.value ?? null)}
          enabledDates={snapshotDates.map((date) => new Date(date))}
          appendTo={() => {
            const element = document.getElementById('calendar-container');
            return element || document.body;
          }}
        />

        {/* Validators Statistics Chart */}
        <div className='mt-2 mb-8 max-w-5xl mx-auto'>
          <h2 className='text-white text-lg mb-3 text-center'>Staking</h2>

          <ValidatorsTabSelector value={chartMode} onChange={setChartMode} />

          <ValidatorsChart
            mode={chartMode}
            delegationsCount={delegationsCount}
            totalStake={totalStake}
            validatorNames={validatorNames}
            isLoading={isStakingSnapshotLoading || validatorNamesLoading}
          />
        </div>

        <h2 className='text-white text-lg mb-3 text-center'>
          Delegations breakdown
        </h2>
        <p className='text-center text-sm text-gray-400 mb-4 max-w-3xl mx-auto'>
          This chart shows the breakdown of all delegations larger than 10,000
          HYPE by validator. Smaller delegations are grouped together as Shrimp
          🦐 (less than 1,000 HYPE) and Dolphin 🐬 (1,000 – 10,000 HYPE).
        </p>
        <p className='text-center text-sm text-gray-400 mb-6 max-w-3xl mx-auto'>
          Click on any cell to see the address on Hypurrscan.
        </p>
        <div className='flex justify-center items-center flex-col mb-8'>
          <div className='relative w-full max-w-7xl'>
            <ValidatorsTreeMap
              validatorNames={validatorNames}
              validatorNamesLoading={validatorNamesLoading}
              stakingData={stakingData}
              snapshotDate={snapshotDate}
              stakingDataLoading={isStakingSnapshotLoading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Staking;
