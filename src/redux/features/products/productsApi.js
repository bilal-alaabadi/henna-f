import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({
    // جلب جميع المنتجات مع إمكانية التصفية والترتيب
    fetchAllProducts: builder.query({
      query: ({
        category,
        gender,
        minPrice,
        maxPrice,
        search,
        sort = "createdAt:desc",
        page = 1,
        limit = 10,
      }) => {
        const params = {
          page: page.toString(),
          limit: limit.toString(),
          sort,
        };

        if (category && category !== "الكل") params.category = category;
        if (gender) params.gender = gender;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (search) params.search = search;

        const queryParams = new URLSearchParams(params).toString();
        return `/?${queryParams}`;
      },
      transformResponse: (response) => ({
        products: response.products,
        totalPages: response.totalPages,
        totalProducts: response.totalProducts,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    // جلب منتج بواسطة ID
    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => {
        // معالجة بيانات المنتج لضمان توافقها مع نظام الطلبات
        const product = response.product;
        return {
          ...product,
          // تحويل سعر الحناء البودر إذا كان المنتج من هذه الفئة
          price: product.category === 'حناء بودر' 
            ? product.price 
            : { 'default': product.regularPrice },
          regularPrice: product.regularPrice,
          images: Array.isArray(product.image) ? product.image : [product.image],
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // جلب المنتجات المرتبطة (منتجات مشابهة)
    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
      providesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // إضافة منتج جديد
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["ProductList"],
    }),

    // تحديث المنتج
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // تحديث كمية المنتج فقط (مهم لنظام الطلبات)
    updateProductQuantity: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/update-quantity/${id}`,
        method: "PATCH",
        body: { quantity },
        headers: {
          'X-Quantity-Update': 'true' // لتمييز أن هذا تحديث للكمية فقط
        }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // حذف المنتج
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // بحث عن المنتجات
    searchProducts: builder.query({
      query: (searchTerm) => `/search?q=${searchTerm}`,
      transformResponse: (response) => {
        // معالجة نتائج البحث لتكون متوافقة مع نظام الطلبات
        return response.map(product => ({
          ...product,
          price: product.category === 'حناء بودر' 
            ? product.price 
            : { 'default': product.regularPrice },
          images: Array.isArray(product.image) ? product.image : [product.image],
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    // جلب المنتجات الأكثر مبيعاً (مهم لعرضها في صفحة التأكيد)
    fetchBestSellingProducts: builder.query({
      query: (limit = 4) => `/best-selling?limit=${limit}`,
      providesTags: ["ProductList"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useLazyFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useUpdateProductQuantityMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useFetchBestSellingProductsQuery,
} = productsApi;

export default productsApi;