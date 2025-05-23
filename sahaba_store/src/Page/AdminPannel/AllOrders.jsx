import LoadingPage from '../../Conponents/LoadingPage';
import { useFetchData } from '../../hooks/useFetchData';
import { useUpdateData } from '../../hooks/useUpdateData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AllOrders = () => {
  const { data, isLoading, error } = useFetchData('orders', '/orders');
  const { mutate: updateOrderStatus, isLoading: isUpdating } = useUpdateData('/orders');
  const deleteOrder = useDeleteData('delete-order');

  const [searchTerm, setSearchTerm] = useState('');

  const orders = data && Array.isArray(data.orders) ? data.orders : [];
  // Filter orders by customer name, phone, or order ID
  const filteredOrders = orders.filter(order => {
    const customer = order.customer || {};
    const id = order._id ? String(order._id) : '';
    return (
      (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus({ id: orderId, data: { status: newStatus } }); // Only send status
  };
  
  const handleDeleteOrder = (orderId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder.mutate(orderId, {
          onSuccess: () => {
            Swal.fire(
              'Deleted!',
              'Order has been deleted.',
              'success'
            );
          },
          onError: (error) => {
            console.error("Error deleting order:", error);
            Swal.fire(
              'Error!',
              'Failed to delete order.',
              'error'
            );
          }
        });
      }
    });
  };

  if (isLoading) return <LoadingPage></LoadingPage>
  if (error) return <div className="p-8 text-lg text-red-600">Failed to load orders.</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>
      {/* Search Bar */}      <div className="mb-4 flex items-center gap-2 max-w-md">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by customer name, phone, or order ID..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No orders found.</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id ? String(order._id).slice(-8) : '--'}
                  </td>                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="font-medium text-gray-900">{order.customer?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{order.customer?.phone || 'No phone'}</div>
                    {order.shipping && (
                      <div className="mt-1 text-xs text-gray-400">
                        <div>{order.shipping.address || ''}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-BD') : ''}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">                    {order.products?.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {order.products.map((product, idx) => (
                          <li key={idx} className="mb-1">
                            <span className="inline-flex items-center">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full mr-1">
                                {product.variant || product.size || "250ml"}
                              </span>
                              <span>{product.name}</span>
                              <span className="ml-1 text-gray-600">(×{product.quantity})</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : 'No products'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ৳{order.orderTotal?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status || 'processing'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      disabled={isUpdating}
                    >
                      <option value="processing">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => handleDeleteOrder(order._id)} 
                      className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                      disabled={deleteOrder.isLoading}
                    >
                      {deleteOrder.isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;