import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        residential: resolve(__dirname, 'residential.html'),
        commercial: resolve(__dirname, 'commercial.html'),
        'commercial-installs': resolve(__dirname, 'commercial-installs.html'),
        sitework: resolve(__dirname, 'sitework.html'),
        snow: resolve(__dirname, 'snow.html'),
        work: resolve(__dirname, 'work.html'),
        'work-project': resolve(__dirname, 'work-project.html'),
        videos: resolve(__dirname, 'videos.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
