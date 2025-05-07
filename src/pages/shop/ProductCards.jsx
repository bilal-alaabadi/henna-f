import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products }) => {
    const dispatch = useDispatch();
    const [activeSizes, setActiveSizes] = useState({});

    const handleAddToCart = (product, size = '500 جرام') => {
        const price = product.category === 'حناء بودر' 
            ? product.price?.[size] || 0
            : product.regularPrice || product.price || 0;
            
        dispatch(addToCart({
            ...product,
            price: price,
            selectedSize: product.category === 'حناء بودر' ? size : null
        }));
    };

    const handleSizeHover = (productId, size) => {
        setActiveSizes(prev => ({
            ...prev,
            [productId]: size
        }));
    };

    const handleMouseLeave = (productId) => {
        setActiveSizes(prev => ({
            ...prev,
            [productId]: null
        }));
    };

    const renderPrice = (product) => {
        if (!product) return null;

        if (product.category === 'حناء بودر') {
            const activeSize = activeSizes[product._id];
            const currentPrice = activeSize ? product.price?.[activeSize] : product.price?.['500 جرام'];
            
            return (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-lg">
                            {currentPrice || 0} ر.ع
                        </span>
                        <div className="flex space-x-2">
                            <button
                                onMouseEnter={() => handleSizeHover(product._id, '500 جرام')}
                                onMouseLeave={() => handleMouseLeave(product._id)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product, '500 جرام');
                                }}
                                className={`px-3 py-1 rounded-full text-sm ${activeSizes[product._id] === '500 جرام' ? 'bg-[#3D4B2E] text-white' : 'bg-gray-200'}`}
                            >
                                500 جرام
                            </button>
                            <button
                                onMouseEnter={() => handleSizeHover(product._id, '1 كيلو')}
                                onMouseLeave={() => handleMouseLeave(product._id)}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product, '1 كيلو');
                                }}
                                className={`px-3 py-1 rounded-full text-sm ${activeSizes[product._id] === '1 كيلو' ? 'bg-[#3D4B2E] text-white' : 'bg-gray-200'}`}
                            >
                                1 كيلو
                            </button>
                        </div>
                    </div>
                    {product.oldPrice && (
                        <s className="text-gray-500 text-sm">{product.oldPrice} ر.ع</s>
                    )}
                </div>
            );
        }

        return (
            <div className="space-y-1">
                <div className="font-medium text-lg">
                    {product.regularPrice || product.price || 0} ر.ع
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
                    onMouseLeave={() => handleMouseLeave(product._id)}
                >
                    <div className='relative'>
                        <Link to={`/shop/${product._id}`}>
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.image?.[0] || "https://via.placeholder.com/300"}
                                    alt={product.name || "صورة المنتج"}
                                    className={`w-full h-full object-cover transition-transform duration-500 ${activeSizes[product._id] ? 'scale-110' : 'scale-100'}`}
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
                                    handleAddToCart(product, activeSizes[product._id] || '500 جرام');
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