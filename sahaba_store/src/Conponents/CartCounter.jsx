import { useEffect } from 'react';

/**
 * This component doesn't render anything, it's used to trigger
 * cart update events when cart is modified in the same tab
 */
const CartCounter = ({ count }) => {
  useEffect(() => {
    // Dispatch a custom event to update cart count in all components
    document.dispatchEvent(new Event('cartUpdated'));
  }, [count]);

  return null;
};

export default CartCounter;
