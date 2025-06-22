import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import RatingStars from '../../../components/RatingStars';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, error, isLoading } = useFetchProductByIdQuery(id); 

    const { user } = useSelector((state) => state.auth);

    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState('500 جرام');
    const [imageScale, setImageScale] = useState(1);

    useEffect(() => {
        // تأثير الحركة عند تغيير الحجم
        setImageScale(1.05);
        const timer = setTimeout(() => setImageScale(1), 300);
        return () => clearTimeout(timer);
    }, [selectedSize]);

    const handleAddToCart = (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const productToAdd = {
            ...product,
            selectedSize: product.category === 'حناء بودر' ? selectedSize : null,
            price: product.category === 'حناء بودر' ? product.price[selectedSize] : product.regularPrice
        };

        dispatch(addToCart(productToAdd));
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === singleProduct.image.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? singleProduct.image.length - 1 : prevIndex - 1
        );
    };

    if (isLoading) return <p>جاري التحميل...</p>;
    if (error) return <p>حدث خطأ أثناء تحميل تفاصيل المنتج.</p>;

    return (
        <>
            <section className='section__container bg-[#e2e5e5]'>
                <h2 className='section__header capitalize'>صفحة المنتج الفردي</h2>
                <div className='section__subheader space-x-2'>
                    <span className='hover:text-[#4E5A3F]'><Link to="/">الرئيسية</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-[#4E5A3F]'><Link to="/shop">المتجر</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-[#4E5A3F]'>{singleProduct.name}</span>
                </div>
            </section>

            <section className='section__container mt-8'>
                <div className='flex flex-col items-center md:flex-row gap-8'>
                    {/* صورة المنتج */}
                    <div className='md:w-1/2 w-full relative'>
                        {singleProduct.image && singleProduct.image.length > 0 ? (
                            <>
                                <div className="overflow-hidden rounded-md">
                                    <img
                                        src={singleProduct.image[currentImageIndex]}
                                        alt={singleProduct.name}
                                        className={`w-full h-auto transition-transform duration-300`}
                                        style={{ transform: `scale(${imageScale})` }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/500";
                                            e.target.alt = "Image not found";
                                        }}
                                    />
                                </div>
                                {singleProduct.image.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full'
                                        >
                                            <i className="ri-arrow-left-s-line"></i>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full'
                                        >
                                            <i className="ri-arrow-right-s-line"></i>
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-red-600">لا توجد صور متاحة لهذا المنتج.</p>
                        )}
                    </div>

                    <div className='md:w-1/2 w-full'>
                        <h3 className='text-2xl font-semibold mb-4'>{singleProduct.name}</h3>
                        
                        {/* عرض السعر */}
                        {singleProduct.category === 'حناء بودر' ? (
                            <div className='mb-4'>
                                <p className='text-xl text-[#3D4B2E] space-x-1'>
                                    السعر: {singleProduct.price?.[selectedSize]} ر.ع
                                </p>
                                <p className='text-sm text-gray-500 mt-1'>
                                    (لـ {selectedSize})
                                </p>
                            </div>
                        ) : (
                            <p className='text-xl text-[#3D4B2E] mb-4 space-x-1'>
                                {singleProduct.regularPrice} ر.ع
                            </p>
                        )}

                        <p className="text-gray-500 mb-4 text-lg font-medium leading-relaxed">
                            <span className="text-gray-800 font-bold block">:الوصف</span> 
                            <span className="text-gray-600">{singleProduct.description}</span>
                        </p>

                        {/* معلومات إضافية عن المنتج */}
                        <div className='flex flex-col space-y-2'>
                            <p className="text-gray-500 mb-4 text-lg font-medium leading-relaxed">
                                <span className="text-gray-800 font-bold block">:الفئة</span> 
                                <span className="text-gray-600">{singleProduct.category}</span>
                            </p>
                            
                            {singleProduct.category === 'حناء بودر' && (
                                <div className="mb-4">
                                    <p className="text-gray-800 font-bold mb-2">:اختر الحجم</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedSize("500 جرام");
                                            }}
                                            className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                                                selectedSize === "500 جرام"
                                                ? "bg-[#4E5A3F] text-white border-[#4E5A3F]"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-[#4E5A3F]"
                                            }`}
                                        >
                                            500 جرام - {singleProduct.price?.['500 جرام']} ر.ع
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedSize("1 كيلو");
                                            }}
                                            className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                                                selectedSize === "1 كيلو"
                                                ? "bg-[#4E5A3F] text-white border-[#4E5A3F]"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-[#4E5A3F]"
                                            }`}
                                        >
                                            1 كيلو - {singleProduct.price?.['1 كيلو']} ر.ع
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(singleProduct);
                            }}
                            className='mt-6 px-6 py-3 bg-[#3D4B2E] text-white rounded-md hover:bg-[#4E5A3F] transition-colors duration-200'
                        >
                            إضافة إلى السلة
                        </button>
                    </div>
                </div>
            </section>

            {/* عرض التقييمات */}
            <section className='section__container mt-8'>
                <ReviewsCard productReviews={productReviews} />
            </section>
        </>
    );
};

export default SingleProduct;