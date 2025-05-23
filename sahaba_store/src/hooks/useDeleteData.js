import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

export const useDeleteData = (key) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
   
      const res = await api.delete(`${key}/${id}`);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });
};
