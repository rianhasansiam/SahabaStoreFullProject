import React from 'react';
import WishlishtEachcard from './WishlishtEachcard';
import PropTypes from 'prop-types';

const WishlistCard = ({ products, setReload, reload }) => {
  return (
    <div className="divide-y divide-gray-200">
      {products.map((product) => (
        <WishlishtEachcard 
          key={product._id}
          product={product}
          id={product._id} 
          setreload={setReload} 
          reload={reload}
        />
      ))}
    </div>
  );
};

WishlistCard.propTypes = {
  products: PropTypes.array.isRequired,
  setReload: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired
};

export default WishlistCard;
