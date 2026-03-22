import { useCallback } from 'react';
import type { UseClipboardReturn } from './types';

/**
 * 提供跨浏览器兼容的剪贴板操作 Hook
 * 兼容 Chrome, Firefox, Edge, Safari 等主流浏览器
 * 
 * @returns {UseClipboardReturn}
 */
export const useClipboard = (): UseClipboardReturn => {
    /**
     * 降级复制方案，使用 execCommand
     * 用于不支持 navigator.clipboard 的旧版浏览器或不安全环境
     * 
     * @param {string} text 要复制的文本
     * @returns {boolean} 是否复制成功
     */
    const fallbackCopyTextToClipboard = (text: string): boolean => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 避免滚动到页面底部
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        
        // 隐藏元素
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        let successful = false;
        try {
            successful = document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
        return successful;
    };

    /**
     * 复制文本到剪贴板
     * 优先使用现代的 navigator.clipboard API，如果不可用则降级使用 execCommand
     * 
     * @param {string} text 要复制的文本
     * @returns {Promise<boolean>} 是否复制成功
     */
    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        if (!navigator.clipboard) {
            return fallbackCopyTextToClipboard(text);
        }
        
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Async: Could not copy text: ', err);
            // 某些情况下，navigator.clipboard 存在但 writeText 失败（如权限问题），尝试降级
            return fallbackCopyTextToClipboard(text);
        }
    }, []);

    return { copyToClipboard };
};
