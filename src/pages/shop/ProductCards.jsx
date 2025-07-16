// ProductCards.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
    const dispatch = useDispatch();

    const getProductPrice = (product) => {
        if (!product) return 0;
        
        // إذا كان السعر كائنًا (مثل الحناء)
        if (typeof product.price === 'object' && product.price !== null) {
            return product.price['500 جرام'] || 0; // نستخدم 500 جرام كحجم افتراضي
        }
        
        // إذا كان السعر رقمًا مباشرًا
        return product.regularPrice || product.price || 0;
    };

    const handleAddToCart = (product) => {
        const price = getProductPrice(product);
        
        dispatch(addToCart({
            ...product,
            price: price
        }));
    };

    const renderPrice = (product) => {
        const price = getProductPrice(product);

        return (
            <div className="space-y-1">
                <div className="font-medium text-lg">
                    {price} ر.ع
                </div>
                {product.oldPrice && (
                    <s className="text-gray-500 text-sm">{product.oldPrice} ر.ع</s>
                )}
            </div>
        );
    };

    return (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.map((product) => (
                <div 
                    key={product._id} 
                    className='product__card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
                >
                    <div className='relative'>
                        <Link to={`/shop/${product._id}`}>
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.image?.[0] || "https://via.placeholder.com/300"}
                                    alt={product.name || "صورة المنتج"}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/300";
                                        e.target.alt = "صورة المنتج غير متوفرة";
                                    }}
                                />
                            </div>
                        </Link>

                        <div className='absolute top-3 right-3'>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                }}
                                className="bg-[#3D4B2E] p-2 text-white hover:bg-[#4E5A3F] rounded-full shadow-md transition-colors duration-300"
                            >
                                <i className="ri-shopping-cart-2-line"></i>
                            </button>
                        </div>
                    </div>

                    <div className='p-4'>
                        <h4 className="text-lg font-semibold mb-1">{product.name || "اسم المنتج"}</h4>
                        <p className="text-gray-500 text-sm mb-3">{product.category || "فئة غير محددة"}</p>
                        
                        {renderPrice(product)}
                        
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCards;