import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { Link } from 'react-router-dom';

const OrderSummary = ({ onClose }) => {
    const dispatch = useDispatch();
    const { selectedItems, totalPrice } = useSelector((store) => store.cart);

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    return (
        <div className='bg-[#6f9248] mt-5 rounded text-base'>
            <div className='px-6 py-4 space-y-5'>
                <h2 className='text-xl text-white'>ملخص الطلب</h2>
                <p className='text-white mt-2'>العناصر المحددة: {selectedItems}</p>
                <p className='font-bold text-white'>السعر الإجمالي:  ر.ع{totalPrice.toFixed(2)}</p>
                <div className='px-4 mb-6'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearCart();
                        }}
                        className='bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4'
                    >
                        <span className='mr-2'>تفريغ السلة</span>
                        <i className="ri-delete-bin-7-line"></i>
                    </button>
                    <Link to="/checkout">
                        <button
                            onClick={onClose} // إغلاق السلة عند الضغط على الزر
                            className='bg-green-600 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center'
                        >
                            <span className='mr-2'>إتمام الشراء</span>
                            <i className="ri-bank-card-line"></i>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;