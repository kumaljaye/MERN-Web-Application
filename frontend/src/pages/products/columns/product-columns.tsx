"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

// Type definition for your product data
export type Product = {
  _id: number
  name: string
  description: string
  category: string
  price_lkr: number
}

// Function to create columns with callback
export const createColumns = (onViewClick: (product: Product) => void): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" className="w-[450px]" />
    ),
    cell: ({ row }) => (
      <div className="w-[450px] truncate">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, value) => {
      // Enables category searching
      return row.getValue<string>(id).toLowerCase().includes(value.toLowerCase())
    },
  },
  {
    accessorKey: "price_lkr",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price_lkr"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "LKR",
      }).format(price)
      return <div className="text-left font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    header: "View",
    cell: ({ row }) => {
      const product = row.original

      return (
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={() => onViewClick(product)}
        >
          <span className="sr-only">View product</span>
          <Eye className="h-4 w-4" />
        </Button>
      )
    },
  },
]
