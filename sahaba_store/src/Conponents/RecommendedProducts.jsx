import React from 'react';
import { Link } from 'react-router-dom';

const RecommendedProducts = ({ products, formatCurrency }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative pb-[60%]">
              <img 
                src={product.image || 'https://via.placeholder.com/300x180'} 
                alt={product.name}
                className="absolute h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-1">{product.shortDescription}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#22874b]">{formatCurrency(product.price)}</span>
                <Link 
                  to={`/product-details/${product._id}`}
                  className="text-[#22874b] hover:text-[#1a6b3a] text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
