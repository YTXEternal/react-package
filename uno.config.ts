import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  shortcuts: [
    // 宽高全屏/全铺满
    ['wh-full', 'w-full h-full'],
    ['wh-screen', 'w-screen h-screen'],
    
    // Flex 布局
    ['f-c', 'flex justify-center items-center'],
    ['f-c-c', 'flex flex-col justify-center items-center'],
    ['f-between', 'flex justify-between items-center'],
    ['f-around', 'flex justify-around items-center'],
    ['f-start', 'flex justify-start items-center'],
    ['f-end', 'flex justify-end items-center'],
    
    // 定位
    ['absolute-center', 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'],
    ['fixed-center', 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'],
    
    // 文本
    ['text-ellipsis', 'truncate'],
  ],
})
