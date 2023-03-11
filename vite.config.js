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
      includeAssets: ["./img/icons/favicon-16x16.png"],    
      manifest: {
        name: 'PrePro',
        short_name: 'PrePro',
        description: 'PrePro',
        theme_color: '#2f8955',
        background_color: '#2f8955',
        icons: [
          {
            "src": "./img/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "./img/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "./img/icons/android-chrome-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/android-chrome-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/apple-touch-icon-60x60.png",
            "sizes": "60x60",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/apple-touch-icon-76x76.png",
            "sizes": "76x76",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/apple-touch-icon-120x120.png",
            "sizes": "120x120",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/apple-touch-icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/apple-touch-icon-180x180.png",
            "sizes": "152x152",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/apple-touch-icon.png",            
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/favicon-16x16.png",
            "sizes": "16x16",
            "type": "image/png",
            "purpose": "icon"
          },
          {
            "src": "./img/icons/favicon-32x32.png",
            "sizes": "32x32",
            "type": "image/png",
            "purpose": "favicon-32x32"
          },
          {
            "src": "./img/icons/msapplication-icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "./img/icons/safari-pinned-tab.svg",           
            "type": "svg",
            "purpose": "maskable"
          },
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
