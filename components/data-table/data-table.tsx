'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTablePagination } from './components/data-table-pagination';
import { DataTableToolbar } from './components/data-table-toolbar';
// import { DataTableRowActions } from '../../app/components/recommendations/components/recs-row-actions';
// import { Open } from '@/types/utils';
// import { TrackPlus } from '@/lib/features/builder/builderSlice';
// import { Card } from '@/components/ui/card';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  callbackOnClick?: (data: TData) => void;
}

export function DataTable<TData, TValue>({ columns, data, callbackOnClick }: DataTableProps<TData, TValue>) {
  console.log('DataTable rendered');
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className='space-y-4 p-4'>
      <DataTableToolbar table={table} />
      <DataTablePagination table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // const { id } = row.original as TrackPlus;
                return (
                  <TableRow
                    key={'row' + row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    // onClick={() => {
                    //   const { id } = row.original as TrackPlus;
                    //   // @ts-ignore
                    //   // setOpen((prev: Open) => (prev ? { ...prev, [id]: !prev[id] } : { [id]: true }));
                    //   // iterate through every key in open and set all to false
                    //   // then set the current key to true
                    //   // @ts-ignore
                    //   setOpen((prev: Open) => {
                    //     const newOpen: Open = {};
                    //     for (const key in prev) {
                    //       newOpen[key] = false;
                    //     }
                    //     newOpen[id] = true;
                    //     return newOpen;
                    //   });
                    // }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      // <DataTableRowActions key={'actions' + row.id} row={row}>
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      // </DataTableRowActions>
                    ))}
                    {/* <DataTableRowActions row={row} open={open || {}} setOpen={setOpen} id={id} /> */}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
