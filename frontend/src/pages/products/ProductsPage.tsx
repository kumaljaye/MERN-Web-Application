import { useState } from 'react';
import { createColumns, Product } from './columns/product-columns';
import { DataTable } from '../../components/data-table/data-table';
import ViewProduct from './model/view-product';
import { useProducts } from '@/hooks/useProducts';
import { DataTableFilter } from '@/components/data-table/data-table-filter';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { PaginationState } from '@tanstack/react-table';

export default function ProductsPage() {
  const [viewProduct, setViewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Pagination state
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  // Use React Query hook for fetching products with pagination
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({
    page: paginationState.pageIndex + 1,
    limit: paginationState.pageSize,
  });

  const allProducts = productsResponse?.products ?? [];
  const totalPages = productsResponse?.pagination?.totalPages ?? 0;

  // Handle view button click
  const handleViewClick = (product: Product) => {
    console.log('Viewing product:', product);
    setSelectedProduct(product);
    setViewProduct(true);
  };

  // Handle view product dialog close
  const handleViewProductClose = (open: boolean) => {
    setViewProduct(open);
    if (!open) {
      setSelectedProduct(null);
    }
  };

  // Create columns with the callback
  const columns = createColumns(handleViewClick);

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error.message}</div>;

  return (
    <div className="bg-card space-y-6 rounded-lg p-12 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={allProducts}
        showPagination={true}
        manualPagination={true}
        pageCount={totalPages}
        paginationState={paginationState}
        onPaginationChange={setPaginationState}
        paginationOptions={{
          pageSizeOptions: [6, 10, 20, 50],
          showFirstLastButtons: true,
          showSelectedRows: true,
        }}
        toolbar={(table) => (
          <div className="flex w-full items-center space-x-4">
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
  );
}
