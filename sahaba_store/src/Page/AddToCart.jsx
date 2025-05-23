import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddtocartProduct from '../Conponents/AddtocartProduct';
import { toast } from 'react-toastify';
import { contextData } from '../Contex';
import LoadingPage from '../Conponents/LoadingPage';

const AddToCart = () => {
  const navigate = useNavigate();
  const { setCheckoutProducts, setFinalPrice } = useContext(contextData);
  const [cartItems, setCartItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Get cart items from local storage
    const storedCart = JSON.parse(localStorage.getItem('addtocart')) || {};
    setCartItems(storedCart);
    setLoading(false);
    
    // Calculate total price
    calculateTotal(storedCart);
  }, []);

  // Calculate total price from cart items
  const calculateTotal = (items) => {
    const subtotal = Object.values(items).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    setTotalPrice(subtotal);
    return subtotal;
  };

  // Update cart when quantity or variant changes
  const updateCart = (productId, updates) => {
    const updatedCart = { ...cartItems };
    
    // Update the specific product with new data
    updatedCart[productId] = {
      ...updatedCart[productId],
      ...updates
    };
    
    // Save to local storage
    localStorage.setItem('addtocart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Recalculate subtotal
    const subtotal = Object.values(updatedCart).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    setTotalPrice(subtotal);
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Cart updated successfully');
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[productId];
    
    localStorage.setItem('addtocart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    
    // Recalculate subtotal
    const subtotal = Object.values(updatedCart).reduce((sum, item) => {
      return sum + (Number(item.price) * item.quantity);
    }, 0);
    
    setTotalPrice(subtotal);
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Item removed from cart');
  };

  // Clear entire cart
  const clearCart = () => {
    localStorage.setItem('addtocart', JSON.stringify({}));
    setCartItems({});
    setTotalPrice(0);
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Cart cleared');
  };

  if (loading) {
    return <LoadingPage></LoadingPage>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
      
      {Object.keys(cartItems).length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="bg-[#22874b] text-white py-3 px-6 rounded-md hover:bg-[#1e463e] transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {Object.entries(cartItems).map(([id, item]) => (
              <AddtocartProduct 
                key={id}
                productId={id}
                product={item}
                updateCart={updateCart}
                removeFromCart={removeFromCart}
              />
            ))}
            
            <div className="flex justify-between mt-6">
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
              <Link 
                to="/products" 
                className="text-[#22874b] hover:text-blue-800 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>৳{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
                
              <button
                onClick={() => {
                  // Convert cart items to array for checkout
                  const products = Object.entries(cartItems).map(([id, item]) => ({
                    id: id,
                    productId: item.productId || id,
                    name: item.name,
                    price: Number(item.price),
                    quantity: item.quantity,
                    image: item.thumbnail,
                    totalPrice: Number(item.price) * item.quantity
                  }));
                    
                  // Update context with cart items and total price
                  setCheckoutProducts(products);
                  setFinalPrice(totalPrice);
                  
                  // Remove any previously applied coupon
                  localStorage.removeItem('appliedCoupon');
                  
                  // Navigate to checkout
                  navigate('/checkout');
                }}
                className="w-full bg-[#22874b] text-white py-3 px-4 rounded-md font-medium text-center block hover:bg-[#1e463e] transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;