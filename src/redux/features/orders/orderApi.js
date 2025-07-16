import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include'
    }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        createCheckoutSession: builder.mutation({
            query: (body) => ({
                url: '/create-checkout-session',
                method: 'POST',
                body,
            }),
        }),
        confirmPayment: builder.mutation({
            query: (body) => ({
                url: '/confirm-payment',
                method: 'POST',
                body,
            }),
        }),
        getOrdersByEmail: builder.query({
            query: (email) => ({
                url: `/${email}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),
        getOrderById: builder.query({
            query: (orderId) => ({
                url: `/order/${orderId}`,
                method: 'GET'
            }),
            providesTags: ['Order']
        }),
        getAllOrders: builder.query({
            query: () => (
                {
                    url: '',
                    method: 'GET',  
                }
            ),
            providesTags: ['Order']
        }),
        updateOrderStatus: builder.mutation({
            query: ({id, status}) => ({
                url: `/update-order-status/${id}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Order']
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `/delete-order/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order']
        })
    })
})

export const {
    useCreateCheckoutSessionMutation,
    useConfirmPaymentMutation,
    useGetOrdersByEmailQuery,
    useGetOrderByIdQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useDeleteOrderMutation
} = orderApi;

export default orderApi;