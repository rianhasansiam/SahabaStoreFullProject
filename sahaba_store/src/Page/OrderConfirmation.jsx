import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaShippingFast, FaMoneyBillWave, FaHome } from 'react-icons/fa';
import { useFetchData } from '../hooks/useFetchData';
import LoadingPage from '../Conponents/LoadingPage';

const OrderConfirmation = () => {
  const { state } = useLocation();
  // Defensive fallback for order data
  const fallbackOrder = {
    _id: '68276cc06964e0d3e4c33f68',
    customer: {
      name: 'Customer',
      phone: ''
    },
    shipping: {
      address: ''
    },
    payment: {
      method: '',
      status: ''
    },
    products: [],
    orderTotal: 0,
    status: 'processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Fetch all orders from backend
  const { data, isLoading, error } = useFetchData('orders', '/orders');

  // Get orderId from state if available
  const orderId = state?.order?._id;

  // Find the order from backend data if possible
  let order = fallbackOrder;
  if (data && data.orders && Array.isArray(data.orders)) {
    if (orderId) {
      const found = data.orders.find(o => o._id === orderId);
      if (found) order = found;
    } else if (data.orders.length > 0) {
      // fallback: use the latest order
      order = data.orders[data.orders.length - 1];
    }
  } else if (state?.order && typeof state.order === 'object') {
    order = state.order;
  }

  // Format date safely
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '';

  // Defensive helpers
  const customerName = order.customer?.name || 'Customer';
  const customerFirstName = customerName.split(' ')[0] || customerName;
  const orderProducts = Array.isArray(order.products) ? order.products : [];
  const orderTotal = typeof order.orderTotal === 'number' ? order.orderTotal : 0;
  const paymentMethod = order.payment?.method || 'N/A';
  const paymentStatus = order.payment?.status || 'N/A';
  const shipping = order.shipping || {};

  if (isLoading) {
    return (
     <LoadingPage></LoadingPage>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">Failed to load order details.</div>
    );
  }
console.log(orderProducts)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Order Success Header */}
        <div className="text-center mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase, {customerFirstName}!
          </p>
          <p className="text-gray-700">
            Your order <span className="font-semibold">#{order._id ? order._id.slice(-8) : 'N/A'}</span> has been received and is being processed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Order Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBox className="mr-2 text-[#22874b]" /> Order Summary
            </h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Number</p>
                  <p className="font-medium">#{order._id ? order._id.slice(-8) : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date Placed</p>
                  <p className="font-medium">{orderDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Amount</p>
                  <p className="font-medium">৳{orderTotal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium capitalize">{paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Ordered Items ({orderProducts.length})</h3>
              <div className="space-y-4">
                {orderProducts.length === 0 ? (
                  <div className="text-gray-400 italic">No products found for this order.</div>
                ) : (
                  orderProducts.map((product, index) => (
                    <div key={index} className="flex border-b border-gray-100 pb-4">
                      <div className="flex-shrink-0 mr-4">
                        <img
                          src={product.thumbnail || product.image || 'https://via.placeholder.com/64'}
                          alt={product.name || 'Product'}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name || 'Product'}</h4>
                        <p className="text-sm text-gray-500">Product ID: {product.productId || '--'}</p>
                        <p className='border rounded-full border-[#22874b] w-20 text-center my-2 bg-green-100'>{product.variant || product.size || 'll'}</p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">৳{(product.price || 0).toFixed(2)} × {product.quantity || 1}</p>
                          <p className="font-medium">৳{((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span>৳{orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping</span>
                <span>৳0.00</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">৳{orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info Card */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaHome className="mr-2 text-[#22874b]" /> Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{order.customer?.phone || ''}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaShippingFast className="mr-2 text-[#22874b]" /> Shipping Address
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{shipping.address || ''}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaMoneyBillWave className="mr-2 text-[#22874b]" /> Payment Method
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="font-medium capitalize">{paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{paymentStatus}</p>
                </div>
                {paymentMethod === 'cash-on-delivery' && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-700">
                      Please prepare exact amount for the delivery person
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
            
            {/* Timeline Steps */}
            <div className="relative pl-10 pb-6">
              <div className="flex items-start mb-1">
                <div className={`absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'processing' ? 'bg-[#22874b] text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className="ml-4">
                  <h3 className={`font-medium ${order.status === 'processing' ? 'text-[#22874b]' : 'text-gray-500'}`}>Order Processing</h3>
                  <p className="text-sm text-gray-500">We've received your order</p>
                </div>
              </div>
            </div>

            <div className="relative pl-10 pb-6">
              <div className="flex items-start mb-1">
                <div className={`absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'shipped' ? 'bg-[#22874b] text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <div className="ml-4">
                  <h3 className={`font-medium ${order.status === 'shipped' ? 'text-[#22874b]' : 'text-gray-500'}`}>Shipped</h3>
                  <p className="text-sm text-gray-500">Your order is on the way</p>
                </div>
              </div>
            </div>

            <div className="relative pl-10">
              <div className="flex items-start">
                <div className={`absolute -left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-[#22874b] text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <div className="ml-4">
                  <h3 className={`font-medium ${order.status === 'delivered' ? 'text-[#22874b]' : 'text-gray-500'}`}>Delivered</h3>
                  <p className="text-sm text-gray-500">Your order has arrived</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#22874b] text-white rounded-md font-medium hover:bg-[#135a6e] transition-colors"
          >
            Continue Shopping
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Need help? <Link to="/contact" className="text-[#22874b] hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;