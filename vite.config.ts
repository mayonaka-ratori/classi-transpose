/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Favicon, Apple icon and manifest will be discovered via index.html links
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ClassiTranspose',
        short_name: 'ClassiTranspose',
        description: 'Classical MIDI Transpose & Playback — transpose, adjust BPM, and export.',
        theme_color: '#C2185B',
        background_color: '#FBF9F6',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // Precache JS/CSS/HTML and the AudioWorklet processor
        globPatterns: ['**/*.{js,css,html}'],
        // Exclude MIDI and SF2 from precache — use runtime caching instead
        globIgnores: ['**/presets/**', '**/soundfonts/**'],
        runtimeCaching: [
          // MIDI presets: cache-first, up to 50 files
          {
            urlPattern: /\/presets\/.*\.mid$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'midi-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          // SoundFont (SF2/SF3): cache-first — large file, rarely changes
          {
            urlPattern: /\/soundfonts\/.*\.(sf2|sf3)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'soundfont-cache',
              expiration: { maxEntries: 2, maxAgeSeconds: 60 * 60 * 24 * 365 },
              // Allow caching opaque responses from cross-origin SF2 URLs
              fetchOptions: { mode: 'cors' },
            },
          },
          // Google Fonts: stale-while-revalidate for fast loading
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy audio libraries into a separate lazy chunk
          spessa: ['spessasynth_lib', 'spessasynth_core'],
          // React + zustand into vendor chunk
          vendor: ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
