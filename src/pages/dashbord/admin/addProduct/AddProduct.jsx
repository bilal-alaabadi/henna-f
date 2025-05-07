import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'أختر منتج', value: '' },
    { label: 'حناء بودر', value: 'حناء بودر' },
    { label: 'سدر بودر', value: 'سدر بودر' },
    { label: 'أعشاب تكثيف وتطويل الشعر', value: 'أعشاب تكثيف وتطويل الشعر' },
    { label: 'مشاط', value: 'مشاط' },
    { label: 'خزامى', value: 'خزامى' },
    { label: 'كركديه', value: 'كركديه' },
    { label: 'إكليل الجبل', value: 'إكليل الجبل' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        regularPrice: '',
        price: {
            "500 جرام": '',
            "1 كيلو": ''
        },
        description: ''
    });
    const [image, setImage] = useState([]);

    const [AddProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handlePriceChange = (size, value) => {
        setProduct({
            ...product,
            price: {
                ...product.price,
                [size]: value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // التحقق من الحقول المطلوبة
        if (!product.name || !product.category || !product.description || image.length === 0) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة');
            return;
        }

        // التحقق من الأسعار بناءً على الفئة
        if (product.category === 'حناء بودر') {
            if (!product.price['500 جرام'] || !product.price['1 كيلو']) {
                alert('الرجاء إدخال سعرين للحناء بودر (500 جرام و1 كيلو)');
                return;
            }
        } else {
            if (!product.regularPrice) {
                alert('الرجاء إدخال سعر المنتج');
                return;
            }
        }

        try {
            const productData = {
                name: product.name,
                category: product.category,
                description: product.description,
                image,
                author: user?._id
            };

            if (product.category === 'حناء بودر') {
                productData.price = {
                    "500 جرام": parseFloat(product.price['500 جرام']),
                    "1 كيلو": parseFloat(product.price['1 كيلو'])
                };
            } else {
                productData.regularPrice = parseFloat(product.regularPrice);
            }

            await AddProduct(productData).unwrap();
            alert('تم إضافة المنتج بنجاح');
            setProduct({
                name: '',
                category: '',
                regularPrice: '',
                price: {
                    "500 جرام": '',
                    "1 كيلو": ''
                },
                description: ''
            });
            setImage([]);
            navigate("/shop");
        } catch (error) {
            console.log("فشل في إضافة المنتج", error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">إضافة منتج جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="اسم المنتج"
                    name="name"
                    placeholder="مثال: حناء بودر عالية الجودة"
                    value={product.name}
                    onChange={handleChange}
                />
                <SelectInput
                    label="الصنف"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                
                {product.category === 'حناء بودر' ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">سعر 500 جرام</label>
                            <input
                                type="number"
                                value={product.price['500 جرام']}
                                onChange={(e) => handlePriceChange('500 جرام', e.target.value)}
                                className="add-product-InputCSS"
                                placeholder="السعر لـ 500 جرام"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">سعر 1 كيلو</label>
                            <input
                                type="number"
                                value={product.price['1 كيلو']}
                                onChange={(e) => handlePriceChange('1 كيلو', e.target.value)}
                                className="add-product-InputCSS"
                                placeholder="السعر لـ 1 كيلو"
                            />
                        </div>
                    </>
                ) : (
                    <TextInput
                        label="السعر"
                        name="regularPrice"
                        type="number"
                        placeholder="50"
                        value={product.regularPrice}
                        onChange={handleChange}
                    />
                )}

                <UploadImage
                    name="image"
                    id="image"
                    setImage={setImage}
                />
                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-gray-700'>الوصف</label>
                    <textarea
                        name="description"
                        id="description"
                        className='add-product-InputCSS'
                        value={product.description}
                        placeholder='اكتب وصفاً للمنتج'
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <button type='submit' className='add-product-btn' disabled={isLoading}>
                        {isLoading ? "جاري الإضافة..." : "إضافة المنتج"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;