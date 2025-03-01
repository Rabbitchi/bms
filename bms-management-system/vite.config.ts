import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'; // 需要安装 Node.js 类型声明文件（@types/node）
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 映射到 src 目录
    },
  },
  server: {
    host: '0.0.0.0', // 开发环境运行的主机名
    port: 3000, // 开发环境运行的端口号
    open: true, // 启动时自动打开浏览器
  },
})