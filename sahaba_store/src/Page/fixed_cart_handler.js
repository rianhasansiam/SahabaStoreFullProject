// filepath: c:\Users\rianh\Desktop\Final\sahaba_store\src\Page\fixed_cart_handler.js

// Get all cart items from local storage
export const getCartItems = () => {
  return JSON.parse(localStorage.getItem('addtocart')) || {};
};

// Get cart item count
export const getCartItemCount = () => {
  const cart = getCartItems();
  return Object.keys(cart).length;
};

// Get total price of cart
export const getCartTotal = () => {
  const cart = getCartItems();
  return Object.values(cart).reduce((total, item) => {
    return total + (Number(item.price) * item.quantity);
  }, 0);
};

// Add item to cart
export const addToCart = (productId, productData) => {
  const cart = getCartItems();
  
  // If product already in cart, just update quantity
  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    // Get default price variant (250ml) or use base price
    let variantPrice = productData.price;
    let variantSize = "250ml";
    
    if (productData.priceVariants && productData.priceVariants.length > 0) {
      // Find the 250ml variant or use the first one
      const defaultVariant = productData.priceVariants.find(v => v.quantity === "250ml") || productData.priceVariants[0];
      variantPrice = defaultVariant.price;
      variantSize = defaultVariant.quantity;
    }
    
    // Add new product to cart
    cart[productId] = {
      id: productId,
      name: productData.name,
      price: variantPrice,
      productId: productData.productId || productId,
      quantity: 1,
      thumbnail: productData.thumbnail || productData.image,
      variant: variantSize,
      priceVariants: productData.priceVariants || []
    };
  }
  
  // Save updated cart to local storage
  localStorage.setItem('addtocart', JSON.stringify(cart));
  
  // Dispatch event to update navbar cart count
  document.dispatchEvent(new Event('cartUpdated'));
  
  return cart;
};

// Update cart item
export const updateCartItem = (productId, updates) => {
  const cart = getCartItems();
  
  if (cart[productId]) {
    cart[productId] = {
      ...cart[productId],
      ...updates
    };
    
    localStorage.setItem('addtocart', JSON.stringify(cart));
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
  }
  
  return cart;
};

// Remove item from cart
export const removeFromCart = (productId) => {
  const cart = getCartItems();
  
  if (cart[productId]) {
    delete cart[productId];
    localStorage.setItem('addtocart', JSON.stringify(cart));
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
  }
  
  return cart;
};

// Clear entire cart
export const clearCart = () => {
  localStorage.setItem('addtocart', JSON.stringify({}));
  
  // Dispatch event to update navbar cart count
  document.dispatchEvent(new Event('cartUpdated'));
  
  return {};
};

// Update quantity for an item
export const updateQuantity = (productId, quantity) => {
  // Make sure quantity is at least 1
  const newQuantity = Math.max(1, quantity);
  return updateCartItem(productId, { quantity: newQuantity });
};

// Update variant for an item
export const updateVariant = (productId, variant, price) => {
  return updateCartItem(productId, { variant, price });
};