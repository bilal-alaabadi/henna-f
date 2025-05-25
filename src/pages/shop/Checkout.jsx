import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RiBankCardLine } from "react-icons/ri";
import { getBaseUrl } from '../../utils/baseURL';

const Checkout = () => {
  const [error, setError] = useState('');
  const { products, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (products.length === 0) {
      setError("لا توجد منتجات في السلة. الرجاء إضافة منتجات قبل المتابعة إلى الدفع.");
    } else {
      setError('');
    }
  }, [products]);

  const makePayment = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      setError("لا توجد منتجات في السلة. الرجاء إضافة منتجات قبل المتابعة إلى الدفع.");
      return;
    }

    const body = {
      products: products.map(product => ({
        ...product,
        image: Array.isArray(product.image) ? product.image[0] : product.image
      })),
      userId: user?._id,
    };

    console.log("Data sent to server:", JSON.stringify(body, null, 2));

    const headers = {
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch(`${getBaseUrl()}/api/orders/create-checkout-session`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      console.log("Server response:", session);

      if (session.paymentLink) {
        window.location.href = session.paymentLink;
      } else {
        console.error("No payment link received from server:", session);
        setError("حدث خطأ أثناء إنشاء رابط الدفع. الرجاء المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      setError("حدث خطأ أثناء عملية الدفع. الرجاء المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* تفاصيل الفاتورة */}
      <div className="flex-1">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">تفاصيل الفاتورة</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={makePayment} className="space-y-4 md:space-y-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 w-full"
            disabled={products.length === 0}
            onClick={makePayment}
          >
            إتمام الطلب
          </button>
        </form>
      </div>

      {/* تفاصيل الطلب */}
      <div className="w-full md:w-1/3 p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">طلبك</h2>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">{product.name} × {product.quantity}</span>
              <span className="text-gray-900 font-medium">{product.price * product.quantity} ر.ع.</span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-gray-800 font-semibold">الإجمالي</span>
            <p className="text-gray-900 font-bold">ر.ع.{totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">دفع ثواني</h3>
          <button
            onClick={makePayment}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
            disabled={products.length === 0}
          >
            <RiBankCardLine className="text-xl" />
            <span>الدفع باستخدام ثواني</span>
          </button>
          <p className="mt-4 text-sm text-gray-600">
            سيتم استخدام بياناتك الشخصية لمعالجة طلبك، ودعم تجربتك عبر هذا الموقع، ولأغراض أخرى موضحة في{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">سياسة الخصوصية</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;