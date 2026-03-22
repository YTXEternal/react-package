export interface UseClipboardReturn {
    copyToClipboard: (text: string) => Promise<boolean>;
}
