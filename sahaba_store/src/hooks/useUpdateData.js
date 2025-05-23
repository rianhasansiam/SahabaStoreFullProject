import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

export const useUpdateData = (key) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`${key}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });
};
