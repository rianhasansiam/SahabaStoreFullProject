import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchData } from '../hooks/useFetchData';

import { contextData } from '../Contex';
import { FaSearch } from 'react-icons/fa';
import ProductCard from '../Conponents/ProductCard';
import LoadingPage from '../Conponents/LoadingPage';

const AllProducts = () => {
  const { category } = useParams();
  const { searchTerm, setSearchTerm } = useContext(contextData);

  // Fetch all products and categories
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    isError: productsError 
  } = useFetchData('products', '/products');
  
  const { 
    data: categories, 
    isLoading: catLoading 
  } = useFetchData('categories', '/allcategories');

  // Filter products by category _id if not 'all'
  let products = Array.isArray(productsData) ? productsData : [];
  let currentCategory = category || 'all';
  
  if (currentCategory && currentCategory.toLowerCase() !== 'all') {
    products = products.filter(
      (product) => product.category === currentCategory
    );
  }

  // Further filter by search term from context
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(search) ||
      product.productId?.toLowerCase().includes(search) ||
      product.shortDescription?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="mx-auto  container">
      {/* Page Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {currentCategory === 'all'
            ? 'All Products'
            : `${(categories?.find(cat => cat._id === currentCategory)?.name || currentCategory)} Products`}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          Browse our wide selection of quality items
        </p>


        
      </div>

      {/* Search Bar - Mobile Only */}
      {/* <div className="mb-6 sm:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div> */}

      {/* Loading/Error States */}
      {(productsLoading || catLoading) && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <LoadingPage></LoadingPage>
        </div>
      )}

      {productsError && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load products. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* No Results State */}
      {!productsLoading && !catLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm 
              ? `No products found matching "${searchTerm}"`
              : 'No products available in this category'}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!productsLoading && !catLoading && filteredProducts.length > 0 && (
        <div className="mb-8 ">
        

          <ProductCard 
            products={filteredProducts} 
            categoryName={currentCategory === 'all' 
              ? 'All Products' 
              : (categories?.find(cat => cat._id === currentCategory)?.name || currentCategory)
            } 
            categoryID={currentCategory}
          />
        </div>
      )}
    </div>
  );
};

export default AllProducts;