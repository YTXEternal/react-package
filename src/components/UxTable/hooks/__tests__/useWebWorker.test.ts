import { renderHook, act } from '@testing-library/react';
import { useWebWorker } from '../useWebWorker';

describe('useWebWorker 自定义钩子', () => {
    it('如果 worker 返回 null，应该降级到主线程执行', async () => {
        const fallback = jest.fn().mockResolvedValue('fallback_result');
        const workerScript = () => null;

        const { result } = renderHook(() => useWebWorker(workerScript, fallback));

        let res;
        await act(async () => {
            res = await result.current.postMessage({ type: 'TEST' });
        });

        expect(fallback).toHaveBeenCalledWith({ type: 'TEST' });
        expect(res).toBe('fallback_result');
    });

    it('如果 window.Worker 未定义，应该降级到主线程执行', async () => {
        const originalWorker = window.Worker;
         
        // @ts-expect-error Mocking window.Worker removal for testing
        delete window.Worker;

        const fallback = jest.fn().mockResolvedValue('fallback_result');
        const workerScript = jest.fn();

        const { result } = renderHook(() => useWebWorker(workerScript, fallback));

        let res;
        await act(async () => {
            res = await result.current.postMessage({ type: 'TEST' });
        });

        expect(workerScript).not.toHaveBeenCalled();
        expect(fallback).toHaveBeenCalledWith({ type: 'TEST' });
        expect(res).toBe('fallback_result');

        // Restore Worker
        window.Worker = originalWorker;
    });
});