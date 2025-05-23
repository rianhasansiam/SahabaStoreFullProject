import React from 'react';

const ProductSizeTag = ({ size, className = "" }) => {
  let sizeColor;
  
  switch(size) {
    case "500 ml":
      sizeColor = "bg-blue-50 text-blue-600 border-blue-200";
      break;
    case "1000 ml":
      sizeColor = "bg-purple-50 text-purple-600 border-purple-200";
      break;
    default: // 250 ml or any other size
      sizeColor = "bg-gray-50 text-gray-600 border-gray-200";
  }
  
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${sizeColor} ${className}`}>
      {size || "250 ml"}
    </span>
  );
};

export default ProductSizeTag;
