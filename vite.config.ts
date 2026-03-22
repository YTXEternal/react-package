import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  publicDir: false, // 禁用 public 目录，避免打包时复制 public/images
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  plugins: [
    UnoCSS(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/demo/**/*'],
      outDir: 'dist/types',
      tsconfigPath: './tsconfig.app.json' // 明确指定 tsconfig，因为项目有多个 tsconfig
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UxTableReact',
      fileName: (format) => `ux-table-react.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
        assetFileNames: 'ux-table-react.[ext]' // 统一 CSS 等静态资源命名
      }
    }
  }
})
