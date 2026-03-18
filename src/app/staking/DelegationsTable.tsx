import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColDef,
  ModuleRegistry,
  ValueFormatterParams,
} from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { Radio, RadioGroup } from '@headlessui/react';
import { useState } from 'react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { defaultColDef } from '@/components/tables/shared';

import useDelegationsTable, {
  DelegationRow,
} from '@/app/hooks/use-delegations-table';
import DelegationsChart from '@/app/staking/DelegationsChart';

type ViewMode = 'chart' | 'table';

const viewOptions = [
  { title: 'Chart 📊', value: 'chart' as ViewMode },
  { title: 'Table 📋', value: 'table' as ViewMode },
];

const amountFormatter = (params: ValueFormatterParams): string => {
  if (params.value == null) return '';

  return Math.round(params.value).toLocaleString('en-US');
};

const columnDefs: ColDef<DelegationRow>[] = [
  {
    field: 'name',
    headerName: 'Validator',
    pinned: 'left',
    minWidth: 200,
  },
  {
    field: 'foundation',
    headerName: 'Foundation',
    valueFormatter: amountFormatter,
  },
  {
    field: 'labs',
    headerName: 'Labs',
    valueFormatter: amountFormatter,
  },
  {
    headerName: 'Foundation + Labs',
    valueGetter: (params) =>
      (params.data?.foundation || 0) + (params.data?.labs || 0),
    valueFormatter: amountFormatter,
  },
  {
    field: 'community',
    headerName: 'Community',
    valueFormatter: amountFormatter,
  },
  {
    field: 'total',
    headerName: 'Total',
    valueFormatter: amountFormatter,
    sort: 'desc',
  },
];

const DelegationsTable = () => {
  const { rows, isLoading } = useDelegationsTable();
  const [viewMode, setViewMode] = useState<ViewMode>('chart');

  return (
    <>
      <div className='w-full px-4 mb-6'>
        <div className='mx-auto w-full max-w-xs'>
          <RadioGroup
            value={viewMode}
            onChange={setViewMode}
            aria-label='Delegations View'
            className='grid grid-cols-2 gap-4 justify-center'
          >
            {viewOptions.map((option) => (
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

      {viewMode === 'chart' ? (
        <DelegationsChart rows={rows} />
      ) : (
        <div className='w-full h-[40rem] mb-8'>
          <div className='ag-theme-material-dark w-full h-full'>
            <AgGridReact
              rowData={rows}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              suppressRowClickSelection={true}
              enableCellTextSelection
              localeText={{
                noRowsToShow: isLoading ? 'Loading...' : 'No data',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DelegationsTable;
