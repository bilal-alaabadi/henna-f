import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UploadImage from '../addProduct/UploadImage';

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

const sizes = [
    { label: 'اختر الحجم', value: '' },
    { label: '1 كيلو', value: '1 كيلو' },
    { label: '500 جرام', value: '500 جرام' }
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    const [product, setProduct] = useState({
        name: '',
        category: '',
        size: '',
        price: '',
        description: '',
        quantity: 0
    });
    
    const [showSizeField, setShowSizeField] = useState(false);
    const [newImage, setNewImage] = useState(null);
    
    const { data: productData, isLoading: isProductLoading, error: fetchError, refetch } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData?.product) {
            const { product: fetchedProduct } = productData;
            setProduct({
                name: fetchedProduct.name || '',
                category: fetchedProduct.category || '',
                size: fetchedProduct.size || '',
                price: fetchedProduct.regularPrice || 
                      (fetchedProduct.price ? 
                       fetchedProduct.price['500 جرام'] || fetchedProduct.price['1 كيلو'] || '' : ''),
                description: fetchedProduct.description || '',
                quantity: fetchedProduct.quantity || 0
            });
            setShowSizeField(fetchedProduct.category === 'حناء بودر');
        }
    }, [productData]);

    useEffect(() => {
        setShowSizeField(product.category === 'حناء بودر');
        if (!showSizeField) {
            setProduct(prev => ({ ...prev, size: '' }));
        }
    }, [product.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleImageChange = (image) => {
        setNewImage(image);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // التحقق من الحقول المطلوبة
        const requiredFields = {
            'أسم المنتج': product.name,
            'صنف المنتج': product.category,
            'السعر': product.price,
            'الوصف': product.description
        };
        
        if (product.category === 'حناء بودر' && !product.size) {
            alert('الرجاء اختيار الحجم للحناء');
            return;
        }

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([field]) => field);

        if (missingFields.length > 0) {
            alert(`الرجاء ملء الحقول التالية: ${missingFields.join('، ')}`);
            return;
        }

        try {
            let updatedProductData = {
                name: product.name,
                category: product.category,
                description: product.description,
                quantity: Number(product.quantity),
                author: user?._id
            };

            if (product.category === 'حناء بودر') {
                updatedProductData.price = {
                    '500 جرام': product.size === '500 جرام' ? product.price : undefined,
                    '1 كيلو': product.size === '1 كيلو' ? product.price : undefined
                };
                updatedProductData.size = product.size;
            } else {
                updatedProductData.regularPrice = product.price;
            }

            if (newImage) {
                updatedProductData.image = newImage;
            }

            await updateProduct({ 
                id: id,
                ...updatedProductData 
            }).unwrap();
            
            alert('تم تحديث المنتج بنجاح');
            await refetch();
            navigate("/dashboard/manage-products");
        } catch (error) {
            console.error('فشل في تحديث المنتج:', error);
            alert('حدث خطأ أثناء تحديث المنتج');
        }
    };

    if (isProductLoading) return <div>جاري التحميل...</div>;
    if (fetchError) return <div>خطأ في جلب بيانات المنتج!</div>;
    if (!productData?.product) return <div>المنتج غير موجود</div>;

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">تحديث المنتج</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="أسم المنتج"
                    name="name"
                    placeholder="أكتب أسم المنتج"
                    value={product.name}
                    onChange={handleChange}
                />
                
                <SelectInput
                    label="صنف المنتج"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                
                {showSizeField && (
                    <SelectInput
                        label="حجم الحناء"
                        name="size"
                        value={product.size}
                        onChange={handleChange}
                        options={sizes}
                    />
                )}
                
                <TextInput
                    label="السعر"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
                
                <TextInput
                    label="الكمية"
                    name="quantity"
                    type="number"
                    placeholder="0"
                    value={product.quantity}
                    onChange={handleChange}
                />
                
                <UploadImage
                    name="image"
                    id="image"
                    setImage={handleImageChange}
                    existingImage={productData?.product?.image}
                />
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        وصف المنتج
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        className="add-product-InputCSS"
                        value={product.description}
                        placeholder="اكتب وصف المنتج"
                        onChange={handleChange}
                        rows={4}
                    ></textarea>
                </div>
                
                <div>
                    <button 
                        type="submit" 
                        className="add-product-btn" 
                        disabled={isUpdating}
                    >
                        {isUpdating ? "جاري التحديث..." : "تحديث المنتج"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;