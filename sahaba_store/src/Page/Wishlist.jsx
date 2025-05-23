import React, { useEffect, useState, useContext } from 'react';
import { ShoppingCartIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import api from '../hooks/api';
import { Link, useNavigate } from 'react-router-dom';
import LoadingPage from '../Conponents/LoadingPage';
import WishlistCard from '../Conponents/WishlistCard';
import { getWishlistItems, moveWishlistToCart } from '../hooks/wishlistUtils';
import { toast } from 'react-toastify';
import { contextData } from '../Contex';

const Wishlist = () => {
  const [reload, setReload] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { setFinalPrice, setCheckoutProducts } = useContext(contextData);
  const navigate = useNavigate();

  // Load wishlist items from localStorage
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoadingProducts(true);
      
      try {        // Get wishlist items from localStorage
        let localWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
        
        // Convert object to array of product IDs
        const productIds = Object.keys(localWishlist);
        
        // Format each item to have consistent structure
        const formattedItems = productIds.map(id => ({ productId: id }));
        
        setWishlistItems(formattedItems);
        
        if (formattedItems.length === 0) {
          setSubtotal(0);
          setWishlistProducts([]);
          setLoadingProducts(false);
          return;
        }
        
        // Fetch product info for each wishlist item
        try {
          const productPromises = formattedItems.map(item =>
            api.get(`/eachproduct/${item.productId}`)
          );
          const productResponses = await Promise.all(productPromises);
          const products = productResponses.map(res => res.data);
          setWishlistProducts(products);
            // Calculate subtotal
          const calculatedSubtotal = products.reduce((sum, product) => {
            // Get price from variants if available, otherwise use default price
            let price = 0;
            if (product.priceVariants && product.priceVariants.length > 0) {
              price = parseFloat(product.priceVariants[0].price) || 0;
            } else {
              price = parseFloat(product.price) || 0;
            }
            return sum + price;
          }, 0);
          setSubtotal(calculatedSubtotal);
        } catch (error) {
          console.error("Error fetching product details:", error);
          setSubtotal(0);
          setWishlistProducts([]);
        }
      } catch (error) {
        console.error("Error processing wishlist:", error);
        setWishlistItems([]);
        setWishlistProducts([]);
        setSubtotal(0);
      }
      
      setLoadingProducts(false);
    };
    
    fetchWishlistProducts();
  }, [reload]);
  // Add this function to move all wishlist items to cart
  const handleMoveAllToCart = () => {
    if (moveWishlistToCart()) {
      setReload(!reload);
    }
  };  // Continue to checkout - add all to cart and redirect
  const handleCheckout = () => {
    if (moveWishlistToCart()) {
      // Navigate to cart
      navigate('/addtocart')
    }
  };
  
  // Buy all wishlist items directly
  const handleBuyAll = () => {
    if (wishlistProducts.length === 0) {
      toast.info('Your wishlist is empty');
      return;
    }
    
    try {
      // Prepare checkout products array
      const checkoutItems = wishlistProducts.map(product => {
        // Get default variant if available
        const defaultVariant = product.priceVariants && product.priceVariants.length > 0 
          ? product.priceVariants[0]
          : null;
            // Get price
        const price = defaultVariant ? parseFloat(defaultVariant.price) : parseFloat(product.price);
        
        return {
          image: product.thumbnail || product.image,
          price: price,
          productId: product._id,
          id: product._id,
          name: product.name,
          quantity: 1,
          totalPrice: price
        };
      });
      
      // Calculate total price
      const totalPrice = checkoutItems.reduce((sum, item) => sum + item.price, 0);
      
      // Set checkout context
      setCheckoutProducts(checkoutItems);
      setFinalPrice(totalPrice);
      
      // Show success message
      toast.success('Proceeding to checkout with all wishlist items');
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error buying all items:', error);
      toast.error('Failed to proceed to checkout');
    }
  };

  const itemCount = wishlistItems.length;

  if (loadingProducts && wishlistItems.length === 0) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900">WISHLIST</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Wishlist Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Wishlist ({itemCount})</h2>
                <div className="flex space-x-3">
                  {/* <button
                    className="text-[#22874b] hover:text-[#135a6e] flex items-center"
                    onClick={handleMoveAllToCart}
                    disabled={loadingProducts || !wishlistItems.length}
                  >
                    Move all to cart <ShoppingCartIcon className="ml-2 h-5 w-5" />
                  </button> */}
                  <button
                    className="text-[#e75b3a] hover:text-[#d14e2f] flex items-center"
                    onClick={handleBuyAll}
                    disabled={loadingProducts || !wishlistItems.length}
                  >
                    Buy All <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>{wishlistItems.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-gray-500 mb-4 text-lg">Your wishlist is empty</p>
                  <Link 
                    to="/" 
                    className="text-[#22874b] hover:text-[#135a6e] flex items-center justify-center text-lg"
                  >
                    <ShoppingCartIcon className="h-6 w-6 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <WishlistCard 
                  products={wishlistProducts}
                  items={wishlistItems}
                  setReload={setReload} 
                  reload={reload}
                />
              )}
            </div>
          </div>

          {/* Summary */}

          {/* {wishlistItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">
                      {loadingProducts ? 'Loading...' : `${subtotal.toFixed(2)} BDT`}
                    </span>
                  </div>
                    <div className="text-sm text-gray-500">
                    Taxes and shipping calculated at checkout
                  </div>
                  <button
                    className="w-full bg-[#22874b] hover:bg-[#135a6e] text-white py-3 px-4 rounded-md font-medium flex items-center justify-center"
                    onClick={handleCheckout}
                    disabled={loadingProducts || !wishlistItems.length}
                  >
                    Continue to Checkout <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </button>
                  <div className="flex justify-center mt-4">
                    <Link to="/" className="text-[#22874b] hover:text-[#135a6e] flex items-center">
                      Continue Shopping <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;