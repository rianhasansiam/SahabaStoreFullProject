import { useFetchData } from "../../hooks/useFetchData";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDeleteData } from "../../hooks/useDeleteData";
import Swal from "sweetalert2";
import LoadingPage from "../../Conponents/LoadingPage";

const AllUsers = () => {
  const queryClient = useQueryClient();

  const { 
    data: posts, 
    isLoading, 
    isError, 
    error ,
    refetch
  } = useFetchData('posts', '/allusers', {
    staleTime: 10 * 60 * 1000,
  });



  // const handleDelete = async (userId) => {
  //   try {
  //     await axios.delete(`/deleteuser/${userId}`);
  //     queryClient.invalidateQueries(['posts']); // refetch after deletion
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //   }
  // };


  useEffect(() => {
 
refetch()
  
}, []);


//delete user
const { mutate: deleteUser } = useDeleteData(`/delete-user`);


const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Call delete function here
      deleteUser(id); // This would be your custom delete logic
      Swal.fire('Deleted!', 'The user has been deleted.', 'success');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('Cancelled', 'Your user is safe :)', 'error');
    }
  });
};





  if (isLoading) return <LoadingPage></LoadingPage>
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users Management </h1>

      
      <div className="bg-white rounded-lg shadow overflow-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((user, index) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index+1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.displayName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-500">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userRole}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
