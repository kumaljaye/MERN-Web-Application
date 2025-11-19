'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

// Type definition for your product data
export type Product = {
  _id: string;
  productId: number;
  name: string;
  description: string;
  category: string;
  price: number;
};

// Function to create columns with callback
export const createColumns = (
  onViewClick: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'productId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className="w-[280px] truncate">{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      // Enables category searching
      return row
        .getValue<string>(id)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'LKR',
      }).format(price);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    header: 'View',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => onViewClick(product)}
        >
          <span className="sr-only">View product</span>
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
