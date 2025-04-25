import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5173', // رابط الخادم الخلفي
                changeOrigin: true, // تغيير الأصل للخادم الخلفي
                rewrite: (path) => path.replace(/^\/api/, ''), // إزالة /api من الرابط
            },
        },
    },
});