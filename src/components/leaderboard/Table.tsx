import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColDef,
  ModuleRegistry,
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { useCallback, useState } from 'react';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { columnTypes, defaultColDef } from '@/components/tables/shared';

import useHypeData from '@/app/hooks/use-hype-data';
import useTokenInfo from '@/app/hooks/use-token-info';
import { apiHost } from '@/constant/config';

import { LeaderboardData, LeaderboardRowData } from '@/types/responses';

/**
 * Table value getters and formatters.
 */
const getTotalBalance = (params: ValueGetterParams<LeaderboardRowData>) => {
  const unstaked = Number(params.data?.balance) || 0;
  const staked = Number(params.data?.balance_staked) || 0;
  return unstaked + staked;
};

const shareOfTotalValueGetter = (
  params: ValueGetterParams<LeaderboardRowData>,
  supply: string | undefined,
) => {
  const totalBalance = getTotalBalance(params);

  if (!totalBalance || !supply) return null;

  const circulatingSupply = parseFloat(supply);

  return totalBalance / circulatingSupply;
};

const shareOfTotalValueFormatter = (params: ValueFormatterParams): string => {
  if (!params.value) return '...';

  return params.value.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

const balanceValueGetter = (
  params: ValueGetterParams<LeaderboardRowData>,
  price: string | undefined,
) => {
  const totalBalance = getTotalBalance(params);

  if (!totalBalance || !price) return null;

  return totalBalance * parseFloat(price);
};

const balanceValueFormatter = (params: ValueFormatterParams): string => {
  if (!params.value) return '...';

  return params.value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const HoldersTable = () => {
  const [rowData, setRowData] = useState<LeaderboardRowData[]>([]);
  const [snapshotDate, setSnapshotDate] = useState<string>();
  const data = useHypeData();
  const { tokenInfo } = useTokenInfo();

  const onGridReady = useCallback(() => {
    fetch(`${apiHost}/leaderboard?coin=hype`)
      .then<LeaderboardData>((resp) => resp.json())
      .then((data) => {
        setRowData(data.rows);
        setSnapshotDate(data.created_at);
      });
  }, []);

  const columnDefs: ColDef<LeaderboardRowData>[] = [
    { field: 'rank', pinned: 'left', width: 80 },
    { field: 'display_address', headerName: 'Address', pinned: 'left' },
    {
      field: 'balance_staked',
      headerName: 'Staked',
      type: ['tokenBalance'],
      minWidth: 150,
    },
    {
      field: 'balance',
      headerName: 'Unstaked',
      type: ['tokenBalance'],
      minWidth: 150,
    },
    {
      field: 'balance',
      headerName: 'Total',
      valueGetter: getTotalBalance,
      type: ['tokenBalance'],
      minWidth: 150,
    },
    {
      field: 'balance',
      headerName: '% Total',
      valueGetter: (params) =>
        shareOfTotalValueGetter(params, tokenInfo?.totalSupply),
      valueFormatter: shareOfTotalValueFormatter,
      minWidth: 150,
    },
    {
      field: 'balance',
      headerName: 'Value (USD)',
      valueGetter: (params) => balanceValueGetter(params, data?.markPx),
      valueFormatter: balanceValueFormatter,
      minWidth: 150,
    },
    {
      field: 'address',
      type: ['moreActions'],
    },
  ];

  return (
    <div className='w-full h-[40rem] mb-8'>
      <div className='ag-theme-material-dark w-full h-full'>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          columnTypes={columnTypes}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSizeSelector={false}
          onGridReady={onGridReady}
          localeText={{
            noRowsToShow: 'Loading...',
          }}
          enableCellTextSelection
        />
      </div>
      {snapshotDate && (
        <p className='text-right text-xs text-hlGray mt-2'>
          Last refreshed: {snapshotDate}
        </p>
      )}
    </div>
  );
};

export default HoldersTable;
