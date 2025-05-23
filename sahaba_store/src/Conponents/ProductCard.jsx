import React, { useContext, useEffect, useState } from "react";
import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { contextData } from "../Contex";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

// Utility to remove null/undefined values from an object
// eslint-disable-next-line no-unused-vars
function removeNulls(obj) {
  // eslint-disable-next-line no-unused-vars
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
}

const ProductCard = ({ products, categoryName, categoryID }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const { userData } = useContext(contextData);
  const [wishlist, setWishlist] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const wishlistFromStorage = JSON.parse(localStorage.getItem("wishlist")) || {};
    setWishlist(wishlistFromStorage);
  }, []);  const handleAddtoCart = async (productId, product) => {
    const pid = typeof productId === 'string' ? productId : String(productId || '');
    const cart = JSON.parse(localStorage.getItem("addtocart")) || {};

    if (cart[pid]) {
      toast.info("Already product add to cart");
      navigate('/add-to-cart');
      return;
    }
   
    try {
      // Get default price variant (250ml) or use base price
      let variantPrice = product.price;
      let variantSize = "250ml";
      
      if (product.priceVariants && product.priceVariants.length > 0) {
        // Find the 250ml variant or use the first one
        const defaultVariant = product.priceVariants.find(v => v.quantity === "250ml") || product.priceVariants[0];
        variantPrice = defaultVariant.price;
        variantSize = defaultVariant.quantity;
      }
      
      // Create cart item with full product details and store full product ID for API fetch
      cart[pid] = {
        id: pid, // Store ID for fetching complete product details
        name: product.name,
        price: variantPrice,
        productId: product.productId || pid,
        quantity: 1,
        thumbnail: product.thumbnail || product.image,
        variant: variantSize,
        priceVariants: product.priceVariants || []
      };
      
      localStorage.setItem("addtocart", JSON.stringify(cart));
      
      // Dispatch custom event to update cart count in navbar
      document.dispatchEvent(new Event('cartUpdated'));
      
      toast.success("Added to cart");
      navigate('/add-to-cart');
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };
 
 
 
 
   const handleAddToWishlist = async (productId) => {
     const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || {};
     const isInWishlist = storedWishlist[productId];
     try {
       let updatedWishlist;
       if (isInWishlist) {
         // Remove from wishlist (local storage only)
         updatedWishlist = { ...storedWishlist };
         delete updatedWishlist[productId];
         localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
         setWishlist(updatedWishlist);
 
 
        
         toast.success("Removed from wishlist");
       } else {
         // Add to wishlist (local storage only)
         updatedWishlist = { ...storedWishlist, [productId]: true };
         localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
         setWishlist(updatedWishlist);
        
         toast.success("Added to wishlist");
       }
     } catch (error) {
       console.error("Wishlist error:", error);
       toast.error("Failed to update wishlist");
     }
   };



  const handleViewDetails = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  if (!products || products.length === 0) return null;

  return (
   <div className="my-6  mx-auto  ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{categoryName}</h1>
        {location.pathname === '/' && (
          <button 
            onClick={() => navigate(`/allproduct/${categoryID}`)} 
            className="px-4 py-2 bg-[#22874b] text-white rounded-lg hover:bg-[#347e8f] transition-colors duration-200 text-sm sm:text-base shadow-sm hover:shadow-md"
          >
            View All Products
          </button>
        )}
      </div>

      <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-3 lg:gap-5">
        {products.map((item, idx) => (
          <div key={item?._id}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-gray-200"
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* Image container with hover effects */}
      <div className="relative aspect-square overflow-hidden">
        <img
          className={`w-full h-full object-cover transition-transform duration-500 ${hoveredIndex === idx ? 'scale-105' : ''}`}
          src={item?.thumbnail}
          alt={item?.name}
          loading="lazy"
        />
        
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToWishlist(item?._id);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm transition-all ${
            wishlist[item._id] 
              ? 'bg-red-100 text-red-500' 
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
          aria-label={wishlist[item._id] ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlist[item._id] ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5 hover:text-red-500" />
          )}
        </button>
        
        {/* Quick view button */}
        <button
          onClick={() => handleViewDetails(item?._id)}
          className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md transition-all ${
            hoveredIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } flex items-center gap-1 text-sm font-medium`}
        >
          <EyeIcon className="h-4 w-4" />
          Quick View
        </button>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 ">
          {item?.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 ">
          {item?.shortDescription}
        </p>
        
        {/* Price and actions */}
        <div className="mt-auto">          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-base text-gray-800">
              {item.priceVariants && item.priceVariants.length > 0 
                ? `${item.priceVariants[0].price} BDT` 
                : `${item.price} BDT`}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {item.originalPrice} BDT
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails(item?._id)}
              className="flex-1 text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Details
            </button>            <button
              onClick={() => handleAddtoCart(item?._id, item)}
              className="flex-1 text-xs px-3 py-2 bg-[#22874b] text-white hover:bg-[#135a6e] rounded-lg transition-colors font-medium shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;