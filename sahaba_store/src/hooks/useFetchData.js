import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useFetchData = (key, endpoint, options = {}) => {
  return useQuery({
    queryKey: [key, endpoint], // Include endpoint in query key for uniqueness
    queryFn: async () => {
      try {
        const res = await api.get(endpoint);
        return res.data;
      } catch (error) {
        // Transform error to a more consistent format
        throw new Error(
          error.response?.data?.message || 
          error.message || 
          'Failed to fetch data'
        );
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache by default
    retry: (failureCount, error) => {
      // Don't retry on 404 errors
      if (error.response?.status === 404) return false;
      return failureCount < 3; // Retry 3 times
    },
    ...options, // Allow overriding defaults
  });
};