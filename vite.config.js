const { defineConfig } = require('vite')

module.exports = defineConfig({
  root: '.',
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },
  build: {
    outDir: 'dist',
  },
})
