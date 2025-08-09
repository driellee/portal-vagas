import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Se seu repositório se chamar "portal-vagas", mantenha abaixo:
// Se for outro nome (ex.: jobs-hub), use base: '/jobs-hub/'
export default defineConfig({
  plugins: [react()],
  base: '/portal-vagas/',
})
