import { useQuery } from '@tanstack/react-query';
import { fetchProducts, PaginatedProductsResponse } from '@/apis/products';

interface UseProductsParams {
  page?: number;
  limit?: number;
}

export function useProducts(params: UseProductsParams = {}) {
  const { page, limit } = params;

  return useQuery<PaginatedProductsResponse>({
    queryKey: ['products', { page, limit }],
    queryFn: () => fetchProducts(page, limit),
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}