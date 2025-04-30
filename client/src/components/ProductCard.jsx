import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className={product.category === 'clothing' ? 'image1' : 'watch1'}>
      <img src={product.image} alt={product.name} />
      <p>{product.name} - ${product.price}</p>
    </div>
  );
};

export default ProductCard;