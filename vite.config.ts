import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT) || 5173,
    // Permite importar/servir archivos desde la carpeta hermana ../assets
    // (fuente única: actualizas ahí con el mismo nombre y se refleja solo).
    fs: { allow: ['..'] },
  },
})
