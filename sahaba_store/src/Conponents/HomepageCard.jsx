import React, { useContext, useEffect, useState } from "react";
import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { contextData } from "../Contex";
import { toast } from "react-toastify";
import api from "../hooks/api";
import { useNavigate } from "react-router-dom";

// Utility to remove null/undefined values from an object
function removeNulls(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
}

const HomepageCard = ({ product }) => {
  const navigate = useNavigate();
  const { userData, searchTerm } = useContext(contextData);
  const [wishlist, setWishlist] = useState({});
    const [isHovered, setIsHovered] = useState(false);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const wishlistFromStorage = JSON.parse(localStorage.getItem("wishlist")) || {};
    setWishlist(wishlistFromStorage);
  }, []);


    const handleAddtoCart = async (productId) => {
    const pid = typeof productId === 'string' ? productId : String(productId || '');
    const cart = JSON.parse(localStorage.getItem("addtocart")) || {};

    if (cart[pid]) {
      toast.info("Already product add to cart");
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
      
      // Create cart item with full product details
      cart[pid] = {
        name: product.name,
        price: variantPrice,
        productId: product.productId || pid,
        quantity: 1,
        thumbnail: product.thumbnail || product.image,
        variant: variantSize
      };
      
      localStorage.setItem("addtocart", JSON.stringify(cart));
      toast.success("Added to cart");
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
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

  // Filter by search term (case-insensitive, name or shortDescription)
  if (searchTerm &&
    !(
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) {
    return null;
  }

  if (!product) return null;

  return (
   <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-gray-200 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with hover effects */}
      <div className="relative aspect-square overflow-hidden">
        <img
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
          src={product?.thumbnail}
          alt={product?.name}
          loading="lazy"
        />
        
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToWishlist(product?._id);
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm transition-all ${
            wishlist[product._id] 
              ? 'bg-red-100 text-red-500' 
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
          aria-label={wishlist[product._id] ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlist[product._id] ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIcon className="h-5 w-5 hover:text-red-500" />
          )}
        </button>
        
        {/* Quick view button */}
        <button
          onClick={() => handleViewDetails(product?._id)}
          className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md transition-all ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } flex items-center gap-1 text-sm font-medium`}
        >
          <EyeIcon className="h-4 w-4" />
          Quick View
        </button>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 ">
          {product?.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 ">
          {product?.shortDescription}
        </p>
        
        {/* Price and actions */}        <div className="mt-auto ">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base text-gray-800 ">
              {product.priceVariants && product.priceVariants.length > 0 
                ? `${product.price} ` 
                : `${product.price} `}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {product.originalPrice} BDT
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleViewDetails(product?._id)}
              className="flex-1 text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Details
            </button>
            <button
              onClick={() => handleAddtoCart(product?._id)}
              className="flex-1 text-xs px-3 py-2 bg-[#22874b] text-white hover:bg-[#135a6e] rounded-lg transition-colors font-medium shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageCard;