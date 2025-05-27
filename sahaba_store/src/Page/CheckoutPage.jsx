import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { contextData } from '../Contex';
import { usePostData } from '../hooks/usePostData';
import Swal from 'sweetalert2';
import ProductSizeTag from '../Conponents/ProductSizeTag';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const { 
    finalPrice, 
    checkoutProducts,
    clearCart // Add this to your context if not already present
  } = useContext(contextData);
    const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const postOrder = usePostData('/add-order');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [calculatedTotal, setCalculatedTotal] = useState(finalPrice);
  
  // Fetch coupons from API
  const fetchCoupons = async () => {
    try {
      const response = await fetch('https://api.sahaba-store.shop/coupons');
      const data = await response.json();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    }
  };
  // Check for applied coupon in localStorage
  useEffect(() => {
    fetchCoupons();
    const couponData = localStorage.getItem('appliedCoupon');
    if (couponData) {
      const savedCoupon = JSON.parse(couponData);
      setAppliedCoupon(savedCoupon);
      setDiscount(savedCoupon.discount);
    } else {
      setCalculatedTotal(finalPrice);
    }
  }, [finalPrice]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    paymentMethod: 'cash-on-delivery' // Default payment method
  });

  const [formErrors, setFormErrors] = useState({});
  // Apply coupon code
  const applyCoupon = () => {
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const foundCoupon = coupons.find(coupon => 
      coupon.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (!foundCoupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (foundCoupon.status !== 'active') {
      setCouponError('This coupon is not active');
      return;
    }

    // Calculate subtotal to check minimum order
    const subtotal = checkoutProducts.reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);

    if (subtotal < foundCoupon.minOrder) {
      setCouponError(`Minimum order amount for this coupon is ৳${foundCoupon.minOrder}`);
      return;
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (foundCoupon.type === 'fixed') {
      discountAmount = foundCoupon.discount;
    } else if (foundCoupon.type === 'percentage') {
      discountAmount = subtotal * (foundCoupon.discount / 100);
    }
    
    setAppliedCoupon(foundCoupon);
    setDiscount(discountAmount);
    
    // Calculate new total with discount
    const newTotal = subtotal - discountAmount;
    setCalculatedTotal(newTotal > 0 ? newTotal : 0);
    
    // Save coupon to localStorage
    localStorage.setItem('appliedCoupon', JSON.stringify({
      code: foundCoupon.code,
      discount: discountAmount,
      type: foundCoupon.type
    }));
    
    toast.success('Coupon applied successfully!');
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    setCalculatedTotal(finalPrice);
    localStorage.removeItem('appliedCoupon');
    toast.info('Coupon removed');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'phone', 'address'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    // Validate phone number (Bangladeshi format)
    if (formData.phone && !/^01[3-9]\d{8}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid Bangladeshi phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Form Errors',
        text: 'Please fix the errors in the form before submitting',
      });
      return;
    }

    if (checkoutProducts.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Empty Cart',
        text: 'Your cart is empty. Please add products before checkout',
      });
      return;
    }    setIsSubmitting(true);      const orderData = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
      },
      shipping: {
        address: formData.address,
      },
      payment: {
        method: formData.paymentMethod,
        status: formData.paymentMethod === 'cash-on-delivery' ? 'pending' : 'paid',
      },
      products: checkoutProducts.map(product => ({
        productId: product.id || product.productId,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        size: product.size || "250 ml", // Ensure size is included
        totalPrice: (product.price * product.quantity) // Calculate total price per product
      })),
      coupon: appliedCoupon ? {
        code: appliedCoupon.code,
        discount: discount,
        type: appliedCoupon.type
      } : null,
      subtotal: appliedCoupon ? calculatedTotal + discount : calculatedTotal,
      orderTotal: calculatedTotal,
      createdAt: new Date().toISOString()
    };try {
      const response = await postOrder.mutateAsync(orderData);
        // Clear cart on successful order
      if (clearCart) {
        clearCart();
        localStorage.removeItem('appliedCoupon'); // Clear applied coupon data
      }      
      
      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: `Your order #${response?.data?._id || ''} has been placed successfully`,
        showCancelButton: true,
        confirmButtonText: 'View Order Details',
        cancelButtonText: 'Continue Shopping'
      }).then((result) => {        if (result.isConfirmed) {
          navigate('/orderOverview', { state: { order: response?.data || orderData } });
        } else {
          navigate('/');
        }
      });
      
    } catch (error) {
      console.error('Order submission error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.response?.data?.message || 'There was an error processing your order. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to recalculate total when discount or products change
  useEffect(() => {
    if (checkoutProducts.length > 0) {
      const subtotal = checkoutProducts.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
      }, 0);
      
      const total = subtotal - discount;
      setCalculatedTotal(total > 0 ? total : 0);
    }
  }, [checkoutProducts, discount]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

          <div className="flex justify-center mt-4 ">

            <div className="flex items-center flex-wrap justify-center">

              <div className="flex items-center ">
                <div className="w-8 h-8 rounded-full bg-[#22874b] flex items-center justify-center ">
                  <span className="text-white">1</span>
                </div>
                <span className="ml-2 text-sm font-medium">Shopping Cart</span>
              </div>
              <div className="mx-4 h-px w-16 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#22874b] flex items-center justify-center">
                  <span className="text-[#22874b]">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-[#22874b]">Checkout</span>
              </div>



              <div className="mx-4 h-px w-16 bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">3</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-400">Order Complete</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full  border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b] bg-gray-100 focus:bg-white`}
                      required
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b] bg-gray-100 focus:bg-white"
                    />
                  </div>
                </div>

                {/* <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b] bg-gray-100 focus:bg-white`}
                    required
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div> */}

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b] bg-gray-100 focus:bg-white`}
                    required
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b] bg-gray-100 focus:bg-white`}
                    required
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                  )}
                </div>
{/* 
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Police Station *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b]`}
                      required
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b]`}
                      required
                    >
                      <option value="Bangladesh">Bangladesh</option>
                     
                    </select>
                  </div>
                 
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#22874b]"
                    />
                  </div>
                </div> */}

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cash-on-delivery"
                        name="paymentMethod"
                        value="cash-on-delivery"
                        checked={formData.paymentMethod === 'cash-on-delivery'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#22874b] focus:ring-[#22874b] border-gray-300"
                      />
                      <label htmlFor="cash-on-delivery" className="ml-2 block text-sm text-gray-700">
                        Cash On Delivery
                      </label>
                    </div>
                    {/* <div className="flex items-center">
                      <input
                        type="radio"
                        id="bkash"
                        name="paymentMethod"
                        value="bkash"
                        checked={formData.paymentMethod === 'bkash'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#22874b] focus:ring-[#22874b] border-gray-300"
                      />
                      <label htmlFor="bkash" className="ml-2 block text-sm text-gray-700">
                        bKash
                      </label>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {checkoutProducts.map((product, index) => (
                  <div key={index} className="flex items-center border-b border-gray-200 pb-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={product.image || 'https://via.placeholder.com/80'} 
                        alt={product.name} 
                        className="w-20 h-20 rounded-md object-cover" 
                      />
                    </div>                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                        <p className="ml-4 text-sm font-medium text-gray-900">৳{product.price.toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <ProductSizeTag size={product.size} className="mr-2" />
                        {product.size && product.size !== "250 ml" && (
                          <span className="text-xs text-amber-600">(Size-adjusted price)</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                      <p className="text-sm text-gray-500">Subtotal: ৳{(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium">৳{(appliedCoupon ? calculatedTotal + discount : calculatedTotal).toFixed(2)}</span>
                  </div>
                  
                  {/* Coupon Code Section */}
                  {!appliedCoupon ? (
                    <div className="py-3">
                      <label htmlFor="coupon" className="block text-sm font-medium text-gray-700  mb-1">
                        Have a coupon?
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 border border-gray-300 rounded-l-md bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#22874b]"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-[#22874b] text-white px-3 py-2 rounded-r-md text-sm hover:bg-[#1c6e3c] transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-1 text-xs text-red-600">{couponError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">Coupon Discount ({appliedCoupon.code})</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">-৳{discount.toFixed(2)}</span>
                        <button 
                          onClick={removeCoupon}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-sm font-medium">৳0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3">
                    <span className="text-base font-medium">Total</span>
                    <span className="text-base font-medium">৳{calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || checkoutProducts.length === 0}
                  className={`w-full bg-[#22874b] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium ${(isSubmitting || checkoutProducts.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-500">
                By placing your order, you agree to our{' '}
                <Link to="/terms" className="text-[#22874b] hover:text-[#135a6e]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#22874b] hover:text-[#135a6e]">
                  Privacy Policy
                </Link>.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;