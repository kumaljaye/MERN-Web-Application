import apiClient from '@/libs/axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PaginatedProductsResponse<TProduct = any> {
  products: TProduct[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export async function fetchProducts(page?: number, limit?: number): Promise<PaginatedProductsResponse> {
  try {
    const params: Record<string, number> = {};
    if (typeof page === 'number') params.page = page;
    if (typeof limit === 'number') params.limit = limit;

    const response = await apiClient.get(`${API_BASE_URL}/api/products`, { params });
    console.log('Full API response:', response.data);
    
    if (Array.isArray(response.data)) {
      return {
        products: response.data,
        pagination: {
          page: 1,
          limit: response.data.length,
          totalItems: response.data.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    if (response.data?.products && response.data?.pagination) {
      return response.data as PaginatedProductsResponse;
    }

    if (response.data?.data) {
      const fallbackData = response.data.data;
      return {
        products: fallbackData,
        pagination: {
          page: 1,
          limit: fallbackData.length,
          totalItems: fallbackData.length,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    console.warn('Unexpected response structure:', response.data);
    const fallback = response.data?.products ?? response.data?.data ?? response.data ?? [];
    return {
      products: Array.isArray(fallback) ? fallback : [],
      pagination: {
        page: 1,
        limit: Array.isArray(fallback) ? fallback.length : 0,
        totalItems: Array.isArray(fallback) ? fallback.length : 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
    };
  } catch (err) {
    console.error('Error fetching products:', err);
    throw new Error("Failed to fetch products");
  }
}


