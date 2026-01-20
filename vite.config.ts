import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 使用相对路径，方便直接双击 index.html 查看
  base: './',
  plugins: [react()],
})
