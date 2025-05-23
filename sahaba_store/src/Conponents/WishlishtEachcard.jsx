import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import { removeFromWishlist } from '../hooks/wishlistUtils';
import { contextData } from '../Contex';

const WishlishtEachcard = ({ product, id, setreload, reload }) => {
  const navigate = useNavigate();
  const { setCheckoutProducts, setFinalPrice } = useContext(contextData);
    if (!product) {
    return <LoadingPage />;
  }
  
  // Handle remove from Wishlist
  const handleRemoveToWishlist = (productId) => {
    const success = removeFromWishlist(productId);
    if (success) {
      setreload(!reload);
    }
  };

  const handleAddtoCart = (productId) => {
    try {
      // Check if product is in stock
      if (product.availableAmount !== undefined && product.availableAmount <= 0) {
        toast.error(`${product.name} is out of stock`);
        return;
      }
      
      // Get current cart
      let cart = JSON.parse(localStorage.getItem("addtocart")) || {};
      
      // Check if product already exists in cart
      if (!cart[productId]) {
        // Get the default variant (first one if available)
        const defaultVariant = product.priceVariants && product.priceVariants.length > 0 
          ? product.priceVariants[0]
          : null;
          // Get base price
        const basePrice = defaultVariant ? defaultVariant.price : parseFloat(product.price);
        
        // Create cart item with full product details
        cart[productId] = {
          name: product.name,
          price: basePrice,
          productId: product.productId || product._id,
          quantity: 1,
          thumbnail: product.thumbnail || product.image
        };
        
        localStorage.setItem("addtocart", JSON.stringify(cart));
        toast.success(`${product.name} added to cart`);
        
        // Trigger storage event for other components to detect the change
        window.dispatchEvent(new Event('storage'));
      } else {
        toast.info(`${product.name} is already in your cart`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };
  
  // Handle Buy Now functionality
  const handleBuyNow = (productId) => {
    try {
      // Check if product is in stock
      if (product.availableAmount !== undefined && product.availableAmount <= 0) {
        toast.error(`${product.name} is out of stock`);
        return;
      }
      
      // Get the default variant (first one if available)
      const defaultVariant = product.priceVariants && product.priceVariants.length > 0 
        ? product.priceVariants[0]
        : null;
      
      // Get size and base price
      const size = defaultVariant ? defaultVariant.quantity : "250ml";
      const basePrice = defaultVariant ? defaultVariant.price : parseFloat(product.price);
      
      // Calculate adjusted price based on size
      const adjustedPrice = basePrice;
      
      // Create checkout item
      const checkoutItem = {
        image: product.thumbnail || product.image,
        price: adjustedPrice,
        productId: product.productId || product._id,
        id: productId,
        name: product.name,
        quantity: 1,
        size: size,
        totalPrice: adjustedPrice
      };
      
      // Set checkout context
      setCheckoutProducts([checkoutItem]);
      setFinalPrice(adjustedPrice);
      
      // Show success message
      toast.success('Proceeding to checkout...');
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error("Failed to proceed to checkout");
    }
  };

  // Get display price for product
  const getDisplayPrice = () => {
    if (product.priceVariants && product.priceVariants.length > 0) {
      return `${product.priceVariants[0].price} BDT`;
    } else if (product.price) {
      if (product.price.includes('-')) {
        return product.price + ' BDT';
      } else {
        return `${product.price} BDT`;
      }
    }
    return '0 BDT';
  };

  return (
    <div className="py-6 flex flex-col sm:flex-row border-b">
      <div className="flex-shrink-0 mb-4 sm:mb-0">
        <img
          className="h-32 w-32 rounded-md object-cover"
          src={product?.thumbnail || product?.image}
          alt={product?.name}
        />
      </div>
      <div className="ml-0 sm:ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{product?.name}</h3>
            <p className="text-gray-500">{product?.shortDescription}</p>
            
            {/* Show variant/size info if available */}
            {product.priceVariants && product.priceVariants.length > 0 && (
              <div className="mt-1">
                <span className="text-xs inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {product.priceVariants[0].quantity}
                </span>
              </div>
            )}
            
            {/* Show stock info if available */}
            {product.availableAmount !== undefined && (
              <div className={`mt-1 text-xs ${
                product.availableAmount <= 0 ? 'text-red-600' : 
                product.availableAmount < 5 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {product.availableAmount <= 0 ? 'Out of stock' : 
                 product.availableAmount < 5 ? `Only ${product.availableAmount} left` : 
                 `In stock`}
              </div>
            )}
          </div>
          <button 
            onClick={() => handleRemoveToWishlist(id?.productId || id)} 
            className="text-red-500"
          >
            <HeartIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-[#22874b]">
            {getDisplayPrice()}
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAddtoCart(id?.productId || id)} 
              className={`bg-[#22874b] hover:bg-[#135a6e] text-white px-3 py-2 rounded-md flex items-center text-sm transition-colors ${
                product.availableAmount !== undefined && product.availableAmount <= 0 
                  ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={product.availableAmount !== undefined && product.availableAmount <= 0}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-1" /> Cart
            </button>
            <button 
              onClick={() => handleBuyNow(id?.productId || id)} 
              className={`bg-[#e75b3a] hover:bg-[#d14e2f] text-white px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors ${
                product.availableAmount !== undefined && product.availableAmount <= 0 
                  ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={product.availableAmount !== undefined && product.availableAmount <= 0}
            >
              Buy Now <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

WishlishtEachcard.propTypes = {
  product: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setreload: PropTypes.func.isRequired,
  reload: PropTypes.bool
};

export default WishlishtEachcard;
