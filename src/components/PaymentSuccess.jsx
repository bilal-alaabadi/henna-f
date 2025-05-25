import React, { useEffect, useState } from 'react';
import { getBaseUrl } from '../utils/baseURL'; // استيراد دالة للحصول على الرابط الأساسي
import TimelineStep from './Timeline'; // تأكد من أن الاسم صحيح

const PaymentSuccess = () => {
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const client_reference_id = query.get('client_reference_id');

        if (client_reference_id) {
            fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ client_reference_id: client_reference_id })
            })
                .then((res) => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
                .then((data) => {
                    if (data.error) throw new Error(data.error);
                    if (!data.order) throw new Error("No order data received.");
                    setOrder(data.order);
                })
                .catch((err) => {
                    console.error("Error confirming payment", err);
                    setError(err.message);
                });
        } else {
            setError("No session ID found in the URL");
        }
    }, []);

    if (error) return <div className="text-red-500">خطأ: {error}</div>;
    if (!order) return <div>جارِ التحميل...</div>;

    const isCompleted = (status) => {
        const statuses = ["pending", "processing", "shipped", "completed"];
        return statuses.indexOf(order.status) >= statuses.indexOf(status);
    };

    const isCurrent = (status) => order.status === status;

    const steps = [
        {
            status: 'pending',
            label: 'قيد الانتظار',
            description: <span className="font-bold">تم إنشاء طلبك وهو قيد الانتظار للمعالجة.</span>,
            icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
        },
        {
            status: 'processing',
            label: 'قيد المعالجة',
            description: 'طلبك يتم معالجته حالياً.',
            icon: { iconName: 'loader-line', bgColor: 'yellow-800', textColor: 'yellow-800' },
        },
        {
            status: 'shipped',
            label: 'تم الشحن',
            description: 'تم شحن طلبك.',
            icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
        },
        {
            status: 'completed',
            label: 'مكتمل',
            description: 'تم إكمال طلبك بنجاح.',
            icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
        },
    ];

    return (
        <section className='section__container rounded p-6'>
            <h2 className='text-2xl font-semibold mb-4'>حالة الدفع: {order?.status || "غير متوفر"}</h2>
            <p className='mb-4'>معرف الطلب: {order?.orderId || "غير متوفر"}</p>
            <p className='mb-8'>الحالة: {order?.status || "غير متوفر"}</p>

            <ol className='sm:flex items-center relative'>
                {steps.map((step, index) => (
                    <TimelineStep
                        key={index}
                        step={step}
                        order={order}
                        isCompleted={isCompleted(step.status)}
                        isCurrent={isCurrent(step.status)}
                        isLastStep={index === steps.length - 1}
                        icon={step.icon}
                        description={step.description}
                    />
                ))}
            </ol>
        </section>
    );
};

export default PaymentSuccess;
