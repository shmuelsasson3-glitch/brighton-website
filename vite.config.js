import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
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
        'arlington-project': resolve(__dirname, 'arlington-project.html'),
        'baker-project': resolve(__dirname, 'baker-project.html'),
        'bates-road': resolve(__dirname, 'bates-road.html'),
        'beige-project': resolve(__dirname, 'beige-project.html'),
        'corner-project': resolve(__dirname, 'corner-project.html'),
        'pool-patio': resolve(__dirname, 'pool-patio.html'),
        'scotchway-project': resolve(__dirname, 'scotchway-project.html'),
        'sukkah-project': resolve(__dirname, 'sukkah-project.html'),
        'toras-aron-project': resolve(__dirname, 'toras-aron-project.html'),
        'vanard-project': resolve(__dirname, 'vanard-project.html'),
      },
    },
  },
})
