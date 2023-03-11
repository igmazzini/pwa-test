import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ["/favicon.png"],    
      manifest: {
        name: 'PrePro',
        short_name: 'PrePro',
        description: 'PrePro',
        theme_color: '#2f8955',
        background_color: '#2f8955',
        icons: [
          {
            "src": "./assets/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "./assets/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "./assets/android-chrome-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./assets/android-chrome-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ]
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
