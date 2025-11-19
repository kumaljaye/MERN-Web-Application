import { useQuery } from '@tanstack/react-query';
import {
  fetchUsers,
  fetchAllUsers,
  PaginationParams,
  PaginatedUsersResponse,
} from '@/apis/user';

export function useUsers(params?: PaginationParams) {
  return useQuery<PaginatedUsersResponse>({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}



