"use client";

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { HTMLAttributes, forwardRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";

// Original Table is wrapped with a <div> (see https://ui.shadcn.com/docs/components/table#radix-:r24:-content-manual),
// but here we don't want it, so let's use a new component with only <table> tag
const TableComponent = forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
));
TableComponent.displayName = "TableComponent";

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
  function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
    const index = props["data-index"];
    const row = rows[index];

    if (!row) return null;

    return (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        {...props}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  height: string;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  height,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <div className={cn("border", className)}>
      <TableVirtuoso
        style={{ height }}
        totalCount={rows.length}
        components={{
          Table: TableComponent,
          TableRow: TableRowComponent(rows),
        }}
        fixedHeaderContent={() =>
          table.getHeaderGroups().map((headerGroup) => (
            // Change header background color to non-transparent
            <TableRow className="bg-card" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex items-center"
                        {...{
                          style: header.column.getCanSort()
                            ? {
                                cursor: "pointer",
                                userSelect: "none",
                              }
                            : {},
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))
        }
      />
    </div>
  );
}
