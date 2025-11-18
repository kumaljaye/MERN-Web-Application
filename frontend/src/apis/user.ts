import apiClient from '@/libs/axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface PaginatedUsersResponse<TUser = any> {
  users: TUser[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export async function fetchUsers(page?: number, limit?: number): Promise<PaginatedUsersResponse> {
  try {
    const params: Record<string, number> = {};
    if (typeof page === 'number') params.page = page;
    if (typeof limit === 'number') params.limit = limit;

    const response = await apiClient.get(`${API_BASE_URL}/api/users`, { params });
    console.log('Full API response:', response.data);
    
    if (Array.isArray(response.data)) {
      return {
        users: response.data,
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

    if (response.data?.users && response.data?.pagination) {
      return response.data as PaginatedUsersResponse;
    }

    if (response.data?.data) {
      const fallbackData = response.data.data;
      return {
        users: fallbackData,
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
    const fallback = response.data?.users ?? response.data?.data ?? response.data ?? [];
    return {
      users: Array.isArray(fallback) ? fallback : [],
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
    console.error('Error fetching users:', err);
    throw new Error("Failed to fetch users");
  }
}

// Add new user to MongoDB
export async function addUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
}) {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/api/users`, userData);
    console.log('User added successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error adding user:', err);
    
    // Extract error message from server response
    const errorMessage = err.response?.data?.error || err.message || "Failed to add user";
    throw new Error(errorMessage);
  }
}

// Update user in MongoDB
export async function updateUser(userId: string, userData: {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
}) {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/api/users/${userId}`, userData);
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error updating user:', err);
    
    // Extract error message from server response
    const errorMessage = err.response?.data?.error || err.message || "Failed to update user";
    throw new Error(errorMessage);
  }
}

// Delete user from MongoDB
export async function deleteUser(userId: string) {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/api/users/${userId}`);
    console.log('User deleted successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error deleting user:', err);
    
    // Extract error message from server response
    const errorMessage = err.response?.data?.error || err.message || "Failed to delete user";
    throw new Error(errorMessage);
  }
}


