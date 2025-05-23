import { useParams, useNavigate } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { useState, useContext, useEffect, useMemo } from 'react';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaArrowRight } from 'react-icons/fa';
import { contextData } from '../Contex';
import api from '../hooks/api';
import { toast } from 'react-toastify';
import LoadingPage from '../Conponents/LoadingPage';
import details1 from '../assets/img/details1.jpg';
import details2 from '../assets/img/details2.png';  
import details3 from '../assets/img/details3.png';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);  const { data: product, isLoading, error } = useFetchData(
    'product',
    `/products/${id}`
  );
  const { userData, setCheckoutProducts, setFinalPrice } = useContext(contextData);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  
  // Set the selected variant when product data loads
  useEffect(() => {
    if (product?.priceVariants?.length > 0) {
      setSelectedVariant(product.priceVariants[0]);
    }
  }, [product]);
  
  // Get price range from the product price field
  const priceRange = useMemo(() => {
    if (!product?.price) return { min: 0, max: 0 };
    
    if (product.price.includes('-')) {
      const [min, max] = product.price.split('-').map(p => parseFloat(p.trim()));
      return { min, max };
    }
    
    const singlePrice = parseFloat(product.price);
    return { min: singlePrice, max: singlePrice };
  }, [product]);
  
  // Get current price based on selected variant
  const currentPrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return priceRange.min;
  }, [selectedVariant, priceRange]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product?._id) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
      setIsInWishlist(!!wishlist[product._id]);
    }
  }, [product]);

  const handleWishlistToggle = async () => {
    

    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
      const newWishlistState = !isInWishlist;

      if (newWishlistState) {
        // Add to wishlist
        await api.put('/add-to-wishlist', {
          email: userData.email,
          productId: product._id
        });
        wishlist[product._id] = true;
        toast.success('Added to wishlist');
      } else {
        // Remove from wishlist
        await api.put('/remove-from-wishlist', {
          email: userData.email,
          productId: product._id
        });
        delete wishlist[product._id];
        toast.success('Removed from wishlist');
      }

      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(newWishlistState);
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    if (product.availableAmount !== undefined && newQuantity > product.availableAmount) {
      toast.error(`Only ${product.availableAmount} items available in stock`);
      return;
    }

    setQuantity(newQuantity);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.availableAmount <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (!selectedVariant && product.priceVariants?.length > 0) {
      toast.error('Please select a variant');
      return;
    }

    setIsAddingToCart(true);
    try {
      // Get current cart data
      const cartData = JSON.parse(localStorage.getItem('addtocart')) || {};
      
      // Check if this product already exists in cart
      const isProductInCart = !!cartData[product._id];
      const newCartItem = {
        quantity: quantity,
        variant: selectedVariant ? selectedVariant.quantity : null,
        price: selectedVariant ? selectedVariant.price : currentPrice,
        name: product.name,
        thumbnail: product.thumbnail,
        productId: product.productId
      };
      
      // If product exists in cart with same variant, update quantity
      if (isProductInCart) {
        const existingItem = cartData[product._id];
        // If same variant or both have no variants, increment quantity
        if ((existingItem.variant === newCartItem.variant) || 
            (!existingItem.variant && !newCartItem.variant)) {
          newCartItem.quantity = existingItem.quantity + quantity;
          
          // Check if quantity exceeds available amount
          if (product.availableAmount && newCartItem.quantity > product.availableAmount) {
            newCartItem.quantity = product.availableAmount;
            toast.warning(`Cart quantity limited to available stock (${product.availableAmount})`);
          }
        }
        // Otherwise it's a different variant of same product, replace it
      }
      
      // Update cart with the new item
      cartData[product._id] = newCartItem;
      
      // Save to localStorage
      localStorage.setItem('addtocart', JSON.stringify(cartData));
      
      // Also update API if user is logged in
      if (userData) {
        await api.put('/add-to-cart', {
          email: userData.email,
          productId: product._id,
          quantity: newCartItem.quantity,
          variant: newCartItem.variant,
          price: newCartItem.price
        });
      }

      // Show success message with variant information
      const variantInfo = selectedVariant ? `(${selectedVariant.quantity})` : '';
      const actionMsg = isProductInCart ? 'updated in' : 'added to';
      toast.success(`${product.name} ${variantInfo} ${actionMsg} cart`);
      
      // Trigger storage event for other components to detect the change
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };  // Handler for Buy Now button
  const handleBuyNow = async () => {
    if (!product) return;
    
    if (product.availableAmount <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (!selectedVariant && product.priceVariants?.length > 0) {
      toast.error('Please select a variant');
      return;
    }
    
    // Check if quantity is more than available stock
    if (product.availableAmount && quantity > product.availableAmount) {
      toast.error(`Only ${product.availableAmount} items available in stock`);
      return;
    }
    
    setIsBuyingNow(true);
    try {
      // First add the product to cart
      // Get current cart data
      const cartData = JSON.parse(localStorage.getItem('addtocart')) || {};
      
      // Create cart item with the current selection
      const newCartItem = {
        quantity: quantity,
        variant: selectedVariant ? selectedVariant.quantity : null,
        price: selectedVariant ? selectedVariant.price : currentPrice,
        name: product.name,
        thumbnail: product.thumbnail,
        productId: product.productId
      };
      
      // Update cart with the new item
      cartData[product._id] = newCartItem;
      
      // Save to localStorage
      localStorage.setItem('addtocart', JSON.stringify(cartData));
      
      // Create checkout products array for direct checkout
      const checkoutProducts = [{
        id: product._id,
        productId: product.productId,
        name: product.name,
        price: selectedVariant ? selectedVariant.price : currentPrice,
        quantity: quantity,
        image: product.thumbnail,
        size: selectedVariant ? selectedVariant.quantity : null,
        totalPrice: (selectedVariant ? selectedVariant.price : currentPrice) * quantity
      }];
      
      // Set the checkout products in context
      setCheckoutProducts(checkoutProducts);
      setFinalPrice((selectedVariant ? selectedVariant.price : currentPrice) * quantity);
      
      // Trigger storage event for other components to detect the change
      window.dispatchEvent(new Event('storage'));
      
      // Show success message
      toast.success('Redirecting to checkout...');
      
      // Redirect directly to checkout page
      navigate('/checkout');
      
    } catch (err) {
      console.error('Buy now error:', err);
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsBuyingNow(false);
    }
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <div className="text-center py-20 text-red-500">Error loading product</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product Gallery */}
          {product.images && product.images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleWishlistToggle}
              className={`flex-1 py-2 px-4 rounded flex items-center justify-center gap-2 ${
                isInWishlist 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <FaHeart className={isInWishlist ? "text-red-500" : "text-gray-500"} /> 
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded flex items-center justify-center gap-2">
              <FaShare /> Share
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            {/* <span className="text-gray-600">(24 reviews)</span> */}
          </div>

          <div className="mb-6">
            {product.price && (
              <div>
                <span className="text-xl font-bold text-gray-700">
                  {product.price} BDT
                </span>
              </div>
            )}
            
           
          </div>

          {/* <p className="text-gray-700 mb-6">{product.description}</p> */}

          <div className="mb-6">
            {/* <h3 className="text-lg font-semibold mb-2">Short Description</h3> */}
            <p className="text-gray-600">{product.shortDescription}</p>
          </div>

          <div className="mb-6">
            {/* <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Availability:</span>
              <span className={`font-semibold ${
                product.availableAmount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.availableAmount > 0 
                  ? `In Stock (${product.availableAmount} available)` 
                  : 'Out of Stock'}
              </span>
            </div> */}


            <div className="font-medium mb-2">Product ID: <span className="font-normal">{product.productId}</span></div>
          </div>


           {selectedVariant && (
              <div className="my-4">
                <span className="text-3xl font-bold text-gray-900">
                  {selectedVariant.price.toFixed(2)} BDT
                </span>
                
              </div>
            )}
          {/* Variant Selection */}
          {product.priceVariants && product.priceVariants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Select Variant</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.priceVariants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantChange(variant)}
                    className={`py-2 px-3 border rounded-md flex items-center justify-center gap-1 ${
                      selectedVariant && selectedVariant.quantity === variant.quantity
                        ? 'bg-[#22874b] text-white border-[#22874b]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#22874b]'
                    }`}
                  >
                    {variant.quantity}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                className="border border-gray-300 rounded-l-md px-4 py-2 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="border-t border-b border-gray-300 px-6 py-2 min-w-[60px] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className={`border border-gray-300 rounded-r-md px-4 py-2 hover:bg-gray-100 transition-colors ${
                  product.availableAmount && quantity >= product.availableAmount ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={product.availableAmount && quantity >= product.availableAmount}
              >
                +
              </button>
            </div>
          </div>          <div className="flex items-center gap-2 mb-8">
            <button 
              onClick={handleAddToCart}
              className={`flex-1 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
                product.availableAmount <= 0 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#22874b] hover:bg-[#479aac]'
              }`}
              disabled={product.availableAmount <= 0 || isAddingToCart}
            >
              <FaShoppingCart /> 
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              {selectedVariant && ` (${selectedVariant.quantity})`}
            </button>
            
            <button 
              onClick={handleBuyNow}
              className={`flex-1 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
                product.availableAmount <= 0 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#e75b3a] hover:bg-[#d14e2f] font-medium'
              }`}              disabled={product.availableAmount <= 0 || isBuyingNow}
            >
              {isBuyingNow ? 'Processing...' : (
                <>
                  Buy Now <FaArrowRight />
                  {selectedVariant && ` (${selectedVariant.quantity})`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-[#22874b] text-[#22874b]">
              Description
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Reviews
            </button>
            <button className="py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Shipping
            </button>
          </nav>
        </div>
        <div className="py-8">
          {/* <h3 className="text-lg font-semibold mb-4">Full Description</h3> */}
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
      </div>




<div className='grid grid-cols-1 lg:grid-cols-3  mt-10  '>

  <div className='flex  items-center justify-start'>
    <img className='w-28' src={details3} alt="" />
    <div>

    <h2 className='font-bold text-lg'>নিরাপদ পেমেন্ট</h2>
    <p className='text-sm'>বিভিন্ন পেমেন্ট পদ্ধতি থেকে বেছে নিন</p>
    </div>
  </div>
  <div className='flex justify-start items-center'>
    <img className='w-28' src={details2} alt="" />
    <div>

    <h2 className='font-bold text-lg'>ডেলেভারি</h2>
    <p className='text-sm'>ঢাকা সিটির ভিতরে ১-২ দিন ঢাকা সিটির বাহিরে ২-৩ দিনের ভিতরে আপনার পন্য পৌছে যাবে
১০০% ন্যাচারাল</p>
    </div>
  </div>
  <div className='flex justify-start items-center'>
    <img className='w-28' src={details1} alt="" />
    <div>

    <h2 className='font-bold text-lg'>১০০% ন্যাচারাল</h2>
    <p className='text-sm'>প্রাকৃতিক উপাদান ব্যবহার করতে আমরা প্রতিশ্রুতিবদ্ধ</p>
    </div>
  </div>


</div>



      
    </div>
  );
};

export default ProductDetails;