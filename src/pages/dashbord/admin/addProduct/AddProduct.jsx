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
        price: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.name || !product.category || !product.price || !product.description || image.length === 0) {
            alert('الرجاء تعبئة جميع الحقول المطلوبة');
            return;
        }

        try {
            await AddProduct({ ...product, image, author: user?._id }).unwrap();
            alert('تم إضافة المنتج بنجاح');
            setProduct({
                name: '',
                category: '',
                price: '',
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
                <TextInput
                    label="السعر"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
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