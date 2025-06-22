import React, { useState, useEffect } from 'react';
import { useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../../redux/features/orders/orderApi';
import { useFetchProductByIdQuery } from '../../../../redux/features/products/productsApi';
import { formatDate } from '../../../../utils/formateDate';
import UpdateOrderModal from './UpdateOrderModal';
import html2pdf from 'html2pdf.js';

const ManageOrders = () => {
    const { data: orders, error, isLoading, refetch } = useGetAllOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]);
    const [deleteOrder] = useDeleteOrderMutation();

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleDeleteOder = async (orderId) => {
        try {
            await deleteOrder(orderId).unwrap();
            alert("Order deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete order:", error);
        }
    };

    const handleViewOrder = async (order) => {
        setViewOrder(order);
        
        // جلب تفاصيل المنتجات
        if (order.products && order.products.length > 0) {
            const productsDetails = await Promise.all(
                order.products.map(async (item) => {
                    try {
                        const response = await fetch(`${getBaseUrl()}/api/products/${item.productId}`);
                        const productData = await response.json();
                        return {
                            ...productData.product,
                            quantity: item.quantity,
                            selectedSize: item.selectedSize
                        };
                    } catch (error) {
                        console.error("Error fetching product details:", error);
                        return {
                            _id: item.productId,
                            name: "Product not available",
                            quantity: item.quantity,
                            selectedSize: item.selectedSize
                        };
                    }
                })
            );
            setOrderProducts(productsDetails);
        }
    };

    const handleCloseViewModal = () => {
        setViewOrder(null);
        setOrderProducts([]);
    };

    const handlePrintOrder = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('order-details');
        const options = {
            margin: [10, 10],
            filename: `order_${viewOrder?.orderId || 'unknown'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };
        html2pdf().from(element).set(options).save();
    };

    const calculateProductPrice = (product) => {
        if (!product) return '0.00';
        
        // لحناء بودر مع حجم محدد
        if (product.category === 'حناء بودر' && product.selectedSize && product.price) {
            const size = product.selectedSize;
            const price = product.price[size] || product.regularPrice || 0;
            return (price * (product.quantity || 1)).toFixed(2);
        }
        
        // للمنتجات العادية
        if (product.regularPrice) {
            return (product.regularPrice * (product.quantity || 1)).toFixed(2);
        }
        
        return '0.00';
    };

    if (isLoading) return <div>Loading....</div>;
    if (error) return <div>Something went wrong!</div>;

    return (
        <div className='section__container p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Manage Orders</h2>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='py-3 px-4 border-b'>Email</th>
                        <th className='py-3 px-4 border-b'>Date</th>
                        <th className='py-3 px-4 border-b'>Status</th>
                        <th className='py-3 px-4 border-b'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {orders &&
                        orders.map((order, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 border-b'>{order?.email}</td>
                                <td className='py-4 px-4 border-b'>{formatDate(order?.updatedAt)}</td>
                                <td className='py-4 px-4 border-b'>
                                    <span className={`px-2 py-1 rounded-full text-white ${getStatusColor(order?.status)}`}>
                                        {order?.status}
                                    </span>
                                </td>
                                <td className='py-3 px-4 border-b flex items-center space-x-4'>
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleViewOrder(order)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="text-green-500 hover:underline"
                                        onClick={() => handleEditOrder(order)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDeleteOder(order?._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Update Order Modal */}
            {selectedOrder && (
                <UpdateOrderModal
                    order={selectedOrder}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}

            {/* View Order Details Modal */}
            {viewOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg w-full max-w-4xl print-modal" id="order-details">
                        <style>
                            {`
                                @media print {
                                    body * {
                                        visibility: hidden;
                                    }
                                    .print-modal, .print-modal * {
                                        visibility: visible;
                                    }
                                    .print-modal {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        max-width: 100%;
                                        box-shadow: none;
                                        border: none;
                                        padding: 20px;
                                    }
                                    .print-modal button {
                                        display: none;
                                    }
                                    .print-modal h2 {
                                        font-size: 24px;
                                        margin-bottom: 20px;
                                    }
                                    .print-modal p {
                                        font-size: 16px;
                                        margin-bottom: 10px;
                                    }
                                }
                            `}
                        </style>
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        
                        {/* تفاصيل المنتجات */}
                        <div className="mt-8 pt-6" dir='rtl'>
                            <h3 className="text-xl font-bold mb-4">تفاصيل المنتجات</h3>
                            <div className="space-y-6">
                                {orderProducts.map((product, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                                        
                                        <div className="md:w-3/4">
                                            <h4 className="text-lg font-semibold">{product?.name || 'اسم المنتج غير متوفر'}</h4>
                                            {product?.description && (
                                                <p className="text-gray-600 mt-2">{product.description}</p>
                                            )}
                                            <div className="mt-2">
                                                <span className="font-medium">الكمية: </span>
                                                <span>{product?.quantity || 1}</span>
                                            </div>
                                            {product?.category === 'حناء بودر' && product?.selectedSize && (
                                                <div className="mt-2">
                                                    <span className="font-medium">الحجم: </span>
                                                    <span>{product.selectedSize}</span>
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                <span className="font-medium">السعر : </span>
                                                <span>{calculateProductPrice(product)} ر.ع</span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="font-medium">الفئة: </span>
                                                <span>{product?.category || 'غير محدد'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ملخص الطلب */}
                        <div className="mt-8 border-t pt-6" dir='rtl'>
                            <h3 className="text-xl font-bold mb-4">ملخص الطلب</h3>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between items-center py-2">
                                    <span className="font-medium">الإجمالي النهائي:</span>
                                    <span className="font-bold text-lg">{viewOrder.amount?.toFixed(2) || '0.00'} ر.ع</span>
                                </div>
                                
                                
                                
                                <div className="flex justify-between py-2">
                                    <span>اسم العميل:</span>
                                    <span className="font-semibold">{viewOrder.customerName || 'غير معروف'}</span>
                                </div>
                                
                                <div className="flex justify-between py-2">
                                    <span>رقم الهاتف:</span>
                                    <span className="font-semibold">{viewOrder.customerPhone || 'غير معروف'}</span>
                                </div>
                                
                                <div className="flex justify-between py-2">
                                    <span>الولاية:</span>
                                    <span className="font-semibold">{viewOrder.wilayat || 'غير معروف'}</span>
                                </div>
                                
                                <div className="flex justify-between py-2 border-t pt-3">
                                    <span>تاريخ الطلب:</span>
                                    <span className="font-semibold">
                                        {viewOrder.createdAt ? new Date(viewOrder.createdAt).toLocaleDateString('ar-OM') : 'غير معروف'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={handleCloseViewModal}
                            >
                                Close
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                onClick={handlePrintOrder}
                            >
                                Print
                            </button>
                            <button
                                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                                onClick={handleDownloadPDF}
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500';
        case 'processing':
            return 'bg-blue-500';
        case 'shipped':
            return 'bg-green-500';
        case 'completed':
            return 'bg-gray-500';
        default:
            return 'bg-gray-300';
    }
};

// دالة مساعدة للحصول على عنوان URL الأساسي
const getBaseUrl = () => {
    return process.env.NODE_ENV === 'production' 
        ? 'https://your-production-url.com' 
        : 'http://localhost:5000';
};

export default ManageOrders;