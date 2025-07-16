import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteProductMutation, useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';

const ManageProduct = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const { 
        data: { products = [], totalPages = 1, totalProducts = 0 } = {}, 
        isLoading, 
        error, 
        refetch 
    } = useFetchAllProductsQuery({
        category: '',
        minPrice: '',
        maxPrice: '',
        page: currentPage,
        limit: productsPerPage,
    });

    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = Math.min(startProduct + productsPerPage - 1, totalProducts);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const getProductPrice = (product) => {
        if (product.regularPrice) return `${product.regularPrice} ر.س`;
        
        if (!product.price) return 'N/A';
        
        if (typeof product.price === 'object') {
            const prices = [];
            if (product.price['500 جرام']) prices.push(`${product.price['500 جرام']} ر.س (500 جرام)`);
            if (product.price['1 كيلو']) prices.push(`${product.price['1 كيلو']} ر.س (1 كيلو)`);
            if (product.price.default) prices.push(`${product.price.default} ر.س`);
            
            return prices.join(' - ') || 'N/A';
        }
        
        return `${product.price} ر.س`;
    };

    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
        if (!confirmDelete) return;
        
        try {
            await deleteProduct(id).unwrap();
            alert("تم حذف المنتج بنجاح");
            if (products.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                refetch();
            }
        } catch (error) {
            console.error("خطأ في حذف المنتج", error);
            alert("فشل في حذف المنتج");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h2>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <span className="text-sm text-gray-600">
                            عرض {startProduct}-{endProduct} من {totalProducts} منتج
                        </span>
                        <Link 
                            to="/dashboard/add-product" 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                        >
                            إضافة منتج جديد
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">جاري تحميل المنتجات...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">حدث خطأ أثناء تحميل المنتجات</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المنتج</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الصنف</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product, index) => (
                                        <tr key={product._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {startProduct + index}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {product.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {getProductPrice(product)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                <Link
                                                    to={`/dashboard/update-product/${product._id}`}
                                                    className="text-blue-600 hover:text-blue-900 mx-2"
                                                >
                                                    تعديل
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProduct(product._id)}
                                                    disabled={isDeleting}
                                                    className="text-red-600 hover:text-red-900 mx-2"
                                                >
                                                    {isDeleting ? 'جاري الحذف...' : 'حذف'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center">
                                <nav className="inline-flex rounded-md shadow">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        السابق
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 border-t border-b border-gray-300 text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        التالي
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageProduct;