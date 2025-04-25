import React, { useState } from 'react';
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
    const [selectedSize, setSelectedSize] = useState(singleProduct.size || ''); // حالة لحجم الحناء المختار

    const handleAddToCart = (product) => {
        if (!user) {
            navigate('/login');
            return;
        }

        // إذا كان المنتج حناء بودر ولم يتم اختيار حجم
        if (product.category === 'حناء بودر' && !selectedSize) {
            alert('الرجاء اختيار حجم الحناء');
            return;
        }

        // إضافة المنتج إلى السلة مع الحجم المختار
        dispatch(addToCart({
            ...product,
            ...(product.category === 'حناء بودر' && { size: selectedSize })
        }));
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
            <section className='section__container bg-[#eff6ff]'>
                <h2 className='section__header capitalize'>صفحة المنتج الفردي</h2>
                <div className='section__subheader space-x-2'>
                    <span className='hover:text-primary'><Link to="/">الرئيسية</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">المتجر</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>{singleProduct.name}</span>
                </div>
            </section>

            <section className='section__container mt-8'>
                <div className='flex flex-col items-center md:flex-row gap-8'>
                    {/* صورة المنتج */}
                    <div className='md:w-1/2 w-full relative'>
                        {singleProduct.image && singleProduct.image.length > 0 ? (
                            <>
                                <img
                                    src={singleProduct.image[currentImageIndex]}
                                    alt={singleProduct.name}
                                    className='rounded-md w-full h-auto'
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/500";
                                        e.target.alt = "Image not found";
                                    }}
                                />
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
                        <p className='text-xl text-primary mb-4 space-x-1'>
                            {singleProduct.price} ر.ع
                            {singleProduct.oldPrice && (
                                <s className='ml-1'>ر.ع {singleProduct.oldPrice}</s>
                            )}
                        </p>
                        <p className='text-gray-400 mb-4'>{singleProduct.description}</p>

                        {/* معلومات إضافية عن المنتج */}
                        <div className='flex flex-col space-y-2'>
                            <p><strong>الفئة:</strong> {singleProduct.category}</p>
                            {singleProduct.category === 'حناء بودر' && (
                                <>
                                    <p><strong>الحجم المتاح:</strong> {singleProduct.size}</p>
                                    <div className="flex flex-col gap-2 mb-4">
  <label className="text-gray-700 font-medium">اختر الحجم:</label>
  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={() => setSelectedSize("500 جرام")}
      className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
        selectedSize === "500 جرام"
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
      }`}
    >
      500 جرام
    </button>
    <button
      onClick={() => setSelectedSize("1 كيلو")}
      className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
        selectedSize === "1 كيلو"
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
      }`}
    >
      1 كيلو
    </button>
  </div>
</div>
                                </>
                            )}
                            <div className='flex gap-1 items-center'>
                                <strong>التقييم: </strong>
                                <RatingStars rating={singleProduct.rating} />
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(singleProduct);
                            }}
                            className='mt-6 px-6 py-3 bg-primary text-white rounded-md'
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