import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// O site é publicado em https://<usuário>.github.io/maratona-marvel/
export default defineConfig({
  base: '/maratona-marvel/',
  plugins: [react(), tailwindcss()],
})
