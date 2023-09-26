import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Define o alvo do build
    assetsDir: '.',    // Define o diretório de ativos
    outDir: 'dist',    // Define o diretório de saída
    sourcemap: false,  // Desative o sourcemap em produção
  },
})


