import { toast } from 'react-toastify';

// Utility functions for wishlist operations using localStorage

/**
 * Get wishlist items from localStorage
 * @returns {Array} Array of wishlist item IDs
 */
export const getWishlistItems = () => {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
    
    // Convert object format to array of IDs
    return Object.keys(wishlist);
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

/**
 * Add an item to the wishlist
 * @param {string} productId - The product ID to add
 * @returns {boolean} Success status
 */
export const addToWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
    
    // Check if item already exists in wishlist
    if (wishlist[productId]) {
      toast.info('Item already in wishlist');
      return false;
    }
    
    // Add item to wishlist
    wishlist[productId] = true;
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    toast.success('Added to wishlist');
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    toast.error('Failed to add to wishlist');
    return false;
  }
};

/**
 * Remove an item from the wishlist
 * @param {string} productId - The product ID to remove
 * @returns {boolean} Success status
 */
export const removeFromWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
    
    // Check if item exists in wishlist
    if (!wishlist[productId]) {
      return false;
    }
    
    // Remove item from wishlist
    delete wishlist[productId];
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    toast.success('Removed from wishlist');
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    toast.error('Failed to remove from wishlist');
    return false;
  }
};

/**
 * Check if an item is in the wishlist
 * @param {string} productId - The product ID to check
 * @returns {boolean} True if item is in wishlist
 */
export const isInWishlist = (productId) => {
  if (!productId) return false;
  
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || {};
    return !!wishlist[productId];
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

/**
 * Move all wishlist items to cart
 * @returns {boolean} Success status
 */
export const moveWishlistToCart = () => {
  try {
    const wishlistItems = getWishlistItems();
    
    if (wishlistItems.length === 0) {
      toast.info('Wishlist is empty');
      return false;
    }
    
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('addtocart')) || {};
    
    // Get product data from API if available, otherwise use minimal data
    // Since we can't make API calls directly here, we'll create a basic entry
    // that will be updated with full product data when the cart loads
    
    // Add each wishlist item to cart
    let addedCount = 0;
      wishlistItems.forEach(productId => {
      // Only add if not already in cart
      if (!cart[productId]) {
        cart[productId] = { 
          quantity: 1
        };
        addedCount++;
      }
    });
    
    // Save updated cart
    localStorage.setItem('addtocart', JSON.stringify(cart));
    
    if (addedCount > 0) {
      toast.success(`${addedCount} item${addedCount > 1 ? 's' : ''} moved to cart`);
    } else {
      toast.info('All items already in cart');
    }
    return true;
  } catch (error) {
    console.error('Error moving wishlist to cart:', error);
    toast.error('Failed to move items to cart');
    return false;
  }
};
