import { useParams, useNavigate } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';
import { useState, useContext, useEffect, useMemo } from 'react';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { contextData } from '../Contex';
import api from '../hooks/api';
import { toast } from 'react-toastify';
import LoadingPage from '../Conponents/LoadingPage';
import details1 from '../assets/img/details1.jpg';
import details2 from '../assets/img/details2.png';  
import details3 from '../assets/img/details3.png';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);  const { data: product, isLoading, error } = useFetchData(
    'product',
    `/products/${id}`
  );
  const { userData, setCheckoutProducts, setFinalPrice } = useContext(contextData);  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  
  // Customer review images
  const reviewImages = [
    "https://i.ibb.co/GLndPnK/Whats-App-Image-2025-05-31-at-1-49-50-PM.jpg",
    "https://i.ibb.co/k2MyW6wb/Whats-App-Image-2025-05-31-at-1-49-55-PM.jpg",
    "https://i.ibb.co/JRLZ1vvM/Whats-App-Image-2025-05-31-at-1-50-00-PM.jpg",
    "https://i.ibb.co/SDggrtVT/Whats-App-Image-2025-05-31-at-1-50-05-PM.jpg",
    "https://i.ibb.co/CsM2wCp3/Whats-App-Image-2025-05-31-at-1-50-14-PM.jpg",
    "https://i.ibb.co/s97mZpff/Whats-App-Image-2025-05-31-at-1-50-20-PM.jpg",
    "https://i.ibb.co/jPCNw6ft/Whats-App-Image-2025-05-31-at-1-50-25-PM.jpg",
    "https://i.ibb.co/r2hXJHbf/Whats-App-Image-2025-05-31-at-1-50-33-PM.jpg",
    "https://i.ibb.co/gM3tz5F1/Whats-App-Image-2025-05-31-at-1-50-41-PM.jpg",
    "https://i.ibb.co/3m6cvqqq/Whats-App-Image-2025-05-31-at-1-50-51-PM.jpg",
    "https://i.ibb.co/msnb0tn/Whats-App-Image-2025-05-31-at-2-11-58-PM.jpg",
    "https://i.ibb.co/xSswLdqW/Whats-App-Image-2025-05-31-at-2-11-59-PM-1.jpg",
    "https://i.ibb.co/2YyZjGbY/Whats-App-Image-2025-05-31-at-2-11-59-PM.jpg",
   
  ];
  
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
  if (!product) return <div className="text-center py-20">Product not found</div>;  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Custom styles for Swiper */}
      <style>{`
        .review-swiper .swiper-pagination-bullet {
          background: #cbd5e0 !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
          margin: 0 4px !important;
        }
        
        .review-swiper .swiper-pagination-bullet-active {
          background: #22874b !important;
        }
        
        .review-swiper .swiper-pagination {
          position: relative !important;
          margin-top: 16px !important;
        }
        
        .review-swiper .swiper-slide {
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
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
          </div>        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#22874b]">
          গ্রাহকদের অভিজ্ঞতা
        </h2>
        <div className="relative w-full max-w-4xl mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          <div className="relative pb-[56.25%] h-0"> {/* 16:9 aspect ratio */}
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/4UBUqeRjBoQ" 
              title="Zaituni Kalojira Oil Feedbacks from Repeated Consumers!" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <p className="text-center mt-4 text-gray-600 text-sm md:text-base">
          আমাদের নিয়মিত গ্রাহকদের প্রকৃত অভিজ্ঞতা এবং মতামত শুনুন
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#22874b]">{product.name} উপকারিতা</h2>
          <ul className="space-y-4">
            {[
              "চেহারার ব্রণ, একনে স্থায়ীভাবে দূর করতে সহায়তা করে",
              "চুলে ব্যবহারে চুল পড়া বন্ধ করতে সাহায্য করে",
              "স্কিনে মালিশে এলার্জি, চর্মরোগজনিত রোগ দূর করতে সাহায্য করে",
              "প্রতিনিয়ত ব্যবহারে স্কিন উজ্জল করে",
              "প্রতিনিয়ত খেলে রোগ বালাই কমে যাবে",
              "শরীরচর্চা-জিম করায় নিত্যদিনের প্রাকৃতিক সঙ্গী",
              "মাইগ্রেনের ব্যথা, জয়েন্টের ব্যথা দূর করে",
              "চা-মধুর সাথে অনায়াসেই খাওয়া যায়"
            ].map((benefit, index) => (
              <li key={index} className="flex items-start">
                <i className="fa-solid fa-check text-[#22874b] mt-1 mr-2"></i>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <img 
            src={product.images && product.images[0] ? product.images[0] : product.thumbnail} 
            alt={product.name}
            className="rounded-lg shadow-md max-h-96"
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        {/* Why Choose Us */}
        <div className="border-4 border-[#22874b] rounded-xl p-6">
          <h2 className="bg-[#22874b] text-white text-xl font-bold py-2 px-4 rounded-sm mb-4">
            {product.name} কেন নিবেন?
          </h2>
          <ul className="space-y-3">
            {[
              "আমরা কোনো প্রকার ক্যামিকাল না মিশিয়ে কালোজিরার তেল প্রস্তুত করি",
              "আমাদের কালোজিরার তেল অথেন্টিক হওয়ায়, আপনি অগণিত উপকারগুলো পাবেন",
              "হাইজিন মেইনটেইন করে আমরা কালোজিরার তেল বোতলজাত করে থাকি"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <i className="fa-solid fa-check text-[#22874b] mt-1 mr-2"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>        {/* Customer Reviews */}
        <div className="border-4 border-[#22874b] rounded-xl p-6">
          <h2 className="bg-[#22874b] text-white text-xl font-bold py-2 px-4 rounded-sm mb-4">
            সম্মানিত গ্রাহকদের রিভিউ
          </h2>
          
          {/* Swiper Review Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              effect="coverflow"
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              className="review-swiper"
            >
              {reviewImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full">
                    <img 
                      src={img} 
                      alt={`Customer review ${index + 1}`}
                      className="w-full h-96 md:h-[500px] lg:h-[600px] object-contain rounded-lg bg-gray-50 mx-auto"
                    />
                  </div>
                </SwiperSlide>
              ))}
              
              {/* Custom Navigation Buttons */}
              <div className="swiper-button-prev-custom absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer z-10">
                <FaChevronLeft size={16} />
              </div>
              <div className="swiper-button-next-custom absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer z-10">
                <FaChevronRight size={16} />
              </div>
            </Swiper>
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