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
    const [imageScale, setImageScale] = useState(1);

    useEffect(() => {
        // تأثير الحركة عند التحميل
        setImageScale(1.05);
        const timer = setTimeout(() => setImageScale(1), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleAddToCart = (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const productToAdd = {
            ...product,
            price: product.regularPrice || product.price || 0
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
                        <p className='text-xl text-[#3D4B2E] mb-4 space-x-1'>
                            {singleProduct.regularPrice || singleProduct.price || 0} ر.ع
                        </p>

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