import { useQuery } from '@tanstack/react-query';
import { fetchUsers, PaginatedUsersResponse } from '@/apis/user';

interface UseUsersParams {
  page?: number;
  limit?: number;
}

export function useUsers(params: UseUsersParams = {}) {
  const { page, limit } = params;

  return useQuery<PaginatedUsersResponse>({
    queryKey: ['users', { page, limit }],
    queryFn: () => fetchUsers(page, limit),
    keepPreviousData: true,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}