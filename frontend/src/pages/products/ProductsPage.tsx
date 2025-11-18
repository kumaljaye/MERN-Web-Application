
import { useEffect, useState } from "react"
import { createColumns, Product } from "./columns/product-columns"
import { DataTable } from "../../components/data-table/data-table"
import ViewProduct from "./model/view-product"
import { useProducts } from "@/hooks/useProducts"
import { DataTableFilter } from "@/components/data-table/data-table-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { PaginationState } from "@tanstack/react-table"


export default function ProductsPage() {

   const [viewProduct, setViewProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 6 })

  // Use React Query hook for fetching products
  const { data: productsResponse, isLoading, error } = useProducts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })
  const products = (productsResponse as any)?.products ?? []
  const totalPages = (productsResponse as any)?.pagination?.totalPages ?? 1
  
  console.log('🛍️ Products:', {
    currentPage: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    totalPages,
    productsCount: products.length,
    isLoading
  })

  // Reset to first page when page size changes
  const handlePaginationChange = (updater: any) => {
    console.log('🛍️ Products pagination change triggered')
    setPagination((prev) => {
      const newState = typeof updater === 'function' ? updater(prev) : updater
      console.log('🛍️ Products:', prev.pageIndex + 1, '→', newState.pageIndex + 1, '| Size:', prev.pageSize, '→', newState.pageSize)
      // If page size changed, reset to first page
      if (newState.pageSize !== prev.pageSize) {
        console.log('Products - Page size changed, resetting to page 0')
        return { ...newState, pageIndex: 0 }
      }
      return newState
    })
  }

  useEffect(() => {
    const maxPageIndex = Math.max(totalPages - 1, 0)
    if (pagination.pageIndex > maxPageIndex && totalPages > 0) {
      console.log('Products - Clamping page index from', pagination.pageIndex, 'to', maxPageIndex)
      setPagination((prev) => ({ ...prev, pageIndex: maxPageIndex }))
    }
  }, [totalPages]) // Remove pagination.pageIndex to prevent infinite loops

  // Handle view button click
  const handleViewClick = (product: Product) => {
    console.log("Viewing product:", product)
    setSelectedProduct(product)
    setViewProduct(true)
  }

  // Handle view product dialog close
  const handleViewProductClose = (open: boolean) => {
    setViewProduct(open)
    if (!open) {
      setSelectedProduct(null)
    }
  }

  // Create columns with the callback
  const columns = createColumns(handleViewClick)

  if (isLoading) return <div className="p-10 text-center">Loading...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error.message}</div>


  return (
    <div className="space-y-6 bg-card rounded-lg p-12 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-2 text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
      </div>
     
      <DataTable
        columns={columns}
        data={products}
        showPagination={true}
        paginationOptions={{
          pageSizeOptions: [6, 10, 20, 50],
          showFirstLastButtons: true,
          showSelectedRows: true,
        }}
        manualPagination
        pageCount={totalPages}
        paginationState={pagination}
        onPaginationChange={handlePaginationChange}
        toolbar={(table) => (
          <div className="flex items-center w-full space-x-4">
            <DataTableFilter
              table={table}
              columnKey="category"
              placeholder="Filter by category..."
              className="max-w-sm"
            />
            <DataTableViewOptions table={table} />
          </div>
        )}
      />
      
      {/* View Product Dialog */}
      {viewProduct && selectedProduct && (
        <ViewProduct
          open={viewProduct}
          onOpenChange={handleViewProductClose}
          product={selectedProduct}
        />
      )}
    </div>
  )
}