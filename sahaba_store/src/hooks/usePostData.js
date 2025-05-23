import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import { toast } from "react-toastify";

export const usePostData = (key) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post(key, data).then(response => response.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success('Data posted successfully!');
    },
    onError: (error) => {
      // You can add error handling here if needed
      // toast.error('Error posting data!');
      console.log(error)
    }
  });
};