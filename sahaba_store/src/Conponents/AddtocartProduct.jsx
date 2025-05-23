// filepath: c:\Users\rianh\Desktop\Final\sahaba_store\src\Conponents\AddtocartProduct.jsx
import React, { useEffect, useState } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { TrashIcon } from '@heroicons/react/24/outline';
import LoadingPage from './LoadingPage';

const AddtocartProduct = ({ productId, product, updateCart, removeFromCart }) => {
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [selectedVariant, setSelectedVariant] = useState(product.variant || '');
  const [price, setPrice] = useState(product.price || 0);
  const [fullProductData, setFullProductData] = useState(null);
  
  // Fetch complete product data from API using the ID
  const { data, isLoading, error } = useFetchData(
    `product-${productId}`, 
    `/products/${productId}`
  );
  
  useEffect(() => {
    if (data) {
      setFullProductData(data);
      
      // If we have price variants from the API and they weren't in local storage
      if (data.priceVariants && data.priceVariants.length > 0 && !product.priceVariants) {
        // Update local cart with price variants
        updateCart(productId, { 
          priceVariants: data.priceVariants 
        });
      }
    }
  }, [data, productId, updateCart, product]);
  
  useEffect(() => {
    // Set initial quantity from local storage
    setQuantity(product.quantity || 1);
    
    // Set initial variant from local storage
    setSelectedVariant(product.variant || '');
    
    // Set initial price from local storage
    setPrice(product.price || 0);
  }, [product]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    // Validate quantity
    if (newQuantity < 1) newQuantity = 1;
    
    // Update state
    setQuantity(newQuantity);
    
    // Update cart in local storage
    updateCart(productId, { quantity: newQuantity });
    
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
  };
  
  // Handle variant change
  const handleVariantChange = (e) => {
    const newVariant = e.target.value;
    setSelectedVariant(newVariant);
    
    // Find the price for this variant
    const variants = product.priceVariants || (fullProductData?.priceVariants || []);
    const variantData = variants.find(v => v.quantity === newVariant);
    
    if (variantData) {
      setPrice(variantData.price);
      
      // Update cart in local storage with new variant and price
      updateCart(productId, { 
        variant: newVariant,
        price: variantData.price
      });
      
      // Dispatch event to update navbar cart count
      document.dispatchEvent(new Event('cartUpdated'));
    }
  };
  
  // Get available variants
  const getVariants = () => {
    return product.priceVariants || (fullProductData?.priceVariants || []);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24 border rounded-lg mb-4">
        <LoadingPage></LoadingPage>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <p className="text-red-500">Error loading product details. {error.message}</p>
      </div>
    );
  }
  
  const handleRemoveFromCart = () => {
    removeFromCart(productId);
    // Dispatch event to update navbar cart count
    document.dispatchEvent(new Event('cartUpdated'));
  };
  
  return (
    <div className="flex flex-col md:flex-row border rounded-lg p-4 mb-4 hover:shadow-md transition">
      {/* Product Image */}
      <div className="w-full md:w-1/4 mb-4 md:mb-0">
        <img
          src={product.thumbnail || (fullProductData?.thumbnail || '')}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>
      
      {/* Product Details */}
      <div className="w-full md:w-3/4 md:pl-6 flex flex-col justify-between">
        <div className="flex justify-between mb-3">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <button
            onClick={handleRemoveFromCart}
            className="text-red-500 hover:text-red-700"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">
            {fullProductData?.shortDescription || ''}
          </p>
          
          {/* Product Variant Selector */}
          {getVariants().length > 0 && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <select
                value={selectedVariant}
                onChange={handleVariantChange}
                className="block w-full md:w-1/3 p-2 border border-gray-300 rounded-md"
              >
                {getVariants().map((variant, index) => (
                  <option key={index} value={variant.quantity}>
                    {variant.quantity}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center justify-between mt-2">
          <div className="flex items-center mb-2 md:mb-0">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="bg-gray-200 px-3 py-1 rounded-l-md"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border-t border-b py-1"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="bg-gray-200 px-3 py-1 rounded-r-md"
            >
              +
            </button>
          </div>
          
          <div className="font-semibold text-lg">
            {(price * quantity).toFixed(2)} BDT
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddtocartProduct;