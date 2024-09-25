/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), legacy()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	server: {
		port: 3000
	}
})
